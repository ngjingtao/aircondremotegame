/* ═══════════════════════════════════════════
   sandwich/js/panel.js — choices, heat, timer
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
      '<button class="seg-btn" data-action="set" data-key="' + key + '" data-value="' + it.id + '">' +
        '<span class="sb-ico">' + it.ico + '</span>' +
        '<b data-i18n="' + it.key + '"></b>' +
      '</button>').join('');
  }

  function build(handler) {
    onAction = handler;
    els.breadRow = $('bread-row');
    els.spreadRow = $('spread-row');
    els.fillingRow = $('filling-row');
    els.vegRow = $('veg-row');
    els.heatRow = $('heat-row');
    els.cookPanel = $('cook-panel');
    els.cookBand = $('cook-band');
    els.cookMark = $('cook-mark');
    els.cookTime = $('cook-time');
    els.actionBtn = $('sandwich-action');
    els.result = $('sandwich-result');
    els.stars = $('sandwich-stars');
    els.resText = $('sandwich-res-text');
    els.hudBalance = $('hud-balance');
    els.hudPan = $('hud-pan');

    const sim = ARG.sim;
    seg(els.breadRow, 'bread', sim.BREADS);
    seg(els.spreadRow, 'spread', sim.SPREADS);
    seg(els.fillingRow, 'filling', sim.FILLINGS);
    seg(els.vegRow, 'veg', sim.VEGGIES);
    seg(els.heatRow, 'heat', sim.HEATS.map(h => ({ id: h.id, key: h.key, ico: '🔥' })));

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

  function setText(el, v) { if (el && el.textContent !== v) el.textContent = v; }

  function mark(host, key, value) {
    if (!host) return;
    host.querySelectorAll('[data-key="' + key + '"]').forEach(b => {
      b.classList.toggle('on', b.dataset.value === value);
    });
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
    const target = sim.heatTarget();

    mark(els.breadRow, 'bread', S.bread);
    mark(els.spreadRow, 'spread', S.spread);
    mark(els.fillingRow, 'filling', S.filling);
    mark(els.vegRow, 'veg', S.veg);
    mark(els.heatRow, 'heat', S.heat);

    const locked = S.phase !== 'build';
    [els.breadRow, els.spreadRow, els.fillingRow, els.vegRow].forEach(row => {
      if (!row) return;
      row.querySelectorAll('.seg-btn').forEach(b => b.classList.toggle('locked', locked));
    });
    if (els.heatRow) {
      els.heatRow.querySelectorAll('.seg-btn').forEach(b =>
        b.classList.toggle('locked', S.phase !== 'cook' || S.cooking));
    }

    if (els.cookPanel) els.cookPanel.hidden = S.phase !== 'cook';
    if (els.cookBand && els.cookBand.style) {
      const max = target * 1.7;
      const lo = (target * 0.9 / max) * 100;
      const hi = (target * 1.1 / max) * 100;
      els.cookBand.style.left = lo.toFixed(1) + '%';
      els.cookBand.style.width = (hi - lo).toFixed(1) + '%';
    }
    if (els.cookMark && els.cookMark.style) {
      els.cookMark.style.left = Math.min(100, (S.cookT / (target * 1.7)) * 100).toFixed(1) + '%';
    }
    const timeTxt = S.phase === 'cook' ? S.cookT.toFixed(1) + ' s' : '';
    if (seen.time !== timeTxt) { seen.time = timeTxt; setText(els.cookTime, timeTxt); }

    const actionKey = S.phase === 'build' ? 'toPan'
      : S.phase === 'cook' ? (S.cooking ? 'stopCook' : 'startCook')
      : S.phase === 'ready' ? 'buildIt'
      : 'again';
    if (seen.action !== actionKey) { seen.action = actionKey; setText(els.actionBtn, t(actionKey)); }
    if (els.actionBtn) els.actionBtn.classList.toggle('cooking', S.cooking);

    if (els.result) els.result.hidden = S.phase !== 'done';
    if (S.phase === 'done') {
      setText(els.stars, stars(S.stars));
      setText(els.resText, t(S.reason));
    }

    const bal = Math.round(sim.balance() * 100);
    if (seen.bal !== bal) {
      seen.bal = bal;
      setText(els.hudBalance, bal + '%');
      if (els.hudBalance) {
        els.hudBalance.classList.toggle('good', bal >= 80);
        els.hudBalance.classList.toggle('bad', bal < 50);
      }
    }
    const pan = S.phase === 'cook' ? t(S.heat === 'low' ? 'hLow' : S.heat === 'med' ? 'hMed' : 'hHigh')
      : S.phase === 'ready' ? Math.round(S.cookQuality * 100) + '%'
      : '—';
    if (seen.pan !== pan) { seen.pan = pan; setText(els.hudPan, pan); }
  }

  function refresh() { for (const k in seen) delete seen[k]; }

  return { build, render, refresh };
})();
