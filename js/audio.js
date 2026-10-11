/* =====================================================================
   THE NORMALCY FILES — audio.js
   Everything you hear (except your narration and the archival Harding
   recording) is synthesized live with the Web Audio API: an original
   1920s-flavoured chiptune score, ambience, and sound effects.
   No copyrighted recordings are used.
   ===================================================================== */
(function () {
  'use strict';
  const NF = (window.NF = window.NF || {});

  const NOTE = (n) => 440 * Math.pow(2, (n - 69) / 12); // MIDI → Hz

  // Chord = [root midi, quality]; progressions in a ragtime/parlour style (original)
  const SCORES = {
    town: { bpm: 104, swing: 0.16, prog: [[53, 'M'], [53, 'M'], [50, '7'], [50, '7'], [55, '7'], [55, '7'], [48, '7'], [48, '7'], [53, 'M'], [57, '7'], [58, 'M'], [59, 'd'], [53, 'M'], [50, '7'], [55, '7'], [48, '7']], lead: 0.07, style: 'stride' },
    interior: { bpm: 84, swing: 0.1, prog: [[48, 'M'], [45, 'm'], [50, 'm'], [43, '7'], [48, 'M'], [52, 'm'], [50, '7'], [43, '7']], lead: 0.05, style: 'waltzless' },
    tense: { bpm: 76, swing: 0.05, prog: [[45, 'm'], [45, 'm'], [41, 'M'], [40, '7'], [45, 'm'], [50, 'm'], [40, '7'], [40, '7']], lead: 0.045, style: 'pulse' },
    grand: { bpm: 96, swing: 0.0, prog: [[50, 'M'], [55, 'M'], [57, '7'], [50, 'M'], [47, 'm'], [52, 'm'], [45, '7'], [50, 'M']], lead: 0.055, style: 'march' },
    reflective: { bpm: 70, swing: 0.0, prog: [[51, 'M'], [48, 'm'], [44, 'M'], [46, '7'], [51, 'M'], [55, 'm'], [44, 'M'], [46, '7']], lead: 0.045, style: 'arp' },
  };
  const QUAL = { M: [0, 4, 7], m: [0, 3, 7], '7': [0, 4, 7, 10], d: [0, 3, 6] };

  const Audio = (NF.Audio = {
    ctx: null, ready: false, scene: null, amb: null,
    vol: { music: 0.45, sfx: 0.7, ambience: 0.5, voice: 1 },

    init() {
      const s = NF.Save.data.settings;
      ['music', 'sfx', 'ambience', 'voice'].forEach((k) => { if (typeof s[k] === 'number') this.vol[k] = s[k]; });
    },
    unlock() {
      if (this.ready) { if (this.ctx.state === 'suspended') this.ctx.resume(); return; }
      try {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        this.ctx = new AC();
        const c = this.ctx;
        this.master = c.createGain(); this.master.gain.value = 0.9; this.master.connect(c.destination);
        this.musicBus = c.createGain(); this.sfxBus = c.createGain(); this.ambBus = c.createGain();
        const comp = c.createDynamicsCompressor(); comp.threshold.value = -18; comp.ratio.value = 3; comp.connect(this.master);
        // gentle low-pass "old radio" warmth on the music
        this.musicLP = c.createBiquadFilter(); this.musicLP.type = 'lowpass'; this.musicLP.frequency.value = 3200;
        this.musicBus.connect(this.musicLP); this.musicLP.connect(comp);
        this.sfxBus.connect(comp); this.ambBus.connect(comp);
        this.noise = this.makeNoise();
        this.ready = true;
        this.applyVolumes();
        if (this.pendingScene) this.setScene(...this.pendingScene);
      } catch (e) { this.ready = false; }
    },
    applyVolumes() {
      if (!this.ready) return;
      const t = this.ctx.currentTime;
      this.musicBus.gain.setTargetAtTime(this.vol.music * 0.5 * (this.duck || 1), t, 0.1);
      this.sfxBus.gain.setTargetAtTime(this.vol.sfx * 0.8, t, 0.05);
      this.ambBus.gain.setTargetAtTime(this.vol.ambience * 0.6 * (this.duck || 1), t, 0.1);
    },
    setVolume(k, v) { this.vol[k] = v; NF.Save.data.settings[k] = v; NF.Save.save(); this.applyVolumes(); if (k === 'voice' && NF.UI) NF.UI.setVoiceVolume(v); },
    // Lower music/ambience while narration plays
    setDuck(on) { this.duck = on ? 0.3 : 1; this.applyVolumes(); },

    makeNoise() {
      const c = this.ctx, len = c.sampleRate * 2;
      const b = c.createBuffer(1, len, c.sampleRate), d = b.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      return b;
    },

    /* ---------------- music sequencer ---------------- */
    setScene(music, ambience) {
      if (!this.ready) { this.pendingScene = [music, ambience]; return; }
      if (this.scene !== music) {
        this.scene = music;
        this.stopMusic();
        if (SCORES[music]) this.startMusic(SCORES[music]);
      }
      if (this.ambName !== ambience) { this.ambName = ambience; this.startAmbience(ambience); }
    },
    stopMusic() { if (this.seqTimer) clearInterval(this.seqTimer); this.seqTimer = null; },
    startMusic(score) {
      const c = this.ctx;
      const beat = 60 / score.bpm;
      let step = 0; // eighth notes
      let next = c.currentTime + 0.15;
      let seed = 7;
      const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
      const melodyMemo = {};
      const tick = () => {
        while (next < c.currentTime + 0.4) {
          const bar = Math.floor(step / 8) % score.prog.length;
          const e = step % 8;
          const [root, q] = score.prog[bar];
          const tones = QUAL[q];
          const swingOff = e % 2 === 1 ? score.swing * beat : 0;
          const t = next + swingOff;
          // bass / left hand
          if (score.style === 'stride') {
            if (e === 0) this.tone(NOTE(root - 12), t, beat * 0.9, 'triangle', 0.22);
            if (e === 4) this.tone(NOTE(root - 12 + 7), t, beat * 0.9, 'triangle', 0.2);
            if (e === 2 || e === 6) tones.slice(0, 3).forEach((iv) => this.tone(NOTE(root + iv + 12), t, beat * 0.35, 'square', 0.025, 1800));
          } else if (score.style === 'march') {
            if (e % 4 === 0) this.tone(NOTE(root - 12 + (e === 4 ? 7 : 0)), t, beat * 0.8, 'triangle', 0.2);
            if (e % 4 === 2) tones.slice(0, 3).forEach((iv) => this.tone(NOTE(root + iv + 12), t, beat * 0.3, 'square', 0.022, 1600));
          } else if (score.style === 'arp') {
            const iv = tones[e % tones.length] + (e >= 4 ? 12 : 0);
            this.tone(NOTE(root + iv), t, beat * 1.2, 'triangle', 0.08);
            if (e === 0) this.tone(NOTE(root - 12), t, beat * 3.5, 'sine', 0.16);
          } else if (score.style === 'pulse') {
            if (e % 2 === 0) this.tone(NOTE(root - 12), t, beat * 0.4, 'triangle', 0.16);
            if (e === 3 || e === 7) tones.slice(0, 3).forEach((iv) => this.tone(NOTE(root + iv + 12), t, beat * 0.25, 'square', 0.018, 1200));
          } else {
            if (e === 0) this.tone(NOTE(root - 12), t, beat * 1.8, 'triangle', 0.18);
            if (e === 4) this.tone(NOTE(root - 5), t, beat * 1.8, 'triangle', 0.15);
            if (e === 2 || e === 6) tones.slice(0, 3).forEach((iv) => this.tone(NOTE(root + iv + 12), t, beat * 0.6, 'sine', 0.035));
          }
          // melody (deterministic per bar, so it repeats like a real tune)
          const key = bar + ':' + e;
          if (melodyMemo[key] === undefined) {
            const play = score.style === 'arp' ? false : rnd() < (e % 2 === 0 ? 0.62 : 0.32);
            const iv = tones[Math.floor(rnd() * tones.length)] + (rnd() < 0.3 ? 12 : 0) + (rnd() < 0.15 ? 2 : 0);
            melodyMemo[key] = play ? iv : null;
          }
          const mv = melodyMemo[key];
          if (mv !== null && mv !== undefined) this.tone(NOTE(root + 24 + mv), t, beat * 0.42, 'square', score.lead, 2600, true);
          step++;
          next += beat / 2;
        }
      };
      tick();
      this.seqTimer = setInterval(tick, 120);
    },
    tone(freq, t, dur, type, vol, lp, vib) {
      const c = this.ctx;
      const o = c.createOscillator(), g = c.createGain();
      o.type = type; o.frequency.value = freq;
      if (vib) { const l = c.createOscillator(), lg = c.createGain(); l.frequency.value = 5.5; lg.gain.value = freq * 0.004; l.connect(lg); lg.connect(o.frequency); l.start(t); l.stop(t + dur + 0.1); }
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(vol, t + 0.012);
      g.gain.exponentialRampToValueAtTime(Math.max(0.0001, vol * 0.4), t + dur * 0.6);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      let node = o;
      if (lp) { const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = lp; o.connect(f); node = f; }
      node.connect(g); g.connect(this.musicBus);
      o.start(t); o.stop(t + dur + 0.05);
    },

    /* ---------------- ambience ---------------- */
    startAmbience(name) {
      const c = this.ctx;
      if (this.amb) { this.amb.stop(); this.amb = null; }
      const nodes = [];
      const out = c.createGain(); out.gain.value = 0; out.connect(this.ambBus);
      out.gain.setTargetAtTime(1, c.currentTime, 0.8);
      const bed = (freq, q, vol) => {
        const s = c.createBufferSource(); s.buffer = this.noise; s.loop = true;
        const f = c.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = q;
        const g = c.createGain(); g.gain.value = vol;
        s.connect(f); f.connect(g); g.connect(out); s.start();
        nodes.push(s);
        return g;
      };
      let timer = null;
      const every = (ms, fn) => { timer = setInterval(() => { if (!document.hidden) fn(); }, ms); };
      const blip = (freq, dur, vol, type) => {
        const t = c.currentTime;
        const o = c.createOscillator(), g = c.createGain(); o.type = type || 'sine';
        o.frequency.setValueAtTime(freq, t); o.frequency.exponentialRampToValueAtTime(freq * 1.25, t + dur * 0.5);
        g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        o.connect(g); g.connect(out); o.start(t); o.stop(t + dur + 0.02);
      };
      const click = (vol) => {
        const t = c.currentTime, s = c.createBufferSource(); s.buffer = this.noise;
        const f = c.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 2500;
        const g = c.createGain(); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);
        s.connect(f); f.connect(g); g.connect(out); s.start(t, Math.random()); s.stop(t + 0.04);
      };
      if (name === 'town') {
        bed(500, 0.4, 0.05);
        every(2600, () => { if (Math.random() < 0.6) { const f = 2400 + Math.random() * 1400; blip(f, 0.09, 0.05); setTimeout(() => blip(f * 1.1, 0.08, 0.04), 110); } });
      } else if (name === 'station') {
        bed(120, 0.7, 0.12); bed(800, 0.5, 0.03);
        every(7000, () => { if (Math.random() < 0.4) { blip(660, 0.6, 0.04, 'triangle'); setTimeout(() => blip(523, 0.8, 0.04, 'triangle'), 450); } });
      } else if (name === 'newsroom') {
        bed(300, 0.5, 0.03);
        every(140, () => { if (Math.random() < 0.45) click(0.12 + Math.random() * 0.08); });
        every(5200, () => { if (Math.random() < 0.5) blip(1800, 0.05, 0.05, 'square'); });
      } else if (name === 'office') {
        bed(400, 0.4, 0.02);
        let tk = 0; every(1000, () => { tk++; click(tk % 2 ? 0.05 : 0.035); });
      } else if (name === 'hall') {
        bed(240, 0.6, 0.06); bed(600, 0.6, 0.02);
      } else if (name === 'court') {
        bed(260, 0.5, 0.03);
        let tk = 0; every(1200, () => { tk++; click(0.03); });
      } else { // library / room
        bed(350, 0.4, 0.018);
        every(9000, () => { if (Math.random() < 0.4) { const s = c.createBufferSource(); s.buffer = this.noise; const f = c.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 3000; const g = c.createGain(); const t = c.currentTime; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.03, t + 0.15); g.gain.linearRampToValueAtTime(0, t + 0.4); s.connect(f); f.connect(g); g.connect(out); s.start(t); s.stop(t + 0.45); } });
      }
      this.amb = { stop: () => { out.gain.setTargetAtTime(0, c.currentTime, 0.3); if (timer) clearInterval(timer); setTimeout(() => nodes.forEach((n) => { try { n.stop(); } catch (e) { /* already stopped */ } }), 1500); } };
    },

    /* ---------------- sound effects ---------------- */
    sfx(name) {
      if (!this.ready) return;
      const c = this.ctx, t = c.currentTime;
      const env = (o, vol, a, d, dest) => { const g = c.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + d); o.connect(g); g.connect(dest || this.sfxBus); return g; };
      const osc = (type, f, start, dur, vol, slideTo) => {
        const o = c.createOscillator(); o.type = type; o.frequency.setValueAtTime(f, t + start);
        if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + start + dur);
        const g = c.createGain(); g.gain.setValueAtTime(0, t + start); g.gain.linearRampToValueAtTime(vol, t + start + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + start + dur);
        o.connect(g); g.connect(this.sfxBus); o.start(t + start); o.stop(t + start + dur + 0.02);
      };
      switch (name) {
        case 'step': {
          const s = c.createBufferSource(); s.buffer = this.noise;
          const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 500 + Math.random() * 300;
          s.connect(f); env(f, 0.12, 0.003, 0.05); s.start(t, Math.random()); s.stop(t + 0.07);
          break;
        }
        case 'open': osc('square', 660, 0, 0.07, 0.05); osc('square', 990, 0.06, 0.09, 0.05); break;
        case 'close': osc('square', 880, 0, 0.06, 0.04); osc('square', 587, 0.05, 0.08, 0.04); break;
        case 'click': osc('square', 1200, 0, 0.03, 0.03); break;
        case 'door': {
          const s = c.createBufferSource(); s.buffer = this.noise; const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 300;
          s.connect(f); env(f, 0.3, 0.005, 0.25); s.start(t); s.stop(t + 0.3);
          osc('triangle', 180, 0, 0.18, 0.15, 90); break;
        }
        case 'discover': [72, 76, 79, 84].forEach((n, i) => osc('triangle', NOTE(n), i * 0.07, 0.35, 0.09)); osc('sine', NOTE(96), 0.28, 0.5, 0.03); break;
        case 'correct': osc('triangle', NOTE(76), 0, 0.2, 0.1); osc('triangle', NOTE(81), 0.09, 0.3, 0.1); break;
        case 'gentle': osc('sine', NOTE(64), 0, 0.22, 0.07); osc('sine', NOTE(62), 0.12, 0.3, 0.06); break;
        case 'complete': [67, 72, 76, 79, 84, 88].forEach((n, i) => osc('triangle', NOTE(n), i * 0.08, 0.45, 0.08)); break;
        case 'horn': osc('sawtooth', 300, 0, 0.18, 0.05, 520); osc('sawtooth', 520, 0.2, 0.25, 0.05, 280); break;
        case 'whistle': {
          [0, 0.9].forEach((st) => { osc('sine', 740, st, 0.7, 0.05); osc('sine', 932, st, 0.7, 0.035); });
          break;
        }
        case 'page': {
          const s = c.createBufferSource(); s.buffer = this.noise; const f = c.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 2600;
          s.connect(f); env(f, 0.06, 0.05, 0.2); s.start(t, Math.random()); s.stop(t + 0.3); break;
        }
      }
    },
  });
})();
