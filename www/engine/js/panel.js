/* ═══════════════════════════════════════════
   engine/js/panel.js — strokes, throttle and step controls
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.panel = (function () {

  const T = () => ARG.i18n.t;
  const M = () => ARG.sim.s;
  let els = {};
  let onAction = null;
  const seen = {};

  function $(id) { return document.getElementById(id); }
  function setText(el, v) { if (el && el.textContent !== v) el.textContent = v; }

  function build(handler) {
    onAction = handler;
    els.strokes = $('engine-strokes');
    els.fact = $('engine-fact');
    els.modeBtns = document.querySelectorAll('.engine-tab');
    els.runBox = $('run-box');
    els.stepBox = $('step-box');
    els.throttleRow = $('throttle-row');
    els.start = $('engine-start');
    els.next = $('engine-next');
    els.back = $('engine-back');
    els.result = $('engine-result');
    els.resText = $('engine-res-text');
    els.hudStroke = $('hud-stroke');
    els.hudRpm = $('hud-rpm');

    const sim = ARG.sim;
    if (els.strokes) {
      els.strokes.innerHTML = sim.STROKES.map((s, i) =>
        '<button class="stroke-cell" data-action="jump" data-stroke="' + i + '">' +
          '<span class="sc-ico">' + s.ico + '</span>' +
          '<b data-i18n="' + s.key + '"></b>' +
        '</button>').join('');
    }
    if (els.throttleRow) {
      els.throttleRow.innerHTML = sim.THROTTLES.map(t =>
        '<button class="seg-btn" data-action="throttle" data-throttle="' + t.id + '">' +
          '<b data-i18n="' + t.key + '"></b><i class="th-rpm">' + t.rpm + '</i>' +
        '</button>').join('');
    }

    const ctl = $('ctl');
    if (ctl) {
      ctl.addEventListener('pointerdown', ev => {
        const b = ev.target && ev.target.closest ? ev.target.closest('button') : null;
        if (!b || !b.dataset || !b.dataset.action) return;
        ev.preventDefault();
        if (navigator.vibrate) { try { navigator.vibrate(10); } catch (e) {} }
        b.classList.add('pressed');
        setTimeout(() => b.classList.remove('pressed'), 130);
        onAction(b.dataset.action, b);
      });
    }
  }

  function render() {
    const S = M();
    const t = T();
    const sim = ARG.sim;
    const stroke = sim.current();

    if (els.strokes) {
      els.strokes.querySelectorAll('.stroke-cell').forEach((b, i) => {
        b.classList.toggle('on', i === stroke);
        b.classList.toggle('done', S.seen[i] && i !== stroke);
      });
    }
    if (seen.stroke !== stroke) {
      seen.stroke = stroke;
      setText(els.fact, t(sim.STROKES[stroke].fact));
    }

    els.modeBtns.forEach(b => b.classList.toggle('on', b.dataset.mode === S.mode));
    if (els.runBox) els.runBox.hidden = S.mode !== 'run';
    if (els.stepBox) els.stepBox.hidden = S.mode !== 'step';
    if (els.throttleRow) {
      els.throttleRow.querySelectorAll('[data-throttle]').forEach(b => {
        b.classList.toggle('on', b.dataset.throttle === S.throttle);
      });
    }
    if (els.start) {
      setText(els.start, t(S.running ? 'stop' : 'start'));
      els.start.classList.toggle('running', S.running);
    }

    if (els.result) els.result.hidden = !S.done;
    if (S.done) setText(els.resText, t('resultText'));

    const name = t(sim.STROKES[stroke].key);
    if (seen.name !== name) { seen.name = name; setText(els.hudStroke, name); }
    const rpm = S.mode === 'run' && S.running ? S.rpm : 0;
    if (seen.rpm !== rpm) {
      seen.rpm = rpm;
      setText(els.hudRpm, rpm ? String(rpm) : '0');
      if (els.hudRpm) els.hudRpm.classList.toggle('good', rpm > 0);
    }
  }

  function refresh() { for (const k in seen) delete seen[k]; }

  return { build, render, refresh };
})();
