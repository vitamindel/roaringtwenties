/* =====================================================================
   THE NORMALCY FILES: world.js
   Builds the town square and every interior room: ground art, buildings,
   props, collision boxes, interactables, lights and NPC placements.
   ===================================================================== */
(function () {
  'use strict';
  const NF = (window.NF = window.NF || {});
  const A = NF.Art, F = A.furn, R = A.R, P = A.P, shade = A.shade;
  const C = () => NF.CONTENT;

  /* ---------- character looks ---------- */
  const LOOKS = {
    player: { skin: '#f0c8a0', hair: '#5a3a24', hat: 'cap', hatColor: '#9a7448', style: 'vest', top: '#7a2e34', shirt: '#f0e8d4', tie: '#2c3d38', sleeve: '#f0e8d4', bottom: '#3a3a4a', shoes: '#2a1e1a', bag: '#6a4a2a' },
    guide: { skin: '#c89a78', hair: '#2a1a14', hat: 'cloche', hatColor: '#2f6a6a', band: '#e2b85a', style: 'dress', top: '#2c4a6a', trim: '#e2b85a', sash: '#e2b85a', pearls: true, shoes: '#3a2a20' },
    veteran: { skin: '#e8b890', hair: '#6a4a2a', hat: 'garrison', hatColor: '#6a6a3a', style: 'uniform', top: '#6e6a3e', bottom: '#5e5a34', belt: '#4a3a22', shoes: '#3a2a1a' },
    newsboy: { skin: '#f0c8a0', hair: '#a8642a', hat: 'cap', hatColor: '#6a6a6a', style: 'vest', top: '#4a4a52', shirt: '#e8e0cc', sleeve: '#e8e0cc', bottom: '#5a4a3a', bag: '#d8ceb0' },
    businessman: { skin: '#e8c0a0', hair: '#3a2a24', hat: 'fedora', hatColor: '#4a4a52', style: 'suit', top: '#3e4452', bottom: '#3e4452', tie: '#8a2a2a', mustache: true },
    farmer: { skin: '#d8a47a', hair: '#7a5a3a', hat: 'straw', hatColor: '#e0c27a', band: '#7a2b2b', style: 'overalls', top: '#a8443a', bottom: '#3e5a7a', sleeve: '#a8443a' },
    flapper: { skin: '#f2d0b0', hair: '#1a1a1a', hat: 'cloche', hatColor: '#b8443a', flower: '#f2e6c0', style: 'dress', top: '#d8a83a', trim: '#7a2b2b', sash: '#7a2b2b', pearls: true, stockings: '#e8c8a8' },
    police: { skin: '#e0b08a', hair: '#3a2a1a', hat: 'police', hatColor: '#2a3450', style: 'uniform', top: '#2a3450', bottom: '#2a3450', badge: true, belt: '#1a1a1a' },
    immigrant: { skin: '#d8a882', hair: '#3a2418', hat: 'bun', style: 'dress', top: '#6a3a4a', trim: '#3a2030', sash: '#3a2030' },
    stationmaster: { skin: '#8d5a3c', hair: '#1a1210', hat: 'police', hatColor: '#2a2a3a', band: '#e2b85a', style: 'uniform', top: '#2a2a3a', bottom: '#2a2a3a', badge: true },
    usher: { skin: '#6a4430', hair: '#1a1210', hat: 'none', style: 'suit', top: '#1e1e26', bottom: '#1e1e26', tie: '#e8e0cc', shirt: '#f4f0e4' },
    editor: { skin: '#e8c0a0', hair: '#8a8a8a', hat: 'none', style: 'vest', top: '#5a4a3a', shirt: '#e8e0cc', sleeve: '#e8e0cc', tie: '#7a2630', glasses: true, bottom: '#3a3a3a', mustache: true },
    diplomat: { skin: '#f0d0b0', hair: '#c8c0b0', hat: 'top', hatColor: '#1a1a1a', style: 'suit', top: '#1e1e26', bottom: '#3a3a44', tie: '#8a7a5a' },
    librarian: { skin: '#5a3a28', hair: '#1a1210', hat: 'bun', style: 'dress', top: '#3a5a4a', trim: '#e8e0cc', sash: '#e8e0cc', glasses: true },
    clerk: { skin: '#e0b896', hair: '#5a4a3a', hat: 'none', style: 'suit', top: '#2a2a2a', bottom: '#2a2a2a', glasses: true },
    archivist: { skin: '#f0c8a8', hair: '#8a5a2a', hat: 'bun', style: 'dress', top: '#6a4a6a', trim: '#e2b85a', sash: '#e2b85a', glasses: true },
    worker: { skin: '#e8c0a0', hair: '#4a3020', hat: 'cloche', hatColor: '#5a6a5a', style: 'dress', top: '#7a6a5a', trim: '#4a3a2a', sash: '#4a3a2a' },
    migrant: { skin: '#5a3a26', hair: '#1a1210', hat: 'cap', hatColor: '#5a5a62', style: 'vest', top: '#4a5a6a', shirt: '#d8d0c0', sleeve: '#d8d0c0', bottom: '#3a3a40' },
  };
  NF.LOOKS = LOOKS;

  /* ---------- characters with conversations (see PEOPLE in content.js) ---------- */
  function person(m, key, x, y, fixed) {
    const p = C().PEOPLE[key];
    if (!p) return;
    m.npcs.push({ id: key, name: p.name, label: p.label, look: p.look, talk: key, x, y, home: [x, y], fixed: !!fixed, dir: 0 });
  }

  /* ---------- map container ---------- */
  function newMap(id, w, h) {
    return { id, w, h, labels: [], mapPins: {}, bg: A.canvas(w, h), statics: [], anims: [], solids: [], inter: [], lights: [], npcs: [], doors: [], exits: [], overlays: [], spawn: { x: w / 2, y: h / 2, dir: 0 }, dark: 0, tint: null };
  }
  function solid(m, x, y, w, h) { m.solids.push({ x: Math.round(x), y: Math.round(y), w: Math.round(w), h: Math.round(h) }); }
  // spr = {c, ax, ay}; placed so its anchor sits on (x, y). opts.solid=[w,h] creates a footprint centred on x ending at y
  function put(m, spr, x, y, opts) {
    opts = opts || {};
    const s = { img: spr.c, x: Math.round(x - spr.ax), y: Math.round(y - spr.ay), sy: opts.sy !== undefined ? opts.sy : y };
    m.statics.push(s);
    if (opts.solid) solid(m, x - opts.solid[0] / 2, y - opts.solid[1], opts.solid[0], opts.solid[1]);
    if (spr.lights) spr.lights.forEach(([lx, ly]) => m.lights.push({ x: s.x + lx, y: s.y + ly, r: opts.lightR || 46, c: 'warm', flicker: true }));
    return s;
  }
  function putFlat(m, canvas, x, y) { m.bg.g.drawImage(canvas, Math.round(x), Math.round(y)); }
  function inter(m, o) { m.inter.push(Object.assign({ r: 22 }, o)); }

  /* =====================================================================
     TOWN SQUARE
     ===================================================================== */
  function buildTown() {
    const W = 1248, H = 928;
    const m = newMap('town', W, H);
    m.title = 'Town Square';
    m.dark = 0.18;
    m.tint = 'rgba(255,170,90,0.10)';
    m.music = 'town'; m.ambience = 'town';
    const g = m.bg.g;
    const rnd = A.RNG(1920);
    const G = A.ground;

    G.grass(g, 0, 0, W, H, rnd);
    // rail corridor
    G.dirt(g, 0, 28, W, 30, rnd);
    G.rail(g, 0, 36, W);
    m.railY = 50;

    // sidewalks (drawn first, roads on top)
    const roads = { N: [96, 288, 1056, 48], S: [96, 640, 1056, 48], Wv: [320, 336, 48, 304], Ev: [880, 336, 48, 304] };
    G.sidewalk(g, 80, 272, 1088, 16, rnd); G.sidewalk(g, 80, 336, 1088, 16, rnd);
    G.sidewalk(g, 80, 624, 1088, 16, rnd); G.sidewalk(g, 80, 688, 1088, 16, rnd);
    G.sidewalk(g, 304, 336, 16, 304, rnd); G.sidewalk(g, 368, 336, 16, 304, rnd);
    G.sidewalk(g, 864, 336, 16, 304, rnd); G.sidewalk(g, 928, 336, 16, 304, rnd);
    G.brickRoad(g, ...roads.N, rnd); G.brickRoad(g, ...roads.S, rnd);
    G.brickRoad(g, ...roads.Wv, rnd, true); G.brickRoad(g, ...roads.Ev, rnd, true);
    // curbs
    [[96, 287, 1056, 1], [96, 336, 1056, 1], [96, 639, 1056, 1], [96, 688, 1056, 1]].forEach((r) => G.curb(g, ...r));
    // road centre dashes
    for (let x = 100; x < 1148; x += 24) { R(g, x, 311, 10, 1, 'rgba(240,220,170,0.55)'); R(g, x, 663, 10, 1, 'rgba(240,220,170,0.55)'); }
    // crosswalks
    const zebraH = (x, y) => { for (let i = 0; i < 6; i++) R(g, x + i * 6, y + 3, 4, 42, 'rgba(238,228,206,0.75)'); };
    const zebraV = (x, y) => { for (let i = 0; i < 6; i++) R(g, x + 3, y + i * 6, 42, 4, 'rgba(238,228,206,0.75)'); };
    zebraH(606, 288); zebraH(606, 640); zebraV(320, 470); zebraV(880, 470);
    zebraH(130, 288); zebraH(1080, 288); zebraH(130, 640); zebraH(1080, 640);

    // central plaza
    G.cobble(g, 432, 384, 384, 224, rnd, 624, 496);
    G.cobble(g, 608, 352, 32, 32, rnd); G.cobble(g, 608, 608, 32, 16, rnd);
    G.cobble(g, 384, 480, 48, 32, rnd); G.cobble(g, 816, 480, 48, 32, rnd);
    // plaza border stones
    g.strokeStyle = '#7d7262'; g.strokeRect(431.5, 383.5, 385, 225);

    // flower beds at plaza corners
    [[400, 360], [800, 360], [400, 584], [800, 584]].forEach(([x, y], i) => putFlat(m, A.flowerbed(40, 24, 50 + i), x - 4, y - 4));

    /* ---------- buildings ---------- */
    const B = {};
    const goldBand = '#e2b85a';
    const emblemEagle = (gg, cx, cy) => { A.disc(gg, cx, cy, 5, '#d8b05a'); A.disc(gg, cx, cy, 3, '#2b3f7a'); P(gg, cx, cy, '#f2e6c0'); };
    const emblemScales = (gg, cx, cy) => { R(gg, cx - 5, cy, 11, 1, '#8a6a3a'); R(gg, cx, cy - 4, 1, 8, '#8a6a3a'); R(gg, cx - 6, cy + 1, 3, 2, '#8a6a3a'); R(gg, cx + 4, cy + 1, 3, 2, '#8a6a3a'); };

    B.station = A.building({ w: 216, wallH: 80, roofH: 26, roof: 'flat', wall: 'stone', wallColor: '#cbb68c', trim: '#f2e8d0', roofColor: '#6a6458', parapet: '#bfa97e',
      floors: [{ y: 18, windows: [{ x: 14, w: 14, h: 24, arch: true }, { x: 38, w: 14, h: 24, arch: true }, { x: 164, w: 14, h: 24, arch: true }, { x: 188, w: 14, h: 24, arch: true }] },
        { y: 54, windows: [{ x: 14, w: 14, h: 14 }, { x: 38, w: 14, h: 14 }, { x: 164, w: 14, h: 14 }, { x: 188, w: 14, h: 14 }] }],
      door: { w: 24, h: 26 }, sign: { text: 'UNION STATION', y: 6, bg: '#2c3d38' },
      extras(gg, L) {
        // grand arched central window
        const cx = L.wx + L.ww / 2;
        A.windowAt(gg, cx - 22, L.wy + 28, 44, 20, { trim: '#f2e8d0', wallColor: '#cbb68c', curtain: '#8a2a2e' }, { arch: true, curtain: false });
        for (let i = 1; i < 4; i++) R(gg, cx - 22 + i * 11, L.wy + 26, 1, 22, '#f2e8d0');
        // clock in the parapet
        gg.drawImage(F.clock(), cx - 9, L.roofH - 20);
        R(gg, L.wx + 60, L.wy + 20, 4, L.wh - 26, '#e2d2a8'); R(gg, L.wx + L.ww - 64, L.wy + 20, 4, L.wh - 26, '#e2d2a8');
      } }, 11);
    B.white = A.building({ w: 232, wallH: 78, roofH: 22, roof: 'flat', wall: 'smooth', wallColor: '#f1ece0', trim: '#ffffff', cornice: '#ffffff', roofColor: '#8a9090', parapet: '#e6e0d0', pilasterColor: '#e4ddcc',
      floors: [{ y: 14, windows: [{ x: 12, w: 10, h: 16, keystone: true }, { x: 34, w: 10, h: 16, keystone: true }, { x: 56, w: 10, h: 16, keystone: true }, { x: 166, w: 10, h: 16, keystone: true }, { x: 188, w: 10, h: 16, keystone: true }, { x: 210, w: 10, h: 16, keystone: true }] },
        { y: 46, windows: [{ x: 12, w: 10, h: 18, keystone: true }, { x: 34, w: 10, h: 18, keystone: true }, { x: 56, w: 10, h: 18, keystone: true }, { x: 166, w: 10, h: 18, keystone: true }, { x: 188, w: 10, h: 18, keystone: true }, { x: 210, w: 10, h: 18, keystone: true }] }],
      columns: { n: 6, x0: 78, x1: 154, top: 14, pediment: true, emblem: emblemEagle, frieze: 'THE WHITE HOUSE' },
      door: { w: 18, h: 24 }, curtain: '#b8903a',
      extras(gg, L) { for (let x = L.wx + 4; x < L.wx + L.ww - 4; x += 6) { R(gg, x, L.roofH - 6, 3, 3, '#f6f2e8'); } } }, 21);
    B.ledger = A.building({ w: 168, wallH: 92, roofH: 24, roof: 'flat', wall: 'brick', wallColor: '#8e4232', trim: '#ead8b8', roofColor: '#5a4a44', parapet: '#7a3428',
      floors: [{ y: 10, windows: [{ x: 14, w: 12, h: 14 }, { x: 40, w: 12, h: 14 }, { x: 116, w: 12, h: 14 }, { x: 142, w: 12, h: 14 }] },
        { y: 34, band: true, windows: [{ x: 14, w: 12, h: 14, flowerbox: true }, { x: 40, w: 12, h: 14, flowerbox: true }, { x: 116, w: 12, h: 14, flowerbox: true }, { x: 142, w: 12, h: 14, flowerbox: true }] },
        { y: 72, windows: [{ x: 10, w: 40, h: 16, curtain: false }, { x: 118, w: 40, h: 16, curtain: false }] }],
      sign: { text: 'THE DAILY LEDGER', y: 54, bg: '#1e2a2a', fg: '#f2d27a' },
      awning: { x: 6, w: 156, y: 64, c1: '#2c5a4a', c2: '#e8dcc0' },
      door: { w: 20, h: 22 }, doorColor: '#2c3d38',
      extras(gg, L) { A.textC(gg, 'EST. 1887', L.wx + L.ww / 2, L.wy + 18, '#ead8b8', 1); } }, 31);
    B.treasury = A.building({ w: 200, wallH: 82, roofH: 22, roof: 'flat', wall: 'stone', wallColor: '#d6cdbb', trim: '#f4eee0', roofColor: '#7a7a72', parapet: '#cfc5b0',
      floors: [{ y: 30, windows: [{ x: 8, w: 10, h: 18 }, { x: 182, w: 10, h: 18 }] }, { y: 58, windows: [{ x: 8, w: 10, h: 14 }, { x: 182, w: 10, h: 14 }] }],
      columns: { n: 8, x0: 26, x1: 174, top: 22, pediment: true, emblem: emblemScales, frieze: 'TREASURY & PRESS HALL' },
      door: { w: 20, h: 26 } }, 41);
    B.nations = A.building({ w: 210, wallH: 80, roofH: 22, roof: 'flat', wall: 'stone', wallColor: '#e0d4bc', trim: '#f6f0e2', roofColor: '#7a8078', parapet: '#d4c8b0', extraTop: 40,
      floors: [{ y: 24, windows: [{ x: 12, w: 12, h: 22, arch: true }, { x: 36, w: 12, h: 22, arch: true }, { x: 162, w: 12, h: 22, arch: true }, { x: 186, w: 12, h: 22, arch: true }] },
        { y: 58, windows: [{ x: 12, w: 12, h: 12 }, { x: 36, w: 12, h: 12 }, { x: 162, w: 12, h: 12 }, { x: 186, w: 12, h: 12 }] }],
      columns: { n: 4, x0: 70, x1: 140, top: 22, frieze: 'HALL OF NATIONS' },
      door: { w: 20, h: 24 },
      extras(gg, L) {
        // copper-green dome
        const cx = L.W / 2, by = 6;
        for (let y = 0; y < 34; y++) {
          const w = Math.round(Math.sqrt(1 - ((34 - y) / 34) ** 2) * 42);
          R(gg, cx - w, by - 34 + y, w * 2, 1, A.mix('#6fa08a', '#3e6a5a', y / 34));
          R(gg, cx - w, by - 34 + y, Math.max(1, Math.round(w * 0.35)), 1, '#8ac0a6');
        }
        for (let i = -3; i <= 3; i++) for (let y = 4; y < 34; y++) { const w = Math.sqrt(1 - ((34 - y) / 34) ** 2) * 42; P(gg, Math.round(cx + (i / 3.5) * w), by - 34 + y, '#3e6a5a'); }
        R(gg, cx - 46, by - 2, 92, 6, '#e6dcc6'); R(gg, cx - 46, by - 2, 92, 1, '#ffffff');
        R(gg, cx - 4, by - 44, 8, 10, '#e6dcc6'); R(gg, cx - 5, by - 46, 10, 2, '#6fa08a'); R(gg, cx, by - 52, 1, 6, '#d8b05a');
      } }, 51);
    B.community = A.building({ w: 204, wallH: 66, roofH: 40, roof: 'hip', wall: 'clap', wallColor: '#3d7266', trim: '#7a4a2c', roofColor: '#5e3c32', fascia: '#3a2218', gable: 44, gableFill: '#2f5c52', curtain: '#c8a45a',
      floors: [{ y: 14, windows: [{ x: 14, w: 14, h: 16 }, { x: 40, w: 14, h: 16 }, { x: 150, w: 14, h: 16 }, { x: 176, w: 14, h: 16 }] },
        { y: 44, windows: [{ x: 14, w: 14, h: 12, flowerbox: true }, { x: 40, w: 14, h: 12, flowerbox: true }, { x: 150, w: 14, h: 12, flowerbox: true }, { x: 176, w: 14, h: 12, flowerbox: true }] }],
      sign: { text: 'COMMUNITY HALL', y: 6, bg: '#6a4028', border: '#3a2218' },
      door: { w: 20, h: 24 }, doorColor: '#7a4a2c', pilasterColor: '#7a4a2c', chimney: { x: 40 } }, 61);
    B.court = A.building({ w: 200, wallH: 80, roofH: 30, roof: 'hip', wall: 'brick', wallColor: '#9a4a38', trim: '#f0e6d0', roofColor: '#4a5a5e', extraTop: 44,
      floors: [{ y: 14, windows: [{ x: 14, w: 12, h: 20, arch: true }, { x: 38, w: 12, h: 20, arch: true }, { x: 150, w: 12, h: 20, arch: true }, { x: 174, w: 12, h: 20, arch: true }] },
        { y: 50, windows: [{ x: 14, w: 12, h: 16 }, { x: 38, w: 12, h: 16 }, { x: 150, w: 12, h: 16 }, { x: 174, w: 12, h: 16 }] }],
      columns: { n: 4, x0: 66, x1: 134, top: 26, pediment: true, emblem: emblemScales, frieze: 'COURTHOUSE', color: '#f2ead8' },
      door: { w: 20, h: 24 },
      extras(gg, L) {
        // clock tower
        const cx = L.W / 2;
        R(gg, cx - 14, -40, 28, 44, '#9a4a38'); R(gg, cx - 14, -40, 4, 44, '#b8664c'); R(gg, cx + 10, -40, 4, 44, '#7a382d');
        R(gg, cx - 16, -42, 32, 4, '#f0e6d0'); for (let i = 0; i < 9; i++) R(gg, cx - 16 + i * 2, -50 + i, 32 - i * 4, 1, '#4a5a5e');
        R(gg, cx, -60, 1, 10, '#d8b05a');
        gg.drawImage(F.clock(), cx - 9, -34);
        R(gg, cx - 6, -12, 4, 10, '#ffd683'); R(gg, cx + 2, -12, 4, 10, '#ffd683');
      } }, 71);
    B.library = A.building({ w: 184, wallH: 78, roofH: 22, roof: 'flat', wall: 'brick', wallColor: '#8a4a3a', trim: '#f0e6d0', roofColor: '#5a5650', parapet: '#e8dcc4',
      floors: [{ y: 16, windows: [{ x: 12, w: 14, h: 22, arch: true }, { x: 36, w: 14, h: 22, arch: true }, { x: 134, w: 14, h: 22, arch: true }, { x: 158, w: 14, h: 22, arch: true }] },
        { y: 54, windows: [{ x: 12, w: 14, h: 14 }, { x: 36, w: 14, h: 14 }, { x: 134, w: 14, h: 14 }, { x: 158, w: 14, h: 14 }] }],
      columns: { n: 2, x0: 70, x1: 114, top: 22, pediment: true, frieze: 'LIBRARY', emblem: (gg, cx, cy) => { R(gg, cx - 4, cy - 1, 8, 4, '#8a6a3a'); R(gg, cx, cy - 1, 1, 4, '#f2e6c0'); } },
      door: { w: 18, h: 24 } }, 81);
    // decorative buildings
    B.bijou = A.building({ w: 128, wallH: 74, roofH: 18, roof: 'flat', wall: 'brick', wallColor: '#5e2c3a', trim: '#e8d0a0', roofColor: '#4a3a3a', parapet: '#4e2430', vents: false,
      floors: [{ y: 10, windows: [{ x: 10, w: 10, h: 14 }, { x: 108, w: 10, h: 14 }] }],
      door: { w: 24, h: 22 }, doorColor: '#7a2630',
      extras(gg, L) {
        const cx = L.W / 2;
        // marquee
        R(gg, cx - 46, L.wy + 30, 92, 18, '#2a1a22'); R(gg, cx - 44, L.wy + 32, 88, 14, '#f4e6c0');
        A.textC(gg, 'THE KID', cx, L.wy + 34, '#7a2630', 1); A.textC(gg, 'CHAPLIN 1921', cx, L.wy + 40, '#2a1a22', 1);
        // vertical sign
        R(gg, cx - 7, L.wy - 14, 14, 42, '#7a2630'); R(gg, cx - 5, L.wy - 12, 10, 38, '#3a1a22');
        'BIJOU'.split('').forEach((ch, i) => A.textC(gg, ch, cx, L.wy - 10 + i * 7, '#ffe08a', 1));
      } }, 91);
    B.bank = A.building({ w: 112, wallH: 70, roofH: 18, roof: 'flat', wall: 'stone', wallColor: '#cfc6b0', trim: '#f2ecdc', roofColor: '#7a7a72', parapet: '#c6bca4', vents: false,
      columns: { n: 4, x0: 18, x1: 94, top: 20, pediment: true, frieze: 'FIRST NATIONAL BANK' }, door: { w: 18, h: 24 } }, 92);
    B.diner = A.building({ w: 104, wallH: 50, roofH: 26, roof: 'hip', wall: 'smooth', wallColor: '#e8dcc0', trim: '#b8342c', roofColor: '#9a3a2e',
      floors: [{ y: 22, windows: [{ x: 8, w: 24, h: 14, curtain: false }, { x: 72, w: 24, h: 14, curtain: false }] }],
      awning: { x: 4, w: 96, y: 12, c1: '#b8342c', c2: '#f2ece0' }, sign: { text: 'SODA & DINER', y: 2, bg: '#2a2a3a', fg: '#ff9a9a' }, door: { w: 16, h: 22 }, doorColor: '#b8342c' }, 93);
    B.garage = A.building({ w: 120, wallH: 58, roofH: 18, roof: 'flat', wall: 'brick', wallColor: '#7a5a3a', trim: '#e8dcc0', roofColor: '#5a5050', parapet: '#6a4a30', vents: false,
      sign: { text: 'MOTOR GARAGE', y: 4, bg: '#2c3d38' }, door: { w: 16, h: 22, x: 34 },
      extras(gg, L) { R(gg, L.wx + 12, L.wy + 22, 54, 36, '#4a4a4a'); for (let y = L.wy + 24; y < L.wy + 58; y += 4) R(gg, L.wx + 13, y, 52, 1, '#6a6a6a'); R(gg, L.wx + 12, L.wy + 20, 54, 2, '#e8dcc0'); } }, 94);

    const doors = {};
    function place(key, L, x, baseY, opts) {
      opts = opts || {};
      const wallBottom = baseY - 6;
      const top = wallBottom - (L.extraTop + L.roofH + L.wh);
      m.statics.push({ img: L.canvas, x, y: top, sy: wallBottom });
      const solidTop = top + L.extraTop + Math.round(L.roofH * 0.55);
      solid(m, x + 3, solidTop, L.ww + 2, wallBottom - solidTop + 1);
      L.lights.forEach(([lx, ly, r]) => m.lights.push({ x: x + lx, y: top + L.extraTop + ly, r: Math.min(30, r), c: 'window' }));
      if (L.door) {
        const dx = x + L.door.x;
        doors[key] = { x: dx, y: wallBottom };
        if (opts.room) {
          m.labels.push({ room: opts.room, x: dx, y: wallBottom - (L.door.h || 24) - 9 });
          m.mapPins[opts.room] = { x: dx, y: top + L.extraTop + Math.round(L.roofH * 0.55) };
          m.doors.push({ x: dx - 13, y: wallBottom - 2, w: 26, h: 12, to: opts.room });
          inter(m, { kind: 'door', x: dx, y: wallBottom + 6, r: 20, to: opts.room });
        } else if (opts.sign) {
          inter(m, { kind: 'sign', x: dx, y: wallBottom + 6, r: 20, sign: opts.sign });
        }
        // forecourt walk to the sidewalk
        if (opts.walkTo) A.ground.sidewalk(g, dx - 16, wallBottom, 32, opts.walkTo - wallBottom, A.RNG(x));
      }
      if (opts.banner) {
        const bn = A.banner(opts.banner, C().ROOMS[opts.room].color);
        m.statics.push({ img: bn, x: x + L.door.x + (opts.bannerDx || 18), y: wallBottom - 46, sy: wallBottom + 1 });
      }
      return { x, top, wallBottom };
    }
    // north row (fronts face the north road)
    place('station', B.station, 36, 272, { room: 'r1', banner: 1, walkTo: 272 });
    place('diner', B.diner, 278, 272, { sign: 'diner', walkTo: 272 });
    place('white', B.white, 508, 240, { room: 'r2', banner: 2, walkTo: 272 });
    place('bank', B.bank, 790, 272, { sign: 'bank', walkTo: 272 });
    place('ledger', B.ledger, 1012, 272, { room: 'r3', banner: 3, walkTo: 272, bannerDx: -64 });
    // east side (fronts face down, with a walk to the south)
    place('treasury', B.treasury, 984, 486, { room: 'r4', banner: 4 });
    A.ground.sidewalk(g, 944, 480, 260, 16, rnd);
    place('garage', B.garage, 1032, 616, { sign: 'garage' });
    A.ground.sidewalk(g, 944, 610, 220, 14, rnd);
    // west side
    place('library', B.library, 44, 486, { room: 'library', walkTo: 496 });
    A.ground.sidewalk(g, 40, 480, 264, 16, rnd);
    place('bijou', B.bijou, 70, 616, { sign: 'bijou' });
    A.ground.sidewalk(g, 40, 610, 264, 14, rnd);
    // south row (below the south road)
    place('court', B.court, 40, 862, { room: 'court' });
    place('community', B.community, 518, 862, { room: 'r6', banner: 6 });
    place('nations', B.nations, 978, 862, { room: 'r5', banner: 5 });
    // forecourts for the south row: paths from road sidewalk down to each door
    ['court', 'community', 'nations'].forEach((k) => { const d = doors[k]; A.ground.sidewalk(g, d.x - 16, 704, 32, d.y - 704 + 8, A.RNG(d.x)); });
    // west/east building forecourts to their side roads
    A.ground.sidewalk(g, doors.library.x - 16, doors.library.y, 32, 8, rnd);
    A.ground.sidewalk(g, doors.treasury.x - 16, doors.treasury.y, 32, 8, rnd);
    // courthouse banner (star instead of number)
    m.statics.push({ img: A.banner('', '#3a2a2a'), x: doors.court.x + 18, y: doors.court.y - 46, sy: doors.court.y + 1 });
    m.statics.push({ img: A.banner('', '#2a3a4a'), x: doors.library.x + 16, y: doors.library.y - 46, sy: doors.library.y + 1 });
    m.doorsByRoom = { r1: doors.station, r2: doors.white, r3: doors.ledger, r4: doors.treasury, r5: doors.nations, r6: doors.community, court: doors.court, library: doors.library };

    // re-draw sidewalks under buildings? forecourts drawn after buildings are statics, ground order is fine.

    /* ---------- White House lawn ---------- */
    const lawnBot = 272;
    const fence = A.fenceH(96);
    put(m, fence, 512, lawnBot - 2, { sy: lawnBot - 2 }); put(m, fence, 648, lawnBot - 2, { sy: lawnBot - 2 });
    solid(m, 512, lawnBot - 8, 96, 6); solid(m, 648, lawnBot - 8, 96, 6);
    const ff = A.fountainFrames();
    m.anims.push({ frames: ff.frames, x: 560 - ff.ax, y: 262 - ff.ay, sy: 262, fps: 6 });
    solid(m, 534, 248, 52, 14);
    solid(m, 697, 258, 6, 4);
    m.anims.push({ frames: A.flagpole('us'), x: 700 - 4, y: 262 - 60, sy: 262, fps: 4 });

    /* ---------- plaza furniture ---------- */
    const mem = A.memorial();
    put(m, mem, 624, 500, { solid: [36, 14] });
    inter(m, { kind: 'artifact', id: 'town_memorial', x: 624, y: 508, r: 24 });
    const lamp = A.lamp();
    [[448, 400], [800, 400], [448, 592], [800, 592], [600, 368], [648, 368], [400, 300 + 52], [848, 352],
      [100, 288], [460, 288], [760, 288], [960, 288], [1180, 288], [140, 704], [460, 704], [760, 704], [1120, 704], [300, 470], [948, 470]].forEach(([x, y]) => put(m, lamp, x, y, { solid: [6, 4] }));
    const bench = A.bench();
    [[520, 420], [728, 420], [520, 580], [728, 580], [470, 496], [778, 496]].forEach(([x, y]) => put(m, bench, x, y, { solid: [30, 8] }));
    put(m, A.signpost(['STATION', 'LEDGER', 'LIBRARY', 'COURT']), 584, 560, { solid: [6, 4] });
    put(m, A.hubSign(), 690, 560, { solid: [70, 6] });
    inter(m, { kind: 'sign', sign: 'hub', x: 690, y: 568, r: 22 });
    inter(m, { kind: 'signpost', x: 584, y: 566, r: 18 });
    put(m, A.mailbox(), 392, 352 + 20, { solid: [10, 4] });
    put(m, A.hydrant(), 856, 618, { solid: [8, 4] });
    put(m, A.newsstand(), 960, 290 - 4, { solid: [26, 8] });
    put(m, A.gaspump(), 1150, 640 - 14, { solid: [10, 4] });
    put(m, A.gaspump(), 1166, 640 - 14, { solid: [10, 4] });
    // parked cars along the curbs
    const parked = [['#2a2a2e', 'sedan', 200, 334, 'side'], ['#7a2a2a', 'sedan', 1050, 334, 'sideL'], ['#2f4a3a', 'sedan', 190, 686, 'side'], ['#e0b84a', 'taxi', 1000, 686, 'sideL']];
    parked.forEach(([col, kind, x, y, view]) => { const car = A.car(col, kind); put(m, { c: car[view][0], ax: 19, ay: 22 }, x, y, { solid: [32, 8] }); });

    /* ---------- trees, hedges and edges ---------- */
    const trees = [];
    const tree = (x, y, kind, seed) => { const t = A.tree(seed, kind); put(m, t, x, y, { solid: kind === 'pine' ? [8, 6] : [10, 6] }); trees.push([x, y]); };
    let sd = 3;
    for (let y = 120; y < 900; y += 34) { tree(14 + ((y * 7) % 13), y, y % 3 ? 'oak' : 'pine', sd++); tree(1232 - ((y * 5) % 13), y + 12, y % 4 ? 'oak' : 'pine', sd++); }
    for (let x = 30; x < 1230; x += 40) { if (x > 230 && x < 260) continue; tree(x, 918 + (x % 3) * 2, x % 3 ? 'oak' : 'pine', sd++); }
    // between north buildings & behind
    [[262, 140], [392, 160], [488, 120], [760, 124], [900, 150], [972, 130], [1200, 100], [60, 96], [180, 92], [330, 96], [430, 92], [820, 92], [1100, 96]].forEach(([x, y]) => tree(x, y, 'oak', sd++));
    // inner plaza greenery
    [[408, 440], [840, 440], [408, 560], [840, 560]].forEach(([x, y]) => tree(x, y, 'oak', sd++));
    // west/east lawns
    [[260, 400], [254, 560], [992, 400], [1210, 420], [990, 560], [1200, 560], [272, 760], [420, 770], [470, 820], [770, 770], [830, 820], [920, 760], [300, 840], [880, 850]].forEach(([x, y]) => tree(x, y, x % 2 ? 'pine' : 'oak', sd++));
    // bushes
    const bushCols = ['#e86a5a', '#f2c45a', '#c97ad6', null];
    [[230, 266], [470, 266], [760, 266], [980, 266], [1190, 266], [40, 506], [228, 506], [960, 506], [1200, 506], [500, 882], [740, 882], [260, 882], [960, 882]].forEach(([x, y], i) => put(m, A.bush(i + 9, bushCols[i % 4]), x, y, { solid: [16, 6] }));
    // hedges lining the rail corridor + fence
    const rfence = A.fenceH(W);
    put(m, rfence, 0, 74, { sy: 74 }); m.statics[m.statics.length - 1].x = 0;
    solid(m, 0, 60, W, 14);

    /* ---------- edges ---------- */
    solid(m, -20, 0, 26, H); solid(m, W - 6, 0, 26, H); solid(m, 0, H - 14, W, 20);

    /* ---------- NPCs ---------- */
    const npcAt = { guide: [600, 588], vet: [168, 300], newsboy: [1000, 300], biz: [830, 300], farmer: [700, 548], flapper: [330, 620], cop: [624, 640 - 4], immigrant: [600, 712] };
    Object.entries(npcAt).forEach(([id, p]) => person(m, id, p[0], p[1], id === 'guide' || id === 'cop'));

    m.spawn = { x: 624, y: 600, dir: 3 };
    m.carLoop = [[344, 324], [904, 324], [904, 676], [344, 676]];
    m.markers = { r1: doors.station, r2: doors.white, r3: doors.ledger, r4: doors.treasury, r5: doors.nations, r6: doors.community, court: doors.court, library: doors.library };
    return m;
  }

  /* =====================================================================
     INTERIORS
     ===================================================================== */
  const RW = 416, RH = 256, WALL = 58;

  function floorPaint(g, kind, c1, c2, rnd) {
    const x0 = 8, y0 = WALL, w = RW - 16, h = RH - WALL - 8;
    if (kind === 'checker') {
      for (let y = y0; y < y0 + h; y += 16) for (let x = x0; x < x0 + w; x += 16) {
        const c = ((x - x0) / 16 + (y - y0) / 16) % 2 ? c1 : c2;
        R(g, x, y, 16, 16, c); R(g, x, y, 16, 1, shade(c, 0.12)); R(g, x, y, 1, 16, shade(c, 0.08));
        if (rnd() < 0.3) { g.strokeStyle = shade(c, -0.08); g.beginPath(); g.moveTo(x + 2, y + 3 + rnd() * 10); g.lineTo(x + 14, y + 3 + rnd() * 10); g.stroke(); }
      }
    } else if (kind === 'wood' || kind === 'darkwood') {
      for (let y = y0; y < y0 + h; y += 6) {
        let x = x0 - ((y / 6) % 4) * 12;
        while (x < x0 + w) {
          const len = 30 + ((rnd() * 30) | 0);
          const c = shade(c1, (rnd() - 0.5) * 0.12);
          R(g, Math.max(x0, x), y, Math.min(len, x0 + w - Math.max(x0, x)), 5, c);
          R(g, Math.max(x0, x), y, Math.min(len, x0 + w - Math.max(x0, x)), 1, shade(c, 0.1));
          R(g, Math.max(x0, x), y + 5, Math.min(len, x0 + w - Math.max(x0, x)), 1, c2);
          if (x > x0) R(g, x, y, 1, 5, c2);
          x += len;
        }
      }
    } else if (kind === 'parquet') {
      for (let y = y0; y < y0 + h; y += 8) for (let x = x0; x < x0 + w; x += 8) {
        const alt = ((x - x0) / 8 + (y - y0) / 8) % 2;
        const c = shade(c1, (rnd() - 0.5) * 0.1);
        R(g, x, y, 8, 8, c2);
        if (alt) { R(g, x, y, 8, 3, c); R(g, x, y + 4, 8, 3, shade(c, -0.06)); }
        else { R(g, x, y, 3, 8, c); R(g, x + 4, y, 3, 8, shade(c, -0.06)); }
      }
    } else { // carpet
      R(g, x0, y0, w, h, c1);
      for (let y = y0 + 4; y < y0 + h; y += 12) for (let x = x0 + 4 + ((y / 12) % 2) * 6; x < x0 + w; x += 12) { P(g, x, y, c2); P(g, x + 1, y + 1, c2); P(g, x - 1, y + 1, c2); P(g, x, y + 2, c2); }
    }
  }

  function wallPaint(g, s, rnd) {
    // crown + wallpaper
    R(g, 0, 0, RW, WALL, s.paper);
    if (s.pattern === 'stripe') for (let x = 8; x < RW - 8; x += 8) R(g, x, 6, 3, 34, s.paper2);
    else if (s.pattern === 'damask') for (let y = 10; y < 38; y += 10) for (let x = 12 + ((y / 10) % 2) * 8; x < RW - 8; x += 16) { P(g, x, y, s.paper2); P(g, x - 1, y + 1, s.paper2); P(g, x + 1, y + 1, s.paper2); P(g, x, y + 2, s.paper2); }
    else if (s.pattern === 'brick') { for (let y = 4; y < 42; y += 4) for (let x = ((y / 4) % 2) * 4; x < RW; x += 8) { R(g, x, y, 7, 3, shade(s.paper, (rnd() - 0.5) * 0.2)); } }
    else if (s.pattern === 'stone') { for (let y = 4; y < 42; y += 10) { R(g, 0, y, RW, 1, s.paper2); for (let x = ((y / 10) % 2) * 16; x < RW; x += 32) R(g, x, y, 1, 10, s.paper2); } }
    R(g, 0, 0, RW, 5, s.crown || '#4a2c1c'); R(g, 0, 4, RW, 1, shade(s.crown || '#4a2c1c', 0.3)); R(g, 0, 5, RW, 1, 'rgba(0,0,0,0.25)');
    // chair rail + wainscot
    R(g, 0, 40, RW, 2, s.rail || '#e8dcc0'); R(g, 0, 42, RW, 14, s.wainscot);
    for (let x = 12; x < RW - 12; x += 26) { R(g, x, 44, 20, 9, shade(s.wainscot, 0.08)); R(g, x, 52, 20, 1, shade(s.wainscot, -0.25)); R(g, x, 44, 1, 9, shade(s.wainscot, 0.2)); }
    R(g, 0, 55, RW, 3, shade(s.wainscot, -0.35));
    // side walls (seen from above) + bottom wall
    const top = s.walltop || '#3a2418';
    R(g, 0, 0, 8, RH, top); R(g, RW - 8, 0, 8, RH, top);
    R(g, 7, WALL, 1, RH - WALL, shade(top, 0.25)); R(g, RW - 8, WALL, 1, RH - WALL, shade(top, 0.25));
    R(g, 0, RH - 8, RW, 8, top); R(g, 0, RH - 8, RW, 1, shade(top, 0.25));
    // doorway + mat
    R(g, RW / 2 - 16, RH - 8, 32, 8, '#1a1010');
    R(g, RW / 2 - 18, RH - 22, 36, 14, '#7a2630'); R(g, RW / 2 - 16, RH - 20, 32, 10, '#9a3a3a');
    A.textC(g, 'EXIT', RW / 2, RH - 18, '#f2d27a', 1);
    // floor shadow under wall
    g.fillStyle = 'rgba(20,10,14,0.28)'; g.fillRect(8, WALL, RW - 16, 4);
  }

  function room(id, s) {
    const m = newMap(id, RW, RH);
    const rnd = A.RNG(id.charCodeAt(0) * 31 + id.length);
    floorPaint(m.bg.g, s.floor, s.f1, s.f2, rnd);
    wallPaint(m.bg.g, s, rnd);
    // walls solid
    solid(m, 0, 0, RW, WALL + 6); solid(m, 0, 0, 10, RH); solid(m, RW - 10, 0, 10, RH);
    solid(m, 0, RH - 9, RW / 2 - 16, 9); solid(m, RW / 2 + 16, RH - 9, RW / 2 - 16, 9);
    solid(m, RW / 2 - 16, RH + 4, 32, 10);
    m.exits.push({ x: RW / 2 - 16, y: RH - 10, w: 32, h: 12 });
    m.spawn = { x: RW / 2, y: RH - 30, dir: 3 };
    m.dark = s.dark || 0.12; m.tint = s.tint || null;
    m.music = s.music || 'interior'; m.ambience = s.ambience || 'room';
    m.title = C().ROOMS[id] ? C().ROOMS[id].title : id;
    return m;
  }
  function wallItem(m, c, x, y) { m.bg.g.drawImage(c, Math.round(x), Math.round(y)); }
  function art(m, id, x, y, r) { inter(m, { kind: 'artifact', id, x, y, r: r || 22 }); }
  function docent(m, roomId, x, y) { person(m, roomId + '_docent', x, y, true); }
  function chandelier(m, x, y) { put(m, F.chandelier(), x, y, { sy: 9999 }); m.lights.push({ x, y: y - 6, r: 70, c: 'warm', flicker: true }); }
  function photoFrame(img) { // returns an inner painter that draws a sepia thumbnail later (filled when image loads)
    return (g, x, y, w, h) => { R(g, x, y, w, h, '#c8b89a'); R(g, x + 2, y + 2, w - 4, h - 4, '#8a7a62'); A.disc(g, x + w / 2, y + h * 0.4, Math.min(w, h) * 0.18, '#d8c8a8'); R(g, x + w * 0.25, y + h * 0.62, w * 0.5, h * 0.3, '#5a4a3a'); };
  }

  /* ---------- Room 1: Union Station ---------- */
  function buildR1() {
    const m = room('r1', { floor: 'checker', f1: '#d8ccb2', f2: '#9a7a62', paper: '#cbb68c', paper2: '#b8a278', pattern: 'stone', wainscot: '#7a6a5a', crown: '#5a4a3a', walltop: '#3e3026', ambience: 'station', dark: 0.1 });
    // tall windows
    [[18, 6], [370, 6]].forEach(([x, y]) => wallItem(m, F.window(28, 34, false), x, y));
    wallItem(m, F.clock(), 199, 8);
    // banner
    const bn = A.canvas(120, 12); R(bn.g, 0, 0, 120, 12, '#7a2630'); R(bn.g, 0, 0, 120, 1, '#a83a3e'); A.textC(bn.g, 'WELCOME HOME, BOYS!', 60, 4, '#f2e6c0', 1); for (let x = 0; x < 120; x += 10) R(bn.g, x, 11, 5, 1, '#e2b85a');
    wallItem(m, bn, 148, 28);
    // timeline poster board (artifact)
    const tb = F.plaque(46, 30, '#2c3d38'); A.textC(tb.g, '1919-20', 23, 3, '#e2b85a', 1); wallItem(m, tb, 66, 8);
    art(m, 'r1_redscare', 89, 70);
    wallItem(m, F.departures(), 304, 8);
    put(m, F.ticketBooth(), 360, 104, { solid: [54, 30] });
    inter(m, { kind: 'game', id: 'r1', x: 360, y: 112, r: 24 });
    put(m, F.gramophone(), 48, 112, { solid: [18, 8] }); art(m, 'r1_recording', 48, 120);
    put(m, A.newsstand(), 128, 106, { solid: [26, 8] }); art(m, 'r1_herald', 128, 114);
    put(m, F.easel(photoFrame()), 72, 196, { solid: [22, 6] }); art(m, 'r1_parade', 72, 204);
    put(m, F.easel(photoFrame()), 344, 196, { solid: [22, 6] }); art(m, 'r1_strike', 344, 204);
    put(m, F.benchStation(84), 208, 150, { solid: [84, 10] });
    put(m, F.benchStation(84), 208, 196, { solid: [84, 10] });
    put(m, F.plant(3), 24, 84, { solid: [12, 6] }); put(m, F.plant(4), 392, 230, { solid: [12, 6] }); put(m, F.plant(5), 24, 230, { solid: [12, 6] });
    put(m, F.trunk('#6a3a2a'), 270, 118, { solid: [20, 8] }); put(m, F.trunk('#3a4a5a'), 286, 128, { solid: [20, 8] });
    put(m, F.stanchion(40), 168, 232, { solid: [40, 4] }); put(m, F.stanchion(40), 248, 232, { solid: [40, 4] });
    chandelier(m, 126, 46); chandelier(m, 284, 46);
    docent(m, 'r1', 236, 104);
    person(m, 'r1_union', 300, 162, true);
    return m;
  }

  /* ---------- Room 2: Harding's office ---------- */
  function buildR2() {
    const m = room('r2', { floor: 'wood', f1: '#8a5a3a', f2: '#5a3622', paper: '#efe2c4', paper2: '#e2d0a8', pattern: 'stripe', wainscot: '#f4ecd8', rail: '#c8b48a', crown: '#d8c8a0', walltop: '#4a3020', ambience: 'office' });
    putFlat(m, F.ovalRug(200, 110, '#22355e', '#2c4270'), 108, 98);
    [[20, 6], [92, 6], [298, 6], [370, 6]].forEach(([x, y]) => { const w = F.window(26, 34, false); wallItem(m, w, x, y); });
    // Harding portrait (artifact)
    wallItem(m, F.portrait(26, 32), 140, 6); art(m, 'r2_harding', 153, 70);
    // business & labor wall
    const wall = A.canvas(60, 34); R(wall.g, 0, 0, 60, 34, '#5a3a24'); R(wall.g, 2, 2, 56, 30, '#c8a878');
    [[4, 4, 16, 12], [22, 4, 16, 12], [40, 4, 16, 12], [4, 18, 24, 12], [32, 18, 24, 12]].forEach(([x, y, w, h], i) => { R(wall.g, x, y, w, h, i % 2 ? '#e8e0cc' : '#8a7a62'); R(wall.g, x + 2, y + 2, w - 4, 2, '#3a3a3a'); });
    wallItem(m, wall, 228, 6); art(m, 'r2_wall', 258, 70);
    // flags behind desk
    put(m, { c: A.flagpole('us')[1], ax: 4, ay: 60 }, 176, 92, { solid: [6, 4] });
    put(m, { c: A.flagpole('pres')[2], ax: 4, ay: 60 }, 240, 92, { solid: [6, 4] });
    // desk with three documents
    const d = F.desk(84, { green: true });
    [[16, 5], [38, 4], [60, 5]].forEach(([x, y], i) => { R(d.c.g, x, y, 10, 7, '#f4ecd8'); R(d.c.g, x + 1, y + 2, 8, 1, '#8a8478'); R(d.c.g, x + 1, y + 4, 6, 1, '#8a8478'); R(d.c.g, x + 7, y + 5, 2, 2, ['#c8302e', '#2b3f7a', '#3e6a3e'][i]); });
    R(d.c.g, 4, 2, 3, 5, '#2a2a2a'); // inkwell
    put(m, d, 208, 132, { solid: [84, 14] });
    put(m, F.chair('down', '#6a2a2e'), 208, 108, { sy: 104 });
    art(m, 'r2_budget', 186, 142, 16); art(m, 'r2_revenue', 208, 142, 16); art(m, 'r2_tariff', 230, 142, 16);
    // cabinet table for mini-game
    put(m, F.table(70, 22, '#6a4028', '#3e6a4a'), 92, 196, { solid: [70, 16] });
    [[66, 176], [92, 176], [118, 176]].forEach(([x, y]) => put(m, F.chair('down'), x, y, { sy: y - 6 }));
    inter(m, { kind: 'game', id: 'r2', x: 92, y: 206, r: 26 });
    put(m, F.bookshelf(34, 3), 30, 100, { solid: [34, 10] }); put(m, F.bookshelf(34, 4), 386, 100, { solid: [34, 10] });
    put(m, F.globe(), 340, 200, { solid: [12, 6] }); put(m, F.plant(7), 24, 236, { solid: [12, 6] }); put(m, F.plant(8), 392, 236, { solid: [12, 6] });
    put(m, F.chair('up', '#6a2a2e'), 190, 176, { solid: [12, 6] }); put(m, F.chair('up', '#6a2a2e'), 226, 176, { solid: [12, 6] });
    chandelier(m, 208, 50);
    m.lights.push({ x: 208, y: 130, r: 60, c: 'warm' });
    docent(m, 'r2', 320, 160);
    person(m, 'r2_worker', 128, 140, true);
    return m;
  }

  /* ---------- Room 3: The Daily Ledger newsroom ---------- */
  function buildR3() {
    const m = room('r3', { floor: 'darkwood', f1: '#5a3c2a', f2: '#3a2418', paper: '#6a3a2e', paper2: '#5a2e24', pattern: 'brick', wainscot: '#3e2a20', rail: '#8a6a4a', crown: '#2a1a14', walltop: '#22140e', ambience: 'newsroom', music: 'tense', dark: 0.5, tint: 'rgba(60,80,140,0.10)' });
    [[18, 6], [376, 6]].forEach(([x, y]) => wallItem(m, F.window(24, 32, true), x, y));
    const sign = A.canvas(90, 12); R(sign.g, 0, 0, 90, 12, '#1e2a2a'); A.textC(sign.g, 'THE DAILY LEDGER', 45, 4, '#f2d27a', 1); wallItem(m, sign, 163, 0);
    // evidence board
    wallItem(m, F.corkBoard(116, 36), 150, 13); art(m, 'r3_board', 208, 72, 28);
    m.lights.push({ x: 208, y: 40, r: 56, c: 'cool' });
    // reserves map
    const mp = A.canvas(58, 34); R(mp.g, 0, 0, 58, 34, '#5a3a24'); R(mp.g, 2, 2, 54, 30, '#e8dcbc');
    mp.g.fillStyle = '#c8b480'; mp.g.beginPath(); [[4, 8], [52, 6], [54, 22], [40, 30], [10, 28], [4, 18]].forEach(([x, y], i) => (i ? mp.g.lineTo(x, y) : mp.g.moveTo(x, y))); mp.g.closePath(); mp.g.fill();
    A.disc(mp.g, 22, 12, 2, '#c8302e'); A.disc(mp.g, 8, 18, 2, '#c8302e'); A.text(mp.g, 'WY', 25, 9, '#3a2a1a', 1); A.text(mp.g, 'CA', 10, 20, '#3a2a1a', 1);
    wallItem(m, mp, 58, 8); art(m, 'r3_map', 87, 70);
    // desks with typewriters + lamps
    [[100, 150], [208, 150], [316, 150], [100, 212]].forEach(([x, y], i) => {
      put(m, F.typewriterDesk(), x, y, { solid: [40, 12] });
      put(m, F.bankerLamp(), x + 14, y - 24, { sy: y + 1 });
      m.lights.push({ x: x + 14, y: y - 30, r: 44, c: 'warm', flicker: true });
      put(m, F.chair('up', '#4a3a2a'), x, y + 14, { sy: y + 14 });
    });
    art(m, 'r3_newspaper', 100, 160);
    put(m, F.cabinet(), 380, 90, { solid: [16, 8] }); put(m, F.cabinet(), 362, 90, { solid: [16, 8] }); art(m, 'r3_other', 371, 98);
    put(m, F.easel(photoFrame()), 300, 214, { solid: [22, 6] }); art(m, 'r3_fall', 300, 222);
    put(m, F.press(), 370, 220, { solid: [40, 12] });
    put(m, F.desk(52, {}), 208, 212, { solid: [52, 12] });
    const fold = A.canvas(12, 8); R(fold.g, 0, 0, 12, 8, '#d8a85a'); R(fold.g, 2, 2, 8, 1, '#7a5a2a');
    m.statics.push({ img: fold, x: 202, y: 188, sy: 213 });
    inter(m, { kind: 'game', id: 'r3', x: 208, y: 224, r: 26 });
    put(m, F.cabinet(), 30, 92, { solid: [16, 8] });
    docent(m, 'r3', 160, 196);
    person(m, 'r3_cub', 52, 176, true);
    wallItem(m, F.framedPrint(34, 34), 296, 8); art(m, 'r3_senate', 313, 70);
    return m;
  }

  /* ---------- Room 4: Coolidge press room ---------- */
  function buildR4() {
    const m = room('r4', { floor: 'parquet', f1: '#a8743e', f2: '#6a4424', paper: '#3e5a48', paper2: '#4e6e58', pattern: 'damask', wainscot: '#efe6d0', rail: '#d8b05a', crown: '#d8c8a0', walltop: '#2a3a2e', ambience: 'office' });
    putFlat(m, F.rug(48, 150, '#5a2a2e', '#6a3236'), 184, 90);
    [[20, 6], [370, 6]].forEach(([x, y]) => wallItem(m, F.window(26, 34, false), x, y));
    wallItem(m, F.portrait(26, 32), 140, 6); art(m, 'r4_portrait', 153, 70);
    const seal = A.canvas(20, 20); A.disc(seal.g, 10, 10, 9, '#d8b05a'); A.disc(seal.g, 10, 10, 7, '#2b3f7a'); A.disc(seal.g, 10, 10, 3, '#d8b05a'); wallItem(m, seal, 198, 12);
    put(m, F.radioMic(), 208, 104, { solid: [24, 10] });
    put(m, { c: A.flagpole('us')[0], ax: 4, ay: 60 }, 176, 92, { solid: [6, 4] });
    // press chairs
    for (const y of [158, 186]) for (const x of [116, 140, 164, 252, 276, 300]) put(m, F.chair('up', '#3e5a48'), x, y, { solid: [12, 6] });
    put(m, F.easel(photoFrame()), 44, 150, { solid: [22, 6] }); art(m, 'r4_star', 44, 158);
    put(m, F.easel(photoFrame()), 368, 130, { solid: [22, 6] }); art(m, 'r4_tax', 368, 138);
    put(m, F.wheat(), 56, 212, { solid: [24, 8] }); put(m, A.crate('FARM'), 80, 216, { solid: [14, 6] }); art(m, 'r4_farm', 64, 222);
    put(m, F.ticker(), 362, 212, { solid: [14, 6] }); art(m, 'r4_ticker', 362, 220);
    put(m, F.desk(56, { green: true }), 84, 104, { solid: [56, 12] }); put(m, F.bankerLamp(), 96, 82, { sy: 105 }); m.lights.push({ x: 96, y: 76, r: 40, c: 'warm' });
    inter(m, { kind: 'game', id: 'r4', x: 84, y: 114, r: 24 });
    put(m, F.plant(12), 24, 236, { solid: [12, 6] }); put(m, F.plant(13), 392, 236, { solid: [12, 6] });
    put(m, F.bookshelf(34, 9), 330, 100, { solid: [34, 10] });
    chandelier(m, 208, 50);
    docent(m, 'r4', 250, 106);
    person(m, 'r4_farmer', 36, 186, true);
    return m;
  }

  /* ---------- Room 5: Hall of Nations ---------- */
  function buildR5() {
    const m = room('r5', { floor: 'parquet', f1: '#b8844a', f2: '#7a5430', paper: '#2c3a5a', paper2: '#3a4a6e', pattern: 'damask', wainscot: '#6a4a2e', rail: '#d8b05a', crown: '#d8b05a', walltop: '#1e2638', ambience: 'hall', music: 'grand' });
    const atl = F.atlanticMap(196, 50);
    wallItem(m, atl.c, 110, 4);
    m.overlays.push({ kind: 'flow', x: 113, y: 7, w: 190, h: 44, pts: atl.pts });
    art(m, 'r5_flow', 208, 72, 30);
    [[100, 30], [316, 30]].forEach(([x, y]) => m.lights.push({ x, y, r: 46, c: 'warm' }));
    ['uk', 'fr', 'de', 'be', 'it', 'jp'].forEach((k, i) => { const fp = A.flagpole(k)[i % 4]; const x = i < 3 ? 30 + i * 26 : 316 + (i - 3) * 26; put(m, { c: fp, ax: 4, ay: 60 }, x, 92, { solid: [6, 4] }); });
    put(m, F.table(150, 26, '#5a3420', '#2e5a44'), 208, 162, { solid: [150, 18] });
    for (const x of [148, 178, 208, 238, 268]) { put(m, F.chair('down', '#5a2a3a'), x, 140, { sy: 136 }); put(m, F.chair('up', '#5a2a3a'), x, 182, { solid: [12, 6] }); }
    [[150, 136], [190, 136], [230, 136], [270, 136]].forEach(([x, y], i) => { const f = A.canvas(8, 10); R(f.g, 0, 0, 1, 10, '#8a6a3a'); A.drawFlag(f.g, ['us', 'uk', 'fr', 'de'][i], 7, 5); m.statics.push({ img: f, x: x, y: y + 2, sy: 163 }); });
    put(m, F.vitrine(photoFrame(), 32), 56, 120, { solid: [30, 8] }); art(m, 'r5_dawes', 56, 128);
    put(m, F.lectern(), 362, 120, { solid: [16, 6] }); art(m, 'r5_kellogg', 362, 128);
    put(m, F.ships(), 64, 220, { solid: [44, 10] }); art(m, 'r5_naval', 64, 228);
    // the empty chair
    // the empty chair: a symbolic display set off to the left, clear of the exit path
    put(m, F.chair('down', '#8a1e2a'), 140, 214, { solid: [12, 6] });
    put(m, F.stanchion(30), 140, 230, { solid: [30, 4] });
    m.lights.push({ x: 140, y: 206, r: 34, c: 'cool' });
    art(m, 'r5_league', 162, 222, 20);
    put(m, F.table(44, 20, '#5a3420', '#e8dcbc'), 352, 214, { solid: [44, 14] });
    m.statics.push({ img: F.ledgerPapers(), x: 335, y: 197, sy: 215 });
    inter(m, { kind: 'game', id: 'r5', x: 352, y: 226, r: 24 });
    docent(m, 'r5', 290, 108);
    person(m, 'r5_banker', 112, 112, true);
    return m;
  }

  /* ---------- Room 6: Community Hall reading room ---------- */
  function buildR6() {
    const m = room('r6', { floor: 'wood', f1: '#9a6a40', f2: '#6a4228', paper: '#7a5a3e', paper2: '#6a4a30', pattern: 'stripe', wainscot: '#4a2e1c', rail: '#c8a45a', crown: '#3a2216', walltop: '#2a1a10', ambience: 'library', music: 'reflective' });
    putFlat(m, F.rug(300, 22, '#6a2a2a', '#7a3434'), 58, 180);
    // shelves along the back wall
    [12, 48, 330, 366].forEach((x, i) => { const bs = F.bookshelf(34, 20 + i); wallItem(m, bs.c, x, 12); });
    // portrait gallery for "unequal experiences"
    [[130, 8], [160, 8], [190, 8], [220, 8], [250, 8]].forEach(([x, y], i) => wallItem(m, F.portrait(24, 28), x, y));
    const pl = F.plaque(70, 8, '#2c3d38'); wallItem(m, pl, 173, 40);
    art(m, 'r6_unequal', 208, 72, 30);
    put(m, F.vitrine(photoFrame(), 32), 52, 110, { solid: [30, 8] }); put(m, F.trunk('#6a4a2a'), 80, 116, { solid: [20, 6] }); art(m, 'r6_immig', 60, 120);
    put(m, F.judgeBench(64), 356, 118, { solid: [62, 18] }); put(m, F.lectern(), 318, 130, { solid: [14, 6] }); art(m, 'r6_gitlow', 340, 134);
    put(m, F.vitrine(photoFrame(), 30), 52, 210, { solid: [28, 8] }); art(m, 'r6_aclu', 52, 218);
    [[150, 160], [266, 160]].forEach(([x, y]) => {
      put(m, F.table(64, 18, '#6a4028', '#7a4a2e'), x, y, { solid: [64, 12] });
      put(m, F.bankerLamp(), x - 14, y - 18, { sy: y + 1 }); m.lights.push({ x: x - 14, y: y - 24, r: 40, c: 'warm', flicker: true });
      put(m, F.chair('up'), x - 14, y + 14, { sy: y + 14 }); put(m, F.chair('up'), x + 14, y + 14, { sy: y + 14 });
    });
    // profile card table (mini-game)
    const t = F.table(56, 18, '#6a4028', '#e8dcbc'); [[6, 4], [18, 5], [30, 3], [42, 5]].forEach(([x, y]) => { R(t.c.g, x, y, 9, 11, '#f4ecd8'); R(t.c.g, x + 2, y + 2, 5, 4, '#8a7a62'); });
    put(m, t, 330, 214, { solid: [56, 12] });
    inter(m, { kind: 'game', id: 'r6', x: 330, y: 226, r: 24 });
    m.lights.push({ x: 208, y: 120, r: 80, c: 'warm' });
    docent(m, 'r6', 208, 214);
    person(m, 'r6_volunteer', 96, 168, true);
    return m;
  }

  /* ---------- Courthouse ---------- */
  function buildCourt() {
    const m = room('court', { floor: 'wood', f1: '#7a4a2c', f2: '#4a2a18', paper: '#e8dcc0', paper2: '#d8c8a0', pattern: 'stripe', wainscot: '#5a3420', rail: '#c8a45a', crown: '#4a2c1c', walltop: '#2a1a10', ambience: 'court', music: 'reflective' });
    m.title = 'The Courthouse: Judge Normalcy';
    [[20, 6], [370, 6]].forEach(([x, y]) => wallItem(m, F.window(26, 34, false), x, y));
    const seal = A.canvas(30, 30); A.disc(seal.g, 15, 15, 14, '#d8b05a'); A.disc(seal.g, 15, 15, 11, '#2b3f7a'); R(seal.g, 8, 14, 15, 1, '#d8b05a'); R(seal.g, 15, 8, 1, 14, '#d8b05a'); wallItem(m, seal, 193, 4);
    put(m, F.judgeBench(120), 208, 112, { solid: [120, 26] });
    inter(m, { kind: 'verdict', x: 208, y: 120, r: 30 });
    put(m, { c: A.flagpole('us')[2], ax: 4, ay: 60 }, 136, 96, { solid: [6, 4] });
    // jury box
    put(m, F.table(70, 14, '#5a3420', '#5a3420'), 60, 150, { solid: [70, 10] });
    for (const x of [36, 52, 68, 84]) put(m, F.chair('down', '#5a2a2e'), x, 136, { sy: 132 });
    // gallery benches
    put(m, F.benchStation(110), 120, 206, { solid: [110, 10] }); put(m, F.benchStation(110), 296, 206, { solid: [110, 10] });
    // reference shelf
    put(m, F.bookshelf(34, 30), 370, 104, { solid: [34, 10] });
    inter(m, { kind: 'biblio', x: 370, y: 112, r: 22 });
    put(m, F.table(40, 14, '#5a3420', '#3e6a4a'), 290, 150, { solid: [40, 10] });
    chandelier(m, 208, 50);
    docent(m, 'court', 290, 120);
    return m;
  }

  /* ---------- Library / Reference room ---------- */
  function buildLibrary() {
    const m = room('library', { floor: 'carpet', f1: '#5a2a2e', f2: '#7a3a3a', paper: '#5a3a2a', paper2: '#4a2e20', pattern: 'stripe', wainscot: '#3a2216', rail: '#c8a45a', crown: '#2a160c', walltop: '#22140c', ambience: 'library', music: 'reflective' });
    m.title = 'The Reference Library';
    [8, 44, 334, 370].forEach((x, i) => wallItem(m, F.bookshelf(36, 40 + i).c, x, 12));
    // EQ board
    const eq = F.plaque(56, 34, '#1e2a2a'); A.textC(eq.g, 'THE TWO BIG', 28, 4, '#e2b85a', 1); A.textC(eq.g, 'QUESTIONS', 28, 11, '#e2b85a', 1); wallItem(m, eq, 88, 6);
    inter(m, { kind: 'eqboard', x: 116, y: 70, r: 22 });
    // projection screen
    const scr = A.canvas(80, 36); R(scr.g, 0, 0, 80, 36, '#3a2a1c'); R(scr.g, 2, 2, 76, 32, '#f4f0e4'); R(scr.g, 2, 30, 76, 4, '#d8d0c0'); A.textC(scr.g, 'HELP DESK', 40, 14, '#7a6a5a', 1);
    wallItem(m, scr, 168, 6);
    put(m, F.projector(), 208, 168, { solid: [16, 8] });
    inter(m, { kind: 'replay', x: 208, y: 176, r: 22 });
    m.lights.push({ x: 208, y: 26, r: 50, c: 'cool' });
    // credits plaque
    const cr = F.plaque(50, 30, '#2c3d38'); A.textC(cr.g, 'CREDITS', 25, 4, '#e2b85a', 1); wallItem(m, cr, 270, 8);
    inter(m, { kind: 'credits', x: 295, y: 70, r: 22 });
    put(m, F.cardCatalog(), 70, 140, { solid: [32, 10] });
    inter(m, { kind: 'biblio', x: 70, y: 150, r: 24 });
    put(m, F.lectern(), 340, 150, { solid: [16, 6] });
    inter(m, { kind: 'scripts', x: 340, y: 158, r: 22 });
    [[120, 214], [296, 214]].forEach(([x, y]) => { put(m, F.table(56, 16, '#6a4028', '#3e6a4a'), x, y, { solid: [56, 10] }); put(m, F.bankerLamp(), x - 10, y - 16, { sy: y + 1 }); m.lights.push({ x: x - 10, y: y - 22, r: 40, c: 'warm', flicker: true }); });
    m.lights.push({ x: 208, y: 120, r: 80, c: 'warm' });
    docent(m, 'library', 150, 120);
    return m;
  }

  NF.World = {
    build() {
      const maps = { town: buildTown(), r1: buildR1(), r2: buildR2(), r3: buildR3(), r4: buildR4(), r5: buildR5(), r6: buildR6(), court: buildCourt(), library: buildLibrary() };
      return maps;
    },
    LOOKS,
  };
})();
