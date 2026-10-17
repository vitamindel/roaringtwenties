/* =====================================================================
   THE NORMALCY FILES: minigames.js
   Six educational mini-games and the final "Judge Normalcy" verdict.
   Every activity explains the real history after each choice.
   ===================================================================== */
(function () {
  'use strict';
  const NF = (window.NF = window.NF || {});
  const h = (...a) => NF.h(...a);
  const sfx = (n) => NF.Audio && NF.Audio.sfx(n);
  const srcLine = (id) => { const s = NF.src(id); return s ? h('span.src', 'Source: ', h('span', { html: s.mla.replace(/<[^>]+>/g, '') }), ' ', h('a', { href: s.url, target: '_blank', rel: 'noopener' }, '↗')) : null; };
  const shuffle = (arr, seed) => { const a = arr.slice(); let s = seed || 7; for (let i = a.length - 1; i > 0; i--) { s = (s * 9301 + 49297) % 233280; const j = Math.floor((s / 233280) * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  function shell(id, steps) {
    const G = NF.CONTENT.GAMES[id];
    const room = NF.CONTENT.ROOMS[id];
    const stepBar = h('div.steps', Array.from({ length: steps }, () => h('span')));
    const stage = h('div');
    const rec = NF.UI.modal({ kicker: `EXHIBIT ${room.num} · MINI-GAME`, title: G.title, body: h('div', h('p', { style: { margin: '0 0 10px', color: '#e9dcbc', fontStyle: 'italic' } }, G.subtitle), stepBar, stage), cls: 'game-modal', closeText: 'Leave game (Esc)' });
    return {
      G, stage, rec,
      step(i) { [...stepBar.children].forEach((s, k) => { s.className = k < i ? 'done' : k === i ? 'cur' : ''; }); },
      set(...nodes) { stage.innerHTML = ''; nodes.forEach((n) => n && stage.append(n)); rec.body.scrollTop = 0; },
      finish(score, note) {
        const S = NF.Save.data;
        const first = !S.games[id];
        S.games[id] = { done: true, score: score === undefined ? null : score, at: Date.now() };
        NF.Save.save();
        [...stepBar.children].forEach((s) => (s.className = 'done'));
        sfx('complete');
        if (first) NF.UI.toast(`Mini-game complete: ${G.title}`, 'EXHIBIT ' + room.num, '★');
        NF.UI.updateHud();
      },
    };
  }
  const feedback = (cls, title, ...body) => h('div.feedback' + (cls ? '.' + cls : ''), h('strong', title), ...body);
  const nextBtn = (label, fn) => h('button.deco-btn', { style: { marginTop: '14px' }, onclick: fn }, label);

  const Games = (NF.Games = {
    open(id) { (this['g_' + id] || (() => {}))(); },

    /* ================= ROOM 1: RESTORE STABILITY ================= */
    g_r1() {
      const sh = shell('r1', 6), G = sh.G;
      const meters = [50, 50];
      const meterEl = () => h('div.meters', G.meters.map((name, i) => h('div.meter', name + ' (simulated)', h('div.mbar', h('span', { style: { width: Math.max(4, Math.min(100, meters[i])) + '%' } })))));
      const choices = [];
      sh.step(0);
      sh.set(h('div.g-card', h('div.g-kicker', 'HISTORICAL SIMULATION'), h('div.g-title', 'Restore Stability, 1920–1922'), h('p', G.intro),
        h('p', { style: { fontSize: '15px', color: '#6a5a48' } }, 'You are a fictional adviser, not Harding himself. There are no “perfect” answers; every option has trade-offs.')),
        meterEl(), nextBtn('Begin ▸', () => round(0)));
      const round = (i) => {
        if (i >= G.rounds.length) return end();
        sh.step(i + 1);
        const R = G.rounds[i];
        const fb = h('div');
        const opts = R.options.map((o, k) => h('button.g-opt', { onclick: () => pick(k) }, o.t, h('span.pc', '＋ ' + o.pro + '   ·   － ' + o.con)));
        const pick = (k) => {
          opts.forEach((b, j) => { b.disabled = true; if (j === k) b.classList.add('sel'); });
          const o = R.options[k];
          meters[0] += o.m[0] * 8; meters[1] += o.m[1] * 8;
          choices.push(o.t);
          sfx('click');
          fb.append(feedback('blue', 'Your choice', h('div', 'Benefit: ' + o.pro), h('div', 'Drawback: ' + o.con)),
            feedback('', 'What the federal government actually did', h('div', R.actual), srcLine(R.src)),
            meterEl(), nextBtn(i < G.rounds.length - 1 ? 'Next challenge ▸' : 'See the outcome ▸', () => round(i + 1)));
        };
        sh.set(h('div.g-card', h('div.g-kicker', `CHALLENGE ${i + 1} OF ${G.rounds.length} · ${R.when}`), h('div.g-title', R.title), h('p', R.prompt), h('div.g-opts', opts)), fb);
      };
      const end = () => {
        sh.step(5);
        sh.set(h('div.g-card', h('div.g-kicker', 'SIMULATION COMPLETE'), h('div.g-title', 'Did you restore stability?'),
          h('p', 'Your simulated meters reflect trade-offs, not historical measurements. The real government generally chose business confidence and order over labor’s demands, while also showing “healing” by freeing Debs and leading on disarmament.'),
          meterEl(),
          h('p', { style: { marginTop: '10px' } }, h('b', 'Think about it: '), 'Which of your choices helped one group but hurt another? That tension (stability for whom?) runs through every room of this museum.')),
          nextBtn('Finish ✓', () => NF.UI.closeTop()));
        sh.finish(Math.round((meters[0] + meters[1]) / 2));
      };
    },

    /* ================= ROOM 2: THE PRESIDENT'S POLICY DESK ================= */
    g_r2() {
      const sh = shell('r2', 3), G = sh.G;
      let score = 0;
      // phase 1: match policy to purpose
      const phase1 = () => {
        sh.step(0);
        const fb = h('div');
        let selL = null, matched = 0;
        const left = G.policies.map((p) => h('button.mcard', { onclick: () => { if (left[G.policies.indexOf(p)].classList.contains('done')) return; left.forEach((b) => b.classList.remove('sel')); selL = p; left[G.policies.indexOf(p)].classList.add('sel'); } }, h('b', p.name)));
        const rightOrder = shuffle(G.policies, 4);
        const right = rightOrder.map((p) => {
          const b = h('button.mcard', { onclick: () => {
            if (!selL || b.classList.contains('done')) return;
            if (selL === p) {
              score += 10; matched++; sfx('correct');
              b.classList.add('done'); left[G.policies.indexOf(p)].classList.add('done'); left[G.policies.indexOf(p)].classList.remove('sel');
              fb.innerHTML = ''; fb.append(feedback('', '✓ ' + p.name, h('div', p.exp), srcLine(p.src)));
              selL = null;
              if (matched === G.policies.length) fb.append(nextBtn('Next: who carried it out? ▸', phase2));
            } else {
              sfx('gentle'); b.classList.add('shake'); setTimeout(() => b.classList.remove('shake'), 400);
              fb.innerHTML = ''; fb.append(feedback('amber', 'Not quite', h('div', `“${selL.name}” was not mainly about that. Re-read the purpose: what problem was the policy trying to solve?`)));
              score = Math.max(0, score - 2);
            }
          } }, p.purpose);
          return b;
        });
        sh.set(h('div.g-card', h('div.g-kicker', 'STEP 1 OF 3'), h('div.g-title', 'Match each policy to its purpose'), h('p', 'Click a policy on the left, then the purpose that fits it on the right.'),
          h('div.match', h('div.col', left), h('div.col', right))), fb);
      };
      // phase 2: institution + groups
      const phase2 = () => {
        sh.step(1);
        let qi = 0;
        const qs = [];
        G.policies.forEach((p, i) => {
          qs.push({ q: `Who carried out or enforced: ${p.name}?`, a: p.inst, opts: shuffle([p.inst, ...G.policies.filter((x) => x !== p).map((x) => x.inst).slice(0, 2)], i + 3), exp: p.exp, src: p.src });
          qs.push({ q: `Which group did ${p.name} affect most directly?`, a: p.groups, opts: shuffle([p.groups, ...G.policies.filter((x) => x !== p).map((x) => x.groups).slice(0, 2)], i + 9), exp: p.exp, src: p.src });
        });
        const ask = () => {
          if (qi >= qs.length) return phase3();
          const Q = qs[qi];
          const fb = h('div');
          const bs = Q.opts.map((o) => h('button.g-opt', { onclick: () => {
            bs.forEach((b) => (b.disabled = true));
            const ok = o === Q.a;
            bs.forEach((b) => { if (b.textContent === Q.a) b.classList.add('right'); });
            if (!ok) bs[Q.opts.indexOf(o)].classList.add('wrong');
            if (ok) { score += 5; sfx('correct'); } else sfx('gentle');
            fb.append(feedback(ok ? '' : 'amber', ok ? 'Correct' : 'The best answer: ' + Q.a, h('div', Q.exp), srcLine(Q.src)), nextBtn('Next ▸', () => { qi++; ask(); }));
          } }, o));
          sh.set(h('div.g-card', h('div.g-kicker', `STEP 2 OF 3 · QUESTION ${qi + 1} OF ${qs.length}`), h('div.g-title', 'Institutions & impact'), h('p', Q.q), h('div.g-opts', bs)), fb);
        };
        ask();
      };
      const phase3 = () => {
        sh.step(2);
        let qi = 0;
        const ask = () => {
          if (qi >= G.quiz.length) return end();
          const Q = G.quiz[qi], fb = h('div');
          const bs = Q.opts.map((o, k) => h('button.g-opt', { onclick: () => {
            bs.forEach((b) => (b.disabled = true)); bs[Q.a].classList.add('right');
            const ok = k === Q.a; if (!ok) bs[k].classList.add('wrong');
            if (ok) { score += 10; sfx('correct'); } else sfx('gentle');
            fb.append(feedback(ok ? '' : 'amber', ok ? 'Correct' : 'Here’s the history', h('div', Q.exp), srcLine(Q.src)), nextBtn('Next ▸', () => { qi++; ask(); }));
          } }, o));
          sh.set(h('div.g-card', h('div.g-kicker', `STEP 3 OF 3 · QUESTION ${qi + 1} OF ${G.quiz.length}`), h('div.g-title', 'Tariffs, taxes & budgets'), h('p', Q.q), h('div.g-opts', bs)), fb);
        };
        ask();
      };
      const end = () => {
        const max = G.policies.length * 10 + G.policies.length * 10 + G.quiz.length * 10;
        sh.set(h('div.g-card.result-banner', h('div.g-kicker', 'POLICY DESK COMPLETE'), h('div.big', `${score} / ${max} points`),
          h('p', 'Normalcy wasn’t “no government.” Budgets, tariffs, tax cuts, and court injunctions were all deliberate choices, and each helped some groups more than others. That is the heart of Essential Question C1: every choice about scarce resources has consequences for different groups.')), nextBtn('Finish ✓', () => NF.UI.closeTop()));
        sh.finish(score);
      };
      phase1();
    },

    /* ================= ROOM 3: SOLVE THE TEAPOT DOME CASE ================= */
    g_r3() {
      const sh = shell('r3', 7), G = sh.G;
      let factPts = 0, pts = 0;
      // 1. evidence
      const s1 = () => {
        sh.step(0);
        const a = NF.CONTENT.ARTIFACTS.r3_board;
        const items = a.media.items;
        const opened = new Set();
        const go = nextBtn('I’ve examined the evidence ▸', s2); go.disabled = true;
        const detail = h('div.note-detail', h('em', 'Open all six case files to continue.'));
        const list = h('div.g-opts', items.map((it, i) => h('button.g-opt', { onclick: (e) => { opened.add(i); e.currentTarget.classList.add('right'); detail.innerHTML = ''; detail.append(h('span.src-type.' + it.type, it.type.toUpperCase() + ' SOURCE'), h('h4', { style: { margin: '6px 0', fontFamily: 'var(--f-pixel)' } }, it.t), h('p', { style: { margin: 0 } }, it.d)); sfx('page'); if (opened.size === items.length) go.disabled = false; } }, `📁 Case file ${i + 1}: ${it.t}`)));
        sh.set(h('div.g-card', h('div.g-kicker', 'STEP 1 · EXAMINE THE EVIDENCE'), h('div.g-title', 'Open the case files'), h('p', 'A good investigation starts with the evidence, not with a conclusion. Note which files are primary and which are secondary.'), list, detail), go);
      };
      // 2. timeline
      const s2 = () => {
        sh.step(1);
        let order = shuffle(G.timeline, 11);
        const fb = h('div');
        const ul = h('ul.order-list');
        let checked = false;
        const draw = () => {
          ul.innerHTML = '';
          order.forEach((it, i) => {
            const correct = checked && G.timeline[i].id === it.id;
            ul.append(h('li.order-item' + (checked ? (correct ? '.ok' : '.bad') : ''), h('span.on', String(i + 1)), h('span', it.t, checked ? h('span.od', '  · ' + it.d) : null),
              h('span.arrows', h('button', { 'aria-label': 'Move up', onclick: () => { if (i > 0) { [order[i - 1], order[i]] = [order[i], order[i - 1]]; checked = false; draw(); } } }, '▲'),
                h('button', { 'aria-label': 'Move down', onclick: () => { if (i < order.length - 1) { [order[i + 1], order[i]] = [order[i], order[i + 1]]; checked = false; draw(); } } }, '▼'))));
          });
        };
        draw();
        let tries = 0;
        const check = h('button.deco-btn', { onclick: () => {
          checked = true; tries++; draw();
          const right = order.filter((it, i) => G.timeline[i].id === it.id).length;
          fb.innerHTML = '';
          if (right === order.length) { pts += Math.max(4, 12 - tries * 2); sfx('correct'); fb.append(feedback('', 'Timeline correct!', h('div', 'Notice the key detail: Harding died in August 1923, before the Senate hearings revealed the money trail. That timing matters when judging what he knew.')), nextBtn('Next: identify the official ▸', s3)); }
          else { sfx('gentle'); fb.append(feedback('amber', `${right} of ${order.length} in the right place`, h('div', 'Green items are placed correctly; dates are now shown as clues. Rearrange and check again.')), h('button.link-btn', { onclick: () => { order = G.timeline.slice(); checked = true; draw(); fb.append(nextBtn('Continue ▸', s3)); } }, 'Show me the correct order')); }
        } }, 'Check timeline');
        sh.set(h('div.g-card', h('div.g-kicker', 'STEP 2 · BUILD THE TIMELINE'), h('div.g-title', 'Put the events in order'), h('p', 'Use the arrows to arrange events from earliest (top) to latest (bottom).'), ul, h('div', { style: { marginTop: '10px' } }, check)), fb);
      };
      const mc = (stepI, kicker, title, Q, next, val) => {
        sh.step(stepI);
        const fb = h('div');
        const bs = Q.opts.map((o, k) => h('button.g-opt', { onclick: () => {
          bs.forEach((b) => (b.disabled = true)); bs[Q.a].classList.add('right');
          const ok = k === Q.a; if (!ok) bs[k].classList.add('wrong');
          if (ok) { pts += val; sfx('correct'); } else sfx('gentle');
          fb.append(feedback(ok ? '' : 'amber', ok ? 'Correct' : 'Look again at the evidence', h('div', Q.exp)), nextBtn('Next ▸', next));
        } }, o));
        sh.set(h('div.g-card', h('div.g-kicker', kicker), h('div.g-title', title), h('p', Q.q), h('div.g-opts', bs)), fb);
      };
      const s3 = () => mc(2, 'STEP 3 · IDENTIFY THE OFFICIAL', 'Who arranged the leases?', G.suspect, s4, 10);
      // 4. connect leases
      const s4 = () => {
        sh.step(3);
        const fb = h('div');
        let sel = null, done = 0;
        const L = G.connect.pairs.map(([res]) => h('button.mcard', { onclick: (e) => { if (e.currentTarget.classList.contains('done')) return; L.forEach((b) => b.classList.remove('sel')); e.currentTarget.classList.add('sel'); sel = res; } }, '🛢 ' + res));
        const Rb = shuffle(G.connect.pairs, 2).map(([res, co]) => h('button.mcard', { onclick: (e) => {
          if (!sel || e.currentTarget.classList.contains('done')) return;
          if (sel === res) { e.currentTarget.classList.add('done'); L.find((b) => b.textContent.includes(res)).classList.add('done'); done++; pts += 5; sfx('correct'); fb.innerHTML = ''; fb.append(feedback('', '✓ Connected', h('div', `${res} → ${co}`))); sel = null;
            if (done === G.connect.pairs.length) fb.append(feedback('blue', 'The pattern', h('div', 'Both leases went to oilmen who had given Fall money: Doheny’s $100,000 “loan,” and bonds and cash from Sinclair’s interests. Public resource → private profit → payment to the official.')), nextBtn('Next: fact or assumption? ▸', s5)); }
          else { sfx('gentle'); e.currentTarget.classList.add('shake'); setTimeout(() => e.currentTarget.classList.remove('shake'), 400); }
        } }, '💼 ' + co));
        sh.set(h('div.g-card', h('div.g-kicker', 'STEP 4 · FOLLOW THE OIL'), h('div.g-title', 'Connect each reserve to its leaseholder'), h('p', G.connect.q), h('div.match', h('div.col', L), h('div.col', Rb))), fb);
      };
      // 5. claims
      const s5 = () => {
        sh.step(4);
        let answered = 0;
        const fb = h('div');
        const cards = G.claims.map((c) => {
          const res = h('div');
          const card = h('div.claim', h('div', '“' + c.t + '”'));
          const btns = h('div.cbtns',
            h('button.deco-btn.small.teal', { onclick: () => judge(true) }, 'Supported by evidence'),
            h('button.deco-btn.small.wine', { onclick: () => judge(false) }, 'Not supported / false'));
          const judge = (v) => {
            btns.querySelectorAll('button').forEach((b) => (b.disabled = true));
            const ok = v === c.proven;
            card.classList.add(ok ? 'ok' : 'bad');
            if (ok) { factPts += 4; sfx('correct'); } else sfx('gentle');
            res.append(h('div', { style: { marginTop: '6px', fontSize: '14.5px' } }, (ok ? '✓ ' : '✗ ') + c.exp));
            answered++;
            if (answered === G.claims.length) fb.append(feedback('', 'Fact vs. assumption', h('div', 'Historians reward precision. Corruption in Harding’s administration is established; Harding personally taking bribes is not. Saying only what the evidence supports is the heart of good reporting.')), nextBtn('Next ▸', s6));
          };
          card.append(btns, res);
          return card;
        });
        sh.set(h('div.g-card', h('div.g-kicker', 'STEP 5 · PROOF OR RUMOR?'), h('div.g-title', 'What does the evidence prove?'), h('p', 'Judge each claim. Points here count double toward your investigator rating.'), cards), fb);
      };
      const s6 = () => mc(5, 'STEP 6 · ACCOUNTABILITY', 'The Senate’s role', G.senate, end, 10);
      const end = () => {
        sh.step(6);
        const total = pts + factPts;
        const rating = total >= 60 ? 'Pulitzer-worthy investigator' : total >= 45 ? 'Senior reporter' : total >= 30 ? 'Cub reporter' : 'Junior fact-checker';
        sh.set(h('div.g-card', h('div.g-kicker', 'CASE CLOSED'), h('div.g-title', 'Investigator rating: ' + rating), h('p', `Score: ${total} (including ${factPts} points for separating facts from assumptions).`),
          h('div.paper-doc', { style: { fontFamily: 'var(--f-type)', fontSize: '15px', lineHeight: '1.6' } }, G.summary),
          h('p', { style: { marginTop: '12px' } }, h('b', 'Final question: '), 'What safeguards should prevent officials from using public resources for private gain? Think about competitive bidding, independent auditors (remember the 1921 GAO?), a free press, and congressional oversight. ')),
          nextBtn('Finish ✓', () => NF.UI.closeTop()));
        sh.finish(total);
      };
      s1();
    },

    /* ================= ROOM 4: BALANCING THE BUDGET ================= */
    g_r4() {
      const sh = shell('r4', 2), G = sh.G;
      const alloc = {}; G.cats.forEach((c) => (alloc[c.id] = 0));
      const used = () => Object.values(alloc).reduce((a, b) => a + b, 0);
      const ind = () => { const r = { business: 0, farm: 0, debt: 0, services: 0 }; G.cats.forEach((c) => Object.entries(c.fx).forEach(([k, v]) => (r[k] += v * alloc[c.id]))); return r; };
      sh.step(0);
      const left = h('div.bud-left'), indBox = h('div.ind-grid'), submit = h('button.deco-btn', { onclick: () => result() }, 'Submit my budget ▸');
      const update = () => {
        left.textContent = `Points remaining: ${G.budget - used()} of ${G.budget}`;
        const r = ind(); indBox.innerHTML = '';
        Object.entries(G.indicators).forEach(([k, name]) => indBox.append(h('div.ind', h('b', (r[k] > 0 ? '+' : '') + r[k]), name)));
        submit.disabled = used() !== G.budget;
        rows.forEach((row) => (row._pts.textContent = alloc[row._id]));
      };
      const rows = G.cats.map((c) => {
        const pts = h('span.pts', '0');
        const row = h('div.bud-row', h('div', h('div.bn', c.name), h('div.bd', c.desc + '  Effects: ' + Object.entries(c.fx).filter(([, v]) => v).map(([k, v]) => `${G.indicators[k]} ${v > 0 ? '+' : ''}${v}`).join(', '))),
          h('div.bud-ctrl', h('button', { 'aria-label': 'Remove a point from ' + c.name, onclick: () => { if (alloc[c.id] > 0) { alloc[c.id]--; sfx('click'); update(); } } }, '−'), pts,
            h('button', { 'aria-label': 'Add a point to ' + c.name, onclick: () => { if (used() < G.budget) { alloc[c.id]++; sfx('click'); update(); } } }, '+')));
        row._pts = pts; row._id = c.id;
        return row;
      });
      sh.set(h('div.g-card', h('div.g-kicker', 'FICTIONAL ADVISER · 1925'), h('div.g-title', 'Write the federal budget'), h('span.sim-label', 'SIMPLIFIED SIMULATION, NOT COOLIDGE’S ACTUAL BUDGET'), h('p', G.rules),
        h('p', { style: { fontSize: '15px', color: '#6a5a48' } }, 'Scoring rule: each point adds its listed effects to the indicators. “Debt reduction” goes down when you spend on programs and up when you retire debt.')),
        left, h('div.budget-grid', rows), indBox, submit);
      update();
      const result = () => {
        sh.step(1);
        const r = ind();
        const top = G.cats.filter((c) => alloc[c.id] > 0).sort((a, b) => alloc[b.id] - alloc[a.id]);
        const coolidgeLike = alloc.tax + alloc.debt >= 6;
        sh.set(h('div.g-card', h('div.g-kicker', 'BUDGET REVIEW'), h('div.g-title', coolidgeLike ? 'A Coolidge-style budget' : alloc.farm + alloc.vets + alloc.roads >= 6 ? 'An activist budget' : 'A mixed budget'),
          h('div.ind-grid', Object.entries(G.indicators).map(([k, name]) => h('div.ind', h('b', (r[k] > 0 ? '+' : '') + r[k]), name))),
          h('h3', { style: { color: '#7a2630', fontFamily: 'var(--f-pixel)' } }, 'Advantages, winners and losers of your choices'),
          top.map((c) => h('div.arg-item', h('b', `${c.name} (${alloc[c.id]} pts): `), `Benefits ${c.helps}. Trade-off: ${c.hurts}.`)),
          (alloc.farm === 0 ? h('div.arg-item.counter', h('b', 'Who was left out: '), 'With no farm relief, farm families facing low crop prices get no direct help, which is the situation many farmers experienced in the 1920s.') : null),
          (alloc.tax === 0 && alloc.debt === 0 ? h('div.arg-item.counter', h('b', 'Who was left out: '), 'Without tax cuts or debt reduction, investors and taxpayers who wanted a smaller government might lose confidence.') : null),
          h('h3', { style: { color: '#7a2630', fontFamily: 'var(--f-pixel)' } }, 'How does this compare with the real administration?'),
          feedback('blue', 'The historical record', h('div', G.actual), ...G.srcs.map(srcLine)),
          h('p', { style: { marginTop: '10px' } }, h('b', 'Economic reasoning: '), 'Every point you spent somewhere was a point you could not spend elsewhere. That is opportunity cost, the same trade-off Coolidge, Mellon and Congress argued about.')),
          h('div', { style: { display: 'flex', gap: '10px', flexWrap: 'wrap' } }, nextBtn('Try a different budget', () => { NF.UI.closeTop(); Games.g_r4(); }), nextBtn('Finish ✓', () => NF.UI.closeTop())));
        sh.finish(null);
      };
    },

    /* ================= ROOM 5: REPAIR THE INTERNATIONAL ECONOMY ================= */
    g_r5() {
      const sh = shell('r5', 4), G = sh.G;
      let made = 0, from = null;
      const done = new Set();
      sh.step(0);
      const board = h('div.flow-board');
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '0 0 160 90');
      svg.innerHTML = '<defs><marker id="ah2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="#f3d58a"/></marker><style>.fl2{stroke-dasharray:4 3;animation:dash2 1.2s linear infinite}@keyframes dash2{to{stroke-dashoffset:-14}}</style></defs>';
      board.append(svg);
      const fb = h('div'), labelBox = h('div');
      const nodeEls = {};
      G.nodes.forEach((n) => {
        const el = h('button.fnode', { style: { left: n.x * 100 + '%', top: n.y * 100 + '%' }, onclick: () => clickNode(n.id) }, n.name);
        nodeEls[n.id] = el; board.append(el);
      });
      const pos = (id) => { const n = G.nodes.find((x) => x.id === id); return [n.x * 160, n.y * 90]; };
      const drawArrow = (a, b, label, col) => {
        const [x1, y1] = pos(a), [x2, y2] = pos(b);
        const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy);
        const sx = x1 + (dx / len) * 22, sy = y1 + (dy / len) * 9, ex = x2 - (dx / len) * 22, ey = y2 - (dy / len) * 9;
        svg.insertAdjacentHTML('beforeend', `<line class="fl2" x1="${sx}" y1="${sy}" x2="${ex}" y2="${ey}" stroke="${col}" stroke-width="1.6" marker-end="url(#ah2)"/><text x="${(sx + ex) / 2}" y="${(sy + ey) / 2 - 2}" font-size="3.4" fill="#f3d58a" text-anchor="middle" font-family="Pixelify Sans">${label}</text>`);
      };
      const clickNode = (id) => {
        if (made >= G.flows.length) return;
        if (!from) { from = id; Object.values(nodeEls).forEach((e) => e.classList.remove('sel')); nodeEls[id].classList.add('sel'); sfx('click'); fb.innerHTML = ''; fb.append(feedback('blue', 'Now choose where the money goes', h('div', 'Click the node that receives money from ' + G.nodes.find((n) => n.id === id).name + '.'))); return; }
        if (from === id) { from = null; nodeEls[id].classList.remove('sel'); return; }
        const flow = G.flows.find((f) => f.from === from && f.to === id && !done.has(f));
        const a = from; from = null; Object.values(nodeEls).forEach((e) => e.classList.remove('sel'));
        fb.innerHTML = '';
        if (!flow) { sfx('gentle'); fb.append(feedback('amber', 'That link wasn’t part of the Dawes-era cycle', h('div', 'Hint: start with who had money to lend after the war, and remember the money traveled in a circle.'))); return; }
        // choose the label
        labelBox.innerHTML = '';
        labelBox.append(h('p', { style: { textAlign: 'center', margin: '10px 0 0' } }, 'Good connection! What kind of payment is this?'),
          h('div.label-pick', G.labels.map((lb) => h('button.chip', { onclick: (e) => {
            if (lb === flow.label) {
              sfx('correct'); done.add(flow); made++; labelBox.innerHTML = '';
              drawArrow(a, id, lb, ['#f2c14a', '#e86a5a', '#6ab0e8'][G.flows.indexOf(flow)]);
              fb.innerHTML = ''; fb.append(feedback('', '✓ ' + lb, h('div', flow.exp)));
              sh.step(Math.min(made, 1));
              if (made === G.flows.length) fb.append(feedback('blue', 'The circle is complete', h('div', 'U.S. banks → Germany → the Allies → the U.S. government. Each payment depended on the one before it.')), nextBtn('Next: stress-test the system ▸', scen));
            } else { sfx('gentle'); e.currentTarget.classList.add('shake'); setTimeout(() => e.currentTarget.classList.remove('shake'), 400); }
          } }, lb))));
      };
      sh.set(h('div.g-card', h('div.g-kicker', 'STEP 1 · REBUILD THE CYCLE'), h('div.g-title', 'Follow the money, 1924–1928'), h('span.sim-label', 'SIMPLIFIED MODEL'), h('p', 'Click the node where money starts, then the node it flows to, then name the payment. Rebuild all three links.')), board, labelBox, fb);
      const scen = () => {
        sh.step(2);
        const S = G.scenario, fb2 = h('div');
        const sel = new Set();
        const bs = S.opts.map((o, k) => h('button.g-opt', { onclick: (e) => { if (sel.has(k)) { sel.delete(k); e.currentTarget.classList.remove('sel'); } else { sel.add(k); e.currentTarget.classList.add('sel'); } sfx('click'); } }, '☐ ' + o.t));
        const check = h('button.deco-btn', { onclick: () => {
          check.disabled = true;
          bs.forEach((b, k) => { b.disabled = true; b.classList.remove('sel'); b.classList.add(S.opts[k].a ? 'right' : (sel.has(k) ? 'wrong' : 'x')); b.firstChild.textContent = (S.opts[k].a ? '☑ ' : '☐ ') + S.opts[k].t; });
          const right = S.opts.every((o, k) => o.a === sel.has(k));
          sfx(right ? 'correct' : 'gentle');
          fb2.append(feedback(right ? '' : 'amber', right ? 'Exactly: the whole chain is affected' : 'Every link depended on the first one', h('div', S.exp), srcLine(G.src)), feedback('blue', 'Important caveat', h('div', S.caveat)), nextBtn('Bonus question ▸', bonus));
        } }, 'Check my prediction');
        sh.set(h('div.g-card', h('div.g-kicker', 'STEP 2 · WHAT IF?'), h('div.g-title', S.title), h('p', S.prompt), h('div.g-opts', bs), h('div', { style: { marginTop: '10px' } }, check)), fb2);
      };
      const bonus = () => {
        sh.step(3);
        const Q = G.kellogg, fb3 = h('div');
        const bs = Q.opts.map((o, k) => h('button.g-opt', { onclick: () => { bs.forEach((b) => (b.disabled = true)); bs[Q.a].classList.add('right'); if (k !== Q.a) bs[k].classList.add('wrong'); sfx(k === Q.a ? 'correct' : 'gentle');
          fb3.append(feedback(k === Q.a ? '' : 'amber', k === Q.a ? 'Correct' : 'Not quite', h('div', Q.exp), srcLine('ohs-kellogg')),
            h('p', { style: { marginTop: '10px' } }, h('b', 'Takeaway: '), 'Normalcy did not mean isolation. American loans, treaties, and tariffs tied the U.S. to the world, and made the whole system vulnerable when U.S. lending stopped.'),
            nextBtn('Finish ✓', () => NF.UI.closeTop()));
          sh.finish(null);
        } }, o));
        sh.set(h('div.g-card', h('div.g-kicker', 'BONUS'), h('div.g-title', 'Promises vs. enforcement'), h('p', Q.q), h('div.g-opts', bs)), fb3);
      };
    },

    /* ================= ROOM 6: WHO EXPERIENCED NORMALCY? ================= */
    g_r6() {
      const G = NF.CONTENT.GAMES.r6;
      const sh = shell('r6', G.profiles.length + 1);
      sh.step(0);
      sh.set(h('div.g-card', h('div.g-kicker', 'HISTORICAL PERSPECTIVES'), h('div.g-title', 'Six lives in the 1920s'), h('p', G.intro),
        h('p', { style: { fontSize: '15px', color: '#6a5a48' } }, 'These stories touch on discrimination and hardship. Read them with care; the goal is empathy and evidence-based understanding.')),
        nextBtn('Meet the first person ▸', () => show(0)));
      const show = (i) => {
        if (i >= G.profiles.length) return end();
        sh.step(i + 1);
        const p = G.profiles[i], fb = h('div');
        const cv = h('canvas', { width: 18, height: 16 });
        const g = cv.getContext('2d'); g.imageSmoothingEnabled = false; g.drawImage(NF.Art.portrait(NF.LOOKS[p.look] || NF.LOOKS.guide), 0, 0);
        const bs = p.opts.map((o, k) => h('button.g-opt', { onclick: () => {
          bs.forEach((b) => (b.disabled = true)); bs[p.a].classList.add('right');
          const ok = k === p.a;
          if (!ok) bs[k].classList.add('sel');
          sfx(ok ? 'correct' : 'page');
          fb.append(feedback(ok ? '' : 'blue', ok ? 'A direct connection' : 'That mattered in the 1920s, but the most direct connection is: ' + p.opts[p.a], h('div', p.exp), srcLine(p.src)),
            nextBtn(i < G.profiles.length - 1 ? 'Next person ▸' : 'Reflect ▸', () => show(i + 1)));
        } }, o));
        sh.set(h('div.g-card', h('div.profile', cv, h('div', h('span.composite-tag', 'HISTORICAL COMPOSITE, NOT A REAL INDIVIDUAL'), h('div.g-title', { style: { margin: '0' } }, p.name), h('div.g-kicker', p.role.toUpperCase()), h('p', { style: { marginTop: '8px' } }, p.story))),
          h('p', h('b', 'Which policy or event most directly shaped this person’s life?')), h('div.g-opts', bs)), fb);
      };
      const end = () => {
        sh.set(h('div.g-card', h('div.g-kicker', 'PERSPECTIVES GATHERED · 6 OF 6'), h('div.g-title', 'Normalcy for whom?'),
          h('p', 'The same decade brought tariffs and tax cuts that helped a factory owner, an injunction that hurt a railroad family, vetoes that left a farmer struggling, a quota that kept a family apart, a court case that expanded free speech, and Northern jobs shadowed by discrimination.'),
          h('p', h('b', 'Reflect: '), 'Can a country truly return to normal if its definition of normal excludes or disadvantages some of its people? Carry your answer to the Courthouse.')),
          nextBtn('Finish ✓', () => NF.UI.closeTop()));
        sh.finish(null);
      };
    },

    /* ================= FINAL: JUDGE NORMALCY ================= */
    // The courthouse has two parts: (1) a verdict backed by evidence, (2) written answers checked by a rubric.
    verdict() {
      const stage = h('div');
      const tabs = h('div.tabs', { role: 'tablist' });
      const tabBtn = (label, fn) => h('button.tab', { role: 'tab', onclick: (e) => { [...tabs.children].forEach((t) => t.classList.remove('on')); e.currentTarget.classList.add('on'); fn(); } }, label);
      const t1 = tabBtn('1. Your verdict', () => Games.verdictPart(stage));
      const t2 = tabBtn('2. Written answers', () => Games.writtenPart(stage));
      tabs.append(t1, t2);
      NF.UI.modal({ kicker: 'The Courthouse', title: 'Judge Normalcy', body: h('div', tabs, stage), cls: 'game-modal', closeText: 'Leave the bench' });
      t1.classList.add('on');
      Games.verdictPart(stage);
    },

    verdictPart(stage) {
      const C = NF.CONTENT, S = NF.Save.data;
      const visited = ['r1', 'r2', 'r3', 'r4', 'r5', 'r6'].filter((r) => S.visited[r]).length;
      let choice = S.verdict ? S.verdict.choice : null;
      const picked = new Set(S.verdict ? S.verdict.evidence : []);
      const go = h('button.deco-btn', { style: { marginTop: '14px' }, onclick: () => argue() });
      const upd = () => { go.disabled = !(choice && picked.size >= 2); go.textContent = choice && picked.size >= 2 ? 'Build my argument ▸' : `Choose a verdict and ${Math.max(0, 2 - picked.size)} more piece(s) of evidence`; };
      const intro = () => {
        stage.innerHTML = '';
        stage.append(h('div.g-card', h('div.g-kicker', 'The central question'), h('div.g-title', '“Did America’s return to normalcy succeed?”'),
          h('p', 'There is no single correct verdict. Historians disagree, but every strong interpretation is built on evidence. Choose a conclusion, then support it with at least two pieces of evidence from the museum.'),
          visited < 6 ? feedback('amber', `You have visited ${visited} of 6 exhibits`, h('div', 'You can give a verdict now, but you will have more evidence if you visit every exhibit first. Press M to travel.')) : null),
          h('h3', 'Step 1: choose your verdict'),
          h('div.verdict-opts', Object.entries(C.VERDICTS).map(([k, v]) => h('button.vopt' + (choice === k ? '.sel' : ''), { onclick: (e) => { choice = k; stage.querySelectorAll('.vopt').forEach((b) => b.classList.remove('sel')); e.currentTarget.classList.add('sel'); sfx('click'); upd(); } }, h('b', v.name), v.d))),
          h('h3', 'Step 2: select your evidence (at least two)'),
          h('p.muted', 'Items marked “seen” are exhibits you have already examined.'),
          h('div.ev-grid', C.EVIDENCE.map((e) => h('button.ev' + (picked.has(e.id) ? '.sel' : '') + (S.examined[e.art] ? '.seen' : ''), { 'aria-pressed': String(picked.has(e.id)), onclick: (ev) => { if (picked.has(e.id)) picked.delete(e.id); else picked.add(e.id); ev.currentTarget.classList.toggle('sel'); ev.currentTarget.setAttribute('aria-pressed', String(picked.has(e.id))); sfx('click'); upd(); } },
            h('small', C.ROOMS[e.room] ? 'Exhibit ' + C.ROOMS[e.room].num : ''), e.label))),
          go);
        upd();
      };
      const argue = () => {
        const V = C.VERDICTS[choice];
        const evs = C.EVIDENCE.filter((e) => picked.has(e.id));
        const sup = evs.filter((e) => e.leans.includes(choice)), comp = evs.filter((e) => !e.leans.includes(choice));
        const counter = C.EVIDENCE.filter((e) => !picked.has(e.id) && !e.leans.includes(choice)).slice(0, 2);
        S.verdict = { choice, evidence: [...picked], at: Date.now() }; NF.Save.save();
        sfx('complete');
        stage.innerHTML = '';
        stage.append(h('div.argument',
          h('div.g-kicker', 'Your verdict'), h('div.g-title', V.name), h('p', V.d),
          h('h3', 'How your evidence supports it'),
          sup.length ? sup.map((e) => h('div.arg-item', h('b', e.label + ': '), e.notes[choice])) : h('p', 'None of your evidence directly supports this verdict. Consider choosing different evidence or a different conclusion.'),
          comp.length ? [h('h3', 'Evidence that complicates your verdict'), comp.map((e) => h('div.arg-item.counter', h('b', e.label + ': '), e.notes[choice]))] : null,
          counter.length ? [h('h3', 'A historian might push back with…'), counter.map((e) => h('div.arg-item.counter', h('b', e.label + ': '), e.notes[e.leans[0]]))] : null,
          h('p', 'Strong arguments admit the counter-evidence and explain why their conclusion still holds.')),
          h('h3', 'Questions to keep thinking about'), h('ul.plain', C.FOLLOWUPS.map((q) => h('li', q))),
          h('div.btn-row',
            h('button.deco-btn.small.ghost', { onclick: intro }, '◂ Revise my verdict'),
            h('button.deco-btn.small', { onclick: () => { const tab = document.querySelectorAll('.tabs .tab')[1]; if (tab) tab.click(); } }, 'Next: written answers ▸')));
        NF.UI.updateHud();
        NF.UI.toast('Verdict recorded', 'The Courthouse', '⚖');
      };
      if (S.verdict && choice && picked.size >= 2) argue(); else intro();
    },

    /* ---------- written answers + rubric ---------- */
    writtenPart(stage) {
      const C = NF.CONTENT, S = NF.Save.data;
      S.written = S.written || {};
      stage.innerHTML = '';
      stage.append(h('div.g-card',
        h('div.g-kicker', 'Written answers'), h('div.g-title', 'Make your case in writing'),
        h('p', 'Answer one or more questions in a few sentences. Each answer is checked against a four-point rubric: historical accuracy, specific evidence, reasoning, and connection to normalcy.'),
        h('p.muted', 'How the checking works: this is an automatic rubric that looks for evidence from the museum, reasoning words, a connection to normalcy and common factual errors. It is not a teacher and it is not an AI, so it can miss good ideas. Any conclusion can earn full marks if it is well supported.')));
      C.WRITTEN.forEach((W) => stage.append(Games.writtenCard(W)));
    },
    writtenCard(W) {
      const S = NF.Save.data;
      S.written = S.written || {};
      const saved = S.written[W.id] || {};
      const ta = h('textarea.reflect-box', { 'aria-label': W.q, placeholder: 'Write your answer here. Make a claim, give evidence, explain why.' });
      ta.value = saved.answer || '';
      const count = h('span.muted', '');
      const updCount = () => { const n = (ta.value.match(/[A-Za-z0-9’']+/g) || []).length; count.textContent = n + ' words'; };
      ta.oninput = () => { updCount(); S.written[W.id] = Object.assign({}, S.written[W.id] || {}, { answer: ta.value }); NF.Save.save(); };
      updCount();
      const out = h('div.grade-out', { 'aria-live': 'polite' });
      const render = (r, rec) => {
        out.innerHTML = '';
        const rows = r.criteria.map((c) => h('li.crit' + (c.ok ? '.ok' : '.no'), h('span.crit-mark', c.ok ? '✓' : '○'), h('div', h('b', c.name), h('div', c.msg))));
        out.append(h('div.grade',
          h('div.grade-head', h('span.grade-score', r.score + ' / 4'), h('span', r.headline)),
          h('ul.crits', rows),
          r.tips.length ? h('div.grade-tips', h('b', 'To improve:'), h('ul.plain', r.tips.map((t) => h('li', t)))) : h('p', 'This answer meets every part of the rubric. A teacher may still have more to say.'),
          rec && rec.attempts ? h('p.muted', 'Submitted ' + rec.attempts + (rec.attempts === 1 ? ' time' : ' times') + '. Edit your answer above and submit again to revise it.') : null));
      };
      const submit = h('button.deco-btn.small', { onclick: () => {
        const r = Games.grade(W, ta.value);
        if (!r) { out.innerHTML = ''; out.append(feedback('amber', 'Write a little more first', h('div', 'Your answer needs at least a couple of sentences before it can be checked.'))); return; }
        const prev = S.written[W.id] || {};
        S.written[W.id] = { answer: ta.value, score: r.score, at: Date.now(), attempts: (prev.attempts || 0) + 1, result: r };
        NF.Save.save();
        sfx(r.score >= 3 ? 'correct' : 'gentle');
        render(r, S.written[W.id]);
      } }, 'Submit answer');
      if (saved.result) render(saved.result, saved);
      return h('div.g-card.written',
        h('div.g-kicker', W.title), h('p.wq', W.q), h('p.muted', 'Tip: ' + W.tip),
        ta, h('div.btn-row', submit, count), out);
    },

    // Transparent rubric scoring. Returns null when the answer is too short to check.
    grade(W, text) {
      const C = NF.CONTENT;
      const raw = (text || '').trim();
      const words = raw.match(/[A-Za-z0-9’']+/g) || [];
      if (words.length < 12) return null;
      const t = raw.toLowerCase().replace(/’/g, "'");
      const found = [];
      W.evidence.forEach(([re, label]) => { if (new RegExp(re, 'i').test(t) && !found.includes(label)) found.push(label); });
      const flags = C.RED_FLAGS.filter((f) => new RegExp(f.re, 'i').test(t));
      const connectors = ['because', 'therefore', 'this shows', 'which shows', 'this means', 'which meant', 'as a result', 'since', 'so that', 'led to', 'demonstrates', 'proves', 'suggests', 'reveals', 'shows that', 'for example', 'for instance', 'however', 'although', 'which is why'];
      const reasons = connectors.filter((c) => t.includes(c));
      const claimRe = /\b(i think|i believe|i argue|in my view|did not|didn't|led to|revealed|showed|failed|succeeded|protected|helped|hurt|served|benefited|mostly|partly|partially|clearly|was a|were)\b/;
      const hasClaim = claimRe.test(t);
      const conn = W.connect.filter((c) => t.includes(c));
      const crit = [];
      const tips = [];
      // 1. historical accuracy
      if (flags.length) {
        crit.push({ name: 'Historical accuracy', ok: false, msg: 'Part of your answer conflicts with the evidence. ' + flags.map((f) => f.fix).join(' ') });
        tips.push('Correct the factual problem described above, then submit again.');
      } else if (found.length) {
        crit.push({ name: 'Historical accuracy', ok: true, msg: 'Your historical details match the museum’s evidence, and no common errors were found.' });
      } else {
        crit.push({ name: 'Historical accuracy', ok: false, msg: 'There is not enough specific history here to check for accuracy yet.' });
      }
      // 2. specific evidence
      if (found.length >= 2) crit.push({ name: 'Specific evidence', ok: true, msg: 'You used specific evidence: ' + found.slice(0, 4).join(', ') + '.' });
      else if (found.length === 1) { crit.push({ name: 'Specific evidence', ok: true, msg: 'You used one piece of specific evidence (' + found[0] + '). A second example would strengthen the argument.' }); tips.push('Add a second specific example, such as a date, a law, a person or an artifact you examined.'); }
      else { crit.push({ name: 'Specific evidence', ok: false, msg: 'Your answer needs a specific historical example from the museum.' }); tips.push('Name a specific person, law, event, date or artifact, for example ' + W.evidence.slice(0, 3).map((e) => e[1]).join(', ') + '.'); }
      // 3. reasoning
      const longEnough = words.length >= 35;
      if (reasons.length && longEnough && hasClaim) crit.push({ name: 'Reasoning', ok: true, msg: 'You explain how your evidence supports your claim (for example, using “' + reasons[0] + '”).' });
      else {
        crit.push({ name: 'Reasoning', ok: false, msg: !hasClaim ? 'State your claim clearly: did it succeed, fail, or something in between?' : !reasons.length ? 'Your answer lists facts but does not yet explain why they support your claim.' : 'Develop your explanation further; a few more sentences will help.' });
        tips.push(!reasons.length ? 'Connect your evidence to your claim with words like “because,” “this shows,” or “as a result,” and explain the link.' : 'Aim for at least three or four sentences: a claim, the evidence, and an explanation.');
      }
      // 4. connection to normalcy
      if (conn.length) crit.push({ name: 'Connection to normalcy', ok: true, msg: 'You tie your argument to the bigger question (you mention ' + conn.slice(0, 2).map((c) => '“' + c + '”').join(' and ') + ').' });
      else {
        crit.push({ name: 'Connection to normalcy', ok: false, msg: 'Tie your argument back to the promise of normalcy and what it meant for the country.' });
        tips.push(W.id === 'w1' ? 'Explain what the scandal means for public trust, government accountability, or Harding’s promise of normalcy.' : W.id === 'w2' ? 'Say whether the policy served the public interest as a whole, and how that fits the promise of normalcy.' : 'Say whether freedom and opportunity were shared equally, and what that means for normalcy.');
      }
      if (W.id === 'w1' && found.some((f) => /Teapot|Fall|leases|bribe/.test(f)) && !conn.some((c) => /trust|accountab|oversight|public/.test(c))) tips.push('You cite Teapot Dome. Now explain its significance: how did the scandal affect public trust and government accountability?');
      const score = crit.filter((c) => c.ok).length;
      const headline = score === 4 ? 'Strong, well-supported answer.' : score === 3 ? 'Good answer with one area to improve.' : score === 2 ? 'A start. Two parts of the rubric still need work.' : 'Keep building this answer using the suggestions below.';
      return { score, headline, criteria: crit, tips: [...new Set(tips)] };
    },
  });
})();
