/* =====================================================================
   THE NORMALCY FILES: main.js
   Boot sequence. Order: save data → audio settings → input → world +
   engine → UI → title screen (the help-desk video is always shown first).
   ===================================================================== */
(function () {
  'use strict';
  const NF = window.NF;
  function boot() {
    try {
      NF.Save.load();
      NF.Audio.init();
      NF.Input.init();
      NF.Game.init(document.getElementById('game'));
      NF.UI.init();
      NF.Title.init();
      document.getElementById('ts-loading').hidden = true;
      // keep voices list warm for text-to-speech previews
      if (window.speechSynthesis) { speechSynthesis.getVoices(); speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices(); }
    } catch (err) {
      console.error(err);
      const box = document.createElement('div');
      box.className = 'noscript';
      box.innerHTML = '<div style="max-width:560px;text-align:center;padding:20px"><h2 style="font-family:Limelight,serif;color:#f3d58a">The museum could not start</h2><p>Please try a current version of Chrome, Edge, Firefox or Safari. Details: ' + String(err && err.message) + '</p></div>';
      document.body.append(box);
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
