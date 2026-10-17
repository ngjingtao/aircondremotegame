/* ═══════════════════════════════════════════
   aircare/js/main.js — boot + loop
   ═══════════════════════════════════════════ */
(function () {

  const CW = 300;   // panel design width
  const CH = 640;   // panel design height

  const $ = id => document.getElementById(id);

  function layout() {
    const mainEl = document.querySelector('main');
    const panel = $('ctl-panel');
    const scaler = $('ctl-scaler');
    if (!mainEl || !panel) return;

    if (ARG.shell && ARG.shell.isCollapsed()) {


      panel.style.flexBasis = '0px';


      return;


    }


    const totalW = mainEl.clientWidth;
    const availH = panel.clientHeight - 16;
    const tablet = totalW >= 700 && mainEl.clientHeight >= 560;

    const maxPanelW = Math.min(totalW * (tablet ? 0.48 : 0.56), tablet ? 520 : 430);
    const maxScale = tablet ? 1.4 : 1.15;

    let scale = Math.min((maxPanelW - 20) / CW, availH / CH);
    scale = Math.max(0.30, Math.min(scale, maxScale));

    document.documentElement.style.setProperty('--ctl-scale', scale);
    scaler.style.width = (CW * scale) + 'px';
    scaler.style.height = (CH * scale) + 'px';
    panel.style.flexBasis = (CW * scale + 20) + 'px';
  }

  function handleAction(action, el) {
    /* ── narration ── */
    if (action === 'speakPart') {
      const key = el && el.dataset ? el.dataset.speak : null;
      const idx = el && el.dataset ? +el.dataset.part : -1;
      ARG.audio.blip();
      ARG.scene.focus(idx);
      if (key) ARG.voice.speak(ARG.i18n.t(key));
      return;
    }
    if (action === 'readAll') {
      ARG.audio.blip();
      narrateCycle();
      return;
    }
    if (action === 'jumpStep') {
      ARG.sim.s.step = +(el && el.dataset ? el.dataset.step : 0);
      ARG.audio.blip();
      speakStep();
      ARG.panel.render();
      ARG.scene.render(0.016);
      return;
    }

    const res = ARG.sim.press(action, el);
    if (!res) return;
    if (res.sound && typeof ARG.audio[res.sound] === 'function') ARG.audio[res.sound]();
    else ARG.audio.blip();

    if (action === 'mode') {
      ARG.voice.stop();
      if (ARG.sim.s.mode === 'wash') ARG.voice.speak(ARG.i18n.t('tWashIntro'));
      else ARG.voice.speak(ARG.i18n.t('tIdea'));
    }
    if (action === 'stepUp' || action === 'stepDown' || action === 'restart') {
      speakStep();
    }
    if (action === 'stepUp' && ARG.sim.s.step === ARG.sim.STEPS.length - 1) {
      ARG.scene.toast(ARG.i18n.t('washDone'), true);
      ARG.audio.cheer();
    }

    ARG.panel.render();
    ARG.scene.render(0.016);
  }

  /* read the whole cycle out, one part after another */
  let narrateTimer = null;
  function narrateCycle() {
    clearTimeout(narrateTimer);
    const parts = ['tIdea', 'tComp', 'tCond', 'tValve', 'tEvap'];
    let i = 0;
    (function next() {
      if (i >= parts.length) return;
      const idx = i - 1;
      ARG.scene.focus(idx >= 0 ? idx : -1);
      const txt = ARG.i18n.t(parts[i++]);
      ARG.voice.speak(txt);
      /* rough timing so the next part waits for the voice to finish */
      narrateTimer = setTimeout(next, Math.min(20000, 1400 + txt.length * 95));
    })();
  }

  function speakStep() {
    const st = ARG.sim.STEPS[ARG.sim.s.step];
    if (!st) return;
    const n = ARG.sim.s.step + 1;
    const head = ARG.i18n.lang === 'zh' ? ('第 ' + n + ' 步，') : ('Step ' + n + '. ');
    ARG.voice.speakLinked(document.getElementById('pane-note'),
      head + ARG.i18n.t(st.key) + '。' + ARG.i18n.t(st.fact));
  }

  let last = 0, running = true;

  function loop(now) {
    if (!running) return;
    const dt = last ? (now - last) / 1000 : 0.016;
    last = now;

    ARG.sim.tick(dt);
    ARG.scene.render(dt);
    ARG.panel.render();

    /* the sticker book: earned the first time it is really done */
    if (ARG.sim.s.mode === 'wash' && ARG.sim.s.step >= ARG.sim.STEPS.length - 1) ARG.progress.award('aircare');

    requestAnimationFrame(loop);
  }

  function boot() {
    ARG.scene.build();
    ARG.panel.build(handleAction);
    ARG.i18n.apply();
    ARG.voice.attach();
    ARG.shell.attach();
    ARG.a11y.init();

    $('btn-lang').addEventListener('click', () => {
      ARG.i18n.toggle();
      ARG.voice.syncLang();
      ARG.i18n.apply();
      ARG.panel.refresh();
      ARG.panel.render();
      ARG.scene.render(0.016);
    });

    $('btn-sound').addEventListener('click', e => {
      const on = ARG.audio.toggle();
      e.currentTarget.textContent = on ? '🔊' : '🔇';
    });
    $('btn-sound').textContent = ARG.audio.enabled ? '🔊' : '🔇';

    const help = $('help-overlay');
    $('btn-help').addEventListener('click', () => { help.hidden = false; });
    $('help-close').addEventListener('click', () => { help.hidden = true; });
    help.addEventListener('click', e => { if (e.target === help) help.hidden = true; });

    /* tapping the help or the note has it read out */
    ARG.voice.speakOnTap($('help-body'));
    ARG.voice.speakOnTap($('pane-note'));

    layout();
    window.addEventListener('resize', layout);
    window.addEventListener('orientationchange', () => setTimeout(layout, 250));
    if (window.ResizeObserver) new ResizeObserver(layout).observe(document.querySelector('main'));
    setTimeout(layout, 60);
    setTimeout(layout, 400);

    document.addEventListener('visibilitychange', () => {
      running = !document.hidden;
      if (running) { last = 0; requestAnimationFrame(loop); }
    });

    document.addEventListener('gesturestart', e => e.preventDefault());
    let lastTouch = 0;
    document.addEventListener('touchend', e => {
      const now = Date.now();
      if (now - lastTouch < 300) e.preventDefault();
      lastTouch = now;
    }, { passive: false });

    ARG.scene.render(0.016);
    ARG.panel.render();
    requestAnimationFrame(loop);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

})();
