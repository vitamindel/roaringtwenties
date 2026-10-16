/* Regenerates docs/BIBLIOGRAPHY.html, docs/BIBLIOGRAPHY.md, docs/SCRIPTS.md and
   media/captions/helpdesk.vtt from js/content.js.   Run:  node tools/build-docs.js */
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
global.window = {};
require(path.join(root, 'js/content.js'));
const C = window.NF.CONTENT;
const strip = (s) => s.replace(/<[^>]+>/g, '');
const key = (s) => strip(s.mla).replace(/[“”"]/g, '');
const sorted = C.SOURCES.slice().sort((a, b) => key(a).localeCompare(key(b)));
const WPS = 2.75; // natural student pace: about 165 words per minute
const words = (a) => a.join(' ').split(/\s+/).length;

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Works Cited: The Normalcy Files</title>
<style>body{font-family:"Times New Roman",Times,serif;font-size:12pt;max-width:7in;margin:1in auto;line-height:2}h1{text-align:center;font-size:12pt;font-weight:normal;margin:0}p.c{padding-left:.5in;text-indent:-.5in;margin:0}h2{font-size:12pt;margin-top:2em}.note{font-size:10pt;line-height:1.4;color:#444}</style></head><body>
<p class="note">How to use: open this file in a browser, press Ctrl+A then Ctrl+C, and paste into Microsoft Word (or open it in Word with File, Open). Format: MLA 9th edition, alphabetized, hanging indent, double-spaced. If your teacher requires access dates, add “Accessed [day month year].” to each web source.</p>
<h1>Works Cited</h1>
${sorted.map((s) => `<p class="c">${s.mla} ${s.url}.</p>`).join('\n')}
<h2>Source-use notes (for the Secretary’s records; not part of the Works Cited page)</h2>
${sorted.map((s) => `<p class="note"><b>${s.type.toUpperCase()}</b>: ${strip(s.mla)}<br>Used for: ${strip(s.use)}</p>`).join('\n')}
<h2>Background music (public-domain recordings)</h2>
${Object.values(C.MUSIC).map((m) => `<p class="note">“${m.title},” ${m.artist}, ${m.year}. ${m.url}</p>`).join('\n')}
</body></html>
`;
fs.writeFileSync(path.join(root, 'docs/BIBLIOGRAPHY.html'), html);

fs.writeFileSync(path.join(root, 'docs/BIBLIOGRAPHY.md'), '# Works Cited: The Normalcy Files (MLA 9th ed.)\n\n' +
  sorted.map((s) => `- ${s.mla.replace(/<i>(.*?)<\/i>/g, '*$1*')} ${s.url}.  \n  *Type:* ${s.type}. *Used for:* ${strip(s.use)}`).join('\n') +
  '\n\n## Background music (public-domain recordings)\n\n' + Object.values(C.MUSIC).map((m) => `- “${m.title},” ${m.artist}, ${m.year}. ${m.url}`).join('\n') + '\n');

let sc = '# The Normalcy Files: Recording Scripts\n\nRead these naturally, like you are guiding a friend through a museum (about 160–170 words per minute). These scripts are also the on-screen captions and transcripts. If you change the wording when recording, update `js/content.js` to match, then run `node tools/build-docs.js`.\n\n';
sc += '## Help-desk welcome video\n\nSave as **media/video/helpdesk.mp4**. Captions: **media/captions/helpdesk.vtt**, timed to the recording. Below is the transcript of what was actually said.\n\n';
C.HELPDESK.forEach((l, i) => { sc += `${i + 1}. ${l}\n`; });
sc += `\n*(${words(C.HELPDESK)} words, ${Math.round(C.HELPDESK_CUES[C.HELPDESK_CUES.length - 1][1])} seconds as recorded)*\n`;
['r1', 'r2', 'r3', 'r4', 'r5', 'r6'].forEach((id) => {
  const r = C.ROOMS[id];
  sc += `\n## Exhibit ${r.num}: ${r.title}\n\nSave as **media/audio/room${r.num}.mp3**. Theme: *${r.question}*\n\n${r.narration.join('\n\n')}\n\n*(${words(r.narration)} words, about ${Math.round(words(r.narration) / WPS)} seconds)*\n`;
});
fs.writeFileSync(path.join(root, 'docs/SCRIPTS.md'), sc);

const fmt = (s) => { const m = Math.floor(s / 60); return '00:' + String(m).padStart(2, '0') + ':' + (s % 60).toFixed(3).padStart(6, '0'); };
let t = 0, vtt = 'WEBVTT\n\nNOTE Timed to the recorded help-desk video (media/video/helpdesk.mp4).\n\n';
C.HELPDESK_CUES.forEach(([a, b, l], i) => { vtt += `${i + 1}\n${fmt(a)} --> ${fmt(b)}\n${l}\n\n`; t = b; });
fs.writeFileSync(path.join(root, 'media/captions/helpdesk.vtt'), vtt);

const dash = [html, sc, vtt].join('').split(String.fromCharCode(0x2014)).length - 1;
console.log(`Wrote ${sorted.length} sources, scripts, and captions (${Math.round(t)} s). Em dashes in output: ${dash}`);
