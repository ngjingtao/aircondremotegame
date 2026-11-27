/* baggage/js/main.js — boot and loop */
(function () {
  const CW = 300, CH = 640;
  const $ = id => document.getElementById(id);
  let toastTimer = null;

  function toast(text, good) {
    if (!text) return;
    const el = $('toast');
    if (!el) return;
    el.textContent = text;
    el.classList.toggle('good', !!good);
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2400);
  }

  function layout() {
    const mainEl = document.querySelector('main');
    const panel = $('ctl-panel');
    const scaler = $('ctl-scaler');
    if (!mainEl || !panel) return;
    if (ARG.shell && ARG.shell.isCollapsed()) { panel.style.flexBasis = '0px'; return; }
    if (ARG.shell && ARG.shell.isStacked && ARG.shell.isStacked()) {
      ARG.shell.stackPanel({ panel: panel, scaler: scaler, w: CW, h: CH, varName: '--ctl-scale' });
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

  function speak() {
    const t = ARG.i18n.t;
    const S = ARG.sim.s;
    if (S.feedback) {
      ARG.voice.stop();
      ARG.voice.speak(t(S.feedback));
      return;
    }
    ARG.voice.stop();
    ARG.voice.speakIn($('bag-fact'), t(ARG.sim.factKey()));
  }

  function handleAction(action, el) {
    const res = ARG.sim.press(action, el);
    if (!res) return;
    if (res.sound && typeof ARG.audio[res.sound] === 'function') ARG.audio[res.sound]();
    else ARG.audio.blip();
    if (action === 'reset') { ARG.panel.refresh(); lastDone = false; }
    ARG.panel.render();
    ARG.scene.render();
    if (action === 'start' || action === 'reset' || action === 'sort') speak();
  }

  let last = 0, running = true, lastDone = false;

  function loop(now) {
    if (!running) return;
    const dt = last ? (now - last) / 1000 : 0.016;
    last = now;
    ARG.sim.tick(dt);
    ARG.panel.render();
    ARG.scene.render();
    const S = ARG.sim.s;
    if (S.done && !lastDone) {
      lastDone = true;
      toast(ARG.i18n.t('toastDone'), true);
      ARG.audio.cheer();
      ARG.voice.stop();
      ARG.voice.speak(ARG.i18n.t('toastDone'));
      ARG.progress.award('baggage', 1);
    }
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
      ARG.scene.render();
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

    ARG.voice.speakOnTap($('bag-fact'));
    ARG.voice.speakOnTap($('help-body'));

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

    document.addEventListener('arg:lang', () => {
      ARG.panel.refresh();
      ARG.panel.render();
      ARG.scene.render();
    });

    ARG.panel.render();
    ARG.scene.render();
    requestAnimationFrame(loop);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
