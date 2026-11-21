/* ═══════════════════════════════════════════════════════════
   shared/lesson.js — a step-by-step science lesson

   One lesson is a list of steps. Each step has:
     • a title and a scene state (the activity draws the picture)
     • one short spoken sentence, read aloud as the step opens
     • two or three key words — tap one to hear it and see what it means

   This is the one piece the science lessons share. The activity keeps its
   own i18n text (js/i18n.js), its own step data (js/state.js) and its own
   picture (js/scene.js); everything a lesson does is here.

   Reading uses the existing shared/voice.js, so it is the same voice, the
   same word-by-word highlight, and the same offline behaviour as the other
   twenty-three activities.
   ═══════════════════════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.lesson = (function () {

  let cfg = null;
  let els = {};
  let seen = false;

  const $ = id => document.getElementById(id);
  const t = k => (ARG.i18n && ARG.i18n.t ? ARG.i18n.t(k) : k);
  const steps = () => (cfg && cfg.sim && cfg.sim.STEPS) || [];
  const cur = () => (cfg && cfg.sim ? cfg.sim.s : { step: 0 });

  function escapeHTML(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /* ─────────── build ─────────── */

  function build() {
    els.steps = $('ls-steps');
    els.title = $('ls-title');
    els.fact = $('ls-fact');
    els.words = $('ls-words');
    els.wordDef = $('ls-worddef');
    els.count = $('ls-count');
    els.bar = $('ls-bar');
    els.back = $('ls-back');
    els.next = $('ls-next');
    els.result = $('ls-result');
    els.resultText = $('ls-result-text');
    els.hud = $('hud-step');
    els.note = $('pane-note');
    els.replay = $('ls-replay');

    if (els.steps) {
      els.steps.innerHTML = steps().map((s, i) =>
        '<button class="ls-step" data-action="jump" data-step="' + i + '">' +
          '<span class="ls-n">' + (i + 1) + '</span>' +
          '<span class="ls-t" data-i18n="' + s.title + '"></span>' +
        '</button>').join('');
    }

    const ctl = $('ctl');
    if (ctl) ctl.addEventListener('pointerdown', onPointer);

    /* tapping the sentence says it again, exactly like the other activities */
    if (els.fact) ARG.voice.speakOnTap(els.fact);
    if (els.note) ARG.voice.speakOnTap(els.note);
    if (els.resultText) ARG.voice.speakOnTap(els.resultText);

    if (document.addEventListener) {
      document.addEventListener('keydown', ev => {
        if (!ev || !ev.key) return;
        if (ev.key === 'ArrowRight') { ev.preventDefault(); press('next'); }
        else if (ev.key === 'ArrowLeft') { ev.preventDefault(); press('prev'); }
      });
    }
  }

  function onPointer(ev) {
    const b = ev.target && ev.target.closest ? ev.target.closest('button') : null;
    if (!b || !b.dataset || !b.dataset.action) return;
    ev.preventDefault();
    if (navigator.vibrate) { try { navigator.vibrate(8); } catch (e) {} }
    b.classList.add('pressed');
    setTimeout(() => b.classList.remove('pressed'), 130);
    press(b.dataset.action, b);
  }

  /* ─────────── navigating ─────────── */

  function press(action, el) {
    const S = cur();
    const list = steps();
    if (!list.length) return false;
    if (action === 'next') { go(S.step + 1); return true; }
    if (action === 'prev') { go(S.step - 1); return true; }
    if (action === 'jump') { go(Number(el && el.dataset ? el.dataset.step : 0)); return true; }
    if (action === 'replay') { speakStep(); return true; }
    if (action === 'word') { sayWord(el && el.dataset ? el.dataset.word : ''); return true; }
    if (action === 'again') { restart(); return true; }
    return false;
  }

  function go(i, opts) {
    const list = steps();
    if (!list.length) return;
    const S = cur();
    opts = opts || {};
    i = Math.max(0, Math.min(list.length - 1, i));
    const changed = i !== S.step;

    S.step = i;
    if (i === list.length - 1) S.seenAll = true;

    paint();
    if (cfg.scene && cfg.scene.show) cfg.scene.show(i, S);

    if (changed) {
      if (els.wordDef) { els.wordDef.hidden = true; els.wordDef.textContent = ''; }
      if (!opts.silent) speakStep();
    } else if (opts.speak) {
      speakStep();
    }

    if (!opts.silent) {
      if (ARG.audio && ARG.audio.blip) ARG.audio.blip();
      if (i === list.length - 1 && !seen) {
        seen = true;
        if (cfg.sticker && ARG.progress) ARG.progress.award(cfg.sticker, 1);
        if (ARG.audio && ARG.audio.cheer) ARG.audio.cheer();
      }
    }
  }

  function restart() {
    const S = cur();
    const list = steps();
    S.seenAll = false;
    seen = false;
    if (els.result) els.result.hidden = true;
    if (els.wordDef) { els.wordDef.hidden = true; els.wordDef.textContent = ''; }
    S.step = 0;
    paint();
    if (cfg.scene && cfg.scene.show) cfg.scene.show(0, S);
    speakStep();
    if (ARG.audio && ARG.audio.blip) ARG.audio.blip();
  }

  /* ─────────── painting ─────────── */

  function paint() {
    const list = steps();
    const S = cur();
    const i = S.step;
    const step = list[i];
    if (!step) return;

    if (els.steps) {
      const kids = els.steps.querySelectorAll('.ls-step');
      Array.prototype.forEach.call(kids, (b, n) => {
        b.classList.toggle('on', n === i);
        b.classList.toggle('done', n < i);
      });
    }

    if (els.title) els.title.textContent = t(step.title);
    if (els.fact) els.fact.textContent = t(step.fact);
    if (els.count) els.count.textContent = (i + 1) + ' / ' + list.length;
    if (els.bar) els.bar.style.width = Math.round(((i + 1) / list.length) * 100) + '%';
    if (els.back) els.back.disabled = i === 0;
    if (els.hud) els.hud.textContent = (i + 1) + ' / ' + list.length;
    if (els.note) els.note.textContent = t('note');
    if (els.replay) {
      els.replay.title = t('readAgain');
      els.replay.setAttribute('aria-label', t('readAgain'));
    }

    renderWords(step);

    if (els.result) els.result.hidden = !S.seenAll;
    if (els.resultText && S.seenAll) els.resultText.textContent = t('result');
  }

  function renderWords(step) {
    if (!els.words) return;
    const list = step.words || [];
    els.words.innerHTML = list.map(w =>
      '<button class="word-chip" data-action="word" data-word="' + escapeHTML(w.term) + '">' +
        escapeHTML(t(w.term)) +
      '</button>').join('');
    if (els.wordDef) { els.wordDef.hidden = true; els.wordDef.textContent = ''; }
  }

  /* ─────────── reading ─────────── */

  function speakStep() {
    const list = steps();
    const step = list[cur().step];
    if (!step || !els.fact) return;
    const body = t(step.fact);
    ARG.voice.stop();
    ARG.voice.speakIn(els.fact, body);
  }

  function sayWord(key) {
    const list = steps();
    const step = list[cur().step];
    if (!step) return;
    const w = (step.words || []).find(x => x.term === key);
    if (!w || !els.wordDef) return;

    const body = t(w.term) + '。' + t(w.def);
    els.wordDef.hidden = false;
    els.wordDef.textContent = body;

    if (els.words) {
      Array.prototype.forEach.call(els.words.querySelectorAll('.word-chip'), b => {
        b.classList.toggle('on', b.dataset.word === key);
      });
    }
    ARG.voice.stop();
    ARG.voice.speakIn(els.wordDef, body);
    if (ARG.audio && ARG.audio.blip) ARG.audio.blip();
  }

  /* ─────────── lesson lifecycle ─────────── */

  function init(options) {
    cfg = options || {};
    seen = false;
    build();
    go(cur().step || 0, { speak: true, silent: true });
    if (!init.__langHooked) {
      init.__langHooked = true;
      document.addEventListener('arg:lang', () => refresh());
    }
  }

  /* re-read the strings after a language change */
  function refresh() {
    if (ARG.i18n && ARG.i18n.apply) ARG.i18n.apply();
    paint();
    if (cfg && cfg.scene && cfg.scene.show) cfg.scene.show(cur().step, cur());
  }

  return {
    init, refresh, go, press, restart,
    get index() { return cur().step; },
    get total() { return steps().length; }
  };
})();
