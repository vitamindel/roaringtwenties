/* =====================================================================
   THE NORMALCY FILES — ui.js
   HUD, prompts, dialogue, modals, narration player, map, settings,
   help, reference room panels, touch controls and the title screen.
   ===================================================================== */
(function () {
  'use strict';
  const NF = (window.NF = window.NF || {});
  const $ = (s) => document.querySelector(s);

  /* tiny DOM builder: h('div.cls#id', {attrs}, ...children) */
  function h(sel, attrs, ...kids) {
    const m = sel.match(/^([a-z0-9]+)?((?:[.#][\w-]+)*)$/i);
    const el = document.createElement((m && m[1]) || 'div');
    if (m && m[2]) m[2].replace(/([.#])([\w-]+)/g, (_, t, n) => { if (t === '.') el.classList.add(n); else el.id = n; });
    if (attrs && (typeof attrs !== 'object' || attrs instanceof Node || Array.isArray(attrs))) { kids.unshift(attrs); attrs = null; }
    if (attrs) for (const [k, v] of Object.entries(attrs)) {
      if (v === undefined || v === null || v === false) continue;
      if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
      else if (k === 'html') el.innerHTML = v;
      else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
      else el.setAttribute(k, v === true ? '' : v);
    }
    const add = (k) => { if (k === null || k === undefined || k === false) return; if (Array.isArray(k)) k.forEach(add); else el.append(k instanceof Node ? k : document.createTextNode(String(k))); };
    kids.forEach(add);
    return el;
  }
  NF.h = h;

  const UI = (NF.UI = {
    modals: [],
    init() {
      const C = NF.CONTENT;
      this.C = C;
      $('#btn-map').onclick = () => this.openMap();
      $('#btn-narr').onclick = () => this.toggleNarration();
      $('#btn-help').onclick = () => this.openHelp();
      $('#btn-pause').onclick = () => this.openPause();
      $('#prompt').onclick = () => { const g = NF.Game; if (g.near && !g.paused) g.activate(g.near); };
      // portrait
      const pc = $('#hud-portrait'); const pg = pc.getContext('2d'); pg.imageSmoothingEnabled = false; pg.drawImage(NF.Art.portrait(NF.LOOKS.player), 0, 0);
      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.modals.length) { e.preventDefault(); e.stopPropagation(); this.closeTop(); }
      }, true);
      this.initNarration();
      this.initTouch();
      this.applySettings();
    },

    /* ---------- settings ---------- */
    settings() { return NF.Save.data.settings; },
    applySettings() {
      const s = this.settings();
      document.documentElement.classList.toggle('large-text', s.textSize === 'large');
      if (s.cc === undefined) s.cc = true;
    },

    /* ---------- HUD ---------- */
    onMapChange(m) {
      const C = this.C;
      const room = C.ROOMS[m.id];
      $('#hud-room').textContent = room ? (room.num <= 6 ? `Exhibit ${room.num} · ${room.title}` : room.title) : m.title || 'Town Square';
      this.updateHud();
      this.setPrompt(null);
      this.stopNarration();
      const btn = $('#btn-narr');
      btn.style.opacity = C.ROOMS[m.id] && C.ROOMS[m.id].narration ? 1 : 0.5;
    },
    updateHud() {
      const S = NF.Save.data, C = this.C;
      const ex = ['r1', 'r2', 'r3', 'r4', 'r5', 'r6'].filter((r) => S.visited[r]).length;
      const totalArt = Object.keys(C.ARTIFACTS).length;
      const seen = Object.keys(C.ARTIFACTS).filter((k) => S.examined[k]).length;
      const games = Object.keys(C.GAMES).filter((k) => S.games[k]).length;
      $('#hud-stats').textContent = `Exhibits ${ex}/6 · Artifacts ${seen}/${totalArt} · Games ${games}/6`;
      const pct = ((ex / 6) * 0.3 + (seen / totalArt) * 0.35 + (games / 6) * 0.25 + (S.verdict ? 0.1 : 0)) * 100;
      $('#hud-bar-fill').style.width = Math.round(pct) + '%';
    },
    setGuide(tgt) {
      const el = $('#hud-guide');
      if (!tgt) { if (!el.hidden) el.hidden = true; return; }
      if (this._guide === tgt && !el.hidden) return;
      this._guide = tgt;
      const r = this.C.ROOMS[tgt];
      el.textContent = r.num <= 6 ? `Next ▸ Exhibit ${r.num}: ${r.building}` : `Next ▸ ${r.building}`;
      el.hidden = false;
    },
    setPrompt(it) {
      const el = $('#prompt');
      if (!it || NF.Game.paused) { el.hidden = true; return; }
      const C = this.C;
      let verb = 'Examine', label = '', isNew = false;
      switch (it.kind) {
        case 'artifact': { const a = C.ARTIFACTS[it.id]; label = a.title; isNew = !NF.Save.data.examined[it.id]; break; }
        case 'game': verb = 'Play'; label = C.GAMES[it.id].title; isNew = !NF.Save.data.games[it.id]; break;
        case 'npc': verb = 'Talk'; label = it.npc.name; break;
        case 'door': { const r = C.ROOMS[it.to]; verb = 'Enter'; label = r.num <= 6 ? `Exhibit ${r.num}: ${r.title}` : r.title; break; }
        case 'sign': verb = 'Read'; label = C.SIGNS[it.sign].title; break;
        case 'signpost': verb = 'Read'; label = 'Signpost'; break;
        case 'verdict': verb = 'Approach'; label = 'the bench — deliver your verdict'; break;
        case 'biblio': verb = 'Open'; label = 'the bibliography'; break;
        case 'credits': verb = 'Read'; label = 'team credits'; break;
        case 'replay': verb = 'Play'; label = 'the help-desk introduction'; break;
        case 'eqboard': verb = 'Read'; label = 'the Essential Questions'; break;
        case 'scripts': verb = 'Read'; label = 'narration scripts'; break;
      }
      el.innerHTML = '';
      el.append(h('kbd', 'E'), h('span.p-verb', verb), h('span', label));
      if (isNew) el.append(h('span.p-new', 'NEW'));
      el.hidden = false;
    },

    /* ---------- feedback ---------- */
    toast(text, sub, icon) {
      const t = h('div.toast', h('span.t-icon', icon || '★'), h('div', sub ? h('small', sub) : null, text));
      $('#toasts').append(t);
      setTimeout(() => t.remove(), 4000);
    },
    fade(mid) {
      const f = $('#fade');
      f.classList.add('on');
      setTimeout(() => { try { mid(); } finally { setTimeout(() => f.classList.remove('on'), 60); } }, 300);
    },
    titleCard(roomId, first) {
      const r = this.C.ROOMS[roomId];
      if (!r) return;
      const tc = $('#titlecard');
      tc.innerHTML = '';
      tc.append(h('div.tc-inner', h('div.tc-kicker', r.num <= 6 ? `EXHIBIT ${r.num} OF 6` : r.building.toUpperCase()), h('div.tc-title', r.title), h('div.tc-rule', '◆'), h('div.tc-q', r.question)));
      tc.hidden = false;
      clearTimeout(this._tc);
      this._tc = setTimeout(() => { tc.hidden = true; }, 3400);
      if (first) { this.toast(r.num <= 6 ? `Exhibit ${r.num} discovered` : `${r.building} discovered`, 'NEW ROOM', '◆'); if (NF.Audio) NF.Audio.sfx('discover'); }
      this.updateHud();
    },

    /* ---------- modals ---------- */
    modal(o) {
      const root = $('#modal-root');
      const closeBtn = h('button.x-btn', { 'aria-label': 'Close', onclick: () => this.closeTop() }, '×');
      const body = h('div.modal-body');
      if (o.body) body.append(o.body);
      const foot = o.foot === false ? null : h('div.modal-foot', o.foot || null, h('span.spacer'), h('button.deco-btn.small', { onclick: () => this.closeTop() }, o.closeText || 'Close  (Esc)'));
      const box = h('div.modal' + (o.cls ? '.' + o.cls.split(' ').join('.') : ''), { role: 'dialog', 'aria-modal': 'true', 'aria-label': o.title },
        h('div.modal-head', o.icon ? h('span', { style: { fontSize: '22px' } }, o.icon) : null, h('div.mh-text', o.kicker ? h('div.mh-kicker', o.kicker) : null, h('div.mh-title', o.title)), closeBtn),
        body, foot);
      const wrap = h('div.modal-wrap', { onclick: (e) => { if (e.target === wrap) this.closeTop(); } }, box);
      root.append(wrap);
      const rec = { wrap, body, onClose: o.onClose };
      this.modals.push(rec);
      NF.Game.paused = true;
      this.setPrompt(null);
      setTimeout(() => { const f = box.querySelector('button, [tabindex], input, textarea'); if (f) f.focus({ preventScroll: true }); }, 30);
      return rec;
    },
    closeTop() {
      const m = this.modals.pop();
      if (!m) return;
      m.wrap.remove();
      if (m.onClose) m.onClose();
      if (NF.Audio) NF.Audio.sfx('close');
      if (!this.modals.length) { NF.Game.paused = false; NF.Game.near = null; NF.Input.keys = {}; this.updateHud(); }
    },
    closeAll() { while (this.modals.length) this.closeTop(); },

    /* ---------- interaction dispatcher ---------- */
    interact(it) {
      const C = this.C;
      switch (it.kind) {
        case 'artifact': NF.Artifacts.open(it.id); break;
        case 'game': NF.Games.open(it.id); break;
        case 'npc': this.dialogue(it.npc); break;
        case 'sign': { const s = C.SIGNS[it.sign]; this.dialogue({ name: s.title, lines: [s.text], look: null }); break; }
        case 'signpost': this.dialogue({ name: 'Signpost', look: null, lines: ['North: Union Station (Exhibit 1), the White House (2), and the Daily Ledger (3).', 'East: Treasury & Press Hall (4). South: Hall of Nations (5), Community Hall (6), and the Courthouse.', 'West: the Public Library — every source used in this museum.'] }); break;
        case 'verdict': NF.Games.verdict(); break;
        case 'biblio': this.openBibliography(); break;
        case 'credits': this.openCredits(); break;
        case 'replay': NF.Title.show(true); break;
        case 'eqboard': this.openEQs(); break;
        case 'scripts': this.openScripts(); break;
      }
    },

    /* ---------- dialogue ---------- */
    dialogue(npc) {
      const root = $('#modal-root');
      let i = 0, typing = null;
      const cv = h('canvas', { width: 18, height: 16 });
      if (npc.look && NF.LOOKS[npc.look]) { const g = cv.getContext('2d'); g.imageSmoothingEnabled = false; g.drawImage(NF.Art.portrait(NF.LOOKS[npc.look]), 0, 0); }
      const txt = h('div.d-text'), more = h('div.d-more', '▼ E / click');
      const box = h('div.dialog', { role: 'dialog', 'aria-label': npc.name }, npc.look ? cv : h('canvas', { width: 18, height: 16 }), h('div', { style: { flex: 1 } }, h('div.d-name', npc.name), txt), more);
      const wrap = h('div.modal-wrap', { style: { background: 'transparent', backdropFilter: 'none' } }, box);
      root.append(wrap);
      const rec = { wrap, onClose: () => { clearInterval(typing); window.removeEventListener('keydown', key, true); } };
      this.modals.push(rec);
      NF.Game.paused = true; this.setPrompt(null);
      const show = () => {
        const full = npc.lines[i];
        let n = 0; txt.textContent = '';
        clearInterval(typing);
        const reduce = this.settings().reduceMotion;
        typing = setInterval(() => { n += reduce ? 999 : 2; txt.textContent = full.slice(0, n); if (n >= full.length) { clearInterval(typing); typing = null; } }, 18);
        more.textContent = i < npc.lines.length - 1 ? '▼ E / click' : '✕ E / click to close';
      };
      const advance = () => {
        if (typing) { clearInterval(typing); typing = null; txt.textContent = npc.lines[i]; return; }
        i++;
        if (NF.Audio) NF.Audio.sfx('click');
        if (i >= npc.lines.length) { this.closeTop(); return; }
        show();
      };
      const key = (e) => { if (this.modals[this.modals.length - 1] !== rec) return; if (['e', ' ', 'enter'].includes(e.key.toLowerCase())) { e.preventDefault(); e.stopPropagation(); advance(); } };
      window.addEventListener('keydown', key, true);
      box.onclick = advance;
      show();
    },

    /* ---------- narration ---------- */
    initNarration() {
      this.narr = { audio: new Audio(), mode: null, idx: 0, playing: false, room: null };
      const a = this.narr.audio;
      a.preload = 'none';
      a.addEventListener('timeupdate', () => this.narrTick());
      a.addEventListener('ended', () => { this.narr.playing = false; this.narrUi(); this.showCaption(null); if (NF.Audio) NF.Audio.setDuck(false); });
      $('#narr-close').onclick = () => { this.stopNarration(); $('#narr').hidden = true; $('#btn-narr').classList.remove('active'); };
      $('#narr-play').onclick = () => this.narrToggle();
      $('#narr-replay').onclick = () => this.narrPlay(true);
      $('#narr-transcript').onclick = () => this.openTranscript(this.narr.room);
      const vol = $('#narr-vol');
      vol.value = NF.Audio.vol.voice;
      vol.oninput = () => NF.Audio.setVolume('voice', +vol.value);
      a.volume = NF.Audio.vol.voice;
      const cc = $('#narr-cc');
      cc.setAttribute('aria-pressed', String(this.settings().cc !== false));
      cc.onclick = () => { const s = this.settings(); s.cc = !(s.cc !== false); NF.Save.save(); cc.setAttribute('aria-pressed', String(s.cc)); if (!s.cc) this.showCaption(null); };
      $('#narr-progress').onclick = (e) => {
        const r = e.currentTarget.getBoundingClientRect(), f = (e.clientX - r.left) / r.width;
        if (this.narr.mode === 'audio' && a.duration) a.currentTime = f * a.duration;
        else if (this.narr.mode === 'tts') { this.narr.idx = Math.floor(f * this.narr.lines.length); this.ttsSpeak(); }
      };
    },
    setVoiceVolume(v) { this.narr.audio.volume = v; },
    toggleNarration() {
      const id = NF.Game.map.id, room = this.C.ROOMS[id];
      const panel = $('#narr');
      if (!room || !room.narration) { this.toast('Narration is available inside each of the six exhibits.', 'NARRATION', '♪'); return; }
      if (!panel.hidden && this.narr.room === id) { panel.hidden = true; this.stopNarration(); $('#btn-narr').classList.remove('active'); return; }
      panel.hidden = false;
      $('#btn-narr').classList.add('active');
      this.loadNarration(id);
      this.narrPlay(true);
    },
    loadNarration(id) {
      const N = this.narr, room = this.C.ROOMS[id];
      this.stopNarration();
      N.room = id; N.lines = room.narration; N.idx = 0;
      $('#narr-title').textContent = `Exhibit ${room.num}: ${room.title}`;
      N.mode = 'probe';
      $('#narr-mode').textContent = 'Loading student recording…';
      const src = this.C.MEDIA.narration[id];
      N.audio.src = src;
      N.audio.onerror = () => {
        N.mode = 'tts';
        $('#narr-mode').textContent = ('speechSynthesis' in window) ? 'Student recording not added yet — playing a text-to-speech preview. Captions and transcript are always available.' : 'Student recording not added yet. Read the transcript or captions below.';
        if (N.wantPlay) this.ttsSpeak();
      };
      N.audio.oncanplay = () => { if (N.mode === 'probe') { N.mode = 'audio'; $('#narr-mode').textContent = 'Student recording'; if (N.wantPlay) this.narrPlay(); } };
      N.audio.load();
    },
    narrPlay(restart) {
      const N = this.narr;
      if (!N.room) return;
      N.wantPlay = true;
      if (NF.Audio) NF.Audio.setDuck(true);
      if (N.mode === 'audio') { if (restart) N.audio.currentTime = 0; N.audio.play().catch(() => {}); N.playing = true; }
      else if (N.mode === 'tts') { if (restart) N.idx = 0; this.ttsSpeak(); }
      else { N.playing = true; }
      this.narrUi();
    },
    narrToggle() {
      const N = this.narr;
      if (N.playing) {
        N.playing = false; N.wantPlay = false;
        if (N.mode === 'audio') N.audio.pause();
        if (N.mode === 'tts' && window.speechSynthesis) speechSynthesis.cancel();
        if (NF.Audio) NF.Audio.setDuck(false);
        this.narrUi();
      } else this.narrPlay(false);
    },
    stopNarration() {
      const N = this.narr;
      if (!N) return;
      N.playing = false; N.wantPlay = false;
      try { N.audio.pause(); } catch (e) { /* ignore */ }
      if (window.speechSynthesis) speechSynthesis.cancel();
      this.showCaption(null);
      if (NF.Audio) NF.Audio.setDuck(false);
      this.narrUi && this.narrUi();
    },
    ttsSpeak() {
      const N = this.narr;
      if (!window.speechSynthesis) { N.playing = false; this.narrUi(); return; }
      speechSynthesis.cancel();
      N.playing = true;
      const token = (N.token = (N.token || 0) + 1);
      const speakOne = () => {
        if (token !== N.token || !N.playing) return;
        if (N.idx >= N.lines.length) { N.playing = false; N.idx = 0; this.showCaption(null); this.narrUi(); if (NF.Audio) NF.Audio.setDuck(false); return; }
        const u = new SpeechSynthesisUtterance(N.lines[N.idx]);
        u.rate = 0.98; u.pitch = 1.02; u.volume = NF.Audio.vol.voice;
        const v = speechSynthesis.getVoices().find((x) => /en[-_]US/i.test(x.lang) && /Natural|Aria|Jenny|Google/i.test(x.name)) || speechSynthesis.getVoices().find((x) => /^en/i.test(x.lang));
        if (v) u.voice = v;
        this.showCaption(N.lines[N.idx]);
        this.narrUi();
        u.onend = () => { if (token !== N.token) return; N.idx++; speakOne(); };
        u.onerror = () => { if (token !== N.token) return; N.idx++; setTimeout(speakOne, 50); };
        speechSynthesis.speak(u);
      };
      speakOne();
    },
    narrTick() {
      const N = this.narr, a = N.audio;
      if (N.mode !== 'audio' || !a.duration) return;
      // approximate captions: split time proportionally to sentence length
      const total = N.lines.reduce((s, l) => s + l.length, 0);
      let acc = 0, f = a.currentTime / a.duration, idx = 0;
      for (let i = 0; i < N.lines.length; i++) { acc += N.lines[i].length / total; if (f <= acc) { idx = i; break; } idx = i; }
      if (N.playing) this.showCaption(N.lines[idx]);
      this.narrUi();
    },
    narrUi() {
      const N = this.narr;
      if (!N) return;
      $('#narr-play').textContent = N.playing ? '❚❚ Pause' : '▶ Play';
      let f = 0, t = '0:00';
      if (N.mode === 'audio' && N.audio.duration) { f = N.audio.currentTime / N.audio.duration; const s = Math.floor(N.audio.currentTime); t = Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); }
      else if (N.mode === 'tts' && N.lines) { f = N.idx / N.lines.length; t = `${Math.min(N.idx + 1, N.lines.length)}/${N.lines.length}`; }
      $('#narr-fill').style.width = (f * 100).toFixed(1) + '%';
      $('#narr-time').textContent = t;
    },
    showCaption(text) {
      const el = $('#captions');
      if (!text || this.settings().cc === false) { el.hidden = true; return; }
      el.textContent = text; el.hidden = false;
    },
    openTranscript(id) {
      const room = this.C.ROOMS[id];
      if (!room) return;
      const body = h('div', h('p', { style: { color: '#e9dcbc', fontStyle: 'italic' } }, 'Full narration transcript — the text alternative for this room’s audio.'), room.narration.map((l) => h('p', l)));
      this.modal({ kicker: `EXHIBIT ${room.num} · TRANSCRIPT`, title: room.title, body, cls: 'narrow' });
    },

    /* ---------- map ---------- */
    openMap() {
      const C = this.C, G = NF.Game, S = NF.Save.data;
      const town = G.maps.town;
      if (!this._mapImg) {
        const sc = 0.45, c = NF.Art.canvas(Math.round(town.w * sc), Math.round(town.h * sc));
        c.g.imageSmoothingEnabled = true;
        c.g.scale(sc, sc);
        c.g.drawImage(town.bg, 0, 0);
        town.statics.slice().sort((a, b) => a.sy - b.sy).forEach((s) => c.g.drawImage(s.img, s.x, s.y));
        c.g.setTransform(1, 0, 0, 1, 0, 0);
        c.g.fillStyle = 'rgba(40,20,60,0.12)'; c.g.fillRect(0, 0, c.width, c.height);
        this._mapImg = c;
      }
      const view = h('div.map-view');
      const cv = h('canvas', { width: this._mapImg.width, height: this._mapImg.height });
      cv.getContext('2d').drawImage(this._mapImg, 0, 0);
      view.append(cv);
      const next = G.nextTarget();
      Object.entries(town.markers).forEach(([id, d]) => {
        const r = C.ROOMS[id];
        const pin = h('button.map-pin' + (S.visited[id] ? '.done' : '') + (next === id ? '.next' : ''), { style: { left: (d.x / town.w) * 100 + '%', top: ((d.y - 70) / town.h) * 100 + '%' }, title: 'Travel here', onclick: () => { this.closeAll(); G.travelTo(id); } },
          (r.num <= 6 ? r.num + ' · ' : '') + r.building + (S.visited[id] ? ' ✓' : ''));
        view.append(pin);
      });
      const here = G.map.id === 'town' ? G.player : town.markers[G.map.id] ? { x: town.markers[G.map.id].x, y: town.markers[G.map.id].y + 10 } : null;
      if (here) view.append(h('span.map-you', { style: { left: (here.x / town.w) * 100 + '%', top: (here.y / town.h) * 100 + '%' }, title: 'You are here' }));
      const list = h('ul.dir-list');
      ['r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'court', 'library'].forEach((id) => {
        const r = C.ROOMS[id];
        const arts = Object.entries(C.ARTIFACTS).filter(([, a]) => a.room === id);
        const seen = arts.filter(([k]) => S.examined[k]).length;
        const sub = [];
        if (S.visited[id]) sub.push(h('span.ok', 'Visited ✓')); else sub.push('Not visited');
        if (arts.length) sub.push(` · Artifacts ${seen}/${arts.length}`);
        if (C.GAMES[id]) sub.push(S.games[id] ? h('span.ok', ' · Game ★') : ' · Game ☆');
        if (id === 'court' && S.verdict) sub.push(h('span.ok', ' · Verdict given'));
        list.append(h('li.dir-item' + (next === id ? '.next' : ''),
          h('span.dir-num', { style: { background: r.color } }, r.num <= 6 ? String(r.num) : id === 'court' ? '⚖' : '✎'),
          h('div', h('div.dir-title', r.title), h('div.dir-sub', sub)),
          h('button.deco-btn.small', { onclick: () => { this.closeAll(); G.travelTo(id); } }, 'Go')));
      });
      const side = h('div', h('h3', 'Room directory'), list, h('p', { style: { fontSize: '14px', color: '#d8c69e', marginTop: '10px' } }, 'Tip: “Go” fast-travels you to the building’s front door. The gold arrow at the top of the screen always points to your next stop.'));
      const foot = G.map.id !== 'town' ? h('button.deco-btn.small.teal', { onclick: () => { this.closeAll(); G.toTown(); } }, '⇦ Return to Town Square') : null;
      this.modal({ kicker: 'MUSEUM MAP', title: 'The Town of Normalcy, 1919–1929', body: h('div.map-grid', view, side), foot, icon: '🗺' });
    },

    /* ---------- pause & settings ---------- */
    openPause() {
      const s = this.settings(), A = NF.Audio;
      const slider = (label, key) => {
        const inp = h('input', { type: 'range', min: 0, max: 1, step: 0.05, value: A.vol[key], 'aria-label': label });
        inp.oninput = () => { A.setVolume(key, +inp.value); if (key === 'voice') $('#narr-vol').value = inp.value; };
        return h('div.set-row', h('span', label), inp);
      };
      const toggle = (label, key, def, after) => {
        const on = s[key] === undefined ? def : s[key];
        const b = h('button.toggle', { 'aria-pressed': String(on), 'aria-label': label });
        b.onclick = () => { const v = b.getAttribute('aria-pressed') !== 'true'; b.setAttribute('aria-pressed', String(v)); s[key] = v; NF.Save.save(); if (after) after(v); };
        return h('div.set-row', h('span', label), b);
      };
      const confirm = h('div.confirm-box', { hidden: true }, h('p', 'Erase all progress (visited rooms, artifacts, games and your verdict)? This cannot be undone.'),
        h('button.deco-btn.small.wine', { onclick: () => { NF.Save.reset(); this.closeAll(); NF.Game.setMap('town', NF.Game.maps.town.spawn); this.toast('Progress reset', 'SETTINGS', '↺'); } }, 'Yes, reset'), ' ',
        h('button.deco-btn.small.ghost', { onclick: () => { confirm.hidden = true; } }, 'Cancel'));
      const body = h('div',
        h('div.pause-menu',
          h('button.deco-btn', { onclick: () => this.closeTop() }, '▶ Resume'),
          h('button.deco-btn.ghost', { onclick: () => { this.closeTop(); this.openMap(); } }, 'Map & room directory'),
          h('button.deco-btn.ghost', { onclick: () => { this.closeTop(); this.openHelp(); } }, 'Controls & help'),
          h('button.deco-btn.ghost', { onclick: () => { this.closeAll(); NF.Title.show(true); } }, 'Replay the introduction video'),
          NF.Game.map.id !== 'town' ? h('button.deco-btn.ghost', { onclick: () => { this.closeAll(); NF.Game.toTown(); } }, 'Return to Town Square') : null),
        h('h3', 'Sound'),
        h('div.set-grid', slider('Music', 'music'), slider('Sound effects', 'sfx'), slider('Ambient sounds', 'ambience'), slider('Voiceover', 'voice')),
        h('h3', 'Display & accessibility'),
        h('div.set-grid',
          toggle('Captions for narration', 'cc', true, (v) => { $('#narr-cc').setAttribute('aria-pressed', String(v)); if (!v) this.showCaption(null); }),
          toggle('Gold guide arrow', 'guide', true),
          toggle('Evening lighting', 'lights', true),
          toggle('Reduce motion', 'reduceMotion', false),
          toggle('Larger text', 'largeText', false, (v) => { s.textSize = v ? 'large' : 'normal'; this.applySettings(); }),
          toggle('Closer camera zoom', 'zoomClose', false, (v) => { s.zoom = v ? 'close' : 'normal'; NF.Game.resize(); })),
        h('h3', 'Progress'),
        h('p', { style: { fontSize: '15px', color: '#d8c69e' } }, 'Progress saves automatically in this browser.'),
        h('button.deco-btn.small.wine', { onclick: () => { confirm.hidden = false; } }, 'Reset progress…'), confirm);
      this.modal({ kicker: 'PAUSED', title: 'Pause & Settings', body, cls: 'medium', icon: '⚙' });
    },

    openHelp() {
      const body = h('div.help-cols',
        h('div',
          h('h3', 'Controls'),
          h('div.keys',
            h('span', h('kbd', 'W'), h('kbd', 'A'), h('kbd', 'S'), h('kbd', 'D')), h('span', 'Walk (or the arrow keys). Hold Shift to hurry.'),
            h('span', h('kbd', 'E'), h('kbd', 'Space')), h('span', 'Examine, talk, play, or enter a door'),
            h('span', h('kbd', 'M')), h('span', 'Map, room directory & fast travel'),
            h('span', h('kbd', 'N')), h('span', 'Play this room’s narration (with captions)'),
            h('span', h('kbd', 'Esc')), h('span', 'Close a window, or pause & settings'),
            h('span', h('kbd', 'H')), h('span', 'This help screen')),
          h('p', { style: { marginTop: '12px', fontSize: '15px', color: '#d8c69e' } }, 'On a phone or tablet, use the round pad to walk and the E button to interact. You can also click the prompt at the bottom of the screen.')),
        h('div',
          h('h3', 'How the museum works'),
          h('div.tip', '✦ Sparkles mark artifacts you haven’t examined. Each opens an archive file with its date, creator, source type and citation.'),
          h('div.tip', '★ A gold star marks each room’s mini-game. Every choice is followed by what really happened.'),
          h('div.tip', '➜ Follow the gold arrow. Visit Exhibits 1–6 in order, then deliver your verdict at the Courthouse.'),
          h('h3', 'Troubleshooting'),
          h('div.tip', 'Stuck or lost? Press M and use “Go” to jump to any exhibit. Inside a room, walk onto the red EXIT mat at the bottom.'),
          h('div.tip', 'No sound? Open Esc → Sound. The archival Harding recording streams from the Library of Congress and needs internet.'),
          h('div.tip', 'Text too small? Esc → Larger text. Prefer less movement? Esc → Reduce motion.')));
      this.modal({ kicker: 'HELP DESK', title: 'How to Play', body, cls: 'medium', icon: '?' });
    },

    /* ---------- reference room panels ---------- */
    openBibliography() {
      const C = this.C;
      let filter = 'all', q = '';
      const list = h('ul.bib-list');
      const sorted = C.SOURCES.slice().sort((a, b) => a.mla.replace(/<[^>]+>|[“”"]/g, '').localeCompare(b.mla.replace(/<[^>]+>|[“”"]/g, '')));
      const render = () => {
        list.innerHTML = '';
        sorted.filter((s) => (filter === 'all' || s.type === filter) && (!q || (s.mla + s.use).toLowerCase().includes(q))).forEach((s) => {
          const li = h('li');
          li.append(h('span.src-type.' + s.type, { style: { textIndent: 0 } }, s.type.toUpperCase()), ' ');
          li.append(h('span', { html: s.mla + ' ' }), h('a', { href: s.url, target: '_blank', rel: 'noopener' }, s.url), h('span.use', 'Used in the museum for: ', h('span', { html: s.use })));
          list.append(li);
        });
        if (!list.children.length) list.append(h('li', 'No sources match.'));
      };
      const chips = ['all', 'primary', 'secondary', 'tertiary'].map((f) => h('button.chip' + (f === 'all' ? '.on' : ''), { onclick: (e) => { filter = f; chips.forEach((c) => c.classList.remove('on')); e.currentTarget.classList.add('on'); render(); } }, f[0].toUpperCase() + f.slice(1)));
      const search = h('input', { type: 'search', placeholder: 'Search sources…', 'aria-label': 'Search sources', oninput: (e) => { q = e.target.value.toLowerCase(); render(); } });
      render();
      const copy = h('button.deco-btn.small', { onclick: () => this.copyBibliography(sorted) }, 'Copy all (for Word)');
      const body = h('div',
        h('p', { html: 'Works Cited (MLA 9th edition). <b>Primary</b> sources were created during the period; <b>secondary</b> sources interpret it later; <b>tertiary</b> sources are reference summaries. A Word-ready copy is also saved in the project at <code>docs/BIBLIOGRAPHY.html</code>.' }),
        h('div.bib-tools', chips, search), list);
      this.modal({ kicker: 'CARD CATALOG', title: 'Works Cited', body, cls: 'paper', foot: copy, icon: '📚' });
    },
    copyBibliography(sorted) {
      const html = '<h1 style="text-align:center">Works Cited</h1>' + sorted.map((s) => `<p style="padding-left:0.5in;text-indent:-0.5in;line-height:2">${s.mla} ${s.url}</p>`).join('');
      const text = 'Works Cited\n\n' + sorted.map((s) => s.mla.replace(/<[^>]+>/g, '') + ' ' + s.url).join('\n\n');
      const done = () => this.toast('Bibliography copied — paste into Word', 'COPIED', '✓');
      try {
        if (navigator.clipboard && window.ClipboardItem) {
          navigator.clipboard.write([new ClipboardItem({ 'text/html': new Blob([html], { type: 'text/html' }), 'text/plain': new Blob([text], { type: 'text/plain' }) })]).then(done, () => this.copyFallback(text, done));
        } else this.copyFallback(text, done);
      } catch (e) { this.copyFallback(text, done); }
    },
    copyFallback(text, done) {
      const ta = h('textarea', { style: { position: 'fixed', left: '-9999px' } }); ta.value = text; document.body.append(ta); ta.select();
      try { document.execCommand('copy'); done(); } catch (e) { this.toast('Copy blocked — use docs/BIBLIOGRAPHY.html instead', 'COPY', '!'); }
      ta.remove();
    },
    openCredits() {
      const C = this.C;
      const body = h('div',
        h('p', 'The Normalcy Files was created by:'),
        h('div.team-grid', C.TEAM.map((t) => h('div.team-card', h('div.tr', t.role.toUpperCase()), h('div.tn', t.name), h('p', t.duties)))),
        h('h3', 'Credits & acknowledgements'),
        h('p', 'Archival photographs, newspapers and the 1920 Harding recording: Library of Congress (Prints & Photographs Division; Chronicling America; Nation’s Forum Collection). Statutes: U.S. Government Publishing Office (GovInfo).'),
        h('p', 'All pixel art, the town, characters, music and sound effects were generated in code for this project and are modern illustrations, not historical artifacts.'),
        h('p', 'Fonts: Limelight, Pixelify Sans, Silkscreen, Special Elite and EB Garamond (SIL Open Font License / Apache License).'),
        h('p', { style: { fontSize: '14px', color: '#6a5a48' } }, 'To add your names, edit the TEAM list at the top of js/content.js.'));
      this.modal({ kicker: 'TEAM', title: 'Credits', body, cls: 'paper medium', icon: '✦' });
    },
    openEQs() {
      const C = this.C;
      const body = h('div', h('p', 'These questions run through the whole museum. Here is where each one appears:'),
        Object.entries(C.EQS).map(([k, q]) => {
          const arts = Object.entries(C.ARTIFACTS).filter(([, a]) => (a.eq || []).includes(k));
          return h('div.g-card', h('div.g-kicker', 'ESSENTIAL QUESTION ' + k), h('p', { style: { fontWeight: 600, margin: '4px 0 8px' } }, q),
            h('div', { style: { fontSize: '14.5px' } }, 'Explored in: ', arts.map(([, a], i) => [i ? ' · ' : '', `${a.title} (${C.ROOMS[a.room] ? 'Exhibit ' + C.ROOMS[a.room].num : 'Town'})`]),
              k === 'A1' ? ' · Mini-game: Solve the Teapot Dome Case' : k === 'C1' ? ' · Mini-game: Balancing the Budget' : k === 'A2' ? ' · Mini-game: Who Experienced Normalcy?' : k === 'D1' ? ' · Mini-game: Repair the International Economy' : ' · Final verdict at the Courthouse'));
        }));
      this.modal({ kicker: 'REFERENCE LIBRARY', title: 'Essential Questions', body, cls: 'medium game-modal', icon: '?' });
    },
    openScripts() {
      const C = this.C;
      const body = h('div', h('h3', 'Help-desk video'), C.HELPDESK.map((l) => h('p', l)),
        ['r1', 'r2', 'r3', 'r4', 'r5', 'r6'].map((id) => [h('h3', `Exhibit ${C.ROOMS[id].num}: ${C.ROOMS[id].title}`), C.ROOMS[id].narration.map((l) => h('p', l))]));
      this.modal({ kicker: 'TRANSCRIPTS', title: 'Narration Scripts', body, cls: 'paper medium', icon: '✎' });
    },

    /* ---------- touch ---------- */
    initTouch() {
      const isTouch = 'ontouchstart' in window || (window.matchMedia && matchMedia('(pointer: coarse)').matches);
      if (!isTouch) return;
      document.body.classList.add('touch');
      this.touchEnabled = true;
      const pad = $('#dpad'), knob = $('#dpad-knob');
      let id = null;
      const move = (e) => {
        const t = [...e.changedTouches].find((x) => x.identifier === id); if (!t) return;
        const r = pad.getBoundingClientRect();
        let dx = t.clientX - (r.left + r.width / 2), dy = t.clientY - (r.top + r.height / 2);
        const len = Math.hypot(dx, dy), max = r.width / 2 - 10;
        if (len > max) { dx *= max / len; dy *= max / len; }
        knob.style.transform = `translate(${dx}px, ${dy}px)`;
        const dead = 12;
        NF.Input.touch.x = Math.abs(dx) > dead ? Math.sign(dx) * Math.min(1, Math.abs(dx) / (max * 0.6)) : 0;
        NF.Input.touch.y = Math.abs(dy) > dead ? Math.sign(dy) * Math.min(1, Math.abs(dy) / (max * 0.6)) : 0;
        e.preventDefault();
      };
      pad.addEventListener('touchstart', (e) => { id = e.changedTouches[0].identifier; move(e); }, { passive: false });
      pad.addEventListener('touchmove', move, { passive: false });
      const end = (e) => { if ([...e.changedTouches].some((x) => x.identifier === id)) { id = null; knob.style.transform = ''; NF.Input.touch.x = NF.Input.touch.y = 0; } };
      pad.addEventListener('touchend', end); pad.addEventListener('touchcancel', end);
      $('#touch-a').addEventListener('touchstart', (e) => { e.preventDefault(); NF.Input.press('e'); }, { passive: false });
    },
    showGameUi(on) {
      $('#hud').hidden = !on;
      $('#touch').hidden = !(on && this.touchEnabled);
      if (!on) { $('#prompt').hidden = true; $('#narr').hidden = true; this.stopNarration(); }
    },
  });

  /* =====================================================================
     TITLE SCREEN + HELP-DESK VIDEO
     ===================================================================== */
  const Title = (NF.Title = {
    init() {
      const C = NF.CONTENT;
      this.el = $('#title-screen');
      this.video = $('#helpdesk');
      this.sky = $('#skyline');
      this.ttsMode = false;
      this.video.src = C.MEDIA.helpdeskVideo;
      const tr = $('#helpdesk-track'); tr.src = C.MEDIA.helpdeskCaptions;
      this.video.addEventListener('error', () => this.noVideo());
      this.video.addEventListener('loadedmetadata', () => { this.hasVideo = true; });
      this.video.addEventListener('timeupdate', () => this.videoCaptions());
      this.video.addEventListener('ended', () => { $('#video-play').classList.remove('playing'); $('#video-captions').hidden = true; });
      this.video.addEventListener('play', () => $('#video-play').classList.add('playing'));
      this.video.addEventListener('pause', () => $('#video-play').classList.remove('playing'));
      $('#video-play').onclick = () => this.togglePlay();
      $('#video-transcript').onclick = () => UI.modal({ kicker: 'HELP DESK', title: 'Video Transcript', body: h('div', C.HELPDESK.map((l) => h('p', l))), cls: 'narrow' });
      const cc = $('#video-cc');
      cc.onclick = () => { const on = cc.getAttribute('aria-pressed') !== 'true'; cc.setAttribute('aria-pressed', String(on)); cc.textContent = on ? 'Captions on' : 'Captions off'; if (!on) $('#video-captions').hidden = true; this.trackMode(); };
      $('#enter-btn').onclick = () => this.enter();
      $('#skip-btn').onclick = () => this.enter();
      this.startSkyline();
      this.drawProjector(0);
    },
    trackMode() {
      const on = $('#video-cc').getAttribute('aria-pressed') === 'true';
      const t = this.video.textTracks && this.video.textTracks[0];
      if (t) t.mode = on && this.trackOk ? 'showing' : 'hidden';
    },
    noVideo() {
      this.hasVideo = false;
      $('#video-placeholder').hidden = false;
      this.video.hidden = true;
    },
    togglePlay() {
      if (NF.Audio) NF.Audio.unlock();
      if (this.hasVideo !== false && !this.video.hidden) {
        // detect whether the VTT track loaded (it can't when opened from file://)
        const t = this.video.textTracks && this.video.textTracks[0];
        this.trackOk = !!(t && t.cues && t.cues.length);
        this.trackMode();
        if (this.video.paused) { this.video.play().catch(() => this.noVideo()); this.video.controls = true; } else this.video.pause();
        return;
      }
      // narrated preview with captions
      const btn = $('#video-play');
      if (this.ttsMode) { this.ttsMode = false; if (window.speechSynthesis) speechSynthesis.cancel(); btn.classList.remove('playing'); $('#video-captions').hidden = true; return; }
      this.ttsMode = true; btn.classList.add('playing');
      const lines = NF.CONTENT.HELPDESK;
      let i = 0;
      const cap = $('#video-captions');
      const next = () => {
        if (!this.ttsMode) return;
        if (i >= lines.length) { this.ttsMode = false; btn.classList.remove('playing'); cap.hidden = true; return; }
        if ($('#video-cc').getAttribute('aria-pressed') === 'true') { cap.textContent = lines[i]; cap.hidden = false; }
        this.drawProjector(i);
        if (window.speechSynthesis) {
          const u = new SpeechSynthesisUtterance(lines[i]); u.rate = 1; u.volume = NF.Audio.vol.voice;
          const v = speechSynthesis.getVoices().find((x) => /en[-_]US/i.test(x.lang) && /Natural|Aria|Jenny|Google/i.test(x.name)) || speechSynthesis.getVoices().find((x) => /^en/i.test(x.lang));
          if (v) u.voice = v;
          u.onend = () => { i++; next(); }; u.onerror = () => { i++; setTimeout(next, 1500); };
          speechSynthesis.speak(u);
        } else { setTimeout(() => { i++; next(); }, 3800); }
      };
      if (window.speechSynthesis) speechSynthesis.cancel();
      next();
    },
    videoCaptions() {
      // fallback captions when the VTT file could not be loaded (e.g. opened from file://)
      if (this.trackOk || $('#video-cc').getAttribute('aria-pressed') !== 'true') return;
      const v = this.video, lines = NF.CONTENT.HELPDESK;
      if (!v.duration) return;
      const total = lines.reduce((s, l) => s + l.length, 0);
      let acc = 0, idx = lines.length - 1;
      for (let i = 0; i < lines.length; i++) { acc += lines[i].length / total; if (v.currentTime / v.duration <= acc) { idx = i; break; } }
      const cap = $('#video-captions'); cap.textContent = lines[idx]; cap.hidden = v.paused;
    },
    drawProjector(step) {
      const c = $('#projector'); if (!c) return;
      const g = c.getContext('2d'), A = NF.Art;
      g.imageSmoothingEnabled = false;
      g.fillStyle = '#1a120e'; g.fillRect(0, 0, 160, 90);
      g.fillStyle = '#f4ead2'; g.fillRect(30, 8, 100, 56); g.fillStyle = '#d8c69e'; g.fillRect(30, 60, 100, 4);
      const icons = ['THE NORMALCY FILES', 'NORMALCY?', 'WASD = WALK', 'E = EXAMINE', 'DOORS & EXITS', 'MINI-GAMES', 'N = NARRATION', 'M = MAP', 'COURTHOUSE', "LET'S GO!"];
      A.textC(g, icons[step % icons.length], 80, 30, '#7a2630', 1);
      g.drawImage(A.charSheet(NF.LOOKS.player), 0, 0, A.FW, A.FH, 71, 38, A.FW, A.FH);
      g.fillStyle = 'rgba(255,240,200,0.08)'; g.beginPath(); g.moveTo(80, 90); g.lineTo(30, 8); g.lineTo(130, 8); g.closePath(); g.fill();
    },
    enter() {
      if (NF.Audio) NF.Audio.unlock();
      try { this.video.pause(); } catch (e) { /* ignore */ }
      this.ttsMode = false; if (window.speechSynthesis) speechSynthesis.cancel();
      $('#video-captions').hidden = true; $('#video-play').classList.remove('playing');
      this.el.classList.add('leaving');
      setTimeout(() => {
        this.el.hidden = true; this.el.classList.remove('leaving');
        this.skyOn = false;
        NF.Game.running = true;
        UI.showGameUi(true);
        UI.onMapChange(NF.Game.map);
        if (NF.Audio && NF.Game.map) NF.Audio.setScene(NF.Game.map.music, NF.Game.map.ambience);
        if (!NF.Save.data.introSeen) {
          NF.Save.data.introSeen = true; NF.Save.save();
          setTimeout(() => UI.dialogue({ name: 'Docent Dot (fictional guide)', look: 'guide', lines: NF.CONTENT.NPCS[0].lines }), 400);
        }
      }, 650);
    },
    show() {
      UI.closeAll();
      NF.Game.running = false;
      UI.showGameUi(false);
      this.el.hidden = false;
      this.skyOn = true;
      this.startSkyline();
    },

    /* ---------- animated pixel skyline ---------- */
    startSkyline() {
      if (this.skyRunning) return;
      this.skyRunning = true; this.skyOn = true;
      const A = NF.Art, cv = this.sky, g = cv.getContext('2d');
      const W = 320, H = 180;
      cv.width = W; cv.height = H; g.imageSmoothingEnabled = false;
      const rnd = A.RNG(1925);
      // pre-render layers
      const sky = A.canvas(W, H);
      for (let y = 0; y < H; y++) { A.R(sky.g, 0, y, W, 1, y < 70 ? A.mix('#1b1430', '#5a2c4a', y / 70) : A.mix('#5a2c4a', '#e08a4a', Math.min(1, (y - 70) / 50))); }
      for (let i = 0; i < 60; i++) A.P(sky.g, (rnd() * W) | 0, (rnd() * 60) | 0, rnd() < 0.5 ? '#ffffff' : '#c8c0e8');
      A.disc(sky.g, 250, 34, 9, '#f6e6c0'); A.disc(sky.g, 253, 31, 8, '#2a1c38');
      const far = A.canvas(W, H), near = A.canvas(W, H);
      const towers = (layer, col, lit, base, minH, maxH, seed) => {
        const r = A.RNG(seed); let x = -4;
        while (x < W) {
          const w = 14 + ((r() * 22) | 0), hh = minH + ((r() * (maxH - minH)) | 0);
          const top = base - hh;
          A.R(layer.g, x, top, w, hh, col);
          // setbacks (zoning-law wedding-cake tops of the 1920s)
          if (r() < 0.6) { A.R(layer.g, x + 3, top - 8, w - 6, 8, col); if (r() < 0.6) { A.R(layer.g, x + 6, top - 14, w - 12, 6, col); A.R(layer.g, x + w / 2 - 1, top - 22, 2, 8, col); } }
          for (let yy = top + 3; yy < base - 2; yy += 4) for (let xx = x + 2; xx < x + w - 2; xx += 3) if (r() < lit) A.P(layer.g, xx, yy, r() < 0.8 ? '#ffd27a' : '#fff2c0');
          x += w + ((r() * 4) | 0);
        }
      };
      towers(far, '#3a2440', 0.18, 128, 30, 70, 3);
      towers(near, '#22182a', 0.3, 140, 20, 52, 9);
      // Woolworth-style gothic tower (built 1913) as a landmark
      const lg = near.g; A.R(lg, 150, 50, 16, 90, '#1e1626'); A.R(lg, 153, 38, 10, 12, '#1e1626'); A.R(lg, 156, 26, 4, 12, '#1e1626'); A.R(lg, 157, 18, 2, 8, '#1e1626');
      for (let y = 54; y < 138; y += 4) for (let x = 152; x < 164; x += 3) if (rnd() < 0.4) A.P(lg, x, y, '#ffd27a');
      const street = A.canvas(W, H);
      A.R(street.g, 0, 140, W, 40, '#2a1e22'); A.R(street.g, 0, 140, W, 3, '#6a5a50'); A.R(street.g, 0, 156, W, 2, '#4a3a36');
      for (let x = 0; x < W; x += 16) A.R(street.g, x, 165, 8, 1, '#c8a86a');
      // storefronts
      const shops = [['#6a2a30', 'CAFE'], ['#2c4a46', 'RADIO'], ['#5a3a6a', 'HATS'], ['#7a4a2a', 'FORD'], ['#2a3a5a', 'BANK'], ['#6a2a30', 'SODA']];
      shops.forEach(([c, name], i) => {
        const x = 4 + i * 54; const sg = street.g;
        A.R(sg, x, 112, 46, 28, c); A.R(sg, x, 112, 46, 2, A.shade(c, 0.3)); A.R(sg, x + 4, 122, 16, 14, '#ffd683'); A.R(sg, x + 26, 122, 10, 18, '#3a2418');
        for (let k = 0; k < 46; k++) A.R(sg, x + k, 117, 1, 4, Math.floor(k / 4) % 2 ? '#e8dcc0' : c);
        A.R(sg, x + 8, 106, 30, 7, '#1e1a1a'); A.textC(sg, name, x + 23, 107, '#ffd27a', 1);
      });
      const lamp = A.lamp();
      const cars = [A.car('#26262c', 'sedan'), A.car('#6a2a2a', 'sedan'), A.car('#e0b84a', 'taxi'), A.car('#2f4a5a', 'sedan')];
      const traffic = cars.map((c, i) => ({ c, x: i * 90, dir: i % 2 ? -1 : 1, sp: 18 + i * 4 }));
      const clouds = [[20, 30, 40], [140, 18, 60], [230, 50, 36]].map(([x, y, w]) => ({ x, y, w }));
      const marquee = { x: 128, y: 96 };
      let t0 = performance.now();
      const draw = (now) => {
        if (!this.skyOn) { this.skyRunning = false; return; }
        const t = Math.max(0, (now - t0) / 1000);
        g.drawImage(sky, 0, 0);
        clouds.forEach((c) => { c.x = (c.x + 0.05) % (W + 80); const x = c.x - 60; g.fillStyle = 'rgba(120,70,100,0.55)'; g.fillRect(Math.round(x), c.y, c.w, 3); g.fillRect(Math.round(x) + 6, c.y - 2, c.w - 14, 2); });
        g.drawImage(far, 0, 0); g.drawImage(near, 0, 0); g.drawImage(street, 0, 0);
        // blinking marquee on the theatre
        A.R(g, marquee.x, marquee.y, 64, 14, '#2a1a22');
        for (let i = 0; i < 16; i++) { const on = (Math.floor(t * 6) + i) % 3 !== 0; A.P(g, marquee.x + 2 + i * 4, marquee.y + 1, on ? '#ffe08a' : '#6a4a2a'); A.P(g, marquee.x + 2 + i * 4, marquee.y + 12, on ? '#6a4a2a' : '#ffe08a'); }
        A.textC(g, 'NORMALCY', marquee.x + 32, marquee.y + 4, Math.floor(t * 2) % 2 ? '#ffd27a' : '#fff2c0', 1);
        [30, 110, 190, 270].forEach((x) => g.drawImage(lamp.c, x, 140 - 44));
        traffic.forEach((o) => {
          o.x += o.dir * o.sp * (1 / 60);
          if (o.x > W + 40) o.x = -40; if (o.x < -40) o.x = W + 40;
          const img = o.dir > 0 ? o.c.side[Math.floor(t * 6) % 2] : o.c.sideL[Math.floor(t * 6) % 2];
          g.drawImage(img, Math.round(o.x), o.dir > 0 ? 148 : 158);
        });
        // lamp glows
        g.save(); g.globalCompositeOperation = 'lighter';
        [30, 110, 190, 270].forEach((x) => { const gr = g.createRadialGradient(x + 11, 103, 0, x + 11, 103, 26); gr.addColorStop(0, 'rgba(255,200,120,0.35)'); gr.addColorStop(1, 'rgba(255,200,120,0)'); g.fillStyle = gr; g.fillRect(x - 20, 76, 62, 60); });
        g.restore();
        g.fillStyle = 'rgba(10,6,16,0.35)'; g.fillRect(0, 0, W, H);
        requestAnimationFrame(draw);
      };
      requestAnimationFrame(draw);
    },
  });
})();
