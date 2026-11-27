/* restaurant/js/panel.js — order, menu, money and change */
window.ARG = window.ARG || {};

ARG.panel = (function () {
  const T = () => ARG.i18n.t;
  let els = {}, onAction = null, lastFact = '';

  function $(id) { return document.getElementById(id); }
  function setText(el, v) { if (el && el.textContent !== v) el.textContent = v; }
  function money(v) { return ARG.sim.money(v); }

  function build(handler) {
    onAction = handler;
    els.fact = $('rest-fact');
    els.order = $('order-list');
    els.menu = $('menu-grid');
    els.serveBox = $('serve-box');
    els.totalBox = $('total-box');
    els.totalRow = $('total-row');
    els.payBox = $('pay-box');
    els.noteRow = $('note-row');
    els.changeBox = $('change-box');
    els.changeRow = $('change-row');
    els.feedback = $('rest-feedback');
    els.result = $('rest-result');
    els.stars = $('rest-stars');
    els.resText = $('rest-res-text');
    els.earned = $('hud-earned');
    els.round = $('hud-round');

    if (els.menu) {
      els.menu.innerHTML = ARG.sim.MENU.map(m =>
        '<button class="menu-btn" data-action="serve" data-item="' + m.id + '">' +
          '<span>' + m.ico + '</span><b data-i18n="' + m.key + '"></b>' +
          '<i data-i18n="' + m.key + 'Price"></i>' +
        '</button>'
      ).join('');
    }
    if (els.noteRow) {
      els.noteRow.innerHTML = ARG.sim.NOTES.map(n =>
        '<button class="note-btn" data-action="pay" data-value="' + n + '"><b>RM ' + n + '</b></button>'
      ).join('');
    }

    const ctl = $('ctl');
    if (ctl) {
      ctl.addEventListener('pointerdown', ev => {
        const b = ev.target && ev.target.closest ? ev.target.closest('[data-action]') : null;
        if (!b) return;
        ev.preventDefault();
        if (navigator.vibrate) { try { navigator.vibrate(10); } catch (e) {} }
        b.classList.add('pressed');
        setTimeout(() => b.classList.remove('pressed'), 130);
        onAction(b.dataset.action, b);
      });
    }
  }

  function choices(host, values, action) {
    if (!host) return;
    host.innerHTML = values.map(v =>
      '<button class="choice-btn" data-action="' + action + '" data-value="' + v + '">' + money(v) + '</button>'
    ).join('');
  }

  function render() {
    const S = ARG.sim.s;
    const t = T();

    const fk = ARG.sim.factKey();
    if (fk !== lastFact) { lastFact = fk; setText(els.fact, t(fk)); }

    if (els.order) {
      const served = S.served;
      els.order.innerHTML = ARG.sim.orderItems().map(m => {
        const done = served.indexOf(m.id) >= 0;
        return '<span class="order-item' + (done ? ' done' : '') + '">' +
          '<span>' + m.ico + '</span><b data-i18n="' + m.key + '"></b>' +
          '<i>' + money(m.price) + '</i><em>' + (done ? '✓' : '') + '</em></span>';
      }).join('');
      ARG.i18n.apply(els.order);
    }

    if (els.menu) {
      els.menu.querySelectorAll('[data-item]').forEach(b => {
        b.classList.toggle('done', S.served.indexOf(b.dataset.item) >= 0);
        b.disabled = S.phase !== 'serve';
      });
    }

    if (els.serveBox) els.serveBox.hidden = S.phase !== 'serve';
    if (els.totalBox) els.totalBox.hidden = S.phase !== 'total';
    if (els.payBox) els.payBox.hidden = S.phase !== 'pay';
    if (els.changeBox) els.changeBox.hidden = S.phase !== 'change';

    if (S.phase === 'total') choices(els.totalRow, S.totalOptions, 'total');
    if (S.phase === 'change') choices(els.changeRow, S.changeOptions, 'change');

    if (els.feedback) {
      els.feedback.textContent = S.feedback ? t(S.feedback) : '';
      els.feedback.className = 'feedback' + (S.feedback ? (S.feedbackOk ? ' ok' : ' no') : '');
    }

    setText(els.earned, money(S.earned));
    setText(els.round, Math.min(S.round + 1, ARG.sim.ORDERS.length) + ' / ' + ARG.sim.ORDERS.length);

    if (els.result) els.result.hidden = !S.done;
    if (S.done) {
      const st = ARG.sim.stars();
      setText(els.stars, '★★★☆☆☆'.slice(3 - st, 6 - st));
      setText(els.resText, t('resultText').replace('{s}', S.score).replace('{n}', ARG.sim.ORDERS.length).replace('{m}', money(S.earned)));
    }
  }

  function refresh() { lastFact = ''; }

  return { build, render, refresh };
})();
