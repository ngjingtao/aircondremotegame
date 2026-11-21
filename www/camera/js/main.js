/* camera/js/main.js — boot and actions */
(function () {

  const CW = 300;
  const CH = 640;
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
    toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
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

  function speakFact() {
    const t = ARG.i18n.t;
    const S = ARG.sim.s;
    const key = S.focus === 'iso' ? 'factIso' : (S.focus === 'aperture' ? 'factAperture' : 'factShutter');
    ARG.voice.stop();
    ARG.voice.speakIn($('camera-fact'), t(key));
  }

  function handleAction(action, el) {
    const res = ARG.sim.press(action, el);
    if (!res) return;
    if (res.sound && typeof ARG.audio[res.sound] === 'function') ARG.audio[res.sound]();
    else ARG.audio.blip();

    if (action === 'shoot') ARG.scene.flash();
    ARG.panel.render();
    ARG.scene.render();

    if (action === 'shoot') {
      const text = ARG.scene.resultText();
      ARG.voice.stop();
      ARG.voice.speakIn($('shot-result'), text);
      const S = ARG.sim.s;
      if (S.done && !ARG.progress.starsOf('camera')) {
        toast(ARG.i18n.t('toastDone'), true);
        ARG.audio.cheer();
        ARG.progress.award('camera', 1);
      }
    } else if (action === 'reset') {
      ARG.panel.refresh();
      ARG.panel.render();
      ARG.scene.render();
      speakFact();
    } else {
      speakFact();
    }
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

    ARG.voice.speakOnTap($('camera-fact'));
    ARG.voice.speakOnTap($('help-body'));

    layout();
    window.addEventListener('resize', layout);
    window.addEventListener('orientationchange', () => setTimeout(layout, 250));
    if (window.ResizeObserver) new ResizeObserver(layout).observe(document.querySelector('main'));
    setTimeout(layout, 60);
    setTimeout(layout, 400);

    ARG.panel.render();
    ARG.scene.render();

    document.addEventListener('arg:lang', () => {
      ARG.panel.refresh();
      ARG.panel.render();
      ARG.scene.render();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

})();
