/* ═══════════════════════════════════════════
   food/js/main.js — boot, loop, HUD, quiz
   ═══════════════════════════════════════════ */
(function () {

  const DW = 320;   // deck design width
  const DH = 660;   // deck design height

  const $ = id => document.getElementById(id);

  /* ─────────── responsive deck scaling ─────────── */
  function layout() {
    const mainEl = document.querySelector('main');
    const panel = $('deck-panel');
    const scaler = $('deck-scaler');
    if (!mainEl || !panel) return;

    const totalW = mainEl.clientWidth;
    const availH = panel.clientHeight - 16;
    const maxPanelW = Math.min(totalW * 0.52, 440);

    let scale = Math.min((maxPanelW - 20) / DW, availH / DH);
    scale = Math.max(0.32, Math.min(scale, 1.1));

    document.documentElement.style.setProperty('--deck-scale', scale);
    scaler.style.width = (DW * scale) + 'px';
    scaler.style.height = (DH * scale) + 'px';
    panel.style.flexBasis = (DW * scale + 20) + 'px';
  }

  /* ─────────── toast ─────────── */
  let toastTimer = null;
  function toast(text, good) {
    if (!text) return;
    const el = $('toast');
    el.textContent = text;
    el.classList.toggle('good', !!good);
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2500);
  }

  /* ─────────── actions ─────────── */
  function handleAction(action, el) {
    const before = ARG.sim.s;

    if (action === 'pick' && (before.stage !== 'MOUTH' || before.food)) {
      ARG.audio.deny();
      return;
    }

    const res = ARG.sim.press(action, el);
    if (!res) return;

    if (res.sound && typeof ARG.audio[res.sound] === 'function') ARG.audio[res.sound]();
    else ARG.audio.blip();

    if (res.say) ARG.body.say(res.say.indexOf('say') === 0 ? ARG.i18n.pick(res.say) : res.say);
    if (action === 'chew') ARG.body.bite();
    if (action === 'poop') ARG.body.dropPoo();
    if (res.cheer) ARG.audio.cheer();
    if (action === 'poop' && ARG.sim.s.journeys === 1) {
      $('btn-quiz').classList.add('ready');
    }

    ARG.deck.render();
    ARG.body.render(0.016);
  }

  /* ─────────── mood speech ─────────── */
  let lastMood = null;
  const MOODS = { hungry: 1, eating: 1, happy: 1, full: 1, ache: 1, toilet: 1, relieved: 1 };

  function moodWatch() {
    const s = ARG.sim.s;
    if (lastMood === s.mood) return;
    lastMood = s.mood;
    const key = 'say' + s.mood.charAt(0).toUpperCase() + s.mood.slice(1);
    if (MOODS[s.mood] && ARG.i18n.t(key) !== key) ARG.body.say(ARG.i18n.pick(key));
  }

  /* ─────────── loop ─────────── */
  let last = 0, running = true;

  function loop(now) {
    if (!running) return;
    const dt = last ? (now - last) / 1000 : 0.016;
    last = now;

    ARG.sim.tick(dt);
    moodWatch();
    ARG.body.render(dt);
    ARG.deck.render();

    requestAnimationFrame(loop);
  }

  /* ─────────── quiz ─────────── */
  const QUIZ = [
    { q: 'quizQ1', a: 'quizA1', b: 'quizA1b', c: 'quizA1c', right: 'a' },
    { q: 'quizQ2', a: 'quizA2', b: 'quizA2b', c: 'quizA2c', right: 'a' },
    { q: 'quizQ3', a: 'quizA3', b: 'quizA3b', c: 'quizA3c', right: 'a' },
    { q: 'quizQ4', a: 'quizA4', b: 'quizA4b', c: 'quizA4c', right: 'a' }
  ];

  let qi = 0, qScore = 0, qLocked = false;

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
    const opts = ['a', 'b', 'c'].map(k => {
      const order = ['a', 'b', 'c'].sort(() => 1);   // keep a/b/c order, answer is always 'a' in data
      return `<button class="quiz-ans" data-pick="${k}">${t(item[k])}</button>`;
    }).join('');

    body.innerHTML = `
      <div class="quiz-progress">${qi + 1} / ${QUIZ.length}</div>
      <p class="quiz-q">${t(item.q)}</p>
      ${opts}
      <div class="quiz-feedback" id="quiz-feedback"></div>`;
    $('quiz-close').textContent = t('quizDone');
    qLocked = false;

    body.querySelectorAll('.quiz-ans').forEach(btn => {
      btn.addEventListener('click', () => {
        if (qLocked) return;
        qLocked = true;
        const pick = btn.dataset.pick;
        const ok = pick === item.right;
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

  /* ─────────── boot ─────────── */
  function boot() {
    ARG.body.build();
    ARG.deck.build(handleAction);
    ARG.i18n.apply();          // after the decks exist, so every label is translated

    ARG.sim.setToastHook((key, kind) => {
      if (!key) return;
      if (key.indexOf('say') === 0) { ARG.body.say(ARG.i18n.pick(key)); return; }
      toast(ARG.i18n.t(key), kind === 'good');
    });

    /* top bar */
    $('btn-lang').addEventListener('click', () => {
      ARG.i18n.toggle();
      ARG.i18n.apply();
      ARG.body.refreshLabels();
      ARG.deck.render();
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

    const quiz = $('quiz-overlay');
    $('btn-quiz').addEventListener('click', () => {
      qi = 0; qScore = 0;
      quiz.hidden = false;
      quizRender();
    });
    $('quiz-close').addEventListener('click', () => { quiz.hidden = true; });
    quiz.addEventListener('click', e => { if (e.target === quiz) quiz.hidden = true; });

    /* mode toggle */
    function setMode(m) {
      ARG.sim.setMode(m);
      $('btn-manual').classList.toggle('active', m === 'MANUAL');
      $('btn-watch').classList.toggle('active', m === 'WATCH');
      toast(ARG.i18n.t(m === 'WATCH' ? 'watchOn' : 'watchOff'), true);
      ARG.audio.blip();
    }
    $('btn-manual').addEventListener('click', () => setMode('MANUAL'));
    $('btn-watch').addEventListener('click', () => setMode('WATCH'));

    /* layout */
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

    ARG.body.render(0.016);
    ARG.deck.render();
    requestAnimationFrame(loop);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

})();
