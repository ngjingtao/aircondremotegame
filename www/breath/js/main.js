/* ═══════════════════════════════════════════
   breath/js/main.js — boot + loop
   ═══════════════════════════════════════════ */
(function () {

  const BW = 300;   // panel design width
  const BH = 640;   // panel design height

  const $ = id => document.getElementById(id);

  /* ─────────── responsive panel scaling ─────────── */
  function layout() {
    const mainEl = document.querySelector('main');
    const panel = $('panel-panel');
    const scaler = $('panel-scaler');
    if (!mainEl || !panel) return;

    if (ARG.shell && ARG.shell.isCollapsed()) {


      panel.style.flexBasis = '0px';


      return;


    }


    const totalW = mainEl.clientWidth;
    const availH = panel.clientHeight - 16;
    const tablet = totalW >= 700 && mainEl.clientHeight >= 560;

    const maxPanelW = Math.min(totalW * (tablet ? 0.46 : 0.50), tablet ? 520 : 400);
    const maxScale = tablet ? 1.4 : 1.15;

    let scale = Math.min((maxPanelW - 20) / BW, availH / BH);
    scale = Math.max(0.30, Math.min(scale, maxScale));

    document.documentElement.style.setProperty('--panel-scale', scale);
    scaler.style.width = (BW * scale) + 'px';
    scaler.style.height = (BH * scale) + 'px';
    panel.style.flexBasis = (BW * scale + 20) + 'px';
  }

  /* ─────────── actions ─────────── */
  function handleAction(action, el) {
    const res = ARG.sim.press(action, el);
    if (!res) return;

    if (res.sound && typeof ARG.audio[res.sound] === 'function') ARG.audio[res.sound]();
    else ARG.audio.blip();

    /* announce the new situation */
    if (res.say) ARG.voice.speak(ARG.i18n.t(res.say));
    else if (action === 'pattern') {
      const p = ARG.sim.s.pattern;
      ARG.voice.speak(ARG.i18n.t(p === 'auto' ? 'paceOff' : 'msg' + p.charAt(0).toUpperCase() + p.slice(1)));
    }

    ARG.panel.render();
    ARG.scene.render(0.016);
  }

  /* ─────────── loop ─────────── */
  let last = 0, running = true;
  let lastBeat = -1;

  /* ─────────── narration ─────────── */
  let lastSpokenSc = null;

  function speakWatch() {
    const s = ARG.sim.s;
    if (!ARG.voice.enabled) return;
    if (lastSpokenSc === null) { lastSpokenSc = s.scenario; return; }   // quiet on load
    if (s.scenario === lastSpokenSc) return;
    lastSpokenSc = s.scenario;
    const cap = s.scenario.charAt(0).toUpperCase() + s.scenario.slice(1);
    ARG.voice.speak(ARG.i18n.t('sc' + cap) + '。' + ARG.i18n.t('msg' + cap));
  }

  function loop(now) {
    if (!running) return;
    const dt = last ? (now - last) / 1000 : 0.016;
    last = now;

    const S = ARG.sim.tick(dt);

    /* a soft heartbeat once per beat */
    if (S.beats !== lastBeat) {
      lastBeat = S.beats;
      if (S.heartRate < 130) ARG.audio.thump();
    }
    /* the whoosh of each breath in and out */
    if (S.breathCue === 'in') ARG.audio.breatheIn();
    else if (S.breathCue === 'out') ARG.audio.breatheOut();

    /* ── guided breathing: a soft cue on every phase change ── */
    if (S.pattern !== 'auto' && S.pacerCue) {
      if (S.pacerCue === 'in') ARG.audio.breatheIn();
      else if (S.pacerCue === 'out') ARG.audio.breatheOut();
      else ARG.audio.blip();
    }

    ARG.scene.render(dt);
    ARG.panel.render();
    speakWatch();

    requestAnimationFrame(loop);
  }

  /* ─────────── boot ─────────── */
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

    /* tap the fact card to hear it */
    ARG.voice.speakOnTap($('fact-text'));

    /* ── the alveoli zoom ── */
    const zoom = $('zoom-overlay');
    document.querySelector('.alveoli').addEventListener('pointerdown', ev => {
      ev.stopPropagation();
      zoom.hidden = false;
      ARG.audio.blip();
      ARG.voice.speak(ARG.i18n.t('zoomBody'), { rate: 0.9 });
    });
    $('zoom-close').addEventListener('click', () => { zoom.hidden = true; ARG.voice.stop(); });
    zoom.addEventListener('click', e => { if (e.target === zoom) { zoom.hidden = true; ARG.voice.stop(); } });

    /* ── the quiz ── */
    const QUIZ = [
      { q: 'quizQ1', a: 'quizQ1a', b: 'quizQ1b', c: 'quizQ1c', right: 'a' },
      { q: 'quizQ2', a: 'quizQ2a', b: 'quizQ2b', c: 'quizQ2c', right: 'a' },
      { q: 'quizQ3', a: 'quizQ3a', b: 'quizQ3b', c: 'quizQ3c', right: 'a' },
      { q: 'quizQ4', a: 'quizQ4a', b: 'quizQ4b', c: 'quizQ4c', right: 'a' }
    ];
    let qi = 0, qScore = 0, qLocked = false;
    const quiz = $('quiz-overlay');

    function quizRender() {
      const t = ARG.i18n.t;
      const body = $('quiz-body');
      $('quiz-title').textContent = t('quizTitle');
      if (qi >= QUIZ.length) {
        body.innerHTML = `<div class="quiz-final">
          <div class="big">${qScore} / ${QUIZ.length}</div>
          <p class="quiz-q">${t('quizScore').replace('{n}', qScore).replace('{t}', QUIZ.length)}</p>
        </div>`;
        $('quiz-close').textContent = t('quizDone');
        return;
      }
      const item = QUIZ[qi];
      body.innerHTML = `
        <div class="quiz-progress">${qi + 1} / ${QUIZ.length}</div>
        <p class="quiz-q">${t(item.q)}</p>
        ${['a', 'b', 'c'].map(k => `<button class="quiz-ans" data-pick="${k}">${t(item[k])}</button>`).join('')}
        <div class="quiz-feedback" id="quiz-feedback"></div>`;
      $('quiz-close').textContent = t('quizDone');
      qLocked = false;
      body.querySelectorAll('.quiz-ans').forEach(btn => {
        btn.addEventListener('click', () => {
          if (qLocked) return;
          qLocked = true;
          const ok = btn.dataset.pick === item.right;
          if (ok) qScore++;
          body.querySelectorAll('.quiz-ans').forEach(b => {
            b.classList.add('disabled');
            if (b.dataset.pick === item.right) b.classList.add('right');
            else if (b === btn) b.classList.add('wrong');
          });
          const fb = $('quiz-feedback');
          fb.className = 'quiz-feedback ' + (ok ? 'ok' : 'no');
          fb.textContent = ok ? ARG.i18n.t('quizRight') : ARG.i18n.t('quizWrong') + ARG.i18n.t(item.right);
          if (ok) ARG.audio.chime(); else ARG.audio.ouch();
          setTimeout(() => { qi++; quizRender(); }, ok ? 900 : 1700);
        });
      });
    }

    $('btn-quiz').addEventListener('click', () => {
      qi = 0; qScore = 0;
      quiz.hidden = false;
      quizRender();
      ARG.audio.blip();
    });
    $('quiz-close').addEventListener('click', () => { quiz.hidden = true; });
    quiz.addEventListener('click', e => { if (e.target === quiz) quiz.hidden = true; });

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
