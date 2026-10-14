/* =====================================================================
   THE NORMALCY FILES: art.js
   Procedural pixel-art generator. Every sprite in the game is drawn
   here with code (no external sprite sheets), so the art can be tweaked
   without image-editing software. All art is a modern illustration.
   ===================================================================== */
(function () {
  'use strict';
  const NF = (window.NF = window.NF || {});
  const A = (NF.Art = {});

  /* ---------- canvas + colour helpers ---------- */
  function canvas(w, h) {
    const c = document.createElement('canvas');
    c.width = Math.max(1, w | 0);
    c.height = Math.max(1, h | 0);
    const g = c.getContext('2d', { willReadFrequently: true });
    g.imageSmoothingEnabled = false;
    c.g = g;
    return c;
  }
  A.canvas = canvas;

  function RNG(seed) {
    let s = (Math.imul(seed | 0, 2654435761) >>> 0) || 1;
    return function () {
      s ^= s << 13; s >>>= 0;
      s ^= s >>> 17;
      s ^= s << 5; s >>>= 0;
      return s / 4294967296;
    };
  }
  A.RNG = RNG;

  function hex2rgb(h) {
    h = h.replace('#', '');
    if (h.length === 3) h = h.split('').map((c) => c + c).join('');
    const n = parseInt(h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function rgb2hex(r, g, b) {
    return '#' + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
  }
  function mix(a, b, t) {
    const x = hex2rgb(a), y = hex2rgb(b);
    return rgb2hex(x[0] + (y[0] - x[0]) * t, x[1] + (y[1] - x[1]) * t, x[2] + (y[2] - x[2]) * t);
  }
  // warm-tinted shading: negative = darker (toward plum), positive = lighter (toward cream)
  function shade(c, amt) {
    return amt < 0 ? mix(c, '#1c1020', -amt) : mix(c, '#fff3d6', amt);
  }
  A.mix = mix; A.shade = shade; A.hex2rgb = hex2rgb;

  const OUT = '#2a1a1c'; // universal warm outline colour
  A.OUT = OUT;

  function R(g, x, y, w, h, c) { g.fillStyle = c; g.fillRect(x, y, w, h); }
  function P(g, x, y, c) { g.fillStyle = c; g.fillRect(x, y, 1, 1); }
  A.R = R; A.P = P;

  function ellipse(g, cx, cy, rx, ry, c) {
    g.fillStyle = c;
    for (let y = -ry; y <= ry; y++) {
      const w = Math.round(rx * Math.sqrt(Math.max(0, 1 - (y * y) / (ry * ry + 0.01))));
      g.fillRect(Math.round(cx - w), Math.round(cy + y), w * 2, 1);
    }
  }
  A.ellipse = ellipse;

  function disc(g, cx, cy, r, c) { ellipse(g, cx, cy, r, r, c); }
  A.disc = disc;

  // Adds a 1px outline around every opaque region of a canvas (in place)
  function outline(c, color, alphaMin) {
    color = color || OUT;
    alphaMin = alphaMin || 10;
    const g = c.getContext('2d');
    const w = c.width, h = c.height;
    const id = g.getImageData(0, 0, w, h);
    const d = id.data;
    const src = new Uint8ClampedArray(d);
    const [r, gg, b] = hex2rgb(color);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4;
        if (src[i + 3] > alphaMin) continue;
        let n = false;
        if (x > 0 && src[i - 4 + 3] > alphaMin) n = true;
        else if (x < w - 1 && src[i + 4 + 3] > alphaMin) n = true;
        else if (y > 0 && src[i - w * 4 + 3] > alphaMin) n = true;
        else if (y < h - 1 && src[i + w * 4 + 3] > alphaMin) n = true;
        if (n) { d[i] = r; d[i + 1] = gg; d[i + 2] = b; d[i + 3] = 255; }
      }
    }
    g.putImageData(id, 0, 0);
    return c;
  }
  A.outline = outline;

  function flipH(c) {
    const o = canvas(c.width, c.height);
    o.g.translate(c.width, 0);
    o.g.scale(-1, 1);
    o.g.drawImage(c, 0, 0);
    return o;
  }
  A.flipH = flipH;

  /* ---------- tiny bitmap font for in-world signs ---------- */
  const GL = {
    A: ['.#.', '#.#', '###', '#.#', '#.#'], B: ['##.', '#.#', '##.', '#.#', '##.'], C: ['.##', '#..', '#..', '#..', '.##'],
    D: ['##.', '#.#', '#.#', '#.#', '##.'], E: ['###', '#..', '##.', '#..', '###'], F: ['###', '#..', '##.', '#..', '#..'],
    G: ['.##', '#..', '#.#', '#.#', '.##'], H: ['#.#', '#.#', '###', '#.#', '#.#'], I: ['###', '.#.', '.#.', '.#.', '###'],
    J: ['..#', '..#', '..#', '#.#', '.#.'], K: ['#.#', '#.#', '##.', '#.#', '#.#'], L: ['#..', '#..', '#..', '#..', '###'],
    M: ['#...#', '##.##', '#.#.#', '#...#', '#...#'], N: ['#..#', '##.#', '#.##', '#..#', '#..#'], O: ['.#.', '#.#', '#.#', '#.#', '.#.'],
    P: ['##.', '#.#', '##.', '#..', '#..'], Q: ['.#.', '#.#', '#.#', '##.', '.##'], R: ['##.', '#.#', '##.', '#.#', '#.#'],
    S: ['.##', '#..', '.#.', '..#', '##.'], T: ['###', '.#.', '.#.', '.#.', '.#.'], U: ['#.#', '#.#', '#.#', '#.#', '###'],
    V: ['#.#', '#.#', '#.#', '#.#', '.#.'], W: ['#...#', '#...#', '#.#.#', '##.##', '#...#'], X: ['#.#', '#.#', '.#.', '#.#', '#.#'],
    Y: ['#.#', '#.#', '.#.', '.#.', '.#.'], Z: ['###', '..#', '.#.', '#..', '###'],
    0: ['###', '#.#', '#.#', '#.#', '###'], 1: ['.#.', '##.', '.#.', '.#.', '###'], 2: ['##.', '..#', '.#.', '#..', '###'],
    3: ['##.', '..#', '.#.', '..#', '##.'], 4: ['#.#', '#.#', '###', '..#', '..#'], 5: ['###', '#..', '##.', '..#', '##.'],
    6: ['.##', '#..', '###', '#.#', '###'], 7: ['###', '..#', '.#.', '.#.', '.#.'], 8: ['###', '#.#', '###', '#.#', '###'],
    9: ['###', '#.#', '###', '..#', '##.'],
    '.': ['.', '.', '.', '.', '#'], ',': ['.', '.', '.', '#', '#'], "'": ['#', '#', '.', '.', '.'], '-': ['...', '...', '###', '...', '...'],
    ':': ['.', '#', '.', '#', '.'], '!': ['#', '#', '#', '.', '#'], '?': ['##.', '..#', '.#.', '...', '.#.'], '/': ['..#', '..#', '.#.', '#..', '#..'],
    '&': ['.#.', '#.#', '.#.', '#.#', '.##'], '·': ['.', '.', '#', '.', '.'], ' ': ['..', '..', '..', '..', '..'],
    '$': ['.##', '##.', '.#.', '.##', '##.'], '(': ['.#', '#.', '#.', '#.', '.#'], ')': ['#.', '.#', '.#', '.#', '#.'],
    '+': ['...', '.#.', '###', '.#.', '...'], '#': ['#.#', '###', '#.#', '###', '#.#'],
    '✓': ['....#', '...#.', '#.#..', '.#...', '.....'], '★': ['..#..', '#####', '.###.', '.#.#.', '#...#'],
  };
  function textWidth(str, s) {
    s = s || 1;
    let w = 0;
    for (const ch of String(str).toUpperCase()) { const gl = GL[ch] || GL[' ']; w += (gl[0].length + 1) * s; }
    return Math.max(0, w - s);
  }
  function text(g, str, x, y, color, s, shadow) {
    s = s || 1;
    let cx = Math.round(x);
    for (const ch of String(str).toUpperCase()) {
      const gl = GL[ch] || GL[' '];
      for (let r = 0; r < 5; r++) for (let c = 0; c < gl[r].length; c++) {
        if (gl[r][c] === '#') {
          if (shadow) R(g, cx + c * s, y + r * s + s, s, s, shadow);
          R(g, cx + c * s, y + r * s, s, s, color);
        }
      }
      cx += (gl[0].length + 1) * s;
    }
    return cx - x;
  }
  function textC(g, str, cx, y, color, s, shadow) { return text(g, str, Math.round(cx - textWidth(str, s) / 2), y, color, s, shadow); }
  A.text = text; A.textC = textC; A.textWidth = textWidth;

  /* =====================================================================
     CHARACTERS: parametric 1920s townsfolk, 4 directions × 4 frames
     ===================================================================== */
  const FW = 18, FH = 27; // frame size including outline margin
  A.FW = FW; A.FH = FH;

  function drawCharFrame(g, ox, oy, dir, f, L) {
    const r = (x, y, w, h, c) => R(g, ox + x, oy + y, w, h, c);
    const p = (x, y, c) => P(g, ox + x, oy + y, c);
    const stride = f === 1 || f === 3;
    const b = stride ? 1 : 0;
    const skin = L.skin, skinD = shade(skin, -0.2);
    const top = L.top, topD = shade(top, -0.28), topL = shade(top, 0.14);
    const bot = L.bottom || shade(L.top, -0.2), botD = shade(bot, -0.3);
    const shoe = L.shoes || '#2f2220', shoeL = shade(shoe, 0.25);
    const hair = L.hair, hairD = shade(hair, -0.3), hairL = shade(hair, 0.18);
    const sleeve = L.sleeve || top, sleeveD = shade(sleeve, -0.25);
    const eye = '#2a1a24';
    const dress = L.style === 'dress';

    if (dir === 0 || dir === 3) {
      // ---- legs ----
      const legTop = dress ? 20 : 18;
      const lUp = f === 1 ? 1 : 0, rUp = f === 3 ? 1 : 0;
      const legC = dress ? (L.stockings || shade(skin, -0.05)) : bot;
      const legCD = dress ? shade(legC, -0.2) : botD;
      r(5, legTop, 2, 21 - legTop - lUp, legC); r(6, legTop, 1, 21 - legTop - lUp, legCD);
      r(9, legTop, 2, 21 - legTop - rUp, legC); r(10, legTop, 1, 21 - legTop - rUp, legCD);
      r(5, 21 - lUp, 2, 2, shoe); p(5, 21 - lUp, shoeL);
      r(9, 21 - rUp, 2, 2, shoe); p(9, 21 - rUp, shoeL);
      // ---- torso ----
      r(4, 12 + b, 8, 6, top); r(11, 12 + b, 1, 6, topD); r(4, 12 + b, 1, 6, topL);
      if (dress) {
        r(3, 16 + b, 10, 4, top); r(3, 19 + b, 10, 1, L.trim || topD); r(12, 16 + b, 1, 4, topD);
        r(4, 16 + b, 8, 1, L.sash || topD);
      } else {
        r(4, 17 + b, 8, 2, bot); r(4, 17 + b, 8, 1, L.belt || botD);
      }
      if (dir === 0) {
        if (L.style === 'suit') {
          r(7, 12 + b, 2, 3, L.shirt || '#efe6d2'); r(7, 13 + b, 2, 3, L.tie || '#7a2630'); p(6, 12 + b, topL); p(9, 12 + b, topL);
          p(6, 15 + b, topD); p(9, 15 + b, topD);
        } else if (L.style === 'vest') {
          r(4, 12 + b, 8, 5, L.shirt || '#efe6d2'); r(5, 13 + b, 2, 4, top); r(9, 13 + b, 2, 4, top); r(7, 12 + b, 2, 2, L.tie || L.shirt || '#efe6d2');
          r(7, 14 + b, 2, 3, L.shirt || '#efe6d2'); p(10, 13 + b, topD); p(10, 14 + b, topD); p(10, 15 + b, topD); p(10, 16 + b, topD);
          if (L.tie) { p(7, 13 + b, L.tie); p(8, 13 + b, L.tie); p(7, 14 + b, L.tie); }
        } else if (L.style === 'overalls') {
          r(5, 14 + b, 6, 4, bot); r(5, 12 + b, 1, 2, bot); r(10, 12 + b, 1, 2, bot); p(5, 14 + b, '#d9c27a'); p(10, 14 + b, '#d9c27a');
        } else if (L.style === 'uniform') {
          r(7, 12 + b, 2, 1, L.shirt || topD); p(8, 14 + b, '#e3c45f'); p(8, 16 + b, '#e3c45f'); r(4, 16 + b, 8, 1, L.belt || '#5a3a24');
          if (L.badge) p(5, 13 + b, '#f1d36a');
        } else if (dress) {
          r(6, 12 + b, 4, 1, shade(skin, -0.05));
          if (L.pearls) { p(5, 13 + b, '#fbf6e8'); p(6, 14 + b, '#fbf6e8'); p(7, 14 + b, '#fbf6e8'); p(8, 14 + b, '#fbf6e8'); p(9, 14 + b, '#fbf6e8'); p(10, 13 + b, '#fbf6e8'); }
        } else {
          r(7, 12 + b, 2, 1, L.shirt || topL);
        }
      } else {
        r(7, 12 + b, 1, 5, topD);
      }
      // ---- arms ----
      const la = f === 1 ? -1 : f === 3 ? 1 : 0;
      r(3, 12 + b, 1, 5 + la, sleeve); r(3, 16 + b + la, 1, 1, sleeveD); p(3, 17 + b + la, skin);
      r(12, 12 + b, 1, 5 - la, sleeve); r(12, 16 + b - la, 1, 1, sleeveD); p(12, 17 + b - la, skin);
      if (L.bag && dir === 0) { r(12, 15 + b, 2, 3, L.bag); }
      // ---- head ----
      r(6, 11 + b, 4, 1, skinD);
      if (dir === 0) {
        r(3, 2 + b, 10, 4, hair);
        r(4, 5 + b, 8, 6, skin); r(5, 11 + b, 6, 1, skin); r(4, 10 + b, 1, 1, skinD); r(11, 10 + b, 1, 1, skinD);
        r(3, 5 + b, 1, 4, hair); r(12, 5 + b, 1, 4, hair);
        if (L.long) { r(3, 9 + b, 1, 4, hair); r(12, 9 + b, 1, 4, hair); }
        r(4, 5 + b, 8, 1, hair); p(5, 5 + b, hairL); p(8, 5 + b, skin); p(9, 5 + b, skin);
        p(3, 8 + b, skin); p(12, 8 + b, skin);
        r(6, 7 + b, 1, 2, eye); r(9, 7 + b, 1, 2, eye);
        p(5, 9 + b, L.blush || '#e8a08a'); p(10, 9 + b, L.blush || '#e8a08a');
        if (L.mustache) { r(6, 10 + b, 4, 1, hairD); }
        if (L.glasses) { r(5, 7 + b, 2, 1, '#2a2a2a'); r(9, 7 + b, 2, 1, '#2a2a2a'); p(8, 7 + b, '#2a2a2a'); }
      } else {
        r(3, 2 + b, 10, 9, hair); r(4, 10 + b, 8, 1, hairD); r(3, 5 + b, 1, 5, hairD);
        if (L.long) { r(4, 11 + b, 8, 2, hair); }
        p(3, 8 + b, skinD); p(12, 8 + b, skinD);
      }
      // round head corners
      g.clearRect(ox + 3, oy + 2 + b, 1, 1); g.clearRect(ox + 12, oy + 2 + b, 1, 1);
      drawHat(r, p, L, dir, b);
    } else {
      // ---- side view, facing left ----
      const legC = dress ? (L.stockings || shade(skin, -0.05)) : bot;
      const legCD = shade(legC, -0.25);
      const legTop = dress ? 20 : 18;
      if (!stride) {
        r(6, legTop, 2, 21 - legTop, legC); r(8, legTop, 2, 21 - legTop, legCD);
        r(5, 21, 3, 2, shoe); r(8, 21, 2, 2, shade(shoe, -0.2)); p(5, 21, shoeL);
      } else {
        const front = f === 1 ? legC : legCD, back = f === 1 ? legCD : legC;
        r(9, legTop, 2, 21 - legTop, back); r(10, 21, 3, 2, shade(shoe, -0.15));
        r(4, legTop, 2, 21 - legTop, front); r(3, 21, 3, 2, shoe); p(3, 21, shoeL);
        r(6, legTop, 3, 1, legC);
      }
      r(5, 12 + b, 6, 6, top); r(10, 12 + b, 1, 6, topD); r(5, 12 + b, 1, 6, topL);
      if (dress) { r(4, 16 + b, 8, 4, top); r(4, 19 + b, 8, 1, L.trim || topD); r(5, 16 + b, 6, 1, L.sash || topD); }
      else { r(5, 17 + b, 6, 2, bot); r(5, 17 + b, 6, 1, L.belt || botD); }
      if (L.style === 'suit') { p(5, 13 + b, L.shirt || '#efe6d2'); p(5, 14 + b, L.tie || '#7a2630'); }
      if (L.style === 'overalls') { r(5, 14 + b, 5, 4, bot); r(6, 12 + b, 1, 2, bot); }
      if (L.bag) { r(9, 15 + b, 3, 3, L.bag); }
      // arm
      if (!stride) { r(7, 12 + b, 2, 5, sleeve); r(7, 16 + b, 2, 1, sleeveD); r(7, 17 + b, 2, 1, skin); }
      else if (f === 1) { r(7, 12 + b, 2, 3, sleeve); r(6, 15 + b, 2, 1, sleeveD); r(5, 16 + b, 2, 1, skin); }
      else { r(8, 12 + b, 2, 3, sleeve); r(9, 15 + b, 2, 1, sleeveD); r(10, 16 + b, 2, 1, skin); }
      // head
      r(6, 11 + b, 3, 1, skinD);
      r(3, 2 + b, 9, 3, hair);
      r(3, 5 + b, 6, 6, skin); r(4, 11 + b, 4, 1, skin);
      r(8, 4 + b, 4, 6, hair); r(11, 5 + b, 1, 4, hairD);
      if (L.long) r(9, 9 + b, 3, 4, hair);
      r(3, 5 + b, 5, 1, hair); p(4, 5 + b, hairL);
      p(8, 8 + b, skinD);
      r(4, 7 + b, 1, 2, eye);
      p(2, 8 + b, skin);
      p(5, 9 + b, L.blush || '#e8a08a');
      if (L.mustache) r(2, 10 + b, 3, 1, hairD);
      if (L.glasses) { r(3, 7 + b, 3, 1, '#2a2a2a'); }
      g.clearRect(ox + 3, oy + 2 + b, 1, 1); g.clearRect(ox + 11, oy + 2 + b, 1, 1);
      drawHatSide(r, p, L, b);
    }
  }

  function drawHat(r, p, L, dir, b) {
    if (!L.hat || L.hat === 'none') return;
    const h = L.hatColor || '#5a4636', hD = shade(h, -0.3), hL = shade(h, 0.18);
    const band = L.band || shade(h, -0.45);
    switch (L.hat) {
      case 'cap':
        r(3, 1 + b, 10, 4, h); r(3, 4 + b, 10, 1, hD); r(4, 1 + b, 3, 1, hL); p(7, 1 + b, hL);
        if (dir === 0) { r(3, 5 + b, 10, 1, hD); }
        break;
      case 'fedora':
        r(4, 0 + b, 8, 3, h); p(7, 0 + b, hD); p(8, 0 + b, hD); r(4, 0 + b, 2, 1, hL);
        r(4, 3 + b, 8, 1, band); r(2, 4 + b, 12, 1, hD);
        break;
      case 'bowler':
        r(5, 0 + b, 6, 1, h); r(4, 1 + b, 8, 3, h); p(6, 1 + b, hL); p(5, 2 + b, hL); r(3, 4 + b, 10, 1, hD);
        break;
      case 'cloche':
        r(4, 1 + b, 8, 1, h); r(3, 2 + b, 10, 4, h); r(4, 1 + b, 3, 1, hL); r(3, 5 + b, 10, 1, band);
        r(3, 6 + b, 1, 1, hD); r(12, 6 + b, 1, 1, hD);
        if (L.flower && dir === 0) { p(10, 4 + b, L.flower); p(11, 5 + b, L.flower); }
        break;
      case 'police':
        r(3, 1 + b, 10, 3, h); r(4, 1 + b, 3, 1, hL); r(3, 3 + b, 10, 1, band);
        if (dir === 0) { p(7, 2 + b, '#f0cf5e'); p(8, 2 + b, '#f0cf5e'); r(4, 4 + b, 8, 1, '#15151f'); }
        break;
      case 'campaign':
        r(7, 0 + b, 2, 1, h); r(6, 1 + b, 4, 1, h); r(5, 2 + b, 6, 1, h); r(4, 3 + b, 8, 1, band); r(1, 4 + b, 14, 1, hD); p(6, 1 + b, hL);
        break;
      case 'garrison':
        r(4, 1 + b, 8, 3, h); r(4, 1 + b, 8, 1, hL); r(4, 3 + b, 8, 1, hD);
        break;
      case 'straw':
        r(4, 1 + b, 8, 3, h); r(4, 1 + b, 8, 1, hL); r(4, 3 + b, 8, 1, band); r(2, 4 + b, 12, 1, hD);
        break;
      case 'bun':
        if (dir === 3) { r(6, 0 + b, 4, 3, shade(L.hair, -0.1)); } else { r(6, 0 + b, 4, 2, L.hair); }
        break;
      case 'top':
        r(4, -1 + b + 1, 8, 4, h); r(4, 3 + b, 8, 1, band); r(3, 4 + b, 10, 1, hD); p(5, 1 + b, hL);
        break;
    }
  }
  function drawHatSide(r, p, L, b) {
    if (!L.hat || L.hat === 'none') return;
    const h = L.hatColor || '#5a4636', hD = shade(h, -0.3), hL = shade(h, 0.18);
    const band = L.band || shade(h, -0.45);
    switch (L.hat) {
      case 'cap': r(3, 1 + b, 9, 4, h); r(4, 1 + b, 3, 1, hL); r(3, 4 + b, 9, 1, hD); r(1, 5 + b, 3, 1, hD); break;
      case 'fedora': r(4, 0 + b, 7, 3, h); r(4, 3 + b, 7, 1, band); r(1, 4 + b, 12, 1, hD); p(5, 0 + b, hL); break;
      case 'bowler': r(5, 0 + b, 5, 1, h); r(4, 1 + b, 7, 3, h); p(5, 1 + b, hL); r(2, 4 + b, 10, 1, hD); break;
      case 'cloche': r(4, 1 + b, 7, 1, h); r(3, 2 + b, 9, 4, h); r(3, 5 + b, 9, 1, band); r(2, 6 + b, 2, 1, hD); r(4, 1 + b, 2, 1, hL);
        if (L.flower) { p(9, 3 + b, L.flower); p(10, 4 + b, L.flower); } break;
      case 'police': r(3, 1 + b, 9, 3, h); r(3, 3 + b, 9, 1, band); r(1, 4 + b, 4, 1, '#15151f'); break;
      case 'campaign': r(6, 0 + b, 2, 1, h); r(5, 1 + b, 4, 1, h); r(4, 2 + b, 6, 1, h); r(4, 3 + b, 6, 1, band); r(0, 4 + b, 14, 1, hD); break;
      case 'garrison': r(3, 1 + b, 9, 3, h); r(3, 1 + b, 9, 1, hL); break;
      case 'straw': r(4, 1 + b, 7, 3, h); r(4, 3 + b, 7, 1, band); r(1, 4 + b, 12, 1, hD); break;
      case 'bun': r(9, 1 + b, 3, 3, L.hair); break;
      case 'top': r(4, 0 + b, 7, 4, h); r(4, 3 + b, 7, 1, band); r(2, 4 + b, 10, 1, hD); break;
    }
  }

  const charCache = {};
  // Returns a sprite sheet: columns = frames (0-3), rows = dir (0 down, 1 left, 2 right, 3 up)
  A.charSheet = function (L) {
    const key = JSON.stringify(L);
    if (charCache[key]) return charCache[key];
    const sheet = canvas(FW * 4, FH * 4);
    for (const dir of [0, 1, 3]) {
      for (let f = 0; f < 4; f++) {
        const fr = canvas(FW, FH);
        drawCharFrame(fr.g, 1, 2, dir, f, L);
        outline(fr);
        sheet.g.drawImage(fr, f * FW, dir * FH);
        if (dir === 1) sheet.g.drawImage(flipH(fr), f * FW, 2 * FH);
      }
    }
    charCache[key] = sheet;
    return sheet;
  };

  // Large portrait (for dialogue box): crop of the head, scaled up
  A.portrait = function (L) {
    const sheet = A.charSheet(L);
    const c = canvas(18, 16);
    c.g.drawImage(sheet, 0, 0, FW, 16, 0, 0, 18, 16);
    return c;
  };

  /* =====================================================================
     NATURE + STREET PROPS
     ===================================================================== */
  const PAL = {
    grass: ['#6f9a45', '#7eaa4f', '#5f8a3c', '#4f7a34', '#8db85a'],
    leaf: ['#3f6b35', '#4f8040', '#629448', '#79a957', '#2f5530'],
    trunk: ['#6b4a33', '#553824', '#86603f'],
    stone: ['#b9ad97', '#a69a84', '#cfc4ae', '#8f846f', '#e0d6c2'],
    brick: ['#9c4d3b', '#ad5a44', '#8a4234', '#b8664c', '#7a382d'],
    iron: '#2f4a4a', ironL: '#4c6d68', gold: '#e2b85a', goldD: '#a8803a',
  };
  A.PAL = PAL;

  A.tree = function (seed, kind) {
    const rnd = RNG(seed);
    if (kind === 'pine') {
      const c = canvas(30, 46);
      const g = c.g;
      R(g, 13, 36, 4, 8, PAL.trunk[1]); R(g, 13, 36, 2, 8, PAL.trunk[0]);
      const tiers = [[15, 4, 5], [15, 11, 8], [15, 19, 11], [15, 27, 13]];
      tiers.forEach(([cx, ty, hw], i) => {
        for (let y = 0; y < 10; y++) {
          const w = Math.round(((y + 2) / 12) * hw);
          R(g, cx - w, ty + y, w * 2, 1, PAL.leaf[4]);
          R(g, cx - w, ty + y, Math.max(1, w - 1), 1, PAL.leaf[0]);
          if (y > 1 && rnd() < 0.5) P(g, cx - w + 1 + ((rnd() * w) | 0), ty + y, PAL.leaf[2]);
        }
      });
      outline(c);
      return { c, ax: 15, ay: 43 };
    }
    const c = canvas(40, 50);
    const g = c.g;
    // trunk
    R(g, 17, 30, 6, 16, PAL.trunk[1]); R(g, 17, 30, 2, 16, PAL.trunk[2]); R(g, 21, 30, 2, 16, shade(PAL.trunk[1], -0.25));
    R(g, 15, 44, 10, 2, PAL.trunk[1]); P(g, 14, 45, PAL.trunk[1]); P(g, 25, 45, PAL.trunk[1]);
    // canopy blobs
    const blobs = [[20, 18, 15], [11, 23, 9], [29, 23, 9], [14, 12, 9], [26, 12, 9], [20, 8, 9], [20, 27, 10]];
    blobs.forEach(([x, y, r]) => disc(g, x, y, r, PAL.leaf[4]));
    blobs.forEach(([x, y, r]) => disc(g, x - 1, y - 1, r - 1, PAL.leaf[0]));
    blobs.forEach(([x, y, r]) => disc(g, x - 2, y - 2, Math.max(2, r - 4), PAL.leaf[1]));
    [[15, 9, 4], [24, 8, 3], [11, 19, 3], [21, 15, 4]].forEach(([x, y, r]) => disc(g, x, y, r, PAL.leaf[2]));
    for (let i = 0; i < 26; i++) {
      const x = 6 + ((rnd() * 28) | 0), y = 3 + ((rnd() * 28) | 0);
      const d = g.getImageData(x, y, 1, 1).data;
      if (d[3] > 0) P(g, x, y, rnd() < 0.5 ? PAL.leaf[3] : PAL.leaf[4]);
    }
    // blossoms on some trees
    if (rnd() < 0.3) for (let i = 0; i < 10; i++) {
      const x = 6 + ((rnd() * 28) | 0), y = 4 + ((rnd() * 24) | 0);
      if (g.getImageData(x, y, 1, 1).data[3] > 0) P(g, x, y, '#f2d0a4');
    }
    outline(c);
    return { c, ax: 20, ay: 46 };
  };

  A.bush = function (seed, flowers) {
    const rnd = RNG(seed);
    const c = canvas(22, 16);
    const g = c.g;
    [[7, 9, 6], [14, 9, 6], [11, 6, 6]].forEach(([x, y, r]) => disc(g, x, y, r, PAL.leaf[4]));
    [[7, 8, 5], [14, 8, 5], [11, 5, 5]].forEach(([x, y, r]) => disc(g, x, y, r, PAL.leaf[1]));
    [[9, 5, 2], [14, 6, 2]].forEach(([x, y, r]) => disc(g, x, y, r, PAL.leaf[2]));
    if (flowers) for (let i = 0; i < 7; i++) {
      const x = 3 + ((rnd() * 16) | 0), y = 2 + ((rnd() * 10) | 0);
      if (g.getImageData(x, y, 1, 1).data[3] > 0) { P(g, x, y, flowers); P(g, x, y - 1, shade(flowers, 0.4)); }
    }
    outline(c);
    return { c, ax: 11, ay: 15 };
  };

  A.flowerbed = function (w, h, seed) {
    const rnd = RNG(seed);
    const c = canvas(w, h);
    const g = c.g;
    R(g, 0, 0, w, h, '#7a5a3c'); R(g, 1, 1, w - 2, h - 2, '#5e432c');
    for (let y = 2; y < h - 2; y += 2) for (let x = 2; x < w - 2; x += 2) if (rnd() < 0.8) {
      P(g, x, y, PAL.leaf[1]); P(g, x + 1, y, PAL.leaf[2]);
    }
    const cols = ['#e86a5a', '#f2c45a', '#c97ad6', '#f7f0e0', '#6aa0e8'];
    for (let i = 0; i < (w * h) / 10; i++) {
      const x = 2 + ((rnd() * (w - 4)) | 0), y = 2 + ((rnd() * (h - 4)) | 0);
      const col = cols[(rnd() * cols.length) | 0];
      P(g, x, y, col); P(g, x, y - 1, shade(col, 0.35));
    }
    R(g, 0, 0, w, 1, '#a8825a'); R(g, 0, h - 1, w, 1, '#3e2a1c');
    return c;
  };

  A.lamp = function () {
    const c = canvas(22, 46);
    const g = c.g;
    const ir = PAL.iron, irL = PAL.ironL, irD = '#1d3030';
    R(g, 8, 40, 6, 5, ir); R(g, 7, 43, 8, 2, irD); R(g, 8, 40, 1, 4, irL);
    R(g, 10, 12, 2, 29, ir); R(g, 10, 12, 1, 29, irL);
    R(g, 9, 20, 4, 2, ir);
    R(g, 3, 11, 16, 2, ir); R(g, 3, 11, 16, 1, irL);
    // globes
    [[4, 5], [15, 5]].forEach(([x, y]) => {
      R(g, x - 1, y + 5, 5, 1, ir);
      disc(g, x + 1.5, y + 2, 3, '#ffe9a8');
      R(g, x, y, 3, 4, '#fff6d2'); P(g, x, y, '#ffffff');
      R(g, x - 1, y - 2, 5, 1, ir); P(g, x + 1, y - 3, ir);
    });
    R(g, 10, 7, 2, 4, ir); R(g, 9, 6, 4, 1, ir);
    outline(c);
    return { c, ax: 11, ay: 44, lights: [[5.5, 7], [16.5, 7]] };
  };

  A.bench = function (dir) {
    const c = canvas(34, 20);
    const g = c.g;
    const w = '#9a6a40', wL = '#b98552', wD = '#6e4628', ir = '#2b2f33';
    // back rest
    R(g, 2, 2, 30, 3, w); R(g, 2, 2, 30, 1, wL); R(g, 2, 6, 30, 3, w); R(g, 2, 6, 30, 1, wL);
    // seat
    R(g, 1, 10, 32, 3, w); R(g, 1, 10, 32, 1, wL); R(g, 1, 13, 32, 2, wD);
    // iron ends
    [2, 29].forEach((x) => { R(g, x, 1, 3, 17, ir); R(g, x - 1, 16, 5, 2, ir); P(g, x + 1, 2, '#5a6066'); });
    outline(c);
    return { c, ax: 17, ay: 18 };
  };

  A.signpost = function (labels) {
    const c = canvas(46, 44);
    const g = c.g;
    R(g, 22, 8, 3, 34, '#6e4a2e'); R(g, 22, 8, 1, 34, '#8e643e');
    labels.forEach((lb, i) => {
      const y = 6 + i * 9;
      const right = i % 2 === 0;
      const x0 = right ? 18 : 4;
      R(g, x0, y, 24, 7, '#d9c08a'); R(g, x0, y + 6, 24, 1, '#a88a58');
      if (right) { P(g, x0 + 24, y + 1, '#d9c08a'); R(g, x0 + 24, y + 2, 2, 3, '#d9c08a'); }
      else { P(g, x0 - 1, y + 1, '#d9c08a'); R(g, x0 - 2, y + 2, 2, 3, '#d9c08a'); }
      textC(g, lb, x0 + 12, y + 1, '#4a2c1c', 1);
    });
    outline(c);
    return { c, ax: 23, ay: 42 };
  };

  A.hydrant = function () {
    const c = canvas(10, 14);
    const g = c.g;
    R(g, 2, 3, 6, 9, '#b8342c'); R(g, 2, 3, 2, 9, '#d4503e'); R(g, 1, 11, 8, 2, '#8a2420'); R(g, 3, 1, 4, 2, '#b8342c');
    R(g, 0, 6, 10, 2, '#9a2c26'); P(g, 4, 0, '#8a2420');
    outline(c);
    return { c, ax: 5, ay: 13 };
  };

  A.mailbox = function () {
    const c = canvas(12, 20);
    const g = c.g;
    R(g, 1, 4, 10, 10, '#2d4f7a'); R(g, 1, 4, 3, 10, '#3e6898'); R(g, 2, 2, 8, 2, '#2d4f7a'); R(g, 3, 1, 6, 1, '#2d4f7a');
    R(g, 3, 6, 6, 1, '#1a2c44'); R(g, 2, 14, 2, 5, '#1a2c44'); R(g, 8, 14, 2, 5, '#1a2c44'); R(g, 3, 9, 6, 2, '#e9dfc6');
    outline(c);
    return { c, ax: 6, ay: 19 };
  };

  A.newsstand = function () {
    const c = canvas(30, 26);
    const g = c.g;
    R(g, 1, 4, 28, 3, '#3f6b5a'); R(g, 1, 4, 28, 1, '#5a8c76');
    for (let i = 0; i < 7; i++) R(g, 1 + i * 4, 7, 4, 2, i % 2 ? '#e9e2cf' : '#3f6b5a');
    R(g, 3, 9, 24, 12, '#7a5434'); R(g, 3, 9, 24, 1, '#9a6c44');
    for (let i = 0; i < 4; i++) { R(g, 5 + i * 6, 11, 5, 7, '#ece4d0'); R(g, 5 + i * 6, 12, 5, 1, '#3a3a3a'); R(g, 6 + i * 6, 14, 3, 1, '#9a9a9a'); R(g, 6 + i * 6, 16, 3, 1, '#9a9a9a'); }
    R(g, 3, 21, 24, 3, '#5a3c24');
    textC(g, 'NEWS', 15, 0, '#f2d27a', 1);
    outline(c);
    return { c, ax: 15, ay: 24 };
  };

  A.gaspump = function () {
    const c = canvas(14, 34);
    const g = c.g;
    disc(g, 7, 5, 4, '#f4ead2'); R(g, 4, 4, 6, 2, '#c8402e');
    R(g, 3, 10, 8, 20, '#c8402e'); R(g, 3, 10, 2, 20, '#e0604a'); R(g, 5, 13, 4, 6, '#f1e7cf'); R(g, 2, 29, 10, 3, '#5a5a5a');
    R(g, 11, 14, 2, 10, '#2a2a2a');
    outline(c);
    return { c, ax: 7, ay: 32 };
  };

  A.barrel = function () {
    const c = canvas(14, 16);
    const g = c.g;
    R(g, 1, 1, 12, 14, '#6e4a2e'); R(g, 1, 1, 4, 14, '#8a5e3a'); R(g, 0, 3, 14, 2, '#3a3a3a'); R(g, 0, 11, 14, 2, '#3a3a3a');
    ellipse(g, 7, 1, 6, 1, '#5a3a22');
    outline(c);
    return { c, ax: 7, ay: 15 };
  };

  A.crate = function (label) {
    const c = canvas(16, 15);
    const g = c.g;
    R(g, 1, 1, 14, 13, '#a87a48'); R(g, 1, 1, 14, 2, '#c49460'); R(g, 1, 7, 14, 1, '#7a5430'); R(g, 7, 3, 1, 11, '#7a5430');
    if (label) textC(g, label, 8, 9, '#4a2c18', 1);
    outline(c);
    return { c, ax: 8, ay: 14 };
  };

  A.fenceH = function (len) {
    const c = canvas(len, 18);
    const g = c.g;
    for (let x = 1; x < len - 1; x += 4) { R(g, x, 3, 2, 13, PAL.iron); P(g, x, 2, PAL.iron); P(g, x + 1, 1, PAL.gold); }
    R(g, 0, 5, len, 2, PAL.iron); R(g, 0, 13, len, 2, PAL.iron); R(g, 0, 5, len, 1, PAL.ironL);
    outline(c);
    return { c, ax: 0, ay: 16 };
  };

  A.hedge = function (len, seed) {
    const rnd = RNG(seed || 3);
    const c = canvas(len, 20);
    const g = c.g;
    R(g, 1, 4, len - 2, 14, PAL.leaf[4]); R(g, 1, 3, len - 2, 12, PAL.leaf[0]); R(g, 1, 3, len - 2, 3, PAL.leaf[1]);
    for (let i = 0; i < len / 2; i++) P(g, 1 + ((rnd() * (len - 2)) | 0), 4 + ((rnd() * 10) | 0), rnd() < 0.5 ? PAL.leaf[2] : PAL.leaf[4]);
    outline(c);
    return { c, ax: 0, ay: 18 };
  };

  // 48-star era U.S. flag (simplified for pixel scale), animated
  A.flagFrames = function (kind) {
    const frames = [];
    for (let f = 0; f < 4; f++) {
      const c = canvas(26, 18);
      const g = c.g;
      const base = canvas(22, 14);
      drawFlag(base.g, kind || 'us', 22, 14);
      for (let x = 0; x < 22; x++) {
        const dy = Math.round(Math.sin((x / 22) * Math.PI * 2 + f * (Math.PI / 2)) * 1.2 * (x / 22));
        g.drawImage(base, x, 0, 1, 14, x + 2, 2 + dy, 1, 14);
      }
      outline(c);
      frames.push(c);
    }
    return frames;
  };
  function drawFlag(g, kind, w, h) {
    if (kind === 'us') {
      for (let i = 0; i < 7; i++) R(g, 0, i * 2, w, 1, '#b8312f'), R(g, 0, i * 2 + 1, w, 1, '#f2ece0');
      R(g, 0, 13, w, 1, '#b8312f');
      R(g, 0, 0, 10, 7, '#2b3f7a');
      for (let y = 1; y < 7; y += 2) for (let x = 1; x < 10; x += 2) P(g, x, y, '#f2ece0');
    } else if (kind === 'uk') {
      R(g, 0, 0, w, h, '#2b3f7a');
      for (let i = 0; i < w; i++) { const y = Math.round((i / w) * h); P(g, i, y, '#f2ece0'); P(g, i, h - 1 - y, '#f2ece0'); P(g, i, y + 1, '#c8302e'); }
      R(g, 0, 5, w, 4, '#f2ece0'); R(g, 9, 0, 4, h, '#f2ece0'); R(g, 0, 6, w, 2, '#c8302e'); R(g, 10, 0, 2, h, '#c8302e');
    } else if (kind === 'fr') {
      R(g, 0, 0, 7, h, '#2b4a9a'); R(g, 7, 0, 8, h, '#f2ece0'); R(g, 15, 0, 7, h, '#c8302e');
    } else if (kind === 'de') { // Weimar Republic black-red-gold
      R(g, 0, 0, w, 5, '#1d1d1d'); R(g, 0, 5, w, 4, '#c8302e'); R(g, 0, 9, w, 5, '#e6b83a');
    } else if (kind === 'be') {
      R(g, 0, 0, 7, h, '#1d1d1d'); R(g, 7, 0, 8, h, '#f0c832'); R(g, 15, 0, 7, h, '#c8302e');
    } else if (kind === 'jp') {
      R(g, 0, 0, w, h, '#f2ece0'); disc(g, 11, 7, 4, '#c8302e');
    } else if (kind === 'it') { // Kingdom of Italy tricolour (Savoy shield simplified)
      R(g, 0, 0, 7, h, '#2a8a4a'); R(g, 7, 0, 8, h, '#f2ece0'); R(g, 15, 0, 7, h, '#c8302e'); R(g, 9, 4, 4, 5, '#c8302e'); R(g, 10, 5, 2, 3, '#f2ece0');
    } else if (kind === 'pres') {
      R(g, 0, 0, w, h, '#2b3f7a'); disc(g, 11, 7, 4, '#e2b85a'); P(g, 11, 7, '#2b3f7a');
    }
  }
  A.drawFlag = drawFlag;

  A.flagpole = function (kind) {
    const frames = A.flagFrames(kind);
    return frames.map((fl) => {
      const c = canvas(30, 64);
      const g = c.g;
      R(g, 3, 2, 2, 58, '#d8d2c4'); R(g, 3, 2, 1, 58, '#ffffff'); disc(g, 4, 2, 2, PAL.gold);
      R(g, 1, 58, 6, 4, '#8a8478');
      g.drawImage(fl, 3, 2);
      outline(c);
      return c;
    });
  };

  // WWI doughboy memorial statue (common in American town squares in the 1920s)
  A.memorial = function () {
    const c = canvas(40, 64);
    const g = c.g;
    const s = PAL.stone;
    // pedestal tiers
    R(g, 2, 50, 36, 12, s[3]); R(g, 2, 50, 36, 2, s[2]);
    R(g, 6, 34, 28, 17, s[0]); R(g, 6, 34, 28, 2, s[4]); R(g, 6, 34, 3, 17, s[2]); R(g, 31, 34, 3, 17, s[3]);
    R(g, 10, 39, 20, 8, '#8a6a3a'); R(g, 11, 40, 18, 6, '#b98a46');
    textC(g, '1917-18', 20, 41, '#4a3014', 1);
    R(g, 4, 31, 32, 4, s[2]); R(g, 4, 31, 32, 1, s[4]);
    // bronze doughboy figure (patina)
    const br = '#4e7a6a', brL = '#6fa08a', brD = '#2f5248';
    R(g, 16, 26, 3, 5, brD); R(g, 21, 26, 3, 5, brD);
    R(g, 15, 15, 10, 12, br); R(g, 15, 15, 3, 12, brL);
    R(g, 25, 8, 2, 12, br); R(g, 24, 4, 4, 2, brD); // raised arm
    R(g, 13, 16, 2, 9, br);
    disc(g, 20, 11, 3, br); R(g, 17, 11, 6, 3, br); P(g, 19, 10, brL);
    R(g, 15, 8, 10, 2, brD); R(g, 16, 7, 8, 1, br); // brodie helmet
    R(g, 11, 22, 2, 10, brD); // rifle
    outline(c);
    return { c, ax: 20, ay: 62 };
  };

  A.fountainFrames = function () {
    const frames = [];
    for (let f = 0; f < 4; f++) {
      const c = canvas(64, 44);
      const g = c.g;
      const s = PAL.stone;
      ellipse(g, 32, 28, 30, 13, s[3]);
      ellipse(g, 32, 27, 30, 12, s[0]);
      ellipse(g, 32, 27, 26, 9, '#3d6f8a');
      ellipse(g, 32, 28, 24, 7, '#4f8aa6');
      // ripples
      for (let i = 0; i < 3; i++) {
        const rr = ((f * 3 + i * 6) % 18) + 4;
        g.strokeStyle = 'rgba(220,240,255,0.55)';
        g.beginPath(); g.ellipse(32, 28, rr, rr * 0.35, 0, 0, Math.PI * 2); g.stroke();
      }
      R(g, 29, 14, 6, 14, s[2]); R(g, 29, 14, 2, 14, s[4]);
      ellipse(g, 32, 14, 8, 3, s[0]); ellipse(g, 32, 13, 6, 2, '#5d96b0');
      R(g, 31, 4, 2, 9, s[2]);
      // water arcs
      for (let i = 0; i < 6; i++) {
        const t = ((i / 6 + f / 24) % 1);
        const dx = Math.round(Math.sin(t * Math.PI) * 10);
        const y = 4 + Math.round(t * t * 10);
        P(g, 32 - dx - 1, y, '#d8f0ff'); P(g, 32 + dx, y, '#d8f0ff');
      }
      P(g, 31, 2 + (f % 2), '#ffffff'); P(g, 32, 1 + ((f + 1) % 2), '#ffffff');
      outline(c);
      frames.push(c);
    }
    return { frames, ax: 32, ay: 41 };
  };

  /* ---------- automobiles (Model T era) ---------- */
  const carCache = {};
  A.car = function (color, kind) {
    const key = color + kind;
    if (carCache[key]) return carCache[key];
    const body = color, bodyL = shade(color, 0.22), bodyD = shade(color, -0.35);
    const res = {};
    // side view facing right, 2 wheel frames
    res.side = [0, 1].map((wf) => {
      const c = canvas(38, 24);
      const g = c.g;
      R(g, 5, 4, 15, 9, bodyD); R(g, 6, 5, 6, 5, '#b7d1d6'); R(g, 13, 5, 6, 5, '#b7d1d6'); P(g, 6, 5, '#e8f4f6'); P(g, 13, 5, '#e8f4f6');
      R(g, 4, 3, 17, 2, body); R(g, 4, 3, 17, 1, bodyL);
      R(g, 3, 11, 30, 6, body); R(g, 3, 11, 30, 1, bodyL); R(g, 21, 9, 10, 3, body); R(g, 21, 9, 10, 1, bodyL);
      R(g, 31, 10, 3, 6, '#3a3a3a'); P(g, 33, 11, '#ffe6a0'); P(g, 33, 12, '#fff6d0');
      R(g, 1, 14, 34, 2, bodyD); // running board
      R(g, 24, 8, 1, 3, '#222'); // windshield post
      if (kind === 'taxi') { R(g, 3, 13, 30, 1, '#2a2a2a'); for (let x = 4; x < 32; x += 3) P(g, x, 13, '#f2e6c0'); }
      [9, 27].forEach((cx) => {
        disc(g, cx, 18, 5, '#1d1a1a'); disc(g, cx, 18, 3, '#8a7a5a');
        P(g, cx, 18, '#d8c89a');
        if (wf === 0) { P(g, cx - 2, 18, '#3a3020'); P(g, cx + 2, 18, '#3a3020'); P(g, cx, 16, '#3a3020'); P(g, cx, 20, '#3a3020'); }
        else { P(g, cx - 1, 17, '#3a3020'); P(g, cx + 1, 19, '#3a3020'); P(g, cx + 1, 17, '#3a3020'); P(g, cx - 1, 19, '#3a3020'); }
      });
      outline(c);
      return c;
    });
    res.sideL = res.side.map(flipH);
    // front (driving down) and back (driving up)
    const fv = (front) => {
      const c = canvas(22, 30);
      const g = c.g;
      R(g, 2, 9, 18, 16, body); R(g, 2, 9, 18, 1, bodyL);
      R(g, 4, 2, 14, 9, bodyD); R(g, 5, 3, 12, 6, front ? '#b7d1d6' : '#8aa4aa'); P(g, 6, 4, '#e8f4f6');
      R(g, 4, 1, 14, 2, body);
      if (front) {
        R(g, 6, 16, 10, 7, '#3a3a3a'); for (let y = 17; y < 23; y += 2) R(g, 7, y, 8, 1, '#6a6a6a');
        disc(g, 3, 19, 2, '#fff2c0'); disc(g, 18, 19, 2, '#fff2c0');
      } else {
        R(g, 7, 15, 8, 6, bodyD); P(g, 4, 21, '#d84a3a'); P(g, 17, 21, '#d84a3a');
      }
      R(g, 0, 22, 4, 7, '#1d1a1a'); R(g, 18, 22, 4, 7, '#1d1a1a');
      R(g, 1, 20, 20, 2, bodyD);
      if (kind === 'taxi') R(g, 7, 0, 8, 2, '#f2d24a');
      outline(c);
      return c;
    };
    res.down = fv(true);
    res.up = fv(false);
    carCache[key] = res;
    return res;
  };

  /* ---------- steam train ---------- */
  A.locomotive = function () {
    const c = canvas(72, 40);
    const g = c.g;
    const bl = '#26262c', blL = '#3e3e48', red = '#9a2a24', brass = '#d8b05a';
    R(g, 20, 14, 40, 14, bl); R(g, 20, 14, 40, 2, blL); // boiler
    for (let x = 24; x < 58; x += 8) R(g, x, 14, 1, 14, brass);
    R(g, 56, 6, 6, 9, bl); R(g, 55, 5, 8, 2, blL); // smokestack
    R(g, 44, 9, 6, 5, bl); disc(g, 47, 9, 3, brass); // steam dome
    R(g, 4, 6, 18, 24, red); R(g, 4, 6, 18, 2, shade(red, 0.2)); R(g, 2, 4, 22, 3, bl); // cab
    R(g, 8, 10, 8, 7, '#ffd98a'); R(g, 8, 10, 8, 1, '#c89a4a');
    R(g, 60, 18, 8, 8, bl); disc(g, 67, 19, 3, '#fff2c0'); // headlamp
    R(g, 62, 27, 9, 4, red); for (let i = 0; i < 4; i++) P(g, 63 + i * 2, 30, bl);
    R(g, 2, 28, 66, 3, '#4a2a22');
    [[12, 4], [30, 6], [44, 6], [56, 4]].forEach(([cx, r]) => { disc(g, cx, 33, r, '#1a1a1a'); disc(g, cx, 33, r - 2, red); P(g, cx, 33, brass); });
    R(g, 28, 32, 30, 2, '#9a9a9a');
    outline(c);
    return c;
  };
  A.railcar = function (color) {
    const c = canvas(66, 38);
    const g = c.g;
    R(g, 2, 6, 62, 24, color); R(g, 2, 6, 62, 2, shade(color, 0.2)); R(g, 0, 3, 66, 4, shade(color, -0.4));
    for (let x = 6; x < 60; x += 9) { R(g, x, 11, 6, 7, '#ffd98a'); R(g, x, 11, 6, 1, '#c89a4a'); }
    R(g, 2, 22, 62, 2, '#d8b05a');
    textC(g, 'PULLMAN', 33, 24, '#f3e2b0', 1);
    R(g, 2, 30, 62, 2, '#2a1a14');
    [[10], [22], [44], [56]].forEach(([cx]) => { disc(g, cx, 33, 4, '#1a1a1a'); P(g, cx, 33, '#8a8a8a'); });
    outline(c);
    return c;
  };

  /* =====================================================================
     GROUND TEXTURES (drawn straight into a big world canvas)
     ===================================================================== */
  A.ground = {
    grass(g, x, y, w, h, rnd) {
      R(g, x, y, w, h, PAL.grass[0]);
      for (let i = 0; i < (w * h) / 9; i++) {
        const px = x + ((rnd() * w) | 0), py = y + ((rnd() * h) | 0);
        const t = rnd();
        if (t < 0.4) P(g, px, py, PAL.grass[1]);
        else if (t < 0.7) P(g, px, py, PAL.grass[2]);
        else if (t < 0.78) { P(g, px, py, PAL.grass[4]); P(g, px, py - 1, PAL.grass[1]); }
        else if (t < 0.81) { P(g, px, py, PAL.grass[3]); P(g, px + 1, py - 1, PAL.grass[3]); P(g, px - 1, py - 1, PAL.grass[3]); }
      }
      // little flowers
      for (let i = 0; i < (w * h) / 420; i++) {
        const px = x + ((rnd() * w) | 0), py = y + ((rnd() * h) | 0);
        const col = ['#f4efe0', '#f2c45a', '#e88a7a', '#b88ad6'][(rnd() * 4) | 0];
        P(g, px, py, col); P(g, px + 1, py + 1, PAL.grass[3]);
      }
    },
    brickRoad(g, x, y, w, h, rnd, vertical) {
      R(g, x, y, w, h, '#5e2e26');
      // herringbone-ish running bond
      if (!vertical) {
        for (let yy = 0; yy < h; yy += 4) for (let xx = -((yy / 4) % 2) * 4; xx < w; xx += 8) {
          const c = PAL.brick[(rnd() * 4) | 0];
          const bx = x + xx + 1, by = y + yy + 1;
          const bw = Math.min(7, x + w - bx), bh = Math.min(3, y + h - by);
          if (bw > 0 && bh > 0 && bx >= x) { R(g, bx, by, bw, bh, c); R(g, bx, by, bw, 1, shade(c, 0.12)); }
        }
      } else {
        for (let xx = 0; xx < w; xx += 4) for (let yy = -((xx / 4) % 2) * 4; yy < h; yy += 8) {
          const c = PAL.brick[(rnd() * 4) | 0];
          const bx = x + xx + 1, by = y + yy + 1;
          const bw = Math.min(3, x + w - bx), bh = Math.min(7, y + h - by);
          if (bw > 0 && bh > 0 && by >= y) { R(g, bx, by, bw, bh, c); R(g, bx, by, 1, bh, shade(c, 0.12)); }
        }
      }
      // wear
      for (let i = 0; i < (w * h) / 60; i++) P(g, x + ((rnd() * w) | 0), y + ((rnd() * h) | 0), 'rgba(40,20,16,0.35)');
    },
    sidewalk(g, x, y, w, h, rnd) {
      R(g, x, y, w, h, PAL.stone[3]);
      for (let yy = 0; yy < h; yy += 8) for (let xx = 0; xx < w; xx += 8) {
        const c = rnd() < 0.5 ? PAL.stone[0] : rnd() < 0.5 ? PAL.stone[1] : PAL.stone[2];
        R(g, x + xx, y + yy, Math.min(7, w - xx), Math.min(7, h - yy), c);
        P(g, x + xx, y + yy, PAL.stone[4]);
        if (rnd() < 0.15) P(g, x + xx + 2 + ((rnd() * 4) | 0), y + yy + 2 + ((rnd() * 4) | 0), PAL.stone[3]);
      }
    },
    cobble(g, x, y, w, h, rnd, cx, cy) {
      R(g, x, y, w, h, '#857a68');
      for (let yy = 0; yy < h; yy += 5) for (let xx = ((yy / 5) % 2) * 3; xx < w; xx += 6) {
        const c = ['#c9bda5', '#b8ac94', '#d6cbb3', '#a99d86'][(rnd() * 4) | 0];
        R(g, x + xx, y + yy, Math.min(5, w - xx), Math.min(4, h - yy), c);
        P(g, x + xx, y + yy, '#e4dac4');
      }
      if (cx !== undefined) {
        // decorative compass-rose rings around centre
        g.strokeStyle = 'rgba(122,70,50,0.65)';
        g.lineWidth = 3;
        [70, 46].forEach((r) => { g.beginPath(); g.ellipse(cx, cy, r, r * 0.7, 0, 0, Math.PI * 2); g.stroke(); });
        g.lineWidth = 1;
      }
    },
    dirt(g, x, y, w, h, rnd) {
      R(g, x, y, w, h, '#d6a85e');
      for (let i = 0; i < (w * h) / 8; i++) {
        const t = rnd();
        P(g, x + ((rnd() * w) | 0), y + ((rnd() * h) | 0), t < 0.4 ? '#e6bc74' : t < 0.8 ? '#c4944c' : '#b5843f');
      }
    },
    curb(g, x, y, w, h) { R(g, x, y, w, h, '#7d7262'); R(g, x, y, w, 1, '#d8ccb4'); },
    rail(g, x, y, w) {
      R(g, x, y, w, 14, '#6a5a4a');
      for (let i = 0; i < w; i += 5) { R(g, x + i, y + 1, 3, 12, '#5a3e2a'); R(g, x + i, y + 1, 3, 1, '#7a5a3e'); }
      R(g, x, y + 3, w, 2, '#a0a0a8'); R(g, x, y + 9, w, 2, '#a0a0a8'); R(g, x, y + 3, w, 1, '#dcdce4'); R(g, x, y + 9, w, 1, '#dcdce4');
    },
  };

  /* =====================================================================
     BUILDINGS: generic facade generator with lots of options
     ===================================================================== */
  function wallFill(g, x, y, w, h, spec, rnd) {
    const base = spec.wallColor;
    if (spec.wall === 'brick') {
      R(g, x, y, w, h, shade(base, -0.35));
      for (let yy = 0; yy < h; yy += 4) {
        const off = (yy / 4) % 2 ? 4 : 0;
        for (let xx = -off; xx < w; xx += 8) {
          const c = shade(base, (rnd() - 0.5) * 0.18);
          const bx = Math.max(x, x + xx), bw = Math.min(x + xx + 7, x + w) - bx;
          if (bw > 0) { R(g, bx, y + yy, bw, 3, c); R(g, bx, y + yy, bw, 1, shade(c, 0.1)); }
        }
      }
    } else if (spec.wall === 'clap') {
      for (let yy = 0; yy < h; yy += 4) {
        R(g, x, y + yy, w, 4, base); R(g, x, y + yy, w, 1, shade(base, 0.16)); R(g, x, y + yy + 3, w, 1, shade(base, -0.22));
      }
    } else if (spec.wall === 'stone') {
      R(g, x, y, w, h, base);
      for (let yy = 0; yy < h; yy += 8) {
        R(g, x, y + yy, w, 1, shade(base, -0.16));
        const off = (yy / 8) % 2 ? 8 : 0;
        for (let xx = off; xx < w; xx += 16) R(g, x + xx, y + yy, 1, 8, shade(base, -0.12));
        R(g, x, y + yy + 1, w, 1, shade(base, 0.1));
      }
      for (let i = 0; i < (w * h) / 40; i++) P(g, x + ((rnd() * w) | 0), y + ((rnd() * h) | 0), shade(base, (rnd() - 0.5) * 0.15));
    } else { // smooth / painted
      R(g, x, y, w, h, base);
      for (let yy = 0; yy < h; yy += 6) R(g, x, y + yy, w, 1, shade(base, -0.05));
    }
  }

  function windowAt(g, x, y, w, h, spec, opts) {
    opts = opts || {};
    const trim = spec.trim || '#efe4cc', trimD = shade(trim, -0.3);
    const lit = opts.lit !== false && spec.lit !== false;
    const glassA = lit ? '#ffd683' : '#4a6478', glassB = lit ? '#f0a54a' : '#2f4558';
    // frame
    R(g, x - 1, y - 1, w + 2, h + 2, trim);
    if (opts.arch) ellipse(g, x + w / 2, y, w / 2 + 1, 3, trim);
    // glass gradient
    for (let yy = 0; yy < h; yy++) R(g, x, y + yy, w, 1, mix(glassA, glassB, yy / h));
    if (opts.arch) { ellipse(g, x + w / 2, y, w / 2, 2, glassA); }
    if (!lit) { for (let i = 0; i < Math.min(w, h); i++) P(g, x + i, y + h - 1 - i, '#7a96a8'); }
    // curtains
    if (lit && opts.curtain !== false) { R(g, x, y, 1, h, spec.curtain || '#b0473a'); R(g, x + w - 1, y, 1, h, spec.curtain || '#b0473a'); }
    // muntins
    if (w >= 6) R(g, x + Math.floor(w / 2), y, 1, h, trim);
    if (h >= 8) R(g, x, y + Math.floor(h / 2), w, 1, trim);
    // sill + lintel
    R(g, x - 2, y + h + 1, w + 4, 2, trim); R(g, x - 2, y + h + 2, w + 4, 1, trimD);
    if (!opts.arch && opts.lintel !== false) { R(g, x - 1, y - 3, w + 2, 2, shade(spec.wallColor, -0.25)); if (opts.keystone) R(g, x + w / 2 - 1, y - 4, 3, 3, trim); }
    if (opts.flowerbox) { R(g, x - 1, y + h + 3, w + 2, 3, '#7a4a2a'); for (let i = 0; i < w + 2; i += 2) P(g, x - 1 + i, y + h + 2, ['#e86a5a', '#f2c45a', '#f7f0e0'][i % 3]); }
  }
  A.windowAt = windowAt;

  function doorAt(g, x, y, w, h, spec) {
    const fr = spec.trim || '#efe4cc';
    const wood = spec.doorColor || '#6a3e26', woodL = shade(wood, 0.2), woodD = shade(wood, -0.3);
    R(g, x - 2, y - 6, w + 4, h + 6, fr);
    R(g, x, y - 4, w, 3, '#ffd683'); R(g, x + Math.floor(w / 2), y - 4, 1, 3, fr);
    R(g, x, y, w, h, wood);
    const half = Math.floor(w / 2);
    R(g, x + half, y, 1, h, woodD);
    [[x + 1, half - 2], [x + half + 1, w - half - 2]].forEach(([dx, dw]) => {
      R(g, dx, y + 2, dw, Math.floor(h / 2) - 3, '#ffd683'); R(g, dx, y + 2, dw, 1, '#f3b65a');
      R(g, dx, y + Math.floor(h / 2) + 1, dw, Math.floor(h / 2) - 3, woodD); R(g, dx, y + Math.floor(h / 2) + 1, dw, 1, woodL);
    });
    P(g, x + half - 2, y + Math.floor(h / 2), PAL.gold); P(g, x + half + 2, y + Math.floor(h / 2), PAL.gold);
  }
  A.doorAt = doorAt;

  function roofBlock(g, W, roofH, spec, rnd) {
    const rc = spec.roofColor || '#4b5f6a';
    if (spec.roof === 'flat' || spec.roof === 'dome' || spec.roof === 'pediment') {
      // tar roof surface seen from above
      R(g, 4, 6, W - 8, roofH - 6, shade(rc, -0.05));
      for (let i = 0; i < (W * roofH) / 18; i++) P(g, 4 + ((rnd() * (W - 8)) | 0), 6 + ((rnd() * (roofH - 6)) | 0), shade(rc, (rnd() - 0.5) * 0.3));
      R(g, 4, 6, W - 8, 2, shade(rc, -0.3));
      // skylight / vents
      if (spec.vents !== false) { R(g, 14, 10, 8, 5, '#6a6a6a'); R(g, 14, 10, 8, 1, '#8a8a8a'); R(g, W - 24, 12, 6, 4, '#5a5a5a'); }
      // parapet
      const pc = spec.parapet || shade(spec.wallColor, -0.1);
      R(g, 2, roofH - 4, W - 4, 4, pc); R(g, 2, roofH - 4, W - 4, 1, shade(pc, 0.25));
      R(g, 2, 4, 3, roofH - 4, pc); R(g, W - 5, 4, 3, roofH - 4, pc); R(g, 2, 4, W - 4, 3, pc); R(g, 2, 4, W - 4, 1, shade(pc, 0.25));
    } else {
      // hipped / gabled shingle roof
      const rows = Math.ceil(roofH / 4);
      for (let r = 0; r < rows; r++) {
        const yy = r * 4;
        const inset = spec.roof === 'hip' ? Math.max(0, Math.round((rows - r - 1) * 2.2)) : 0;
        const x0 = 1 + inset, x1 = W - 1 - inset;
        const rowC = shade(rc, (r / rows) * 0.12 - 0.04);
        R(g, x0, yy, x1 - x0, 4, rowC);
        for (let xx = x0 + ((r % 2) * 3); xx < x1; xx += 6) {
          R(g, xx, yy + 3, 1, 1, shade(rc, -0.35));
          R(g, xx + 1, yy, 4, 1, shade(rowC, 0.12));
          if (rnd() < 0.18) R(g, xx + 1, yy + 1, 4, 2, shade(rowC, -0.1));
        }
        R(g, x0, yy + 3, x1 - x0, 1, shade(rc, -0.28));
      }
      // ridge
      const ri = spec.roof === 'hip' ? Math.round((rows - 1) * 2.2) : 0;
      R(g, 1 + ri, 0, W - 2 - ri * 2, 2, shade(rc, 0.25));
      // fascia / eave
      R(g, 0, roofH - 2, W, 2, spec.fascia || shade(rc, -0.45));
      if (spec.gable) {
        // centred front gable dormer
        const gw = spec.gable, gx = (W - gw) / 2;
        for (let i = 0; i < gw / 2; i++) R(g, gx + i, roofH - 2 - i, gw - i * 2, 1, shade(rc, 0.05));
        const ty = roofH - 2 - Math.floor(gw / 2) + 4;
        for (let i = 2; i < gw / 2 - 2; i++) R(g, gx + i, roofH - 3 - i + 2, gw - i * 2, 1, spec.gableFill || spec.wallColor);
        windowAt(g, W / 2 - 3, ty + 4, 6, 6, spec, { lintel: false, curtain: false });
      }
    }
  }

  /*
    spec = {
      w: facade width (px), wallH, roofH, roof:'hip'|'gable'|'flat'|'dome'|'pediment',
      wall:'brick'|'clap'|'stone'|'smooth', wallColor, trim, roofColor,
      floors: [{y, windows:[{x,w,h,arch,keystone,flowerbox}] }],
      door:{w,h, x (centre offset)}, sign:{text, y, scale, bg, fg, border}, columns:{n, x0, x1, top, color},
      chimney:{x}, awning:{x,w,y,c1,c2}, extras:function(g, L){}
    }
  */
  A.building = function (spec, seed) {
    const rnd = RNG(seed || 7);
    const W = spec.w + 8;
    const roofH = spec.roofH;
    const H = roofH + spec.wallH + 8;
    const c = canvas(W, H + (spec.extraTop || 0));
    const g = c.g;
    if (spec.extraTop) g.translate(0, spec.extraTop);
    const L = { W, H, roofH, wx: 4, wy: roofH, ww: spec.w, wh: spec.wallH, lights: [] };
    // chimney behind roof
    if (spec.chimney) {
      const cx = spec.chimney.x;
      R(g, cx, -6, 8, roofH, '#8a4234'); R(g, cx, -6, 8, 1, '#b8664c'); R(g, cx - 1, -8, 10, 3, '#5a5a5a');
    }
    roofBlock(g, W, roofH, spec, rnd);
    // wall
    wallFill(g, L.wx, L.wy, L.ww, L.wh, spec, rnd);
    // corner pilasters
    if (spec.pilasters !== false) {
      const pc = spec.pilasterColor || shade(spec.wallColor, spec.wall === 'brick' ? 0.25 : -0.12);
      R(g, L.wx, L.wy, 4, L.wh, pc); R(g, L.wx + L.ww - 4, L.wy, 4, L.wh, pc);
      R(g, L.wx + L.ww - 1, L.wy, 1, L.wh, shade(pc, -0.3));
      R(g, L.wx, L.wy, 1, L.wh, shade(pc, 0.2));
    }
    // cornice band under roof
    const cc = spec.cornice || spec.trim || '#efe4cc';
    R(g, 2, L.wy, W - 4, 3, cc); R(g, 2, L.wy + 3, W - 4, 1, shade(cc, -0.35));
    if (spec.dentils !== false) for (let x = 4; x < W - 4; x += 3) P(g, x, L.wy + 4, shade(cc, -0.2));
    // under-eave shadow
    g.fillStyle = 'rgba(30,14,20,0.28)'; g.fillRect(L.wx, L.wy + 5, L.ww, 2);
    // floors / windows
    (spec.floors || []).forEach((fl) => {
      if (fl.band) { R(g, L.wx, L.wy + fl.y - 4, L.ww, 2, shade(cc, -0.1)); }
      fl.windows.forEach((w) => {
        windowAt(g, L.wx + w.x, L.wy + fl.y, w.w, w.h, spec, w);
        if (spec.lit !== false && w.lit !== false) L.lights.push([L.wx + w.x + w.w / 2, L.wy + fl.y + w.h / 2, Math.max(w.w, w.h) * 1.6]);
      });
    });
    // columns
    if (spec.columns) {
      const co = spec.columns;
      const col = co.color || '#f3ecdc', colD = shade(col, -0.25), colDD = shade(col, -0.45);
      const top = L.wy + (co.top || 6), bottom = L.wy + L.wh - 6;
      // portico shadow
      g.fillStyle = 'rgba(30,14,20,0.32)'; g.fillRect(L.wx + co.x0 - 2, top, co.x1 - co.x0 + 4, bottom - top);
      for (let i = 0; i < co.n; i++) {
        const x = Math.round(L.wx + co.x0 + (i * (co.x1 - co.x0 - 6)) / (co.n - 1));
        R(g, x, top, 6, bottom - top, col); R(g, x + 4, top, 2, bottom - top, colD); R(g, x + 1, top, 1, bottom - top, '#ffffff');
        for (let yy = top + 3; yy < bottom - 2; yy += 3) P(g, x + 3, yy, colD);
        R(g, x - 1, top, 8, 2, col); R(g, x - 1, top + 2, 8, 1, colDD); R(g, x - 1, bottom - 2, 8, 2, col); R(g, x - 1, bottom - 1, 8, 1, colDD);
      }
      // entablature (taller when it carries an engraved frieze)
      const eh = co.frieze ? 10 : 4;
      R(g, L.wx + co.x0 - 4, top - eh, co.x1 - co.x0 + 8, eh, col); R(g, L.wx + co.x0 - 4, top - 1, co.x1 - co.x0 + 8, 1, colDD);
      R(g, L.wx + co.x0 - 4, top - eh, co.x1 - co.x0 + 8, 1, '#ffffff');
      if (co.frieze) textC(g, co.frieze, L.wx + (co.x0 + co.x1) / 2, top - eh + 3, co.friezeColor || shade(col, -0.55), 1);
      if (co.pediment) {
        const pw = co.x1 - co.x0 + 12, px = L.wx + co.x0 - 6, ph = Math.round(pw / 5);
        const base = top - eh;
        for (let i = 0; i < ph; i++) {
          const inset = Math.round(((ph - 1 - i) / ph) * (pw / 2));
          R(g, px + inset, base - ph + i, pw - inset * 2, 1, i < 2 ? col : shade(col, -0.06));
        }
        for (let i = 0; i < ph; i++) { const inset = Math.round(((ph - 1 - i) / ph) * (pw / 2)); P(g, px + inset, base - ph + i, colDD); P(g, px + pw - inset - 1, base - ph + i, colDD); }
        R(g, px, base - 1, pw, 1, colDD);
        if (co.emblem) co.emblem(g, px + pw / 2, base - ph / 2.6);
      }
    }
    // door
    if (spec.door) {
      const d = spec.door;
      const dx = Math.round(L.wx + L.ww / 2 - d.w / 2 + (d.x || 0));
      const dy = L.wy + L.wh - d.h;
      doorAt(g, dx, dy, d.w, d.h, spec);
      L.door = { x: dx + d.w / 2, y: L.wy + L.wh, h: d.h };
      L.lights.push([dx + d.w / 2, dy - 3, 18]);
    }
    // awning
    if (spec.awning) {
      const a = spec.awning;
      for (let x = 0; x < a.w; x++) {
        const col = Math.floor(x / 4) % 2 ? a.c1 : a.c2;
        R(g, L.wx + a.x + x, L.wy + a.y, 1, 6, col);
        P(g, L.wx + a.x + x, L.wy + a.y + 6 + (x % 4 === 1 || x % 4 === 2 ? 1 : 0), col);
      }
      R(g, L.wx + a.x, L.wy + a.y, a.w, 1, shade(a.c1, 0.3));
      g.fillStyle = 'rgba(30,14,20,0.25)'; g.fillRect(L.wx + a.x, L.wy + a.y + 8, a.w, 2);
    }
    // foundation + steps
    R(g, L.wx - 1, L.wy + L.wh - 1, L.ww + 2, 3, PAL.stone[3]);
    R(g, L.wx - 1, L.wy + L.wh - 1, L.ww + 2, 1, PAL.stone[2]);
    if (spec.door) {
      const sw = spec.door.w + 12, sx = Math.round(L.door.x - sw / 2);
      R(g, sx, L.wy + L.wh, sw, 3, PAL.stone[0]); R(g, sx, L.wy + L.wh, sw, 1, PAL.stone[4]);
      R(g, sx - 3, L.wy + L.wh + 3, sw + 6, 3, PAL.stone[1]); R(g, sx - 3, L.wy + L.wh + 3, sw + 6, 1, PAL.stone[2]);
    }
    // sign
    if (spec.sign) {
      const s = spec.sign, sc = s.scale || 1;
      const tw = textWidth(s.text, sc);
      const sw = tw + 8 * sc, sh = 5 * sc + 6;
      const sx = Math.round(W / 2 - sw / 2 + (s.x || 0)), sy = L.wy + s.y;
      R(g, sx - 1, sy - 1, sw + 2, sh + 2, s.border || '#2a1a1c');
      R(g, sx, sy, sw, sh, s.bg || '#2c3d38');
      R(g, sx + 1, sy + 1, sw - 2, 1, shade(s.bg || '#2c3d38', 0.2));
      textC(g, s.text, sx + sw / 2, sy + 3, s.fg || PAL.gold, sc, s.shadow || 'rgba(0,0,0,0.45)');
    }
    if (spec.extras) spec.extras(g, L, rnd);
    if (spec.extraTop) g.setTransform(1, 0, 0, 1, 0, 0);
    outline(c);
    L.canvas = c;
    L.extraTop = spec.extraTop || 0;
    return L;
  };

  /* ---------- an exhibit banner hanging by a door ---------- */
  A.banner = function (num, color) {
    const c = canvas(14, 30);
    const g = c.g;
    R(g, 0, 0, 14, 2, '#3a2a1c');
    R(g, 2, 2, 10, 22, color); R(g, 2, 2, 2, 22, shade(color, 0.2)); R(g, 10, 2, 2, 22, shade(color, -0.25));
    P(g, 2, 24, color); P(g, 3, 25, color); R(g, 4, 24, 6, 1, color); P(g, 11, 24, color); P(g, 10, 25, color);
    R(g, 3, 4, 8, 1, PAL.gold); R(g, 3, 21, 8, 1, PAL.gold);
    textC(g, String(num), 7, 9, '#fff3d0', 2);
    outline(c);
    return c;
  };

  /* =====================================================================
     INTERIOR FURNITURE
     ===================================================================== */
  const F = (A.furn = {});
  const wood = '#7a4a2c', woodL = '#9c6438', woodD = '#52301c', woodDD = '#3a2012';

  F.desk = function (w, opts) {
    opts = opts || {};
    w = w || 48;
    const c = canvas(w, 30);
    const g = c.g;
    const top = opts.color || wood;
    R(g, 1, 4, w - 2, 8, shade(top, 0.15)); R(g, 1, 4, w - 2, 1, shade(top, 0.35));
    R(g, 1, 12, w - 2, 14, top); R(g, 1, 12, w - 2, 1, shade(top, -0.3));
    R(g, 4, 15, 12, 4, shade(top, -0.15)); R(g, w - 16, 15, 12, 4, shade(top, -0.15)); P(g, 10, 17, PAL.gold); P(g, w - 10, 17, PAL.gold);
    R(g, 4, 20, 12, 4, shade(top, -0.15)); R(g, w - 16, 20, 12, 4, shade(top, -0.15)); P(g, 10, 22, PAL.gold); P(g, w - 10, 22, PAL.gold);
    R(g, 1, 26, w - 2, 2, shade(top, -0.45));
    if (opts.green) { R(g, 6, 5, w - 12, 6, '#3f6a4a'); R(g, 6, 5, w - 12, 1, '#5a8a62'); }
    outline(c);
    return { c, ax: w / 2, ay: 28 };
  };

  F.table = function (w, h, color, cloth) {
    const c = canvas(w, h + 10);
    const g = c.g;
    const col = color || wood;
    R(g, 1, 1, w - 2, h, cloth || shade(col, 0.12)); R(g, 1, 1, w - 2, 1, shade(cloth || col, 0.3));
    R(g, 1, h, w - 2, 4, shade(col, -0.2));
    R(g, 3, h + 3, 3, 6, woodD); R(g, w - 6, h + 3, 3, 6, woodD);
    outline(c);
    return { c, ax: w / 2, ay: h + 8 };
  };

  F.chair = function (dir, color) {
    const c = canvas(14, 20);
    const g = c.g;
    const col = color || '#7a3a2e';
    if (dir === 'up') { // back toward viewer
      R(g, 2, 2, 10, 9, woodD); R(g, 3, 3, 8, 7, col); R(g, 3, 3, 8, 1, shade(col, 0.25));
      R(g, 2, 11, 10, 3, woodD); R(g, 2, 14, 2, 5, woodDD); R(g, 10, 14, 2, 5, woodDD);
    } else {
      R(g, 2, 1, 10, 6, woodD); R(g, 3, 2, 8, 4, col);
      R(g, 1, 8, 12, 5, col); R(g, 1, 8, 12, 1, shade(col, 0.25)); R(g, 1, 13, 12, 2, woodD);
      R(g, 2, 15, 2, 4, woodDD); R(g, 10, 15, 2, 4, woodDD);
    }
    outline(c);
    return { c, ax: 7, ay: 18 };
  };

  F.bookshelf = function (w, seed) {
    const rnd = RNG(seed || 11);
    w = w || 32;
    const c = canvas(w, 44);
    const g = c.g;
    R(g, 1, 1, w - 2, 42, woodD); R(g, 1, 1, w - 2, 2, woodL); R(g, 1, 1, 2, 42, wood); R(g, w - 3, 1, 2, 42, woodDD);
    const cols = ['#7a2630', '#2c4a6a', '#3e6a3e', '#b0863a', '#5a3a6a', '#8a5a2a', '#e8dcc0', '#1e3a3a'];
    for (let s = 0; s < 4; s++) {
      const sy = 4 + s * 10;
      R(g, 3, sy + 8, w - 6, 2, wood);
      let x = 3;
      while (x < w - 4) {
        const bw = 2 + ((rnd() * 2) | 0), bh = 5 + ((rnd() * 3) | 0);
        if (rnd() < 0.08) { x += 3; continue; }
        const col = cols[(rnd() * cols.length) | 0];
        R(g, x, sy + 8 - bh, bw, bh, col); R(g, x, sy + 8 - bh, 1, bh, shade(col, 0.25));
        if (bh > 6) P(g, x, sy + 8 - bh + 2, PAL.gold);
        x += bw;
      }
    }
    outline(c);
    return { c, ax: w / 2, ay: 43 };
  };

  F.cabinet = function () {
    const c = canvas(18, 32);
    const g = c.g;
    const m = '#5a6a6a', mL = '#7a8c8a', mD = '#3c4848';
    R(g, 1, 1, 16, 30, m); R(g, 1, 1, 16, 1, mL); R(g, 15, 1, 2, 30, mD);
    for (let i = 0; i < 4; i++) { R(g, 3, 3 + i * 7, 11, 6, mL); R(g, 3, 8 + i * 7, 11, 1, mD); R(g, 7, 5 + i * 7, 4, 1, '#d8c890'); R(g, 6, 3 + i * 7 + 1, 6, 2, '#efe6cc'); }
    outline(c);
    return { c, ax: 9, ay: 31 };
  };

  F.typewriterDesk = function () {
    const d = F.desk(40, {});
    const g = d.c.g;
    R(g, 13, 2, 14, 7, '#2a2a2e'); R(g, 13, 2, 14, 1, '#4a4a52'); R(g, 15, 0, 10, 3, '#efe6cc');
    for (let x = 14; x < 26; x += 2) P(g, x, 7, '#c8c0a8');
    R(g, 31, 4, 6, 4, '#efe6cc'); R(g, 30, 6, 6, 3, '#e4dac0'); // papers
    R(g, 4, 3, 2, 6, '#2a2a2a'); disc(g, 5, 2, 2, '#2a2a2a'); // telephone
    return d;
  };

  F.bankerLamp = function () {
    const c = canvas(12, 14);
    const g = c.g;
    R(g, 5, 6, 2, 6, PAL.goldD); R(g, 3, 11, 6, 2, PAL.goldD);
    ellipse(g, 6, 5, 5, 2, '#2f6a44'); R(g, 1, 4, 10, 2, '#3e8a58'); R(g, 2, 3, 8, 1, '#5aa874');
    outline(c);
    return { c, ax: 6, ay: 13 };
  };

  F.plant = function (seed) {
    const rnd = RNG(seed || 5);
    const c = canvas(22, 34);
    const g = c.g;
    R(g, 6, 22, 10, 10, '#8a4a30'); R(g, 5, 22, 12, 2, '#a85a3a'); R(g, 6, 24, 3, 8, '#a85a3a');
    for (let i = 0; i < 9; i++) {
      const ang = -Math.PI / 2 + (i - 4) * 0.33 + (rnd() - 0.5) * 0.2;
      const len = 13 + rnd() * 6;
      for (let t = 0; t < len; t++) {
        const x = 11 + Math.cos(ang) * t, y = 22 + Math.sin(ang) * t + (t * t) / 40;
        P(g, Math.round(x), Math.round(y), t > len * 0.5 ? PAL.leaf[1] : PAL.leaf[0]);
        if (t > 3 && t % 2) { P(g, Math.round(x + 1), Math.round(y), PAL.leaf[2]); P(g, Math.round(x - 1), Math.round(y + 1), PAL.leaf[4]); }
      }
    }
    outline(c);
    return { c, ax: 11, ay: 32 };
  };

  F.gramophone = function () {
    const c = canvas(30, 40);
    const g = c.g;
    // pedestal
    R(g, 6, 26, 18, 13, woodD); R(g, 6, 26, 18, 2, woodL); R(g, 8, 29, 14, 8, wood);
    // box
    R(g, 7, 18, 16, 8, wood); R(g, 7, 18, 16, 2, woodL); ellipse(g, 15, 18, 7, 2, '#1a1a1a');
    // horn
    R(g, 18, 11, 2, 8, PAL.goldD);
    for (let i = 0; i < 10; i++) { const r = 2 + i * 0.9; ellipse(g, 20 + i, 10 - i * 0.6, r * 0.5, r, i % 2 ? PAL.gold : '#f0cf78'); }
    ellipse(g, 29, 4, 2, 7, '#7a5a22');
    outline(c);
    return { c, ax: 15, ay: 39 };
  };

  F.radioMic = function () {
    const c = canvas(28, 44);
    const g = c.g;
    // podium
    R(g, 3, 18, 22, 24, wood); R(g, 3, 18, 22, 2, woodL); R(g, 1, 16, 26, 3, woodL); R(g, 7, 22, 14, 14, woodD);
    disc(g, 14, 29, 4, PAL.gold); P(g, 14, 29, '#7a2630');
    // microphones (early carbon/condenser style)
    [[8, 4], [14, 2], [20, 4]].forEach(([x, y]) => { R(g, x, y + 6, 1, 10, '#2a2a2a'); disc(g, x, y + 3, 3, '#3a3a40'); R(g, x - 2, y + 2, 5, 2, '#9a9aa2'); });
    outline(c);
    return { c, ax: 14, ay: 42 };
  };

  F.ticker = function () {
    const c = canvas(18, 34);
    const g = c.g;
    R(g, 6, 14, 6, 18, woodD); R(g, 3, 30, 12, 3, woodD);
    ellipse(g, 9, 9, 7, 9, 'rgba(220,240,255,0.55)'); R(g, 4, 10, 10, 5, PAL.goldD); R(g, 5, 9, 8, 2, PAL.gold);
    for (let i = 0; i < 8; i++) P(g, 14 + (i % 3), 15 + i * 2, '#f3ecd8');
    outline(c);
    return { c, ax: 9, ay: 33 };
  };

  F.globe = function () {
    const c = canvas(20, 32);
    const g = c.g;
    R(g, 8, 20, 4, 9, woodD); R(g, 4, 28, 12, 3, woodD);
    disc(g, 10, 11, 8, '#3e6a8a'); disc(g, 9, 10, 6, '#4f80a6');
    R(g, 5, 8, 4, 3, '#8aa860'); R(g, 11, 12, 4, 4, '#8aa860'); R(g, 7, 14, 2, 2, '#c8a860');
    g.strokeStyle = PAL.goldD; g.beginPath(); g.arc(10, 11, 9.5, -1.2, 1.9); g.stroke();
    outline(c);
    return { c, ax: 10, ay: 31 };
  };

  F.easel = function (inner) {
    const c = canvas(30, 44);
    const g = c.g;
    R(g, 5, 10, 2, 33, woodD); R(g, 23, 10, 2, 33, woodD); R(g, 14, 6, 2, 37, wood);
    R(g, 3, 6, 24, 22, '#d8c8a0'); R(g, 3, 6, 24, 22, '#3a2a1c'); R(g, 4, 7, 22, 20, '#efe4cc');
    if (inner) inner(g, 5, 8, 20, 18);
    R(g, 2, 27, 26, 2, woodL);
    outline(c);
    return { c, ax: 15, ay: 43 };
  };

  F.vitrine = function (inner, w) {
    w = w || 30;
    const c = canvas(w, 36);
    const g = c.g;
    R(g, 2, 20, w - 4, 15, woodD); R(g, 2, 20, w - 4, 2, woodL); R(g, 4, 24, w - 8, 9, wood);
    R(g, 3, 4, w - 6, 17, 'rgba(200,230,240,0.35)');
    if (inner) inner(g, 5, 8, w - 10, 12);
    R(g, 3, 4, w - 6, 1, '#e8f6fa'); R(g, 3, 4, 1, 17, '#e8f6fa'); R(g, w - 4, 4, 1, 17, '#9ab8c0');
    for (let i = 0; i < 6; i++) P(g, 6 + i, 6 + i, 'rgba(255,255,255,0.7)');
    outline(c);
    return { c, ax: w / 2, ay: 35 };
  };

  F.stanchion = function (len) {
    const c = canvas(len, 18);
    const g = c.g;
    [1, len - 5].forEach((x) => { R(g, x + 1, 4, 2, 12, PAL.goldD); disc(g, x + 2, 3, 2, PAL.gold); R(g, x, 15, 4, 2, PAL.goldD); });
    for (let x = 4; x < len - 4; x++) { const y = 5 + Math.round(Math.sin(((x - 4) / (len - 8)) * Math.PI) * 4); R(g, x, y, 1, 2, '#8a1e2a'); }
    outline(c);
    return { c, ax: len / 2, ay: 16 };
  };

  F.benchStation = function (w) {
    const c = canvas(w, 22);
    const g = c.g;
    R(g, 1, 1, w - 2, 9, woodD); R(g, 2, 2, w - 4, 6, wood); for (let x = 2; x < w - 2; x += 6) R(g, x, 2, 1, 6, woodD);
    R(g, 0, 10, w, 5, woodL); R(g, 0, 10, w, 1, '#c88c58'); R(g, 0, 15, w, 2, woodD);
    for (let x = 2; x < w; x += Math.max(14, (w - 4) / 3)) R(g, x, 16, 3, 5, woodDD);
    R(g, w - 5, 16, 3, 5, woodDD);
    outline(c);
    return { c, ax: w / 2, ay: 20 };
  };

  F.trunk = function (color) {
    const c = canvas(22, 18);
    const g = c.g;
    const col = color || '#6a3a2a';
    R(g, 1, 3, 20, 13, col); R(g, 1, 3, 20, 2, shade(col, 0.25)); R(g, 1, 9, 20, 1, PAL.goldD);
    R(g, 5, 3, 2, 13, '#3a2418'); R(g, 15, 3, 2, 13, '#3a2418'); R(g, 10, 8, 3, 3, PAL.gold);
    outline(c);
    return { c, ax: 11, ay: 16 };
  };

  F.press = function () { // printing press
    const c = canvas(44, 40);
    const g = c.g;
    R(g, 2, 14, 40, 22, '#2e3436'); R(g, 2, 14, 40, 2, '#4e5658');
    disc(g, 12, 22, 8, '#3a4244'); disc(g, 12, 22, 6, '#5a6264'); R(g, 11, 15, 2, 14, '#2a2a2a'); R(g, 5, 21, 14, 2, '#2a2a2a');
    R(g, 24, 8, 16, 14, '#efe6cc'); R(g, 24, 8, 16, 1, '#ffffff'); for (let y = 11; y < 20; y += 2) R(g, 26, y, 12, 1, '#8a8478');
    R(g, 2, 34, 40, 4, '#1e2224');
    outline(c);
    return { c, ax: 22, ay: 38 };
  };

  F.corkBoard = function (w, h) {
    const c = canvas(w, h);
    const g = c.g;
    const rnd = RNG(19);
    R(g, 0, 0, w, h, woodD); R(g, 2, 2, w - 4, h - 4, '#b98a52');
    for (let i = 0; i < (w * h) / 6; i++) P(g, 2 + ((rnd() * (w - 4)) | 0), 2 + ((rnd() * (h - 4)) | 0), rnd() < 0.5 ? '#a87a44' : '#c89a62');
    const notes = [[6, 5, 12, 10, '#efe6cc'], [22, 4, 10, 13, '#e8dcbc'], [36, 6, 12, 9, '#efe6cc'], [52, 4, 11, 12, '#f2e2a8'], [8, 20, 14, 10, '#efe6cc'], [28, 21, 12, 9, '#e8dcbc'], [44, 19, 12, 12, '#efe6cc']];
    const pins = [];
    notes.forEach(([x, y, nw, nh, col]) => {
      if (x + nw > w - 2 || y + nh > h - 2) return;
      R(g, x, y, nw, nh, col);
      for (let yy = y + 3; yy < y + nh - 1; yy += 2) R(g, x + 2, yy, nw - 4, 1, '#9a9282');
      P(g, x + nw / 2, y + 1, '#c8302e');
      pins.push([x + nw / 2, y + 1]);
    });
    g.strokeStyle = '#c8302e';
    g.beginPath();
    for (let i = 0; i < pins.length - 1; i++) { g.moveTo(pins[i][0] + 0.5, pins[i][1] + 0.5); g.lineTo(pins[(i + 3) % pins.length][0] + 0.5, pins[(i + 3) % pins.length][1] + 0.5); }
    g.stroke();
    return c;
  };

  F.fireplace = function () {
    const c = canvas(36, 34);
    const g = c.g;
    R(g, 1, 4, 34, 30, '#e8dcc4'); R(g, 0, 2, 36, 4, '#f4ecd8'); R(g, 0, 5, 36, 1, '#b8ac94');
    R(g, 8, 12, 20, 22, '#2a1a14'); R(g, 6, 10, 24, 2, '#c8bca4');
    return c;
  };

  F.clock = function () {
    const c = canvas(18, 18);
    const g = c.g;
    disc(g, 9, 9, 8, PAL.goldD); disc(g, 9, 9, 6, '#f6eedc');
    R(g, 9, 4, 1, 5, '#2a1a1a'); R(g, 9, 9, 3, 1, '#2a1a1a');
    for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; P(g, Math.round(9 + Math.cos(a) * 5), Math.round(9 + Math.sin(a) * 5), '#6a5a4a'); }
    outline(c);
    return c;
  };

  F.portrait = function (w, h, inner) {
    const c = canvas(w, h);
    const g = c.g;
    R(g, 0, 0, w, h, PAL.goldD); R(g, 1, 1, w - 2, h - 2, PAL.gold); R(g, 3, 3, w - 6, h - 6, '#3a2a24');
    if (inner) inner(g, 3, 3, w - 6, h - 6);
    else {
      // generic oil portrait silhouette
      R(g, 3, 3, w - 6, h - 6, '#4a3a2a');
      disc(g, w / 2, h * 0.42, w * 0.16, '#d8b494'); R(g, w / 2 - w * 0.25, h * 0.62, w * 0.5, h * 0.3, '#2a2a2e');
    }
    return c;
  };

  F.rug = function (w, h, c1, c2, border) {
    const c = canvas(w, h);
    const g = c.g;
    R(g, 0, 0, w, h, border || PAL.goldD); R(g, 2, 2, w - 4, h - 4, c1); R(g, 4, 4, w - 8, h - 8, c2 || c1);
    R(g, 6, 6, w - 12, h - 12, c1);
    for (let x = 8; x < w - 8; x += 6) { P(g, x, 5, border || PAL.gold); P(g, x, h - 6, border || PAL.gold); }
    for (let y = 8; y < h - 8; y += 6) { P(g, 5, y, border || PAL.gold); P(g, w - 6, y, border || PAL.gold); }
    return c;
  };

  F.ovalRug = function (w, h, c1, c2) {
    const c = canvas(w, h);
    const g = c.g;
    ellipse(g, w / 2, h / 2, w / 2 - 1, h / 2 - 1, PAL.gold);
    ellipse(g, w / 2, h / 2, w / 2 - 3, h / 2 - 3, c1);
    ellipse(g, w / 2, h / 2, w / 2 - 8, h / 2 - 7, c2);
    ellipse(g, w / 2, h / 2, w / 6, h / 5, PAL.goldD);
    ellipse(g, w / 2, h / 2, w / 6 - 2, h / 5 - 2, c1);
    // stars ring
    for (let i = 0; i < 13; i++) { const a = (i / 13) * Math.PI * 2; P(g, Math.round(w / 2 + Math.cos(a) * (w / 2 - 12)), Math.round(h / 2 + Math.sin(a) * (h / 2 - 10)), '#f6e6b0'); }
    return c;
  };

  F.chandelier = function () {
    const c = canvas(26, 16);
    const g = c.g;
    R(g, 12, 0, 2, 5, PAL.goldD);
    ellipse(g, 13, 8, 10, 3, PAL.gold); ellipse(g, 13, 8, 8, 2, PAL.goldD);
    [3, 8, 13, 18, 23].forEach((x) => { R(g, x - 1, 3, 2, 4, '#fff6d8'); P(g, x - 1, 2, '#ffe08a'); });
    for (let i = 0; i < 6; i++) P(g, 5 + i * 3, 11 + (i % 2), '#e8f4ff');
    outline(c);
    return { c, ax: 13, ay: 15 };
  };

  F.judgeBench = function (w) {
    const c = canvas(w, 46);
    const g = c.g;
    R(g, 1, 10, w - 2, 34, woodD); R(g, 1, 8, w - 2, 4, woodL); R(g, 1, 8, w - 2, 1, '#c88c58');
    for (let x = 6; x < w - 10; x += 16) { R(g, x, 16, 12, 22, wood); R(g, x, 16, 12, 1, woodL); R(g, x + 11, 16, 1, 22, woodDD); }
    // seal
    disc(g, w / 2, 26, 7, PAL.goldD); disc(g, w / 2, 26, 5, PAL.gold);
    R(g, w / 2 - 3, 25, 6, 1, PAL.goldD); R(g, w / 2, 22, 1, 7, PAL.goldD); // scales
    P(g, w / 2 - 3, 27, PAL.goldD); P(g, w / 2 + 3, 27, PAL.goldD);
    // judge chair back
    R(g, w / 2 - 8, 0, 16, 9, '#5a1e24'); R(g, w / 2 - 8, 0, 16, 1, '#8a3a3a');
    R(g, w / 2 + 12, 4, 5, 4, '#3a2214'); // gavel
    outline(c);
    return { c, ax: w / 2, ay: 44 };
  };

  F.cardCatalog = function () {
    const c = canvas(34, 34);
    const g = c.g;
    R(g, 1, 1, 32, 32, wood); R(g, 1, 1, 32, 2, woodL); R(g, 30, 1, 3, 32, woodD);
    for (let y = 0; y < 5; y++) for (let x = 0; x < 4; x++) { R(g, 3 + x * 7, 5 + y * 5, 6, 4, woodL); P(g, 5 + x * 7, 7 + y * 5, PAL.gold); R(g, 4 + x * 7, 6 + y * 5, 4, 1, '#efe6cc'); }
    R(g, 1, 30, 32, 3, woodDD);
    outline(c);
    return { c, ax: 17, ay: 33 };
  };

  F.projector = function () {
    const c = canvas(26, 34);
    const g = c.g;
    R(g, 11, 16, 3, 14, '#2a2a2a'); R(g, 6, 28, 14, 4, '#2a2a2a'); R(g, 7, 30, 2, 2, '#4a4a4a');
    R(g, 3, 8, 18, 9, '#3a3a40'); R(g, 3, 8, 18, 1, '#5a5a66'); R(g, 21, 10, 4, 5, '#6a6a72'); disc(g, 24, 12, 2, '#fff2c0');
    disc(g, 7, 5, 4, '#2a2a2e'); disc(g, 16, 5, 4, '#2a2a2e'); P(g, 7, 5, '#8a8a8a'); P(g, 16, 5, '#8a8a8a');
    outline(c);
    return { c, ax: 12, ay: 32 };
  };

  F.plaque = function (w, h, col) {
    const c = canvas(w, h);
    const g = c.g;
    R(g, 0, 0, w, h, PAL.goldD); R(g, 1, 1, w - 2, h - 2, col || '#2c3d38');
    R(g, 1, 1, w - 2, 1, PAL.gold);
    for (let y = 4; y < h - 3; y += 3) R(g, 3, y, w - 6, 1, 'rgba(240,220,170,0.55)');
    return c;
  };

  F.wheat = function () {
    const c = canvas(26, 26);
    const g = c.g;
    R(g, 2, 14, 22, 11, '#a87a48'); R(g, 2, 14, 22, 2, '#c49460'); R(g, 2, 19, 22, 1, '#7a5430');
    for (let i = 0; i < 9; i++) { const x = 5 + i * 2; R(g, x, 3 + (i % 3), 1, 11, '#c8a040'); R(g, x - 1, 2 + (i % 3), 3, 4, '#e8c060'); }
    textC(g, 'WHEAT', 13, 18, '#4a2c18', 1);
    outline(c);
    return { c, ax: 13, ay: 25 };
  };

  F.ships = function () {
    const c = canvas(46, 30);
    const g = c.g;
    R(g, 1, 14, 44, 10, wood); R(g, 1, 14, 44, 2, woodL); R(g, 3, 24, 3, 5, woodD); R(g, 40, 24, 3, 5, woodD);
    R(g, 3, 10, 40, 5, '#3a6a8a');
    [[6, '#6a6a72'], [20, '#5a5a62'], [33, '#7a7a82']].forEach(([x, col]) => { R(g, x, 8, 10, 3, col); R(g, x + 3, 5, 3, 3, col); R(g, x + 4, 2, 1, 3, '#3a3a3a'); });
    outline(c);
    return { c, ax: 23, ay: 29 };
  };

  F.lectern = function (paper) {
    const c = canvas(20, 32);
    const g = c.g;
    R(g, 8, 12, 4, 17, woodD); R(g, 4, 28, 12, 3, woodD);
    R(g, 1, 4, 18, 9, wood); R(g, 1, 4, 18, 1, woodL);
    R(g, 3, 1, 14, 9, paper || '#efe6cc'); R(g, 5, 3, 10, 1, '#8a8478'); R(g, 5, 5, 10, 1, '#8a8478'); R(g, 5, 7, 7, 1, '#8a8478');
    outline(c);
    return { c, ax: 10, ay: 31 };
  };

  F.ticketBooth = function () {
    const c = canvas(56, 52);
    const g = c.g;
    R(g, 2, 8, 52, 42, wood); R(g, 2, 8, 52, 2, woodL); R(g, 0, 4, 56, 6, woodD); R(g, 0, 4, 56, 1, woodL);
    textC(g, 'TICKETS', 28, 5, PAL.gold, 1);
    for (let i = 0; i < 2; i++) { const x = 8 + i * 24; R(g, x, 14, 16, 14, '#ffd683'); R(g, x, 14, 16, 1, '#f0a54a'); for (let yy = 16; yy < 28; yy += 3) R(g, x, yy, 16, 1, PAL.goldD); R(g, x - 1, 28, 18, 3, woodL); }
    R(g, 2, 32, 52, 18, woodD); for (let x = 6; x < 52; x += 12) R(g, x, 35, 9, 12, wood);
    outline(c);
    return { c, ax: 28, ay: 50 };
  };

  F.departures = function () {
    const c = canvas(60, 30);
    const g = c.g;
    R(g, 0, 0, 60, 30, woodD); R(g, 2, 2, 56, 26, '#1e2422');
    textC(g, 'DEPARTURES', 30, 3, PAL.gold, 1);
    const rows = ['CHICAGO 4:10', 'D.C.    5:25', 'NEW YORK 6:40'];
    rows.forEach((r, i) => text(g, r, 5, 11 + i * 6, '#efe6cc', 1));
    return c;
  };

  F.mapWall = function (w, h) {
    const c = canvas(w, h);
    const g = c.g;
    R(g, 0, 0, w, h, PAL.goldD); R(g, 2, 2, w - 4, h - 4, '#e8dcbc');
    // stylised world map (Americas left, Europe centre, Asia right)
    const land = '#b8a46a', landD = '#8a7a4a';
    const blob = (pts) => { g.fillStyle = land; g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x * w, y * h) : g.moveTo(x * w, y * h))); g.closePath(); g.fill(); g.strokeStyle = landD; g.stroke(); };
    blob([[0.08, 0.18], [0.3, 0.14], [0.32, 0.3], [0.24, 0.46], [0.2, 0.5], [0.12, 0.36]]); // N America
    blob([[0.22, 0.52], [0.3, 0.55], [0.28, 0.85], [0.23, 0.8], [0.2, 0.6]]); // S America
    blob([[0.44, 0.16], [0.56, 0.14], [0.58, 0.3], [0.5, 0.38], [0.44, 0.32]]); // Europe
    blob([[0.46, 0.42], [0.58, 0.42], [0.6, 0.62], [0.54, 0.86], [0.48, 0.66]]); // Africa
    blob([[0.58, 0.14], [0.9, 0.16], [0.92, 0.36], [0.78, 0.5], [0.64, 0.42], [0.58, 0.3]]); // Asia
    blob([[0.8, 0.66], [0.9, 0.66], [0.9, 0.78], [0.8, 0.78]]); // Australia
    for (let x = 4; x < w - 4; x += 10) R(g, x, 2, 1, h - 4, 'rgba(120,100,70,0.25)');
    for (let y = 4; y < h - 4; y += 8) R(g, 2, y, w - 4, 1, 'rgba(120,100,70,0.25)');
    return c;
  };

  F.window = function (w, h, night) {
    const c = canvas(w, h);
    const g = c.g;
    R(g, 0, 0, w, h, '#efe4cc');
    for (let y = 2; y < h - 2; y++) R(g, 2, y, w - 4, 1, night ? mix('#1e2a4a', '#4a3a6a', y / h) : mix('#f4b870', '#f6dca0', y / h));
    if (!night) { disc(g, w * 0.7, h * 0.35, 3, '#fff2c0'); }
    else for (let i = 0; i < 5; i++) P(g, 3 + ((i * 7) % (w - 6)), 3 + ((i * 5) % (h - 8)), '#ffffff');
    R(g, Math.floor(w / 2), 2, 1, h - 4, '#efe4cc'); R(g, 2, Math.floor(h / 2), w - 4, 1, '#efe4cc');
    R(g, 0, 0, 4, h, '#8a2a2e'); R(g, w - 4, 0, 4, h, '#8a2a2e'); R(g, 1, 0, 1, h, '#a83a3e'); R(g, w - 3, 0, 1, h, '#a83a3e');
    R(g, -1, 0, w + 2, 2, PAL.goldD);
    return c;
  };

  // Wall map for Exhibit 5: the North Atlantic, with the countries in the reparations cycle labelled
  F.atlanticMap = function (w, h) {
    const c = canvas(w, h);
    const g = c.g;
    R(g, 0, 0, w, h, PAL.goldD); R(g, 1, 1, w - 2, h - 2, '#3a2a1a'); R(g, 3, 3, w - 6, h - 6, '#9fb8b0');
    for (let y = 3; y < h - 3; y += 2) for (let x = 3 + (y % 4); x < w - 3; x += 6) P(g, x, y, '#a9c2b9');
    const land = '#e2d3a6', landD = '#a8925e';
    const poly = (pts, col) => {
      g.fillStyle = col || land; g.beginPath();
      pts.forEach(([x, y], i) => { const px = 3 + x * (w - 6), py = 3 + y * (h - 6); if (i) g.lineTo(px, py); else g.moveTo(px, py); });
      g.closePath(); g.fill(); g.strokeStyle = landD; g.lineWidth = 1; g.stroke();
    };
    poly([[0, 0], [0.22, 0], [0.25, 0.14], [0.22, 0.28], [0.26, 0.42], [0.22, 0.58], [0.18, 0.7], [0.15, 0.8], [0.16, 0.98], [0.12, 0.98], [0.1, 0.84], [0.05, 0.9], [0, 0.95]]);
    poly([[0.6, 0.24], [0.63, 0.2], [0.64, 0.34], [0.6, 0.36]]);
    poly([[0.65, 0.1], [0.69, 0.06], [0.7, 0.26], [0.68, 0.42], [0.64, 0.42], [0.66, 0.28]]);
    poly([[0.67, 0.56], [0.72, 0.46], [0.78, 0.38], [0.86, 0.3], [1, 0.26], [1, 1], [0.84, 1], [0.79, 0.86], [0.72, 0.88], [0.7, 0.72]]);
    // France / Germany border
    g.strokeStyle = landD; g.beginPath(); g.moveTo(3 + 0.79 * (w - 6), 3 + 0.36 * (h - 6)); g.lineTo(3 + 0.81 * (w - 6), 3 + 0.6 * (h - 6)); g.lineTo(3 + 0.79 * (w - 6), 3 + 0.86 * (h - 6)); g.stroke();
    const lab = (t, fx, fy, col) => textC(g, t, 3 + fx * (w - 6), 3 + fy * (h - 6), col || '#4a3218', 1);
    lab('UNITED', 0.1, 0.32); lab('STATES', 0.1, 0.46);
    lab('BRITAIN', 0.58, 0.02);
    lab('FRANCE', 0.74, 0.66);
    lab('GERMANY', 0.9, 0.5);
    lab('ATLANTIC OCEAN', 0.42, 0.42, '#5a7a74');
    // legend
    let lx = Math.round(3 + 0.27 * (w - 6));
    const ly = h - 10;
    [['LOANS', '#f2c14a'], ['REPARATIONS', '#e86a5a'], ['WAR DEBTS', '#4a7ab0']].forEach(([t, col]) => {
      R(g, lx, ly + 1, 3, 3, col); text(g, t, lx + 5, ly, '#2a3a36', 1);
      lx += 5 + textWidth(t) + 7;
    });
    return { c, pts: { us: [0.2, 0.36], de: [0.9, 0.38], al: [0.71, 0.5] } };
  };

  F.ledgerPapers = function () {
    const c = canvas(34, 14);
    const g = c.g;
    R(g, 2, 2, 20, 11, '#e8dcbc'); R(g, 2, 2, 20, 1, '#fff6e0');
    for (let y = 5; y < 12; y += 2) R(g, 4, y, 16, 1, '#8a7a5a');
    R(g, 14, 1, 18, 12, '#f2e6c8'); R(g, 16, 4, 6, 1, '#c8302e'); R(g, 22, 4, 4, 1, '#c8302e'); P(g, 26, 3, '#c8302e'); P(g, 26, 5, '#c8302e');
    R(g, 16, 8, 10, 1, '#4a7ab0'); P(g, 15, 7, '#4a7ab0'); P(g, 15, 9, '#4a7ab0');
    outline(c);
    return c;
  };

  F.framedPrint = function (w, h) {
    const c = canvas(w, h);
    const g = c.g;
    R(g, 0, 0, w, h, '#2a1a12'); R(g, 2, 2, w - 4, h - 4, '#f4ecd8');
    const rnd = RNG(w * 7 + h);
    for (let i = 0; i < 40; i++) { const x = 4 + ((rnd() * (w - 8)) | 0), y = 4 + ((rnd() * (h - 12)) | 0); disc(g, x, y, 1.6, '#3a3030'); P(g, x, y + 1, '#f4ecd8'); }
    R(g, 4, h - 7, w - 8, 1, '#6a5a4a'); R(g, 6, h - 5, w - 12, 1, '#9a8a7a');
    return c;
  };

  // A big wooden direction board for the town square
  A.hubSign = function () {
    const c = canvas(78, 40);
    const g = c.g;
    R(g, 8, 18, 4, 21, '#5a3a22'); R(g, 66, 18, 4, 21, '#5a3a22');
    R(g, 1, 2, 76, 22, '#3a2416'); R(g, 3, 4, 72, 18, '#2c3d38'); R(g, 3, 4, 72, 1, '#4a6a62');
    R(g, 1, 2, 76, 1, PAL.gold); R(g, 1, 23, 76, 1, PAL.goldD);
    textC(g, 'MUSEUM HUB', 39, 6, PAL.gold, 1, 'rgba(0,0,0,0.5)');
    textC(g, 'TOWN SQUARE', 39, 14, '#efe6cc', 1);
    outline(c);
    return { c, ax: 39, ay: 39 };
  };

  // Sparkle used over unexamined artifacts
  A.sparkle = function (t) {
    const c = canvas(9, 9);
    const g = c.g;
    const s = 1 + Math.round((Math.sin(t) + 1) * 1.5);
    R(g, 4, 4 - s, 1, s * 2 + 1, '#fff6c8'); R(g, 4 - s, 4, s * 2 + 1, 1, '#fff6c8'); P(g, 4, 4, '#ffffff');
    return c;
  };
})();
