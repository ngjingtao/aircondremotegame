/* ═══════════════════════════════════════════
   engine/js/scene.js — piston, rod, valves, spark
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.scene = (function () {

  const T = () => ARG.i18n.t;
  const M = () => ARG.sim.s;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const NS = 'http://www.w3.org/2000/svg';

  const CX = 160;
  const CRANK_Y = 430;
  const TDC = 185;
  const TRAVEL = 110;

  let els = {};
  let intakeDots = [], exhaustDots = [];
  let lastNote = null, lastStatus = null, lastLead = null;
  let toastTimer = null;

  function mk(tag, attrs) {
    const e = document.createElementNS(NS, tag);
    if (attrs) Object.keys(attrs).forEach(k => e.setAttribute(k, attrs[k]));
    return e;
  }

  function build() {
    els.scene = document.getElementById('scene');
    els.piston = document.getElementById('piston');
    els.rod = document.getElementById('rod');
    els.crank = document.getElementById('crank');
    els.crankPin = document.getElementById('crankPin');
    els.intakeValve = document.getElementById('intakeValve');
    els.exhaustValve = document.getElementById('exhaustValve');
    els.combustion = document.getElementById('combustion');
    els.spark = document.getElementById('spark');
    els.intakeGas = document.getElementById('intakeGas');
    els.exhaustGas = document.getElementById('exhaustGas');
    els.lead = document.getElementById('scene-lead');
    els.status = document.getElementById('scene-status');
    els.paneNote = document.getElementById('pane-note');
    els.toast = document.getElementById('toast');

    if (els.intakeGas) {
      for (let i = 0; i < 9; i++) {
        const c = mk('circle', { r: (2 + (i % 3) * 0.6).toFixed(1), class: 'airDot', opacity: '0' });
        els.intakeGas.appendChild(c);
        intakeDots.push(c);
      }
    }
    if (els.exhaustGas) {
      for (let i = 0; i < 9; i++) {
        const c = mk('circle', { r: (2 + (i % 3) * 0.6).toFixed(1), class: 'gasDot', opacity: '0' });
        els.exhaustGas.appendChild(c);
        exhaustDots.push(c);
      }
    }
  }

  function render(dt) {
    const S = M();
    const t = T();
    const now = performance.now() / 1000;
    const angle = S.angle % 720;
    const th = angle * Math.PI / 180;

    if (els.scene) {
      els.scene.setAttribute('data-stroke', S.mode === 'step' ? S.step : ARG.sim.strokeFromAngle(angle));
      els.scene.setAttribute('data-mode', S.mode);
      els.scene.classList.toggle('running', S.mode === 'run' && S.running);
    }

    /* slider-crank, simplified: the piston follows the crank angle */
    const py = TDC + (1 - Math.cos(th)) / 2 * TRAVEL;
    if (els.piston) els.piston.setAttribute('transform', 'translate(0 ' + (py - TDC).toFixed(1) + ')');
    const pinX = CX;
    const pinY = py + 17;
    const cpX = CX + 30 * Math.sin(th);
    const cpY = CRANK_Y - 30 * Math.cos(th);
    if (els.rod) {
      els.rod.setAttribute('x1', pinX);
      els.rod.setAttribute('y1', pinY.toFixed(1));
      els.rod.setAttribute('x2', cpX.toFixed(1));
      els.rod.setAttribute('y2', cpY.toFixed(1));
    }
    if (els.crankPin) {
      els.crankPin.setAttribute('cx', cpX.toFixed(1));
      els.crankPin.setAttribute('cy', cpY.toFixed(1));
    }
    if (els.crank) els.crank.setAttribute('transform', 'rotate(' + angle.toFixed(1) + ' ' + CX + ' ' + CRANK_Y + ')');

    /* valve lift: intake during 0–180, exhaust during 540–720 */
    const intakeLift = angle <= 180 ? Math.sin(th) : 0;
    const exhaustLift = angle >= 540 ? Math.sin((angle - 540) * Math.PI / 180) : 0;
    if (els.intakeValve) els.intakeValve.setAttribute('transform', 'translate(0 ' + (intakeLift * 13).toFixed(1) + ')');
    if (els.exhaustValve) els.exhaustValve.setAttribute('transform', 'translate(0 ' + (exhaustLift * 13).toFixed(1) + ')');

    /* combustion and spark */
    const stroke = S.mode === 'step' ? S.step : ARG.sim.strokeFromAngle(angle);
    const power = stroke === 2;
    if (els.combustion) els.combustion.setAttribute('opacity', power ? '0.85' : '0');
    if (els.spark) {
      const nearSpark = power && (S.mode === 'step' || (angle >= 352 && angle <= 392));
      els.spark.setAttribute('opacity', nearSpark ? '1' : '0');
    }

    /* air in during intake, burnt gas out during exhaust */
    for (let i = 0; i < intakeDots.length; i++) {
      const d = intakeDots[i];
      const f = ((now * 0.8 + i / intakeDots.length) % 1);
      d.setAttribute('cx', (38 + f * 82).toFixed(1));
      d.setAttribute('cy', (148 + Math.sin(f * 8 + i) * 3).toFixed(1));
      d.setAttribute('opacity', (stroke === 0 ? Math.sin(f * Math.PI) * 0.7 : 0).toFixed(2));
    }
    for (let i = 0; i < exhaustDots.length; i++) {
      const d = exhaustDots[i];
      const f = ((now * 0.8 + i / exhaustDots.length) % 1);
      d.setAttribute('cx', (200 + f * 112).toFixed(1));
      d.setAttribute('cy', (148 + Math.sin(f * 8 + i) * 3).toFixed(1));
      d.setAttribute('opacity', (stroke === 3 ? Math.sin(f * Math.PI) * 0.55 : 0).toFixed(2));
    }

    /* chrome */
    const lead = t('lead');
    if (lastLead !== lead) { lastLead = lead; if (els.lead) els.lead.textContent = lead; }
    const status = S.mode === 'step' ? t('statusStep')
      : S.running ? t('statusRunning')
      : t('statusStopped');
    if (lastStatus !== status) {
      lastStatus = status;
      if (els.status) {
        els.status.textContent = status;
        els.status.classList.toggle('busy', S.running);
      }
    }
    const note = t(S.mode === 'step' ? 'stepHint' : 'slow');
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
