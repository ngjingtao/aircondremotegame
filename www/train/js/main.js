/* ═══════════════════════════════════════════
   train/js/main.js — boot + loop
   ═══════════════════════════════════════════ */
(function () {

  const $ = id => document.getElementById(id);

  /* ─────────── actions ─────────── */
  function handleAction(action) {
    const res = ARG.sim.press(action);
    if (!res) return;

    if (res.sound && typeof ARG.audio[res.sound] === 'function') ARG.audio[res.sound]();
    else ARG.audio.notch();

    ARG.cab.render();
    ARG.scene.render(0.016);
  }

  /* ─────────── loop ─────────── */
  let last = 0, running = true;

  function loop(now) {
    if (!running) return;
    const dt = last ? (now - last) / 1000 : 0.016;
    last = now;

    const S = ARG.sim.tick(dt);

    /* the level-crossing bell */
    if (S.dingNow) ARG.audio.ding();

    ARG.scene.render(dt);
    ARG.cab.render();
    updateChips(S);

    requestAnimationFrame(loop);
  }

  const chipSeen = {};
  function updateChips(S) {
    const score = S.score;
    if (chipSeen.score !== score) { chipSeen.score = score; $('hud-score').textContent = score; }
    if (chipSeen.served !== S.served) { chipSeen.served = S.served; $('hud-served').textContent = S.served; }
    const dist = Math.round(S.x) + ' m';
    if (chipSeen.dist !== dist) { chipSeen.dist = dist; $('hud-dist').textContent = dist; }
  }

  /* ─────────── boot ─────────── */
  function boot() {
    ARG.i18n.apply();
    ARG.voice.attach();
    ARG.shell.attach();
    ARG.a11y.init();
    ARG.scene.build();
    ARG.cab.build(handleAction);

    ARG.sim.setMissionHook((result, stars, reason) => {
      ARG.scene.showResult(result, stars, reason);
      /* the sticker book is written by the model, in train/js/state.js */
    });

    /* ── free drive ↔ the timetabled run ── */
    function paintMode() {
      $('btn-mode-label').textContent = ARG.i18n.t(ARG.sim.s.mission >= 0 ? 'mission' : 'freeDrive');
    }

    function setMode(on) {
      ARG.scene.hideResult();
      if (on) ARG.sim.startMission(ARG.sim.unlocked());
      else ARG.sim.leaveMission();
      ARG.audio.chime();
      paintMode();
      ARG.scene.render(0.016);
      ARG.cab.refresh();
      ARG.cab.render();
    }

    $('btn-mode').addEventListener('click', () => setMode(ARG.sim.s.mission < 0));

    $('mr-retry').addEventListener('click', () => {
      ARG.scene.hideResult();
      ARG.sim.startMission(ARG.sim.s.mission);
      ARG.scene.render(0.016);
    });

    $('mr-next').addEventListener('click', () => {
      ARG.scene.hideResult();
      ARG.sim.startMission(Math.min(ARG.sim.s.mission + 1, ARG.sim.MISSIONS.length - 1));
      ARG.scene.render(0.016);
    });

    paintMode();

    $('btn-lang').addEventListener('click', () => {
      ARG.i18n.toggle();
      ARG.voice.syncLang();
      ARG.i18n.apply();
      ARG.cab.refresh();
      /* station name plates are refreshed by scene.render */
      ARG.cab.render();
      paintMode();
      /* the result card is written imperatively, so rebuild it in the new language */
      const S = ARG.sim.s;
      if (!$('mission-result').hidden && S.result) ARG.scene.showResult(S.result, S.stars, S.failReason);
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

    /* layout */
    function layout() { ARG.scene.layoutPixels(); }
    layout();
    window.addEventListener('resize', layout);
    window.addEventListener('orientationchange', () => setTimeout(layout, 250));
    if (window.ResizeObserver) new ResizeObserver(layout).observe($('scene'));
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
    ARG.cab.render();
    requestAnimationFrame(loop);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

})();
