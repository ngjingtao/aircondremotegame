/* ═══════════════════════════════════════════
   food/js/aftermeal.js — the after-meal lesson

   A short branching lesson: rest vs run right after eating, what happens to
   blood flow, digestion and pain, and the 1–2 hour rule. It reads itself and
   highlights the words in the body, like the rest of the app.
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.after = (function () {

  const $ = id => document.getElementById(id);
  const t = k => ARG.i18n.t(k);
  let step = 'intro';

  function bar(id, value, suffix) {
    const fill = $(id);
    if (fill) fill.style.width = Math.max(0, Math.min(100, value)) + '%';
    const num = $(id + '-n');
    if (num) num.textContent = Math.round(value) + (suffix || '%');
  }

  function flow(stomach, muscle, pain) {
    bar('af-stomach', stomach);
    bar('af-muscle', muscle);
    bar('af-pain', pain, '');
  }

  function actions(list) {
    const host = $('after-actions');
    if (!host) return;
    host.innerHTML = list.map(a =>
      '<button class="after-btn ' + (a.kind || '') + '" data-choice="' + a.id + '">' + a.label + '</button>'
    ).join('');
  }

  function speak(text) {
    ARG.voice.stop();
    ARG.voice.speakIn($('after-body'), text);
  }

  function render() {
    const ov = $('after-overlay');
    if (!ov || ov.hidden) return;

    const title = $('after-title');
    const ico = $('after-ico');
    const num = $('after-step');
    const body = $('after-body');
    let text = '';
    let icon = '🍽️';
    let n = '1 / 3';

    if (step === 'intro') {
      text = t('afterIntro');
      actions([
        { id: 'rest', label: t('afterRest'), kind: 'primary' },
        { id: 'run', label: t('afterRun'), kind: 'danger' }
      ]);
      flow(55, 15, 5);
    } else if (step === 'rest') {
      text = t('afterRestSay');
      icon = '🛋️';
      n = '2 / 3';
      actions([{ id: 'next', label: t('afterNext'), kind: 'primary' }]);
      flow(60, 15, 5);
    } else if (step === 'run') {
      text = t('afterRunSay');
      icon = '🏃';
      n = '2 / 3';
      actions([
        { id: 'recover', label: t('afterRecover'), kind: 'primary' },
        { id: 'keep', label: t('afterKeep'), kind: 'danger' }
      ]);
      flow(20, 65, 60);
    } else if (step === 'keep') {
      text = t('afterKeepSay');
      icon = '😖';
      n = '2 / 3';
      actions([{ id: 'recover', label: t('afterRecover'), kind: 'primary' }]);
      flow(15, 70, 85);
    } else {
      text = t('afterRule');
      icon = '✅';
      n = '3 / 3';
      actions([{ id: 'close', label: t('afterNext'), kind: 'primary' }]);
      flow(50, 25, 10);
    }

    if (title) title.textContent = t('afterTitle');
    if (ico) ico.textContent = icon;
    if (num) num.textContent = n;
    if (body) body.textContent = text;
    const close = $('after-close');
    if (close) close.setAttribute('aria-label', t('afterClose'));
    speak(text);
  }

  function choose(choice) {
    if (choice === 'rest') step = 'rest';
    else if (choice === 'run') step = 'run';
    else if (choice === 'keep') step = 'keep';
    else if (choice === 'recover') step = 'rule';
    else if (choice === 'next') step = 'rule';
    else if (choice === 'close') { close(); return; }
    if (ARG.audio) ARG.audio.blip();
    render();
  }

  function open() {
    const ov = $('after-overlay');
    if (!ov) return;
    step = 'intro';
    ov.hidden = false;
    if (ARG.audio) ARG.audio.blip();
    render();
  }

  function close() {
    const ov = $('after-overlay');
    if (ov) ov.hidden = true;
    ARG.voice.stop();
  }

  function refresh() {
    const ov = $('after-overlay');
    if (ov && !ov.hidden) render();
  }

  function bind() {
    const btn = $('btn-after');
    if (btn) btn.addEventListener('click', open);

    const ov = $('after-overlay');
    if (ov) {
      ov.addEventListener('click', e => { if (e.target === ov) close(); });
      ov.addEventListener('click', e => {
        const b = e.target && e.target.closest ? e.target.closest('[data-choice]') : null;
        if (b) choose(b.dataset.choice);
      });
    }
    const closeBtn = $('after-close');
    if (closeBtn) closeBtn.addEventListener('click', close);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && ov && !ov.hidden) close();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind);
  else bind();

  return { open, close, refresh, render, choose };
})();
