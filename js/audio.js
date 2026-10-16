/* =====================================================================
   THE NORMALCY FILES: audio.js
   Background music: genuine public-domain jazz recordings (1920–1924),
   one track per area, listed in content.js (MUSIC). Tracks never
   overlap: the old one fades out and stops before the next one starts.
   Ambience and sound effects are synthesized live with the Web Audio API.
   ===================================================================== */
(function () {
  'use strict';
  const NF = (window.NF = window.NF || {});

  const NOTE = (n) => 440 * Math.pow(2, (n - 69) / 12); // MIDI to Hz

  const Audio = (NF.Audio = {
    ctx: null, ready: false, amb: null,
    vol: { music: 0.3, sfx: 0.6, ambience: 0.25, voice: 1 },
    musicOn: true, duck: 1, trackKey: null, el: null,

    init() {
      const s = NF.Save.data.settings;
      ['music', 'sfx', 'ambience', 'voice'].forEach((k) => { if (typeof s[k] === 'number') this.vol[k] = s[k]; });
      if (s.musicOn === false) this.musicOn = false;
    },
    unlock() {
      this.unlocked = true;
      if (this.ready) { if (this.ctx.state === 'suspended') this.ctx.resume(); }
      else {
        try {
          const AC = window.AudioContext || window.webkitAudioContext;
          if (AC) {
            this.ctx = new AC();
            const c = this.ctx;
            this.master = c.createGain(); this.master.gain.value = 0.9; this.master.connect(c.destination);
            this.sfxBus = c.createGain(); this.ambBus = c.createGain();
            const comp = c.createDynamicsCompressor(); comp.threshold.value = -18; comp.ratio.value = 3; comp.connect(this.master);
            this.sfxBus.connect(comp); this.ambBus.connect(comp);
            this.noise = this.makeNoise();
            this.ready = true;
          }
        } catch (e) { this.ready = false; }
      }
      this.applyVolumes();
      if (this.pendingScene && NF.Game && NF.Game.running) { const p = this.pendingScene; this.pendingScene = null; this.setScene(p[0], p[1]); }
    },
    applyVolumes() {
      if (this.ready) {
        const t = this.ctx.currentTime;
        this.sfxBus.gain.setTargetAtTime(this.vol.sfx * 0.8, t, 0.05);
        this.ambBus.gain.setTargetAtTime(this.vol.ambience * 0.6 * this.duck, t, 0.1);
      }
      if (this.el && !this.fading) this.el.volume = this.musicTarget();
    },
    musicTarget() { return this.musicOn ? Math.max(0, Math.min(1, this.vol.music * 0.55 * this.duck)) : 0; },
    setVolume(k, v) {
      this.vol[k] = v; NF.Save.data.settings[k] = v; NF.Save.save(); this.applyVolumes();
      if (k === 'voice' && NF.UI) NF.UI.setVoiceVolume(v);
    },
    setMusicOn(on) {
      this.musicOn = on; NF.Save.data.settings.musicOn = on; NF.Save.save();
      if (!on) this.stopTrack();
      else if (this.wantKey) this.playTrack(this.wantKey);
    },
    // Lower music and ambience while narration or an archival recording plays
    setDuck(on) { this.duck = on ? 0.25 : 1; this.applyVolumes(); },

    makeNoise() {
      const c = this.ctx, len = c.sampleRate * 2;
      const b = c.createBuffer(1, len, c.sampleRate), d = b.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      return b;
    },

    /* ---------------- scene changes ---------------- */
    setScene(mapId, ambience) {
      if (!this.unlocked || !(NF.Game && NF.Game.running)) { this.pendingScene = [mapId, ambience]; return; }
      const key = (NF.CONTENT.ROOM_MUSIC || {})[mapId] || 'hub';
      this.wantKey = key;
      if (this.musicOn && key !== this.trackKey) this.playTrack(key);
      if (this.ready && this.ambName !== ambience) { this.ambName = ambience; this.startAmbience(ambience); }
    },

    /* ---------------- music player (one track at a time) ---------------- */
    playTrack(key) {
      const info = NF.CONTENT.MUSIC[key];
      const token = (this.token = (this.token || 0) + 1);
      const start = () => {
        if (token !== this.token) return;
        this.trackKey = key;
        if (!info || !this.musicOn) return;
        const el = new window.Audio();
        el.loop = true; el.preload = 'auto'; el.volume = 0; el.src = info.src;
        el.addEventListener('error', () => { if (this.el === el) { this.el = null; this.trackKey = null; } console.info('Music file unavailable, continuing without music:', info.src); });
        this.el = el;
        el.play().then(() => this.fadeTo(el, this.musicTarget(), 1200)).catch(() => { /* autoplay blocked or file missing: stay silent */ });
      };
      if (this.el) this.stopTrack(start); else start();
    },
    // Silence everything except the help-desk video (used by the title screen)
    quiet() {
      this.stopTrack();
      if (this.amb) { this.amb.stop(); this.amb = null; }
      this.ambName = null;
    },
    stopTrack(after) {
      const el = this.el;
      this.el = null; this.trackKey = null;
      if (!el) { if (after) after(); return; }
      this.fadeTo(el, 0, 600, () => { try { el.pause(); el.removeAttribute('src'); el.load(); } catch (e) { /* ignore */ } if (after) after(); });
    },
    fadeTo(el, target, ms, done) {
      const from = el.volume, t0 = performance.now();
      this.fading = true;
      const step = (now) => {
        const k = Math.min(1, (now - t0) / ms);
        try { el.volume = from + (target - from) * k; } catch (e) { /* ignore */ }
        if (k < 1) requestAnimationFrame(step); else { this.fading = false; if (done) done(); else if (this.el === el) el.volume = this.musicTarget(); }
      };
      requestAnimationFrame(step);
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
