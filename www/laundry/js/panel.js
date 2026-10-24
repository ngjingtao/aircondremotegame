/* ═══════════════════════════════════════════
   laundry/js/panel.js — the control panel
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.panel = (function () {

  const T = () => ARG.i18n.t;
  const M = () => ARG.sim.s;

  let els = {};
  let onAction = null;
  const seen = {};

  function $(id) { return document.getElementById(id); }

  function seg(host, key, items) {
    if (!host) return;
    host.innerHTML = items.map(it =>
      '<button class="seg-btn" data-action="set" data-key="' + key + '" data-value="' + it.value + '">' +
        (it.ico ? '<span class="sb-ico">' + it.ico + '</span>' : '') +
        '<b' + (it.key ? ' data-i18n="' + it.key + '"' : '') + '>' + (it.text || '') + '</b>' +
      '</button>').join('');
  }

  function build(handler) {
    onAction = handler;

    els.paneWash = $('pane-wash');
    els.paneDry = $('pane-dry');
    els.tabWash = $('tab-wash');
    els.tabDry = $('tab-dry');

    els.washPhase = $('wash-phase');
    els.washProgress = $('wash-progress');
    els.washStart = $('wash-start');
    els.washResult = $('wash-result');
    els.washStars = $('wash-stars');
    els.washResText = $('wash-res-text');

    els.dryPhase = $('dry-phase');
    els.dryProgress = $('dry-progress');
    els.dryStart = $('dry-start');
    els.dryResult = $('dry-result');
    els.dryStars = $('dry-stars');
    els.dryResText = $('dry-res-text');

    els.hudClean = $('hud-clean');
    els.hudMoisture = $('hud-moisture');

    const sim = ARG.sim;
    const loadItems = sim.LOADS.map((l, i) => ({
      value: l.id, ico: ['🧺', '👕', '🧶'][i], key: l.key
    }));

    seg($('load-row'), 'load', loadItems);
    seg($('load-row-dry'), 'load', loadItems);

    seg($('program-row'), 'program', sim.PROG_ORDER.map((id, i) => ({
      value: id, ico: ['⚡', '🛏️', '💪', '🧶'][i], key: sim.PROGRAMS[id].key
    })));

    seg($('temp-row'), 'temp', sim.TEMPS.map(t => ({
      value: String(t), text: t + '°'
    })));

    seg($('spin-row'), 'spin', sim.SPINS.map(s => ({
      value: String(s), text: String(s)
    })));

    seg($('det-row'), 'detergent', sim.DET_ORDER.map((id, i) => ({
      value: id, ico: ['💧', '🧴', '🫧'][i], key: sim.DETERGENTS[id].key
    })));

    seg($('dry-program-row'), 'dryProgram', sim.DRY_PROG_ORDER.map((id, i) => ({
      value: id, ico: ['🌀', '⏱️'][i], key: sim.DRY_PROGRAMS[id].key
    })));

    seg($('dryness-row'), 'dryness', sim.DRYNESS_ORDER.map((id, i) => ({
      value: id, ico: ['👔', '🚪', '✨'][i], key: 'dry' + id.charAt(0).toUpperCase() + id.slice(1)
    })));

    seg($('heat-row'), 'heat', sim.HEAT_ORDER.map((id, i) => ({
      value: id, ico: ['🌬️', '🔥'][i], key: sim.HEATS[id].key
    })));

    /* one delegated listener covers every button, including ones built above */
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

  function mark(host, key, value) {
    if (!host) return;
    host.querySelectorAll('[data-key="' + key + '"]').forEach(b => {
      b.classList.toggle('on', b.dataset.value === String(value));
    });
  }

  function stars(n) {
    const out = [];
    for (let i = 0; i < 3; i++) out.push(i < n ? '★' : '☆');
    return out.join('');
  }

  function phaseKey(S, which) {
    if (which === 'wash') {
      if (S.phase === 'fill') return 'phFill';
      if (S.phase === 'wash') return 'phWash';
      if (S.phase === 'drain') return 'phDrain';
      if (S.phase === 'rinse') return 'phRinse';
      if (S.phase === 'spin') return 'phSpin';
      return S.washDone ? 'phDone' : 'phIdle';
    }
    if (S.phase === 'heat') return 'dhHeat';
    if (S.phase === 'dry') return 'dhDry';
    if (S.phase === 'cool') return 'dhCool';
    return S.dryDone ? 'dhDone' : 'dhIdle';
  }

  function render() {
    const S = M();
    const t = T();
    const sim = ARG.sim;

    const washRunning = sim.WASH_PHASES.indexOf(S.phase) >= 0;
    const dryRunning = sim.DRY_PHASES.indexOf(S.phase) >= 0;

    if (els.tabWash) els.tabWash.classList.toggle('on', S.tab === 'wash');
    if (els.tabDry) els.tabDry.classList.toggle('on', S.tab === 'dry');
    if (els.paneWash) els.paneWash.hidden = S.tab !== 'wash';
    if (els.paneDry) els.paneDry.hidden = S.tab !== 'dry';

    mark($('load-row'), 'load', S.load);
    mark($('load-row-dry'), 'load', S.load);
    mark($('program-row'), 'program', S.program);
    mark($('temp-row'), 'temp', S.temp);
    mark($('spin-row'), 'spin', S.spin);
    mark($('det-row'), 'detergent', S.detergent);
    mark($('dry-program-row'), 'dryProgram', S.dryProgram);
    mark($('dryness-row'), 'dryness', S.dryness);
    mark($('heat-row'), 'heat', S.heat);

    /* ── washer phase + button ── */
    const wp = phaseKey(S, 'wash');
    if (seen.wp !== wp) { seen.wp = wp; setText(els.washPhase, t(wp)); }
    const wPct = Math.round((washRunning ? S.progress : (S.washDone ? 1 : 0)) * 100);
    if (seen.wPct !== wPct) {
      seen.wPct = wPct;
      if (els.washProgress && els.washProgress.style) els.washProgress.style.width = wPct + '%';
    }
    const wLabel = washRunning ? t('stop') : S.washDone ? t('again') : t('start');
    if (seen.wLabel !== wLabel) { seen.wLabel = wLabel; setText(els.washStart, wLabel); }
    if (els.washStart) els.washStart.classList.toggle('running', washRunning);

    /* ── dryer phase + button ── */
    const dp = phaseKey(S, 'dry');
    if (seen.dp !== dp) { seen.dp = dp; setText(els.dryPhase, t(dp)); }
    const dPct = Math.round((dryRunning ? S.progress : (S.dryDone ? 1 : 0)) * 100);
    if (seen.dPct !== dPct) {
      seen.dPct = dPct;
      if (els.dryProgress && els.dryProgress.style) els.dryProgress.style.width = dPct + '%';
    }
    const dLabel = dryRunning ? t('stop') : S.dryDone ? t('again') : t('start');
    if (seen.dLabel !== dLabel) { seen.dLabel = dLabel; setText(els.dryStart, dLabel); }
    if (els.dryStart) els.dryStart.classList.toggle('running', dryRunning);

    /* ── result cards ── */
    if (els.washResult) els.washResult.hidden = !S.washDone;
    if (S.washDone) {
      setText(els.washStars, stars(S.washStars));
      setText(els.washResText, t(S.washReason));
    }
    if (els.dryResult) els.dryResult.hidden = !S.dryDone;
    if (S.dryDone) {
      setText(els.dryStars, stars(S.dryStars));
      setText(els.dryResText, t(S.dryReason));
    }

    /* ── the top-bar numbers ── */
    const clean = Math.round(S.clean * 100);
    if (seen.clean !== clean) {
      seen.clean = clean;
      setText(els.hudClean, clean + '%');
      if (els.hudClean) {
        els.hudClean.classList.toggle('good', clean >= 85);
        els.hudClean.classList.toggle('bad', clean > 0 && clean < 60);
      }
    }
    const moisture = Math.round(S.moisture * 100);
    if (seen.moisture !== moisture) {
      seen.moisture = moisture;
      setText(els.hudMoisture, moisture + '%');
      if (els.hudMoisture) {
        els.hudMoisture.classList.toggle('good', moisture <= 12);
        els.hudMoisture.classList.toggle('bad', moisture > 65);
      }
    }
  }

  function refresh() {
    for (const k in seen) delete seen[k];
  }

  return { build, render, refresh };
})();
