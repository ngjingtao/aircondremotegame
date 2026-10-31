/* ═══════════════════════════════════════════
   weather/js/panel.js — readings and forecast buttons
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

  function dirName(deg) {
    const names = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return names[Math.round(((deg % 360) / 45)) % 8];
  }

  function build(handler) {
    onAction = handler;
    els.readings = $('readings');
    els.forecasts = $('forecast-row');
    els.submit = $('forecast-submit');
    els.next = $('forecast-next');
    els.feedback = $('weather-feedback');
    els.result = $('weather-result');
    els.stars = $('weather-stars');
    els.resText = $('weather-res-text');
    els.hudRound = $('hud-round');
    els.hudScore = $('hud-score');

    const sim = ARG.sim;
    const items = [
      { key: 'pressure', unit: 'hPa' },
      { key: 'humidity', unit: '%' },
      { key: 'wind', unit: 'km/h' },
      { key: 'rain', unit: 'mm' },
      { key: 'river', unit: 'm' },
      { key: 'sun', unit: 'h' }
    ];
    if (els.readings) {
      els.readings.innerHTML = items.map(it =>
        '<div class="reading" data-reading="' + it.key + '">' +
          '<span class="rd-label" data-i18n="' + it.key + '"></span>' +
          '<b class="rd-val">—</b>' +
          '<i class="rd-unit">' + it.unit + '</i>' +
        '</div>').join('');
    }
    if (els.forecasts) {
      els.forecasts.innerHTML = sim.FORECASTS.map(f =>
        '<button class="seg-btn" data-action="guess" data-forecast="' + f.id + '">' +
          '<span class="sb-ico">' + f.ico + '</span><b data-i18n="' + f.key + '"></b>' +
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
    const r = sim.current();

    const values = {
      pressure: r.pressure + ' / ' + t(r.trend),
      humidity: r.humidity,
      wind: r.wind + ' · ' + dirName(r.dir),
      rain: r.rain,
      river: r.river.toFixed(1),
      sun: r.sun
    };
    if (els.readings) {
      els.readings.querySelectorAll('.reading').forEach(card => {
        const key = card.dataset.reading;
        const v = values[key];
        if (seen[key] !== v) {
          seen[key] = v;
          setText(card.querySelector('.rd-val'), String(v));
        }
      });
    }

    if (els.forecasts) {
      els.forecasts.querySelectorAll('.seg-btn').forEach(b => {
        b.classList.toggle('on', b.dataset.forecast === S.guess);
        b.classList.toggle('locked', S.phase !== 'read');
      });
    }
    if (els.submit) {
      els.submit.disabled = S.phase !== 'read' || !S.guess;
      els.submit.hidden = S.phase !== 'read';
    }
    if (els.next) {
      els.next.hidden = S.phase === 'read';
      setText(els.next, t(S.phase === 'done' ? 'again' : 'next'));
      if (S.phase === 'done') els.next.hidden = false;
    }

    if (els.feedback) {
      const show = S.phase === 'reveal';
      els.feedback.hidden = !show;
      if (show) {
        const right = S.guess === r.forecast;
        setText(els.feedback, t(right ? 'right' : 'wrong') + ' ' + t(r.key + 'why'));
        els.feedback.classList.toggle('good', right);
        els.feedback.classList.toggle('bad', !right);
      }
    }

    if (els.result) els.result.hidden = S.phase !== 'done';
    if (S.phase === 'done') {
      setText(els.stars, stars(S.stars));
      setText(els.resText, t(S.reason));
    }

    const round = Math.min(sim.ROUNDS.length, S.round + 1) + ' / ' + sim.ROUNDS.length;
    if (seen.round !== round) { seen.round = round; setText(els.hudRound, round); }
    if (seen.correct !== S.correct) {
      seen.correct = S.correct;
      setText(els.hudScore, S.correct + ' / ' + sim.ROUNDS.length);
    }
  }

  function refresh() { for (const k in seen) delete seen[k]; }

  return { build, render, refresh };
})();
