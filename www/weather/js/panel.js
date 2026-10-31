/* ═══════════════════════════════════════════
   weather/js/panel.js — readings and forecast buttons
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.panel = (function () {

  const T = () => ARG.i18n.t;
  const M = () => ARG.sim.s;
  const $ = id => document.getElementById(id);
  const setText = (el, v) => { if (el && el.textContent !== v) el.textContent = v; };
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

  /* one entry per instrument in the picture and in the readings */
  const INSTRUMENTS = [
    { id: 'barometer', ico: '⏲️' },
    { id: 'hygrometer', ico: '💧' },
    { id: 'thermometer', ico: '🌡️' },
    { id: 'anemometer', ico: '🌀' },
    { id: 'vane', ico: '🧭' },
    { id: 'rainGauge', ico: '🌧️' },
    { id: 'riverGauge', ico: '🌊' },
    { id: 'sunshine', ico: '☀️' }
  ];

  let els = {};
  let onAction = null;
  let currentInst = null;
  let instView = '';
  const seen = {};

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
    els.instOverlay = $('instrument-overlay');
    els.instCard = els.instOverlay ? els.instOverlay.querySelector('.overlay-card') : null;
    els.instIcon = $('inst-icon');
    els.instTitle = $('inst-title');
    els.instBody = $('inst-body');
    els.instBack = $('inst-back');
    els.instClose = $('inst-close');
    els.instRead = $('inst-read');

    const sim = ARG.sim;
    const items = [
      { key: 'pressure', unit: 'hPa', instrument: 'barometer' },
      { key: 'humidity', unit: '%', instrument: 'hygrometer' },
      { key: 'wind', unit: 'km/h', instrument: 'anemometer' },
      { key: 'rain', unit: 'mm', instrument: 'rainGauge' },
      { key: 'river', unit: 'm', instrument: 'riverGauge' },
      { key: 'sun', unit: 'h', instrument: 'sunshine' }
    ];
    if (els.readings) {
      els.readings.innerHTML = items.map(it =>
        '<button type="button" class="reading" data-reading="' + it.key + '" data-action="instrument" data-instrument="' + it.instrument + '">' +
          '<span class="rd-label" data-i18n="' + it.key + '"></span>' +
          '<b class="rd-val">—</b>' +
          '<i class="rd-unit">' + it.unit + '</i>' +
          '<i class="rd-info" aria-hidden="true">?</i>' +
        '</button>').join('');
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

    if (els.instClose) els.instClose.addEventListener('click', hideInstrument);
    if (els.instBack) els.instBack.addEventListener('click', showInstrumentIndex);
    if (els.instRead) {
      if (!ARG.voice || !ARG.voice.supported) els.instRead.hidden = true;
      els.instRead.addEventListener('click', () => {
        if (!ARG.voice) return;
        if (ARG.voice.speaking) { ARG.voice.stop(); return; }
        const title = els.instTitle ? els.instTitle.textContent + '. ' : '';
        const body = els.instBody ? els.instBody.textContent : '';
        ARG.voice.speakLinked(els.instBody, title + body);
      });
    }
    if (els.instOverlay) {
      els.instOverlay.addEventListener('click', ev => {
        if (ev.target === els.instOverlay) hideInstrument();
      });
      document.addEventListener('keydown', ev => {
        if (ev.key === 'Escape' && !els.instOverlay.hidden) hideInstrument();
      });
    }
    if (els.instBody) {
      els.instBody.addEventListener('pointerdown', ev => {
        const row = ev.target && ev.target.closest ? ev.target.closest('[data-instrument]') : null;
        if (!row) return;
        ev.preventDefault();
        showInstrument(row.getAttribute('data-instrument'));
      });
    }
  }

  function showInstrument(key) {
    const inst = INSTRUMENTS.find(x => x.id === key);
    if (!inst || !els.instOverlay) return;
    const t = T();
    currentInst = key;
    instView = 'detail';
    setText(els.instIcon, inst.ico);
    setText(els.instTitle, t('inst' + cap(key) + 'Name'));
    if (els.instBody) els.instBody.innerHTML = t('inst' + cap(key) + 'Body');
    if (els.instBack) els.instBack.hidden = false;
    els.instOverlay.hidden = false;
    if (els.instCard) els.instCard.scrollTop = 0;
    if (ARG.voice && ARG.voice.stop) ARG.voice.stop();
  }

  function showInstrumentIndex() {
    if (!els.instOverlay) return;
    const t = T();
    currentInst = null;
    instView = 'index';
    setText(els.instIcon, '🔎');
    setText(els.instTitle, t('instIndexTitle'));
    if (els.instBack) els.instBack.hidden = true;
    if (els.instBody) {
      els.instBody.innerHTML = '<p class="inst-hint">' + t('instIndexHint') + '</p>' +
        INSTRUMENTS.map(i =>
          '<button type="button" class="inst-row" data-instrument="' + i.id + '">' +
            '<span class="ir-ico">' + i.ico + '</span>' +
            '<span class="ir-name">' + t('inst' + cap(i.id) + 'Name') + '</span>' +
            '<span class="ir-go">›</span>' +
          '</button>').join('');
    }
    els.instOverlay.hidden = false;
    if (els.instCard) els.instCard.scrollTop = 0;
    if (ARG.voice && ARG.voice.stop) ARG.voice.stop();
  }

  function hideInstrument() {
    if (els.instOverlay) els.instOverlay.hidden = true;
    currentInst = null;
    instView = '';
    if (ARG.voice && ARG.voice.stop) ARG.voice.stop();
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
      pressure: r.pressure + (r.trend === 'rising' ? ' ↗' : ' ↘'),
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

  function refresh() {
    for (const k in seen) delete seen[k];
    if (els.instOverlay && !els.instOverlay.hidden) {
      if (instView === 'detail' && currentInst) showInstrument(currentInst);
      else if (instView === 'index') showInstrumentIndex();
    }
  }

  return { build, render, refresh, showInstrument, showInstrumentIndex, hideInstrument };
})();
