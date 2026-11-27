/* baggage/js/panel.js — tag, chutes and score */
window.ARG = window.ARG || {};

ARG.panel = (function () {
  const T = () => ARG.i18n.t;
  let els = {}, onAction = null, lastFact = '';

  function $(id) { return document.getElementById(id); }
  function setText(el, v) { if (el && el.textContent !== v) el.textContent = v; }

  function build(handler) {
    onAction = handler;
    els.fact = $('bag-fact');
    els.chutes = $('chute-row');
    els.code = $('tag-code');
    els.city = $('tag-city');
    els.flight = $('tag-flight');
    els.no = $('tag-no');
    els.belt = $('belt-fill');
    els.note = $('belt-note');
    els.feedback = $('bag-feedback');
    els.start = $('btn-start');
    els.result = $('bag-result');
    els.stars = $('bag-stars');
    els.resText = $('bag-res-text');
    els.score = $('hud-score');
    els.miss = $('hud-miss');

    if (els.chutes) {
      els.chutes.innerHTML = ARG.sim.DESTS.map((d, i) =>
        '<button class="chute-btn" data-action="sort" data-chute="' + i + '">' +
          '<b>' + d.code + '</b><i>' + d.city + '</i>' +
        '</button>'
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

  function render() {
    const S = ARG.sim.s;
    const t = T();
    const b = ARG.sim.bag();
    const d = ARG.sim.dest();

    const fk = ARG.sim.factKey();
    if (fk !== lastFact) { lastFact = fk; setText(els.fact, t(fk)); }

    setText(els.code, b.code);
    setText(els.city, d.city);
    setText(els.flight, b.flight);
    setText(els.no, '#' + Math.min(S.i + 1, ARG.sim.BAGS.length) + ' / ' + ARG.sim.BAGS.length);

    if (els.chutes) {
      els.chutes.querySelectorAll('[data-chute]').forEach(btn => {
        btn.disabled = !S.running;
      });
    }

    const pct = S.running ? Math.min(100, (S.t / S.duration) * 100) : (S.done ? 100 : 0);
    if (els.belt) els.belt.style.width = pct + '%';
    if (els.note) setText(els.note, S.running ? t('statusRun') : (S.done ? t('statusDone') : t('statusIdle')));

    if (els.feedback) {
      const f = S.feedback;
      els.feedback.textContent = f ? t(f) : '';
      els.feedback.className = 'feedback' + (f ? (S.feedbackOk ? ' ok' : ' no') : '');
    }

    if (els.start) {
      els.start.disabled = S.running || S.done;
      setText(els.start, t('start'));
    }

    setText(els.score, String(S.score));
    setText(els.miss, String(S.mistakes));

    if (els.result) els.result.hidden = !S.done;
    if (S.done) {
      const stars = ARG.sim.stars();
      setText(els.stars, '★★★☆☆☆'.slice(3 - stars, 6 - stars));
      setText(els.resText, t('resultText').replace('{s}', S.score).replace('{n}', ARG.sim.BAGS.length).replace('{m}', S.mistakes));
    }
  }

  function refresh() { lastFact = ''; }

  return { build, render, refresh };
})();
