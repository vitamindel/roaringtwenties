/* =====================================================================
   THE NORMALCY FILES: artifacts.js
   The archive window that opens for every artifact, plus its media:
   image gallery with enlargement, newspaper viewer, archival audio with
   a synchronized transcript, documents, timelines, the evidence board,
   diagrams, maps and comparisons.
   ===================================================================== */
(function () {
  'use strict';
  const NF = (window.NF = window.NF || {});
  const h = (...a) => NF.h(...a);
  // append that silently skips null/undefined/false (prevents stray "null" text)
  const add = (el, ...kids) => { kids.flat(Infinity).forEach((k) => { if (k !== null && k !== undefined && k !== false) el.append(k); }); return el; };
  NF.add = add;

  const TYPE_TEXT = {
    primary: ['Primary source', 'an original record (document, image or recording)'],
    secondary: ['Secondary source', 'an explanation written later'],
    illustration: ['Modern illustration', 'made for this museum'],
    composite: ['Historical composite', 'based on real conditions'],
  };

  /* ---------- zoom / pan viewer used by newspapers and the lightbox ---------- */
  function zoomViewer(src, alt, fit) {
    const img = h('img', { src, alt: alt || '', draggable: 'false' });
    const box = h('div.news-viewer');
    let s = 1, x = 0, y = 0, base = 1;
    const apply = () => { img.style.transform = `translate(${x}px, ${y}px) scale(${s})`; };
    const clamp = () => {
      const bw = box.clientWidth, bh = box.clientHeight, iw = img.naturalWidth * s, ih = img.naturalHeight * s;
      x = iw <= bw ? (bw - iw) / 2 : Math.min(0, Math.max(bw - iw, x));
      y = ih <= bh ? (bh - ih) / 2 : Math.min(0, Math.max(bh - ih, y));
    };
    const reset = () => {
      if (!img.naturalWidth || !box.clientWidth) return;
      const bw = box.clientWidth, bh = box.clientHeight;
      base = fit === 'contain' ? Math.min(bw / img.naturalWidth, bh / img.naturalHeight) : bw / img.naturalWidth;
      s = base; x = 0; y = 0; clamp(); apply();
    };
    const zoomAt = (f, cx, cy) => {
      const ns = Math.max(base, Math.min(base * 6, s * f));
      x = cx - ((cx - x) * ns) / s; y = cy - ((cy - y) * ns) / s; s = ns; clamp(); apply();
    };
    img.onload = reset;
    if (window.ResizeObserver) new ResizeObserver(() => reset()).observe(box);
    box.addEventListener('wheel', (e) => { e.preventDefault(); const r = box.getBoundingClientRect(); zoomAt(e.deltaY < 0 ? 1.2 : 1 / 1.2, e.clientX - r.left, e.clientY - r.top); }, { passive: false });
    let drag = null;
    box.addEventListener('pointerdown', (e) => { if (e.target.closest('button')) return; drag = { px: e.clientX, py: e.clientY, x, y }; box.setPointerCapture(e.pointerId); box.style.cursor = 'grabbing'; });
    box.addEventListener('pointermove', (e) => { if (!drag) return; x = drag.x + e.clientX - drag.px; y = drag.y + e.clientY - drag.py; clamp(); apply(); });
    box.addEventListener('pointerup', () => { drag = null; box.style.cursor = ''; });
    box.addEventListener('dblclick', (e) => { const r = box.getBoundingClientRect(); zoomAt(2, e.clientX - r.left, e.clientY - r.top); });
    const tools = h('div.news-tools',
      h('button', { title: 'Zoom in', 'aria-label': 'Zoom in', onclick: () => zoomAt(1.4, box.clientWidth / 2, box.clientHeight / 3) }, '+'),
      h('button', { title: 'Zoom out', 'aria-label': 'Zoom out', onclick: () => zoomAt(1 / 1.4, box.clientWidth / 2, box.clientHeight / 3) }, '−'),
      h('button', { title: 'Reset view', 'aria-label': 'Reset view', onclick: reset }, '⟲'));
    box.append(img, tools);
    img.onerror = () => { box.innerHTML = ''; box.append(h('div.img-missing', 'This image could not be loaded. Use the source link in the citations.')); };
    return box;
  }
  function lightbox(src, caption, alt) {
    const root = document.querySelector('#modal-root');
    const lb = h('div.lightbox', { role: 'dialog', 'aria-label': 'Enlarged image' });
    lb.append(h('button.deco-btn.small.lb-close', { onclick: () => NF.UI.closeTop() }, 'Close ✕'), zoomViewer(src, alt || caption, 'contain'));
    if (caption) lb.append(h('div.lb-cap', caption));
    root.append(lb);
    NF.UI.modals.push({ wrap: lb });
    NF.Game.paused = true;
  }
  NF.lightbox = lightbox;

  /* ---------- image gallery: one large image, thumbnails, caption + credit ---------- */
  function gallery(images) {
    if (!images || !images.length) return null;
    let cur = 0;
    const fig = h('figure.gal');
    const frame = h('div.gal-frame');
    const cap = h('figcaption');
    const thumbs = images.length > 1 ? h('div.gal-thumbs') : null;
    const show = (i) => {
      cur = i;
      const im = images[i];
      frame.innerHTML = '';
      const img = h('img', { src: im.src, alt: im.alt || im.caption || '', loading: 'lazy', title: 'Click to enlarge' });
      img.onclick = () => lightbox(im.src, im.caption, im.alt);
      img.onerror = () => { frame.innerHTML = ''; frame.append(h('div.img-missing', 'This image could not be loaded. ', im.credit ? 'Source: ' + im.credit + '.' : '')); };
      frame.append(img, h('button.enlarge', { onclick: () => lightbox(im.src, im.caption, im.alt), 'aria-label': 'Enlarge image' }, 'Enlarge ⤢'));
      cap.innerHTML = '';
      add(cap, h('span', im.caption), im.credit ? h('span.credit', ' ' + im.credit + '.') : null);
      if (thumbs) [...thumbs.children].forEach((t, k) => t.classList.toggle('on', k === i));
    };
    if (thumbs) images.forEach((im, i) => thumbs.append(h('button.gal-thumb', { onclick: () => show(i), 'aria-label': 'Show image ' + (i + 1) + ': ' + (im.alt || '') }, h('img', { src: im.src, alt: '' }))));
    add(fig, frame, cap, thumbs);
    show(0);
    return fig;
  }

  /* ---------- media renderers ---------- */
  const MEDIA = {
    newspaper(m) { return h('div.media-block', zoomViewer(m.src, m.caption), h('p.media-cap', m.caption)); },
    audio(m, a) {
      const el = new window.Audio();
      el.preload = 'none'; el.src = m.src; el.volume = NF.Audio.vol.voice;
      const play = h('button.deco-btn.small', '▶ Play recording');
      const fill = h('span'), bar = h('div.audio-bar', { role: 'slider', 'aria-label': 'Recording position', tabindex: 0 }, fill), time = h('span.narr-time', '0:00 / 4:22');
      const err = h('div.audio-err', { hidden: true }, 'The recording could not be streamed (you may be offline). The transcript below is the complete text. ', h('a', { href: 'https://www.loc.gov/item/2016655168/', target: '_blank', rel: 'noopener' }, 'Listen at the Library of Congress ↗'));
      const T = a.transcript;
      const rows = T ? T.lines.map(([t, line]) => h('p.tr-line', { 'data-t': t }, h('span.tr-time', Math.floor(t / 60) + ':' + String(t % 60).padStart(2, '0')), ' ', line)) : [];
      play.onclick = () => {
        if (el.paused) { NF.Audio.setDuck(true); play.textContent = 'Loading…'; el.play().then(() => { play.textContent = '❚❚ Pause'; }).catch(() => { err.hidden = false; play.textContent = '▶ Play recording'; NF.Audio.setDuck(false); }); }
        else el.pause();
      };
      el.addEventListener('pause', () => { play.textContent = '▶ Play recording'; NF.Audio.setDuck(false); });
      el.addEventListener('ended', () => NF.Audio.setDuck(false));
      el.addEventListener('error', () => { err.hidden = false; play.textContent = '▶ Play recording'; NF.Audio.setDuck(false); });
      el.addEventListener('timeupdate', () => {
        if (el.duration) fill.style.width = (el.currentTime / el.duration) * 100 + '%';
        const sec = Math.floor(el.currentTime); time.textContent = Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0') + ' / 4:22';
        let curRow = null; rows.forEach((r) => { if (+r.dataset.t <= el.currentTime) curRow = r; r.classList.remove('now'); });
        if (curRow) curRow.classList.add('now');
      });
      bar.onclick = (e) => { const r = bar.getBoundingClientRect(); if (el.duration) el.currentTime = ((e.clientX - r.left) / r.width) * el.duration; };
      rows.forEach((r) => { r.onclick = () => { if (el.duration) { el.currentTime = +r.dataset.t; if (el.paused) play.click(); } }; r.title = 'Play from here'; });
      const box = h('div.media-block',
        h('div.player', h('div.player-title', '“Readjustment,” Warren G. Harding, 1920'), h('div.audio-row', play, bar, time),
          h('p.player-note', 'Streams the original 78-rpm disc from the Library of Congress (4 minutes 22 seconds). Needs an internet connection.'), err),
        T ? h('section.transcript', { 'aria-label': 'Transcript' },
          h('h4', 'Transcript'),
          h('dl.tr-meta', h('dt', 'Speaker'), h('dd', T.speaker), h('dt', 'Context'), h('dd', T.context)),
          h('p.tr-note', T.note),
          h('div.tr-body', rows)) : null);
      box._cleanup = () => { el.pause(); el.removeAttribute('src'); NF.Audio.setDuck(false); };
      return box;
    },
    document(m) {
      return h('div.paper-doc', h('div.pd-head', m.heading), m.lines.map(([k, v]) => h('div.pd-line', h('b', k), h('span', v))), h('div.pd-foot', m.foot));
    },
    timeline(m) { return h('ul.timeline', m.items.map(([d, t]) => h('li', h('span.tl-d', d), t))); },
    board(m) {
      const seen = new Set();
      const detail = h('div.note-detail', { 'aria-live': 'polite' }, h('em', 'Click a pinned note to read it. Check each label: primary or secondary?'));
      const board = h('div.board');
      const items = (m.items || []).filter(Boolean);
      const notes = items.map((it, i) => {
        const b = h('button.note', { 'aria-label': (it.t || 'Evidence') + ', ' + (it.type || 'source') }, h('span.nt.src-type.' + (it.type || 'secondary'), it.type === 'primary' ? 'PRIMARY' : 'SECONDARY'), it.t || 'Evidence');
        b.onclick = () => {
          notes.forEach((n) => n.classList.remove('active')); b.classList.add('active', 'seen'); seen.add(i);
          NF.Audio.sfx('page');
          const src = it.src ? NF.src(it.src) : null;
          detail.innerHTML = '';
          if (it.img) {
            const im = h('img', { src: it.img, alt: it.t || '', title: 'Click to enlarge' });
            im.onclick = () => lightbox(it.img, it.t);
            im.onerror = () => im.remove();
            detail.append(im);
          }
          add(detail,
            h('span.src-type.' + (it.type || 'secondary'), (it.type === 'primary' ? 'PRIMARY' : 'SECONDARY') + ' SOURCE'),
            h('h4', it.t || 'Evidence'),
            h('p', it.d || 'Details for this item are not available.'),
            src ? h('div.note-src', 'Source: ', h('span', { html: src.mla }), ' ', h('a', { href: src.url, target: '_blank', rel: 'noopener' }, 'link ↗')) : null);
          if (seen.size === items.length && !this._boardDone) { this._boardDone = true; NF.UI.toast('Every piece of evidence reviewed', 'EVIDENCE BOARD', '✓'); }
        };
        return b;
      });
      board.append(...notes);
      return h('div.media-block', board, detail);
    },
    map() {
      const svg = `<svg viewBox="0 0 400 230" class="flow-svg" role="img" aria-label="Simplified map of the United States marking Teapot Dome, Wyoming and Elk Hills, California">
        <rect width="400" height="230" fill="#e8dcbc"/>
        <path d="M22 40 L120 30 L200 34 L282 38 L330 30 L350 48 L372 52 L380 74 L360 96 L352 128 L330 150 L318 178 L296 196 L286 222 L270 196 L236 180 L206 196 L176 212 L150 190 L118 182 L84 178 L58 162 L36 134 L24 100 Z" fill="#c8b480" stroke="#7a6a4a" stroke-width="2"/>
        <rect x="112" y="64" width="62" height="44" fill="#d8a85a" stroke="#7a2630" stroke-width="2"/>
        <text x="143" y="84" text-anchor="middle" font-family="Pixelify Sans, sans-serif" font-size="11" fill="#3a2418">WYOMING</text>
        <circle cx="150" cy="96" r="5" fill="#c8302e" stroke="#fff" stroke-width="1.5"/>
        <text x="160" y="124" font-family="Pixelify Sans, sans-serif" font-size="11" fill="#7a2630">Teapot Dome (Naval Reserve No. 3)</text>
        <path d="M28 70 L62 80 L58 116 L84 150 L80 168 L56 160 L36 134 L26 100 Z" fill="#d8a85a" stroke="#7a2630" stroke-width="2"/>
        <text x="40" y="96" font-family="Pixelify Sans, sans-serif" font-size="10" fill="#3a2418">CA</text>
        <circle cx="54" cy="128" r="5" fill="#c8302e" stroke="#fff" stroke-width="1.5"/>
        <text x="64" y="208" font-family="Pixelify Sans, sans-serif" font-size="11" fill="#7a2630">Elk Hills (Naval Reserve No. 1)</text>
        <line x1="54" y1="133" x2="80" y2="198" stroke="#7a2630" stroke-dasharray="3 2"/>
        <text x="386" y="222" text-anchor="end" font-family="Silkscreen, monospace" font-size="8" fill="#6a5a48">SIMPLIFIED ILLUSTRATION, NOT TO SCALE</text>
      </svg>`;
      return h('div.media-block', h('div', { html: svg }), h('p.media-cap', 'Simplified map drawn for this museum. Not to scale.'));
    },
    compare(m) {
      const pic = (side) => h('figure.gal', h('div.gal-frame', (() => { const i = h('img', { src: side.src, alt: side.caption, title: 'Click to enlarge' }); i.onclick = () => lightbox(side.src, side.caption); return i; })()), h('figcaption', side.caption));
      return h('div.media-block', h('div.compare', h('div', h('h4', m.left.title), pic(m.left)), h('div', h('h4', m.right.title), pic(m.right))),
        h('div.compare', { style: { marginTop: '12px' } },
          h('div.view-card', h('b', 'A business view'), h('p', 'Stable government, lower taxes and protective tariffs let industry invest and grow, and growth creates jobs.')),
          h('div.view-card', h('b', 'A labor view'), h('p', 'When workers organized for better wages, the federal government used courts and injunctions against them.'))),
        h('p.media-cap', 'These two views summarize perspectives described by the sources below. They are not direct quotations.'));
    },
    diagram() {
      const svg = `<svg viewBox="0 0 440 260" class="flow-svg dark" role="img" aria-label="Flowchart: U.S. banks lend to Germany; Germany pays reparations to Britain and France; they repay war debts to the U.S. government">
        <defs><marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#f3d58a"/></marker>
        <style>.fl{fill:none;stroke-width:4;stroke-dasharray:10 8;animation:dash 1.4s linear infinite}@keyframes dash{to{stroke-dashoffset:-36}}.nd{fill:#f4ead2;stroke:#9c7a36;stroke-width:3}.nt{font-family:Pixelify Sans,sans-serif;font-size:14px;font-weight:700;fill:#2a1d18;text-anchor:middle}.lb{font-family:Pixelify Sans,sans-serif;font-size:12px;fill:#f3d58a;text-anchor:middle}.sm{font-family:EB Garamond,serif;font-size:11px;fill:#e9dcbc;text-anchor:middle;font-style:italic}</style></defs>
        <path class="fl" stroke="#f2c14a" d="M120 52 L320 52" marker-end="url(#ah)"/>
        <path class="fl" stroke="#e86a5a" d="M370 76 L370 180" marker-end="url(#ah)"/>
        <path class="fl" stroke="#6ab0e8" d="M320 208 L120 208" marker-end="url(#ah)"/>
        <rect class="nd" x="14" y="28" width="108" height="48"/><text class="nt" x="68" y="57">U.S. BANKS</text>
        <rect class="nd" x="318" y="28" width="108" height="48"/><text class="nt" x="372" y="57">GERMANY</text>
        <rect class="nd" x="318" y="184" width="108" height="48"/><text class="nt" x="372" y="206">BRITAIN</text><text class="nt" x="372" y="222">&amp; FRANCE</text>
        <rect class="nd" x="14" y="184" width="108" height="48"/><text class="nt" x="68" y="206">U.S.</text><text class="nt" x="68" y="222">GOVERNMENT</text>
        <text class="lb" x="220" y="42">1. Private loans</text><text class="sm" x="220" y="70">$200 million Dawes loan (1924) and more</text>
        <text class="lb" x="300" y="128" text-anchor="end">2. Reparations</text><text class="sm" x="300" y="144" text-anchor="end">bill set at 132 billion gold marks (1921)</text>
        <text class="lb" x="220" y="200">3. War-debt repayments</text><text class="sm" x="220" y="228">on more than $10 billion in wartime loans</text>
        <text class="sm" x="70" y="134">The cycle worked only</text><text class="sm" x="70" y="148">while step 1 continued</text>
      </svg>`;
      return h('div.media-block', h('div', { html: svg }),
        h('p.media-cap', 'Simplified model based on the U.S. Office of the Historian. Real flows also included trade, tariffs and gold, and the cycle broke when American lending dried up in 1928.'));
    },
    priorities() {
      const P = [
        { k: 'Tax reduction', sup: 'Lower rates leave money for investment and reward work.', crit: 'Benefits went mostly to the wealthiest taxpayers.', did: 'Revenue Acts of 1924 and 1926 cut income, estate and gift taxes.', ev: 'Miller Center; Cato Journal' },
        { k: 'Federal spending', sup: 'A thrifty government “saves people” from the cost of waste (Coolidge, 1925).', crit: 'Spending restraint left little room for relief programs.', did: 'Coolidge pursued economy and ran budget surpluses.', ev: 'Coolidge inaugural address; Miller Center' },
        { k: 'Business growth', sup: 'Confidence and light regulation fueled a consumer boom.', crit: 'Light regulation let speculation and margin buying grow.', did: 'A hands-off approach to business regulation.', ev: 'Miller Center' },
        { k: 'Farm distress', sup: 'Price supports would be costly and encourage overproduction.', crit: 'Farmers suffered low prices all decade while cities boomed.', did: 'Vetoed the McNary-Haugen farm bills (1927, 1928).', ev: 'Miller Center; Library of Congress photograph, Jan. 12, 1924' },
        { k: 'What the public expected', sup: 'Most help should come from states, communities and private effort.', crit: 'Many Americans expected Washington to respond to hardship.', did: 'Left most issues to the states; restraint over bold action.', ev: 'Miller Center' },
      ];
      const card = h('div.view-card');
      const chips = P.map((p, i) => h('button.chip' + (i === 0 ? '.on' : ''), { onclick: (e) => { chips.forEach((c) => c.classList.remove('on')); e.currentTarget.classList.add('on'); show(p); } }, p.k));
      const show = (p) => { card.innerHTML = ''; card.append(h('dl', h('dt', 'Supporters argued'), h('dd', p.sup), h('dt', 'Critics argued'), h('dd', p.crit), h('dt', 'What the administration did'), h('dd', p.did), h('dt', 'Evidence'), h('dd', p.ev))); };
      show(P[0]);
      return h('div.media-block', h('h4', 'Comparing priorities'), h('p.media-cap', 'A summary of arguments, with no invented statistics. Choose a priority:'), h('div.chip-row', chips), card);
    },
    case(m) {
      return h('div.media-block',
        h('h4', 'The case at a glance'),
        h('ul.timeline', m.timeline.map(([d, t]) => h('li', h('span.tl-d', d), t))),
        h('div.compare', { style: { marginTop: '12px' } },
          h('div.view-card', h('b', 'Outcome for Gitlow'), h('p', 'He lost. The Court upheld his conviction, 7 to 2. New York could punish speech it judged dangerous to public order.')),
          h('div.view-card', h('b', 'Constitutional significance'), h('p', 'Free speech now reached state governments through the Fourteenth Amendment, a principle later courts built on.'))),
        h('div.paper-doc', { style: { marginTop: '12px' } },
          h('div.pd-line', h('b', '1st Amendment'), h('span', '“Congress shall make no law… abridging the freedom of speech, or of the press…”')),
          h('div.pd-line', h('b', '14th Amendment'), h('span', '“…nor shall any State deprive any person of life, liberty, or property, without due process of law…”'))));
    },
  };

  /* ---------- the archive window ---------- */
  const Artifacts = (NF.Artifacts = {
    media: MEDIA,
    // preview: opened from the WWI Effacts list, so it does not count as examined
    open(id, preview) {
      const C = NF.CONTENT, a = C.ARTIFACTS[id];
      if (!a) { NF.UI.toast('This exhibit is not available.', 'ARCHIVE', '!'); return; }
      const S = NF.Save.data;
      const first = !preview && !S.examined[id];
      if (!preview) { S.examined[id] = true; NF.Save.save(); }
      this._boardDone = false;
      const room = C.ROOMS[a.room];
      const kind = a.media && a.media.kind;
      let special = null;
      try { special = kind && MEDIA[kind] ? MEDIA[kind].call(this, a.media, a) : null; } catch (e) { console.error(e); special = h('div.img-missing', 'This display could not be shown. The text and sources are still available.'); }
      const gal = gallery(a.images);
      const left = h('div.art-media');
      if (kind === 'document') add(left, gal, special); else add(left, special, gal);
      if (!left.children.length) left.append(h('div.img-missing', 'No image for this item.'));

      const tt = TYPE_TEXT[a.type] || [a.type, ''];
      const section = (title, body) => (body ? h('section.af-sec', h('h4', title), Array.isArray(body) ? body.map((p) => h('p', p)) : h('p', body)) : null);
      const info = h('div.art-info',
        h('p.af-kind', a.kind || '', a.date ? ' · ' + a.date : ''),
        h('p.af-type.' + a.type, h('b', tt[0]), tt[1] ? ', ' + tt[1] : ''),
        a.creator ? h('p.af-creator', 'Made by: ' + a.creator) : null,
        a.summary ? h('p.af-lead', a.summary) : null,
        a.excerpt ? h('blockquote.quote', a.excerpt.text, h('cite', a.excerpt.by)) : null,
        a.excerpt && a.excerpt.second ? h('blockquote.quote', a.excerpt.second.text, h('cite', a.excerpt.second.by)) : null,
        this.effactBox(id),
        section('Background', a.background),
        section('What this evidence tells us', a.tells),
        section('Limits of this source', a.limits),
        section('Why it matters for normalcy', a.why),
        a.more && a.more.length ? h('details.more', h('summary', 'Read more'), a.more.map((p) => h('p', p))) : null,
        this.questionBox(a),
        h('section.af-sec.af-sources', h('h4', 'Sources'),
          a.sources.length ? h('ol.cites', a.sources.map((sid) => { const s = NF.src(sid); return s ? h('li', h('span', { html: s.mla + ' ' }), h('a', { href: s.url, target: '_blank', rel: 'noopener' }, 'View source ↗')) : null; })) : h('p', 'See the Library for the full bibliography.')));
      const body = h('div.art-grid', left, info);
      NF.UI.modal({ kicker: room ? (room.num <= 6 ? `Exhibit ${room.num}: ${room.title}` : room.title) : 'Town Square', title: a.title, body, cls: 'paper', closeText: 'Close and keep exploring', onClose: () => { if (special && special._cleanup) special._cleanup(); } });
      if (first) {
        const total = Object.keys(C.ARTIFACTS).length, n = Object.keys(C.ARTIFACTS).filter((k) => S.examined[k]).length;
        NF.UI.toast(`Artifact examined (${n} of ${total})`, 'ARCHIVE', '✦');
        NF.Audio.sfx('discover');
        NF.UI.updateHud();
      }
    },
    // The class's WWI "Effacts" that this artifact explains
    effactBox(id) {
      const list = NF.CONTENT.EFFACTS.filter((e) => e.art === id || (e.also || []).includes(id));
      if (!list.length) return null;
      return h('section.af-sec.effact-box', { 'aria-label': 'WWI Effacts' },
        list.map((e) => h('div.effact',
          h('div.effact-tag', 'WWI EFFACT #' + e.n),
          h('p.effact-text', e.text),
          h('p.effact-here', h('b', 'Why it matters here: '), e.here))),
        h('button.link-btn.dark', { onclick: () => NF.UI.openEffacts(list[0].n) }, 'See all WWI Effacts ›'));
    },
    questionBox(a) {
      if (!a.question) return null;
      const box = h('section.af-sec.question', h('h4', 'Think about it'), h('p', a.question));
      if (a.thinking) {
        const th = h('p.thinking', { hidden: true }, h('b', 'One possible answer: '), a.thinking);
        const btn = h('button.link-btn.dark', { onclick: () => { th.hidden = !th.hidden; btn.textContent = th.hidden ? 'Show one possible answer' : 'Hide the answer'; } }, 'Show one possible answer');
        box.append(btn, th);
      }
      return box;
    },
  });
})();
