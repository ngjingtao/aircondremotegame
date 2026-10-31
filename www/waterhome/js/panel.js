/* ═══════════════════════════════════════════
   waterhome/js/panel.js — supply steps and heater controls
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
    els.tabSupply = $('tab-supply');
    els.tabHeater = $('tab-heater');
    els.paneSupply = $('pane-supply');
    els.paneHeater = $('pane-heater');
    els.steps = $('supply-steps');
    els.fact = $('supply-fact');
    els.next = $('supply-next');
    els.back = $('supply-back');
    els.power = $('heater-power');
    els.powerState = $('power-state');
    els.setpoints = $('setpoint-row');
    els.temp = $('tank-temp');
    els.tempBar = $('tank-bar-fill');
    els.bottomTemp = $('bottom-temp');
    els.upperChip = $('upper-chip');
    els.lowerChip = $('lower-chip');
    els.upperLed = $('upper-led');
    els.lowerLed = $('lower-led');
    els.draw = $('draw-btn');
    els.state = $('heater-state');
    els.result = $('water-result');
    els.stars = $('water-stars');
    els.resText = $('water-res-text');
    els.hudTemp = $('hud-temp');
    els.hudDrawn = $('hud-drawn');

    const sim = ARG.sim;
    if (els.steps) {
      els.steps.innerHTML = sim.SUPPLY.map((s, i) =>
        '<button class="wstep" data-action="jump" data-step="' + i + '">' +
          '<span class="ws-n">' + (i + 1) + '</span>' +
          '<b data-i18n="' + s.key + '"></b>' +
        '</button>').join('');
    }
    if (els.setpoints) {
      els.setpoints.innerHTML = sim.SETPOINTS.map(n =>
        '<button class="seg-btn" data-action="set" data-key="setTemp" data-value="' + n + '">' +
          '<b>' + n + '°</b>' +
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

  function stars(n) {
    let out = '';
    for (let i = 0; i < 3; i++) out += i < n ? '★' : '☆';
    return out;
  }

  function render() {
    const S = M();
    const t = T();
    const sim = ARG.sim;
    const rating = sim.rating();

    if (els.tabSupply) els.tabSupply.classList.toggle('on', S.tab === 'supply');
    if (els.tabHeater) els.tabHeater.classList.toggle('on', S.tab === 'heater');
    if (els.paneSupply) els.paneSupply.hidden = S.tab !== 'supply';
    if (els.paneHeater) els.paneHeater.hidden = S.tab !== 'heater';

    if (els.steps) {
      els.steps.querySelectorAll('.wstep').forEach((b, i) => {
        b.classList.toggle('on', i === S.step);
        b.classList.toggle('done', i < S.step || S.supplyDone);
      });
    }
    if (seen.step !== S.step) {
      seen.step = S.step;
      setText(els.fact, t(sim.SUPPLY[S.step].fact));
    }
    if (els.back) els.back.disabled = S.step <= 0;
    if (els.next) els.next.classList.toggle('done', S.step >= sim.SUPPLY.length - 1);

    if (els.powerState) {
      setText(els.powerState, t(S.power ? 'on' : 'off'));
      if (els.power) els.power.classList.toggle('warn', !S.power);
    }
    if (els.setpoints) {
      els.setpoints.querySelectorAll('.seg-btn').forEach(b => {
        b.classList.toggle('on', +b.dataset.value === S.setTemp);
      });
    }

    const temp = Math.round(S.temp);
    if (seen.temp !== temp) {
      seen.temp = temp;
      setText(els.temp, temp + '°C');
      if (els.tempBar) els.tempBar.style.width = (Math.min(1, (S.temp - 20) / 50) * 100).toFixed(1) + '%';
      setText(els.hudTemp, temp + '°');
      if (els.hudTemp) {
        els.hudTemp.classList.toggle('good', S.temp >= 60);
        els.hudTemp.classList.toggle('bad', S.temp < 30);
      }
    }
    const bottom = Math.round(S.bottom);
    if (seen.bottom !== bottom) {
      seen.bottom = bottom;
      setText(els.bottomTemp, bottom + '°C');
    }
    if (els.upperChip) els.upperChip.classList.toggle('on', S.upperOn);
    if (els.lowerChip) els.lowerChip.classList.toggle('on', S.lowerOn);
    if (els.state) {
      setText(els.state, t(S.upperOn ? 'upperHeating' : S.lowerOn ? 'lowerHeating' : S.temp >= S.setTemp - 0.5 ? 'ready' : 'cold'));
      els.state.classList.toggle('heating', S.heating);
    }
    if (els.draw) els.draw.disabled = S.temp < 30;

    if (seen.drawn !== S.drawn) {
      seen.drawn = S.drawn;
      setText(els.hudDrawn, String(S.drawn));
    }

    if (els.result) els.result.hidden = rating.stars === 0;
    if (rating.stars > 0) {
      setText(els.stars, stars(rating.stars));
      setText(els.resText, t(rating.reason));
    }
  }

  function refresh() { for (const k in seen) delete seen[k]; }

  return { build, render, refresh };
})();
