/* =====================================================================
   THE NORMALCY FILES: engine.js
   Game loop, input, player movement, collision, camera, NPCs, traffic,
   the passing train, lighting and room transitions. Also: save state.
   ===================================================================== */
(function () {
  'use strict';
  const NF = (window.NF = window.NF || {});
  const A = NF.Art;

  /* =====================================================================
     SAVE STATE (localStorage, wrapped so it never crashes)
     ===================================================================== */
  const KEY = 'normalcyFiles.v1';
  const Save = (NF.Save = {
    data: { visited: {}, examined: {}, games: {}, verdict: null, reflection: '', settings: {}, introSeen: false },
    load() {
      try { const raw = localStorage.getItem(KEY); if (raw) Object.assign(this.data, JSON.parse(raw)); } catch (e) { /* storage unavailable */ }
      this.data.visited = this.data.visited || {}; this.data.examined = this.data.examined || {}; this.data.games = this.data.games || {};
      return this.data;
    },
    save() { try { localStorage.setItem(KEY, JSON.stringify(this.data)); } catch (e) { /* ignore */ } },
    reset() { const s = this.data.settings; this.data = { visited: {}, examined: {}, games: {}, verdict: null, reflection: '', settings: s, introSeen: true }; this.save(); },
  });

  /* =====================================================================
     INPUT
     ===================================================================== */
  const Input = (NF.Input = {
    keys: {}, pressed: {}, touch: { x: 0, y: 0 },
    init() {
      window.addEventListener('keydown', (e) => {
        const k = e.key.toLowerCase();
        if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable)) return;
        if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(k) && Game.running && !Game.paused) e.preventDefault();
        if (!this.keys[k]) this.pressed[k] = true;
        this.keys[k] = true;
      });
      window.addEventListener('keyup', (e) => { this.keys[e.key.toLowerCase()] = false; });
      window.addEventListener('blur', () => { this.keys = {}; });
    },
    down(...ks) { return ks.some((k) => this.keys[k]); },
    hit(...ks) { let r = false; ks.forEach((k) => { if (this.pressed[k]) r = true; }); return r; },
    flush() { this.pressed = {}; },
    press(k) { this.pressed[k] = true; },
  });

  /* =====================================================================
     GAME
     ===================================================================== */
  const Game = (NF.Game = {
    running: false, paused: false, maps: null, map: null, t: 0,
    player: { x: 0, y: 0, dir: 0, frame: 0, anim: 0, moving: false },
    cam: { x: 0, y: 0 }, view: { w: 480, h: 270, scale: 3 },
    npcs: [], cars: [], train: null, particles: [], fireflies: [],
    near: null, stepT: 0, transition: false, trainTimer: 18,

    init(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.light = A.canvas(8, 8);
      this.maps = NF.World.build();
      this.playerSheet = A.charSheet(NF.LOOKS.player);
      this.resize();
      window.addEventListener('resize', () => this.resize());
      this.buildNpcs();
      this.buildTraffic();
      for (let i = 0; i < 40; i++) this.fireflies.push({ x: Math.random() * 1248, y: 90 + Math.random() * 800, p: Math.random() * 6.28, s: 0.4 + Math.random() * 0.6 });
      this.sparkles = [0, 1, 2, 3, 4, 5].map((i) => A.sparkle(i));
      this.starIcon = this.makeStar();
      this.bubble = this.makeBubble();
      this.seenIcon = (() => { const c = A.canvas(7, 7); A.text(c.g, '✓', 1, 1, '#bfe8a8', 1); A.outline(c); return c; })();
      this.arrowIcon = this.makeArrow();
      this.setMap('town', this.maps.town.spawn);
      let last = performance.now();
      const loop = (now) => {
        const dt = Math.max(0, Math.min(0.05, (now - last) / 1000));
        last = now;
        this.frame(dt);
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    },

    resize() {
      const ww = window.innerWidth, wh = window.innerHeight;
      const big = Save.data.settings.zoom === 'close' ? 1 : 0;
      let scale = Math.max(2, Math.round(wh / 290) + big);
      if (ww < 700) scale = Math.max(2, Math.round(Math.min(ww / 220, wh / 300)));
      this.view.scale = scale;
      this.view.w = Math.ceil(ww / scale);
      this.view.h = Math.ceil(wh / scale);
      this.canvas.width = this.view.w;
      this.canvas.height = this.view.h;
      this.canvas.style.width = this.view.w * scale + 'px';
      this.canvas.style.height = this.view.h * scale + 'px';
      this.ctx.imageSmoothingEnabled = false;
      this.light.width = this.view.w; this.light.height = this.view.h;
    },

    makeStar() {
      const c = A.canvas(11, 11);
      const pts = ['.....#.....', '....###....', '....###....', '###########', '.#########.', '..#######..', '..#######..', '.####.####.', '.###...###.', '##.......##', '...........'];
      pts.forEach((r, y) => [...r].forEach((ch, x) => { if (ch === '#') A.P(c.g, x, y, y < 4 ? '#ffe9a0' : '#f2c14a'); }));
      A.outline(c);
      return c;
    },
    makeBubble() {
      const c = A.canvas(11, 12);
      A.R(c.g, 1, 1, 9, 7, '#fff6e0'); A.R(c.g, 4, 8, 2, 2, '#fff6e0');
      A.R(c.g, 3, 4, 1, 1, '#5a3a2a'); A.R(c.g, 5, 4, 1, 1, '#5a3a2a'); A.R(c.g, 7, 4, 1, 1, '#5a3a2a');
      A.outline(c);
      return c;
    },
    makeArrow() {
      const c = A.canvas(13, 13);
      ['......#......', '.....###.....', '....#####....', '...#######...', '..#########..', '.....###.....', '.....###.....', '.....###.....', '.....###.....'].forEach((r, y) => [...r].forEach((ch, x) => { if (ch === '#') A.P(c.g, x, y + 2, '#f2c14a'); }));
      A.outline(c);
      return c;
    },

    /* ---------- NPCs & traffic ---------- */
    buildNpcs() {
      this.npcsByMap = {};
      Object.values(this.maps).forEach((m) => {
        this.npcsByMap[m.id] = m.npcs.map((n) => Object.assign({}, n, { sheet: A.charSheet(NF.LOOKS[n.look] || NF.LOOKS.guide), frame: 0, anim: 0, moving: false, wait: Math.random() * 3, tx: n.x, ty: n.y }));
      });
    },
    buildTraffic() {
      const loop = this.maps.town.carLoop;
      const segs = [];
      let total = 0;
      for (let i = 0; i < loop.length; i++) {
        const a = loop[i], b = loop[(i + 1) % loop.length];
        const len = Math.abs(b[0] - a[0]) + Math.abs(b[1] - a[1]);
        segs.push({ a, b, len, start: total });
        total += len;
      }
      this.loop = { segs, total };
      const cols = [['#26262c', 'sedan'], ['#6a2a2a', 'sedan'], ['#e0b84a', 'taxi'], ['#2f4a5a', 'sedan'], ['#3a4a2e', 'sedan']];
      this.cars = cols.map(([c, k], i) => ({ d: (i / cols.length) * total, speed: 46 + i * 4, base: 46 + i * 4, spr: A.car(c, k), wheel: 0, honk: 0 }));
    },
    carPos(d) {
      const L = this.loop;
      d = ((d % L.total) + L.total) % L.total;
      for (const s of L.segs) {
        if (d <= s.start + s.len) {
          const t = (d - s.start) / s.len;
          const x = s.a[0] + (s.b[0] - s.a[0]) * t, y = s.a[1] + (s.b[1] - s.a[1]) * t;
          const dx = Math.sign(s.b[0] - s.a[0]), dy = Math.sign(s.b[1] - s.a[1]);
          return { x, y, dx, dy };
        }
      }
      return { x: 0, y: 0, dx: 1, dy: 0 };
    },
    carRect(c) {
      const p = this.carPos(c.d);
      return p.dx ? { x: p.x - 16, y: p.y - 9, w: 32, h: 9 } : { x: p.x - 9, y: p.y - 12, w: 18, h: 14 };
    },

    /* ---------- maps ---------- */
    setMap(id, spawn) {
      this.map = this.maps[id];
      this.npcs = this.npcsByMap[id];
      const p = this.player;
      p.x = spawn.x; p.y = spawn.y; p.dir = spawn.dir || 0;
      this.snapCamera();
      if (NF.Audio) NF.Audio.setScene(this.map.id, this.map.ambience);
      if (NF.UI && NF.UI.C) NF.UI.onMapChange(this.map);
    },
    snapCamera() {
      const v = this.view, m = this.map, p = this.player;
      this.cam.x = m.w <= v.w ? (m.w - v.w) / 2 : Math.max(0, Math.min(m.w - v.w, p.x - v.w / 2));
      this.cam.y = m.h <= v.h ? (m.h - v.h) / 2 : Math.max(0, Math.min(m.h - v.h, p.y - v.h / 2));
    },
    enter(roomId) {
      if (this.transition) return;
      this.transition = true;
      if (NF.Audio) NF.Audio.sfx('door');
      NF.UI.fade(() => {
        const m = this.maps[roomId];
        this.setMap(roomId, m.spawn);
        const first = !Save.data.visited[roomId];
        Save.data.visited[roomId] = true; Save.save();
        NF.UI.titleCard(roomId, first);
        this.transition = false;
      });
    },
    toTown(roomId) {
      if (this.transition) return;
      this.transition = true;
      if (NF.Audio) NF.Audio.sfx('door');
      const d = this.maps.town.doorsByRoom[roomId || this.map.id] || this.maps.town.spawn;
      NF.UI.fade(() => {
        this.setMap('town', { x: d.x, y: d.y + 16, dir: 0 });
        this.transition = false;
      });
    },
    travelTo(roomId) {
      // Fast travel to the front of a building (used by the map)
      const d = this.maps.town.doorsByRoom[roomId];
      if (!d) return;
      NF.UI.fade(() => this.setMap('town', { x: d.x, y: d.y + 16, dir: 3 }));
    },
    nextTarget() {
      const order = ['r1', 'r2', 'r3', 'r4', 'r5', 'r6'];
      for (const r of order) if (!Save.data.visited[r]) return r;
      if (!Save.data.verdict) return 'court';
      if (!Save.data.visited.library) return 'library';
      return null;
    },

    /* ---------- collision ---------- */
    blocked(x, y, self) {
      const m = this.map;
      const bx = x - 5, by = y - 4, bw = 10, bh = 5;
      if (bx < 0 || by < 0 || bx + bw > m.w || by + bh > m.h) return true;
      for (const s of m.solids) if (bx < s.x + s.w && bx + bw > s.x && by < s.y + s.h && by + bh > s.y) return true;
      if (m.id === 'town') for (const c of this.cars) { const r = this.carRect(c); if (bx < r.x + r.w && bx + bw > r.x && by < r.y + r.h && by + bh > r.y) return true; }
      for (const n of this.npcs) { if (n === self) continue; if (Math.abs(n.x - x) < 9 && Math.abs(n.y - y) < 5) return true; }
      if (self && self !== this.player) { const p = this.player; if (Math.abs(p.x - x) < 10 && Math.abs(p.y - y) < 6) return true; }
      return false;
    },
    moveEntity(e, dx, dy) {
      if (dx) { if (!this.blocked(e.x + dx, e.y, e)) e.x += dx; else if (!dy) { // slide around corners
        if (!this.blocked(e.x + dx, e.y - 2, e)) { e.y -= 1; } else if (!this.blocked(e.x + dx, e.y + 2, e)) { e.y += 1; } } }
      if (dy) { if (!this.blocked(e.x, e.y + dy, e)) e.y += dy; else if (!dx) {
        if (!this.blocked(e.x - 3, e.y + dy, e)) { e.x -= 1; } else if (!this.blocked(e.x + 3, e.y + dy, e)) { e.x += 1; } } }
    },

    /* ---------- per-frame ---------- */
    frame(dt) {
      this.t += dt;
      if (this.running && !this.paused && !this.transition) this.update(dt);
      else this.updateAmbient(dt);
      this.render();
      Input.flush();
    },
    update(dt) {
      const p = this.player;
      let dx = 0, dy = 0;
      if (Input.down('arrowleft', 'a')) dx -= 1;
      if (Input.down('arrowright', 'd')) dx += 1;
      if (Input.down('arrowup', 'w')) dy -= 1;
      if (Input.down('arrowdown', 's')) dy += 1;
      if (Input.touch.x || Input.touch.y) { dx = Input.touch.x; dy = Input.touch.y; }
      const run = Input.down('shift');
      p.moving = !!(dx || dy);
      if (p.moving) {
        const len = Math.hypot(dx, dy) || 1;
        const sp = (run ? 118 : 74) * dt;
        const mx = (dx / len) * sp, my = (dy / len) * sp;
        if (Math.abs(dx) > Math.abs(dy)) p.dir = dx < 0 ? 1 : 2; else if (dy) p.dir = dy < 0 ? 3 : 0;
        // sub-pixel accumulation
        p.fx = (p.fx || 0) + mx; p.fy = (p.fy || 0) + my;
        const ix = Math.trunc(p.fx), iy = Math.trunc(p.fy);
        p.fx -= ix; p.fy -= iy;
        for (let i = 0; i < Math.abs(ix); i++) this.moveEntity(p, Math.sign(ix), 0);
        for (let i = 0; i < Math.abs(iy); i++) this.moveEntity(p, 0, Math.sign(iy));
        p.anim += dt * (run ? 13 : 9);
        p.frame = Math.floor(p.anim) % 4;
        this.stepT -= dt;
        if (this.stepT <= 0) { this.stepT = run ? 0.2 : 0.3; if (NF.Audio) NF.Audio.sfx('step'); }
      } else { p.frame = 0; p.anim = 0; }

      // doors & exits
      const m = this.map;
      for (const d of m.doors) if (p.x > d.x && p.x < d.x + d.w && p.y > d.y && p.y < d.y + d.h && p.dir === 3 && p.moving) { this.enter(d.to); return; }
      for (const e of m.exits) if (p.x > e.x && p.x < e.x + e.w && p.y > e.y && p.dir === 0 && p.moving) { this.toTown(); return; }

      this.updateAmbient(dt);

      // nearest interactable
      let best = null, bd = 1e9;
      for (const it of m.inter) {
        const d = Math.hypot(it.x - p.x, it.y - p.y);
        if (d < it.r && d < bd) { bd = d; best = it; }
      }
      for (const n of this.npcs) {
        const d = Math.hypot(n.x - p.x, n.y - p.y);
        if (d < 22 && d < bd) { bd = d; best = { kind: 'npc', npc: n, x: n.x, y: n.y }; }
      }
      if (best !== this.near && !(best && this.near && best.kind === 'npc' && this.near.kind === 'npc' && best.npc === this.near.npc)) { this.near = best; NF.UI.setPrompt(best); }
      if (best && Input.hit('e', ' ', 'enter')) this.activate(best);
      if (Input.hit('m')) NF.UI.openMap();
      if (Input.hit('n')) NF.UI.toggleNarration();
      if (Input.hit('h', '?')) NF.UI.openHelp();
      if (Input.hit('escape', 'p')) NF.UI.openPause();
    },
    activate(it) {
      if (it.kind === 'door') { this.enter(it.to); return; }
      if (it.kind === 'npc') {
        const n = it.npc, p = this.player;
        n.dir = Math.abs(p.x - n.x) > Math.abs(p.y - n.y) ? (p.x < n.x ? 1 : 2) : (p.y < n.y ? 3 : 0);
        n.moving = false; n.frame = 0; n.wait = 4;
      }
      if (NF.Audio) NF.Audio.sfx('open');
      NF.UI.interact(it);
    },
    updateAmbient(dt) {
      const m = this.map;
      // NPC wandering
      for (const n of this.npcs) {
        if (n.fixed || this.paused) { n.moving = false; n.frame = 0; continue; }
        n.wait -= dt;
        if (n.wait <= 0 && !n.moving) {
          n.tx = n.home[0] + (Math.random() - 0.5) * 80; n.ty = n.home[1] + (Math.random() - 0.5) * 40;
          n.moving = true; n.wait = 2 + Math.random() * 4; n.stuck = 0;
        }
        if (n.moving) {
          const dx = n.tx - n.x, dy = n.ty - n.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 2 || n.stuck > 1.2) { n.moving = false; n.frame = 0; continue; }
          const sp = 26 * dt;
          n.fx = (n.fx || 0) + (dx / dist) * sp; n.fy = (n.fy || 0) + (dy / dist) * sp;
          const ix = Math.trunc(n.fx), iy = Math.trunc(n.fy);
          n.fx -= ix; n.fy -= iy;
          const ox = n.x, oy = n.y;
          if (ix) this.moveEntity(n, ix, 0);
          if (iy) this.moveEntity(n, 0, iy);
          if ((ix || iy) && ox === n.x && oy === n.y) n.stuck += dt; else n.stuck = 0;
          n.dir = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 1 : 2) : (dy < 0 ? 3 : 0);
          n.anim += dt * 7; n.frame = Math.floor(n.anim) % 4;
        }
      }
      // traffic
      if (m.id === 'town') {
        const p = this.player;
        for (const c of this.cars) {
          const pos = this.carPos(c.d);
          let stop = false;
          // look ahead for the player or another car
          const ax = pos.x + pos.dx * 26, ay = pos.y + pos.dy * 26;
          if (Math.abs(p.x - ax) < 20 && Math.abs(p.y - ay) < 16) stop = true;
          for (const o of this.cars) { if (o === c) continue; let gap = o.d - c.d; if (gap < 0) gap += this.loop.total; if (gap > 0 && gap < 48) stop = true; }
          const target = stop ? 0 : c.base;
          c.speed += (target - c.speed) * Math.min(1, dt * (stop ? 8 : 1.5));
          if (stop && Math.abs(p.x - ax) < 20 && Math.abs(p.y - ay) < 16) { c.honk -= dt; if (c.honk <= 0) { c.honk = 4; if (NF.Audio && !this.paused) NF.Audio.sfx('horn'); } }
          c.d = (c.d + c.speed * dt) % this.loop.total;
          c.wheel += c.speed * dt * 0.25;
        }
        // train
        this.trainTimer -= dt;
        if (!this.train && this.trainTimer <= 0) {
          const ltr = Math.random() < 0.5;
          this.train = { x: ltr ? -300 : m.w + 40, dir: ltr ? 1 : -1, speed: 110 };
          if (NF.Audio) NF.Audio.sfx('whistle');
        }
        if (this.train) {
          const tr = this.train;
          tr.x += tr.dir * tr.speed * dt;
          if (Math.random() < dt * 14) this.particles.push({ x: tr.x + (tr.dir > 0 ? 230 + 58 : 58), y: m.railY - 30, vx: -tr.dir * 10, vy: -14, life: 2.2, max: 2.2, r: 2, kind: 'smoke' });
          if ((tr.dir > 0 && tr.x > m.w + 40) || (tr.dir < 0 && tr.x < -320)) { this.train = null; this.trainTimer = 50 + Math.random() * 40; }
        }
      }
      // particles
      for (const pt of this.particles) { pt.x += pt.vx * dt; pt.y += pt.vy * dt; pt.life -= dt; pt.r += dt * 3; }
      this.particles = this.particles.filter((pt) => pt.life > 0);
      // camera follow
      const v = this.view, p = this.player;
      const tx = m.w <= v.w ? (m.w - v.w) / 2 : Math.max(0, Math.min(m.w - v.w, p.x - v.w / 2));
      const ty = m.h <= v.h ? (m.h - v.h) / 2 : Math.max(0, Math.min(m.h - v.h, p.y - v.h / 2 - 10));
      const k = Math.min(1, dt * 8);
      this.cam.x += (tx - this.cam.x) * k; this.cam.y += (ty - this.cam.y) * k;
    },

    /* ---------- rendering ---------- */
    render() {
      const ctx = this.ctx, v = this.view, m = this.map;
      if (!m) return;
      const cx = Math.round(this.cam.x), cy = Math.round(this.cam.y);
      ctx.fillStyle = m.id === 'town' ? '#2a3a22' : '#140c10';
      ctx.fillRect(0, 0, v.w, v.h);
      ctx.drawImage(m.bg, -cx, -cy);

      const list = [];
      const inView = (x, y, w, h) => x + w > cx - 8 && x < cx + v.w + 8 && y + h > cy - 8 && y < cy + v.h + 8;
      for (const s of m.statics) if (inView(s.x, s.y, s.img.width, s.img.height)) list.push({ sy: s.sy, img: s.img, x: s.x, y: s.y });
      for (const a of m.anims) { const fr = a.frames[Math.floor(this.t * a.fps) % a.frames.length]; if (inView(a.x, a.y, fr.width, fr.height)) list.push({ sy: a.sy, img: fr, x: a.x, y: a.y }); }
      for (const n of this.npcs) list.push({ sy: n.y, char: n });
      list.push({ sy: this.player.y, char: this.player, isPlayer: true });
      if (m.id === 'town') {
        for (const c of this.cars) {
          const p = this.carPos(c.d);
          const wf = Math.floor(c.wheel) % 2;
          let img = p.dx > 0 ? c.spr.side[wf] : p.dx < 0 ? c.spr.sideL[wf] : p.dy > 0 ? c.spr.down : c.spr.up;
          const ax = Math.round(img.width / 2), ay = p.dx ? 22 : 28;
          list.push({ sy: p.y, img, x: Math.round(p.x - ax), y: Math.round(p.y - ay), shadow: [p.x, p.y, p.dx ? 15 : 9] });
        }
        if (this.train) {
          const tr = this.train;
          if (!this.trainImgs) { this.trainImgs = { loco: A.locomotive(), cars: [A.railcar('#2c4a3a'), A.railcar('#5a2a2a'), A.railcar('#2c3a5a')] }; this.trainImgs.locoL = A.flipH(this.trainImgs.loco); this.trainImgs.carsL = this.trainImgs.cars.map(A.flipH); }
          const ti = this.trainImgs, y = m.railY - 36;
          if (tr.dir > 0) { ti.cars.forEach((c, i) => list.push({ sy: m.railY, img: c, x: Math.round(tr.x + i * 68), y: y + 2 })); list.push({ sy: m.railY, img: ti.loco, x: Math.round(tr.x + 3 * 68), y }); }
          else { list.push({ sy: m.railY, img: ti.locoL, x: Math.round(tr.x), y }); ti.carsL.forEach((c, i) => list.push({ sy: m.railY, img: c, x: Math.round(tr.x + 74 + i * 68), y: y + 2 })); }
        }
      }
      list.sort((a, b) => a.sy - b.sy);
      for (const d of list) {
        if (d.char) this.drawChar(ctx, d.char, cx, cy, d.isPlayer);
        else {
          if (d.shadow) { ctx.fillStyle = 'rgba(20,10,10,0.28)'; ctx.beginPath(); ctx.ellipse(Math.round(d.shadow[0] - cx), Math.round(d.shadow[1] - cy), d.shadow[2], 3, 0, 0, Math.PI * 2); ctx.fill(); }
          ctx.drawImage(d.img, d.x - cx, d.y - cy);
        }
      }
      // overlays (animated money-flow map in Room 5)
      for (const o of m.overlays) if (o.kind === 'flow') this.drawFlow(ctx, o, cx, cy);
      // particles
      for (const pt of this.particles) {
        const a = Math.max(0, pt.life / pt.max) * 0.5;
        ctx.fillStyle = `rgba(210,205,200,${a})`;
        ctx.beginPath(); ctx.arc(pt.x - cx, pt.y - cy, pt.r, 0, Math.PI * 2); ctx.fill();
      }
      this.drawLighting(ctx, cx, cy);
      // fireflies / dust in town
      if (m.id === 'town' && !Save.data.settings.reduceMotion) {
        for (const f of this.fireflies) {
          const x = f.x + Math.sin(this.t * f.s + f.p) * 8 - cx, y = f.y + Math.cos(this.t * f.s * 0.7 + f.p) * 6 - cy;
          if (x < 0 || y < 0 || x > v.w || y > v.h) continue;
          const a = (Math.sin(this.t * 2 * f.s + f.p) + 1) / 2;
          ctx.fillStyle = `rgba(255,236,150,${0.25 + a * 0.6})`; ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
          if (a > 0.8) { ctx.fillStyle = 'rgba(255,230,140,0.25)'; ctx.fillRect(Math.round(x) - 1, Math.round(y), 3, 1); ctx.fillRect(Math.round(x), Math.round(y) - 1, 1, 3); }
        }
      }
      this.drawDoorLabels(ctx, cx, cy);
      this.drawIndicators(ctx, cx, cy);
      this.drawGuideArrow(ctx, cx, cy);
      // vignette
      if (!this.vig || this.vig.width !== v.w || this.vig.height !== v.h) {
        this.vig = A.canvas(v.w, v.h);
        const gr = this.vig.g.createRadialGradient(v.w / 2, v.h / 2, Math.min(v.w, v.h) * 0.45, v.w / 2, v.h / 2, Math.max(v.w, v.h) * 0.75);
        gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(20,8,16,0.45)');
        this.vig.g.fillStyle = gr; this.vig.g.fillRect(0, 0, v.w, v.h);
      }
      ctx.drawImage(this.vig, 0, 0);
    },
    // Name plates over every exhibit door, with a check mark once visited
    drawDoorLabels(ctx, cx, cy) {
      const m = this.map;
      if (!m.labels || !m.labels.length) return;
      this.labelCache = this.labelCache || {};
      for (const lb of m.labels) {
        const r = NF.CONTENT.ROOMS[lb.room];
        const seen = !!Save.data.visited[lb.room];
        const key = lb.room + (seen ? '1' : '0');
        if (!this.labelCache[key]) {
          const top = r.num <= 6 ? 'EXHIBIT ' + r.num : r.building.toUpperCase();
          const bottom = (r.num <= 6 ? r.short : lb.room === 'court' ? 'FINAL VERDICT' : 'SOURCES & CREDITS').toUpperCase().replace(/[’']/g, "'");
          const t1 = seen ? top + ' ✓' : top;
          const w = Math.max(A.textWidth(t1), A.textWidth(bottom)) + 10;
          const c = A.canvas(w, 18);
          A.R(c.g, 0, 0, w, 18, '#2a1a12'); A.R(c.g, 1, 1, w - 2, 16, seen ? '#2c4a3e' : '#3a2a40'); A.R(c.g, 1, 1, w - 2, 1, '#e2b85a');
          A.textC(c.g, t1, w / 2, 3, seen ? '#bfe8a8' : '#f3d58a', 1);
          A.textC(c.g, bottom, w / 2, 10, '#f4ead2', 1);
          this.labelCache[key] = c;
        }
        const c = this.labelCache[key];
        const x = Math.round(lb.x - c.width / 2 - cx), y = Math.round(lb.y - c.height - cy);
        if (x > -c.width && y > -20 && x < this.view.w && y < this.view.h) ctx.drawImage(c, x, y);
      }
    },
    drawChar(ctx, ch, cx, cy, isPlayer) {
      const sheet = isPlayer ? this.playerSheet : ch.sheet;
      const x = Math.round(ch.x - 9 - cx), y = Math.round(ch.y - 25 - cy);
      ctx.fillStyle = 'rgba(20,10,10,0.3)';
      ctx.fillRect(x + 4, y + 24, 10, 2); ctx.fillRect(x + 5, y + 23, 8, 4);
      ctx.drawImage(sheet, ch.frame * A.FW, ch.dir * A.FH, A.FW, A.FH, x, y, A.FW, A.FH);
    },
    drawFlow(ctx, o, cx, cy) {
      const P = o.pts || { us: [0.2, 0.36], de: [0.9, 0.38], al: [0.71, 0.5] };
      const pts = {}; Object.keys(P).forEach((k) => { pts[k] = [o.x + o.w * P[k][0], o.y + o.h * P[k][1]]; });
      const paths = [['us', 'de', '#f2c14a'], ['de', 'al', '#e86a5a'], ['al', 'us', '#4a7ab0']];
      paths.forEach(([a, b, col], i) => {
        const [x1, y1] = pts[a], [x2, y2] = pts[b];
        const mx = (x1 + x2) / 2, my = i === 2 ? Math.max(y1, y2) + 8 : Math.min(y1, y2) - 8;
        for (let k = 0; k < 4; k++) {
          const t = ((this.t * 0.35 + k / 4 + i * 0.13) % 1);
          const x = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * mx + t * t * x2;
          const y = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * my + t * t * y2;
          ctx.fillStyle = col; ctx.fillRect(Math.round(x - cx), Math.round(y - cy), 2, 2);
        }
      });
      Object.values(pts).forEach(([x, y]) => { ctx.fillStyle = '#c8302e'; ctx.fillRect(Math.round(x - cx) - 1, Math.round(y - cy) - 1, 3, 3); });
    },
    drawLighting(ctx, cx, cy) {
      const m = this.map, v = this.view;
      const dark = (Save.data.settings.lights === false ? 0 : 1) * m.dark;
      const L = this.light, lg = L.getContext('2d');
      if (dark > 0) {
        lg.globalCompositeOperation = 'source-over';
        lg.clearRect(0, 0, v.w, v.h);
        lg.fillStyle = m.id === 'town' ? `rgba(46,26,70,${dark})` : `rgba(24,12,30,${dark})`;
        lg.fillRect(0, 0, v.w, v.h);
        lg.globalCompositeOperation = 'destination-out';
        for (const l of m.lights) {
          const x = l.x - cx, y = l.y - cy;
          if (x < -80 || y < -80 || x > v.w + 80 || y > v.h + 80) continue;
          const fl = l.flicker && !Save.data.settings.reduceMotion ? 1 + Math.sin(this.t * 9 + l.x) * 0.03 + Math.sin(this.t * 23 + l.y) * 0.02 : 1;
          const r = l.r * fl;
          const gr = lg.createRadialGradient(x, y, 0, x, y, r);
          gr.addColorStop(0, 'rgba(0,0,0,0.95)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
          lg.fillStyle = gr; lg.fillRect(x - r, y - r, r * 2, r * 2);
        }
        ctx.drawImage(L, 0, 0);
      }
      // warm glows
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (const l of m.lights) {
        const x = l.x - cx, y = l.y - cy;
        if (x < -80 || y < -80 || x > v.w + 80 || y > v.h + 80) continue;
        const r = l.r * (l.c === 'window' ? 0.7 : 0.55);
        const col = l.c === 'cool' ? '120,150,220' : l.c === 'window' ? '255,170,80' : '255,190,110';
        const gr = ctx.createRadialGradient(x, y, 0, x, y, r);
        gr.addColorStop(0, `rgba(${col},${l.c === 'window' ? 0.16 : 0.22})`); gr.addColorStop(1, `rgba(${col},0)`);
        ctx.fillStyle = gr; ctx.fillRect(x - r, y - r, r * 2, r * 2);
      }
      ctx.restore();
      if (m.tint) { ctx.fillStyle = m.tint; ctx.fillRect(0, 0, v.w, v.h); }
    },
    drawIndicators(ctx, cx, cy) {
      const m = this.map, bob = Math.round(Math.sin(this.t * 4) * 1.5);
      for (const it of m.inter) {
        const x = Math.round(it.x - cx), y = Math.round(it.y - cy);
        if (x < -20 || y < -40 || x > this.view.w + 20 || y > this.view.h + 20) continue;
        if (it.kind === 'artifact' && !Save.data.examined[it.id]) {
          const sp = this.sparkles[Math.floor(this.t * 6 + it.x) % 6];
          ctx.drawImage(sp, x - 4, y - 44 + bob);
        } else if (it.kind === 'artifact') {
          ctx.globalAlpha = 0.75; ctx.drawImage(this.seenIcon, x - 3, y - 40); ctx.globalAlpha = 1;
        } else if (it.kind === 'game') {
          const done = Save.data.games[it.id];
          ctx.globalAlpha = done ? 0.55 : 1;
          ctx.drawImage(this.starIcon, x - 5, y - 52 + bob);
          ctx.globalAlpha = 1;
        } else if (it.kind === 'verdict' || it.kind === 'biblio' || it.kind === 'credits' || it.kind === 'replay' || it.kind === 'eqboard' || it.kind === 'scripts') {
          const sp = this.sparkles[Math.floor(this.t * 6 + it.x) % 6];
          ctx.drawImage(sp, x - 4, y - 40 + bob);
        }
      }
      for (const n of this.npcs) {
        const near = this.near && this.near.kind === 'npc' && this.near.npc === n;
        ctx.globalAlpha = near ? 1 : 0.7;
        ctx.drawImage(this.bubble, Math.round(n.x - cx) - 5, Math.round(n.y - cy) - 40 + (near ? bob : 0));
        ctx.globalAlpha = 1;
      }
      // highlight current interactable
      const nr = this.near;
      if (nr && nr.kind !== 'npc' && !this.paused) {
        const x = Math.round(nr.x - cx), y = Math.round(nr.y - cy);
        ctx.strokeStyle = `rgba(255,226,140,${0.5 + Math.sin(this.t * 6) * 0.3})`;
        ctx.beginPath(); ctx.ellipse(x + 0.5, y + 0.5, 10, 4, 0, 0, Math.PI * 2); ctx.stroke();
      }
    },
    drawGuideArrow(ctx, cx, cy) {
      if (this.map.id !== 'town' || Save.data.settings.guide === false) { NF.UI && NF.UI.setGuide(null); return; }
      const tgt = this.nextTarget();
      if (!tgt || !NF.UI.C) { NF.UI.C && NF.UI.setGuide(null); return; }
      const d = this.map.markers[tgt];
      const v = this.view;
      const sx = d.x - cx, sy = d.y - cy;
      const onScreen = sx > 10 && sx < v.w - 10 && sy > 10 && sy < v.h - 10;
      const bob = Math.round(Math.sin(this.t * 5) * 2);
      if (onScreen) {
        const lb = (this.map.labels || []).find((l) => l.room === tgt);
        const ay = lb ? lb.y - 18 - cy - 10 : sy - 48;
        ctx.save(); ctx.translate(Math.round(sx), Math.round(ay) + bob); ctx.rotate(Math.PI); ctx.drawImage(this.arrowIcon, -6, -6); ctx.restore();
      } else {
        const px = this.player.x - cx, py = this.player.y - cy;
        const ang = Math.atan2(sy - py, sx - px);
        const rx = Math.max(16, Math.min(v.w - 16, v.w / 2 + Math.cos(ang) * (v.w / 2 - 22)));
        const ry = Math.max(28, Math.min(v.h - 16, v.h / 2 + Math.sin(ang) * (v.h / 2 - 22)));
        ctx.save(); ctx.translate(Math.round(rx), Math.round(ry)); ctx.rotate(ang + Math.PI / 2); ctx.drawImage(this.arrowIcon, -6, -6); ctx.restore();
      }
      NF.UI.setGuide(tgt);
    },
  });
})();
