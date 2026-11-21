/* ═══════════════════════════════════════════════════════════
   shared/lang.js — the language gate

   Chinese is the default. Tapping the language button opens a short
   one-digit addition quiz; five correct answers unlock English for five
   minutes. A visible countdown runs, then the app returns to Chinese.
   An active English session survives page navigation; once it ends, the
   next load starts in Chinese again.

   Loaded after shared/store.js and before the page's i18n.
   ═══════════════════════════════════════════════════════════ */
window.ARG = window.ARG || {};

(function () {

  const NEED = 5;
  const SECONDS = 300;
  const KEY = 'arg.enUntil';
  const store = ARG.store || { get: () => null, set: () => {} };

  let until = Number(store.get(KEY) || 0);
  if (!(until > Date.now())) {
    until = 0;
    store.set(KEY, '0');
    store.set('arg.lang', 'zh');       // always default to Chinese
  } else {
    store.set('arg.lang', 'en');
  }

  let chip = null, quiz = null, qEl = null, input = null, progEl = null, fbEl = null;
  let correct = 0, a = 0, b = 0, busy = false, done = false, timer = 0;

  function active() { return until > Date.now(); }
  function remaining() { return Math.max(0, until - Date.now()); }
  function mmss(ms) {
    const s = Math.ceil(ms / 1000);
    return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  }

  /* ─────────── the countdown chip ─────────── */
  function ensureChip() {
    if (chip || !document.body) return;
    chip = document.createElement('div');
    chip.id = 'lang-timer';
    chip.className = 'lang-timer';
    chip.hidden = true;
    document.body.appendChild(chip);
  }

  function showChip() {
    ensureChip();
    if (!chip) return;
    chip.hidden = false;
    chip.textContent = 'EN · ' + mmss(remaining());
  }

  function hideChip() {
    if (chip) chip.hidden = true;
  }

  function tick() {
    clearTimeout(timer);
    if (!until) { hideChip(); return; }
    if (!active()) { switchToChinese(); return; }
    showChip();
    timer = setTimeout(tick, 1000);
  }

  /* ─────────── the quiz ─────────── */
  function ensureQuiz() {
    if (quiz || !document.body) return;
    quiz = document.createElement('div');
    quiz.id = 'lang-quiz';
    quiz.className = 'overlay';
    quiz.hidden = true;
    quiz.innerHTML =
      '<div class="overlay-card lang-quiz-card" role="dialog" aria-modal="true" aria-labelledby="lang-quiz-title">' +
        '<h2 id="lang-quiz-title">数学小测验</h2>' +
        '<p class="lang-quiz-sub">答对 5 道一位数加法，就能切换到 English 5 分钟。</p>' +
        '<div class="lang-quiz-q" id="lang-quiz-question">…</div>' +
        '<input class="lang-quiz-input" id="lang-quiz-input" type="number" min="1" max="18" inputmode="numeric" autocomplete="off" aria-label="答案" />' +
        '<div class="lang-quiz-progress" id="lang-quiz-progress">0 / 5</div>' +
        '<div class="lang-quiz-feedback" id="lang-quiz-feedback"></div>' +
        '<button class="lang-quiz-submit" id="lang-quiz-submit" type="button">检查</button>' +
        '<button class="lang-quiz-cancel" id="lang-quiz-close" type="button">取消</button>' +
      '</div>';
    document.body.appendChild(quiz);

    qEl = document.getElementById('lang-quiz-question');
    input = document.getElementById('lang-quiz-input');
    progEl = document.getElementById('lang-quiz-progress');
    fbEl = document.getElementById('lang-quiz-feedback');

    const send = document.getElementById('lang-quiz-submit');
    if (send) send.addEventListener('click', submit);
    if (input) input.addEventListener('keydown', e => {
      if (e.key === 'Enter') { e.preventDefault(); submit(); }
    });
    const close = document.getElementById('lang-quiz-close');
    if (close) close.addEventListener('click', closeQuiz);
    quiz.addEventListener('click', e => { if (e.target === quiz) closeQuiz(); });
  }

  function feedback(text, ok) {
    if (!fbEl) return;
    fbEl.textContent = text;
    fbEl.className = 'lang-quiz-feedback' + (ok ? ' ok' : '');
  }

  function newQuestion() {
    a = 1 + Math.floor(Math.random() * 9);
    b = 1 + Math.floor(Math.random() * 9);
    busy = false;
    if (qEl) qEl.textContent = a + ' + ' + b + ' = ?';
    if (progEl) progEl.textContent = correct + ' / ' + NEED;
    if (input) {
      input.value = '';
      input.disabled = false;
      try { input.focus(); } catch (e) {}
    }
  }

  function submit() {
    if (busy || done || !input || input.disabled) return;
    const v = parseInt(input.value, 10);
    if (!isFinite(v)) { feedback('先写一个数字。', false); return; }

    busy = true;
    input.disabled = true;

    if (v === a + b) {
      correct++;
      if (progEl) progEl.textContent = correct + ' / ' + NEED;
      if (correct >= NEED) {
        done = true;
        feedback('✔ 5 / 5 — 正在切换到 English…', true);
        setTimeout(pass, 700);
        return;
      }
      feedback('✔ 对了！', true);
      setTimeout(newQuestion, 450);
    } else {
      feedback('再试一次。', false);
      setTimeout(newQuestion, 650);
    }
  }

  function openQuiz() {
    ensureQuiz();
    if (!quiz) return;
    correct = 0;
    busy = false;
    done = false;
    if (progEl) progEl.textContent = '0 / ' + NEED;
    feedback('', true);
    newQuestion();
    quiz.hidden = false;
    setTimeout(() => { if (input) { try { input.focus(); } catch (e) {} } }, 60);
  }

  function closeQuiz() {
    if (quiz) quiz.hidden = true;
  }

  /* ─────────── passing / timeout ─────────── */
  function pass() {
    until = Date.now() + SECONDS * 1000;
    store.set(KEY, String(until));
    store.set('arg.lang', 'en');
    closeQuiz();

    if (ARG.i18n) { ARG.i18n.setLang('en'); ARG.i18n.apply(); }
    if (ARG.voice) ARG.voice.syncLang();
    document.dispatchEvent(new CustomEvent('arg:lang', { detail: { lang: 'en' } }));

    showChip();
    tick();

    /* a reload gives every panel its English strings at once */
    setTimeout(() => { try { location.reload(); } catch (e) {} }, 150);
  }

  function switchToChinese() {
    until = 0;
    store.set(KEY, '0');
    store.set('arg.lang', 'zh');

    if (ARG.i18n) { ARG.i18n.setLang('zh'); ARG.i18n.apply(); }
    if (ARG.voice) ARG.voice.syncLang();
    document.dispatchEvent(new CustomEvent('arg:lang', { detail: { lang: 'zh' } }));

    hideChip();
    closeQuiz();
  }

  function request() {
    if (active()) { switchToChinese(); return; }
    openQuiz();
  }

  function wrapI18n() {
    if (!ARG.i18n || ARG.i18n.__langGated) return;
    ARG.i18n.toggle = function () {
      request();
      return ARG.i18n.lang;
    };
    ARG.i18n.__langGated = true;
  }

  function init() {
    ensureChip();
    ensureQuiz();
    wrapI18n();
    if (until) { showChip(); tick(); } else hideChip();
  }

  ARG.langGate = {
    request, switchToChinese, active, remaining,
    need: NEED, seconds: SECONDS
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
  setTimeout(init, 0);

})();
