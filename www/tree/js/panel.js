/* ═══════════════════════════════════════════
   tree/js/panel.js — phases, water and light
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.panel = (function () {

  const T = () => ARG.i18n.t;
  const M = () => ARG.sim.s;

  let els = {};
  let onAction = null;
  const seen = {};

  function $(id) { return document.getElementById(id); }

  function build(handler) {
    onAction = handler;

    els.phaseStrip = $('phase-strip');
    els.stageTitle = $('stage-title');
    els.stageFact = $('stage-fact');
    els.stageNeed = $('stage-need');
    els.moistBand = $('moist-band');
    els.moistMark = $('moist-mark');
    els.sunRow = $('sun-row');
    els.waterBtn = $('water-btn');
    els.waterCount = $('water-count');
    els.startBtn = $('plant-start');
    els.result = $('tree-result');
    els.stars = $('tree-stars');
    els.resText = $('tree-res-text');
    els.hudStage = $('hud-stage');
    els.hudHealth = $('hud-health');
    els.hudWater = $('hud-water');

    const sim = ARG.sim;

    if (els.phaseStrip) {
      els.phaseStrip.innerHTML = sim.STAGES.map((s, i) =>
        '<div class="phase-cell" data-phase="' + i + '">' +
          '<span class="ph-ico">' + s.icon + '</span>' +
          '<b data-i18n="' + s.key + '"></b>' +
        '</div>').join('');
    }

    if (els.sunRow) {
      els.sunRow.innerHTML = sim.SUNS.map(s =>
        '<button class="seg-btn" data-action="set" data-key="sun" data-value="' + s.id + '">' +
          '<span class="sb-ico">' + s.ico + '</span><b data-i18n="' + s.key + '"></b>' +
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

  function setText(el, v) {
    if (el && el.textContent !== v) el.textContent = v;
  }

  function stars(n) {
    let out = '';
    for (let i = 0; i < 3; i++) out += i < n ? '★' : '☆';
    return out;
  }

  function render() {
    const S = M();
    const t = T();
    const sim = ARG.sim;
    const st = sim.stage();
    const running = sim.isRunning();

    /* phase strip */
    if (els.phaseStrip) {
      els.phaseStrip.querySelectorAll('.phase-cell').forEach((cell, i) => {
        const done = S.phase === 'done' || i < S.stage;
        cell.classList.toggle('done', done);
        cell.classList.toggle('on', i === S.stage && S.phase !== 'done');
        cell.classList.toggle('wilt', i === S.stage && S.phase === 'wilted');
      });
    }

    /* the current phase's explanation */
    if (seen.stage !== S.stage) {
      seen.stage = S.stage;
      setText(els.stageTitle, t(st.key));
      setText(els.stageFact, t(st.fact));
      setText(els.stageNeed, t(st.need));
    }

    /* water band and marker */
    if (els.moistBand && els.moistBand.style) {
      const lo = st.water[0] * 100, hi = st.water[1] * 100;
      els.moistBand.style.left = lo.toFixed(1) + '%';
      els.moistBand.style.width = (hi - lo).toFixed(1) + '%';
    }
    if (els.moistMark && els.moistMark.style) {
      els.moistMark.style.left = (S.water * 100).toFixed(1) + '%';
    }

    /* sun buttons */
    if (els.sunRow) {
      els.sunRow.querySelectorAll('[data-key="sun"]').forEach(b => {
        b.classList.toggle('on', +b.dataset.value === S.sun);
        b.classList.toggle('locked', !running);
      });
    }

    /* controls */
    const startKey = S.phase === 'growing' ? 'pauseBtn'
      : S.phase === 'paused' ? 'resumeBtn'
      : S.phase === 'done' || S.phase === 'wilted' ? 'again'
      : 'plantBtn';
    if (seen.start !== startKey) { seen.start = startKey; setText(els.startBtn, t(startKey)); }

    if (els.waterBtn) {
      els.waterBtn.classList.toggle('locked', !running);
      els.waterBtn.disabled = !running;
    }

    /* result card */
    if (els.result) els.result.hidden = !(S.phase === 'done' || S.phase === 'wilted');
    if (S.phase === 'done' || S.phase === 'wilted') {
      setText(els.stars, stars(S.stars));
      setText(els.resText, t(S.reason));
    }

    /* top-bar numbers */
    const stageTxt = (S.phase === 'done' ? 8 : S.stage + 1) + ' / 8';
    if (seen.stageTxt !== stageTxt) { seen.stageTxt = stageTxt; setText(els.hudStage, stageTxt); }

    const health = Math.round(S.health * 100);
    if (seen.health !== health) {
      seen.health = health;
      setText(els.hudHealth, health + '%');
      if (els.hudHealth) {
        els.hudHealth.classList.toggle('good', health >= 75);
        els.hudHealth.classList.toggle('bad', health < 40);
      }
    }

    if (seen.waterUsed !== S.waterUsed) {
      seen.waterUsed = S.waterUsed;
      setText(els.hudWater, String(S.waterUsed));
      setText(els.waterCount, String(S.waterUsed));
    }
  }

  function refresh() {
    for (const k in seen) delete seen[k];
  }

  return { build, render, refresh };
})();
