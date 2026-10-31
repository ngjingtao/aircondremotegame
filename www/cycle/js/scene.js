/* ═══════════════════════════════════════════
   cycle/js/scene.js — one drop going round the cycle
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.scene = (function () {

  const T = () => ARG.i18n.t;
  const M = () => ARG.sim.s;

  /* the drop's stops, in order, then back to the start */
  const PTS = [
    { x: 58, y: 348 },
    { x: 148, y: 332 },
    { x: 182, y: 174 },
    { x: 222, y: 238 },
    { x: 250, y: 342 },
    { x: 226, y: 382 },
    { x: 172, y: 398 },
    { x: 110, y: 378 },
    { x: 58, y: 348 }
  ];

  let els = {};
  let lastNote = null, lastStatus = null, lastLead = null;
  let toastTimer = null;

  function build() {
    els.scene = document.getElementById('scene');
    els.droplet = document.getElementById('droplet');
    els.lead = document.getElementById('scene-lead');
    els.status = document.getElementById('scene-status');
    els.paneNote = document.getElementById('pane-note');
    els.toast = document.getElementById('toast');
  }

  function render() {
    const S = M();
    const t = T();
    const step = ARG.sim.STEPS[S.step];
    const now = performance.now() / 1000;

    if (els.scene) els.scene.setAttribute('data-step', S.step);

    /* the drop moves along the current segment while WATCH runs */
    const p = S.auto ? Math.min(1, S.stepT / ARG.sim.WATCH_SECONDS) : 0;
    const a = PTS[S.step];
    const b = PTS[S.step + 1] || PTS[0];
    const x = a.x + (b.x - a.x) * p + Math.sin(now * 2) * 1.4;
    const y = a.y + (b.y - a.y) * p + Math.cos(now * 2) * 1.1;
    if (els.droplet) els.droplet.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ')');

    /* highlight the stage */
    document.querySelectorAll('#scene .part').forEach(el => {
      el.classList.toggle('on', el.dataset.part === step.part);
    });
    document.querySelectorAll('#scene .lab').forEach(el => {
      el.classList.toggle('on', el.dataset.part === step.part);
    });

    /* rain only shows at the precipitation stage */
    const rain = document.getElementById('rainGroup');
    if (rain) rain.classList.toggle('on', S.step === 3);
    const evap = document.getElementById('evapGroup');
    if (evap) evap.classList.toggle('on', S.step === 0 || S.step === 1);

    const lead = t('lead');
    if (lastLead !== lead) { lastLead = lead; if (els.lead) els.lead.textContent = lead; }

    const status = S.auto ? t('statusWatch') : S.seenAll ? t('statusDone') : t('statusStep');
    if (lastStatus !== status) {
      lastStatus = status;
      if (els.status) {
        els.status.textContent = status;
        els.status.classList.toggle('busy', S.auto);
      }
    }

    const note = t(S.seenAll ? 'noteEnd' : 'note');
    if (lastNote !== note) { lastNote = note; if (els.paneNote) els.paneNote.textContent = note; }
  }

  function toast(msg, good) {
    if (!msg || !els.toast) return;
    els.toast.textContent = msg;
    els.toast.classList.toggle('good', good !== false);
    els.toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => els.toast.classList.remove('show'), 2600);
  }

  return { build, render, toast };
})();
