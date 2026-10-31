/* ═══════════════════════════════════════════
   sandwich/js/scene.js — the pan, the stack, the steam
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.scene = (function () {

  const T = () => ARG.i18n.t;
  const M = () => ARG.sim.s;
  const NS = 'http://www.w3.org/2000/svg';

  const BREAD = { white: '#f0c987', wholemeal: '#c99a5b', sourdough: '#d8a35f' };
  const SPREAD = { butter: '#ffd36a', avocado: '#8ecf72', mayo: '#fff1c9', none: '#000000' };

  let els = {};
  let steam = [];
  let lastNote = null, lastStatus = null, lastLead = null;
  let toastTimer = null;

  function mk(tag, attrs) {
    const e = document.createElementNS(NS, tag);
    if (attrs) Object.keys(attrs).forEach(k => e.setAttribute(k, attrs[k]));
    return e;
  }

  function build() {
    els.scene = document.getElementById('scene');
    els.panEgg = document.getElementById('panEgg');
    els.panYolk = document.getElementById('panYolk');
    els.pan = document.getElementById('pan');
    els.panGlow = document.getElementById('panGlow');
    els.steam = document.getElementById('steam');
    els.labels = document.getElementById('labels');
    els.lead = document.getElementById('scene-lead');
    els.status = document.getElementById('scene-status');
    els.paneNote = document.getElementById('pane-note');
    els.toast = document.getElementById('toast');

    if (els.steam) {
      for (let i = 0; i < 9; i++) {
        const s = mk('circle', { r: (3 + (i % 3) * 1.2).toFixed(1), class: 'steam', opacity: '0' });
        els.steam.appendChild(s);
        steam.push(s);
      }
    }
  }

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  function show(id, on) {
    const e = document.getElementById(id);
    if (e) e.setAttribute('opacity', on ? '1' : '0');
  }

  function render(dt) {
    const S = M();
    const t = T();
    const d = dt || 0.016;
    const now = performance.now() / 1000;
    const target = ARG.sim.heatTarget();

    if (els.scene) {
      els.scene.setAttribute('data-phase', S.phase);
      els.scene.setAttribute('data-cooking', S.cooking ? '1' : '0');
    }

    /* the pan only matters in the cooking phases, but it is still on the counter */
    const panOn = S.phase === 'cook' || S.phase === 'ready';
    const panOpacity = panOn ? '1' : S.phase === 'build' ? '0.35' : '0.18';
    const panGroup = document.getElementById('panGroup');
    if (panGroup) panGroup.setAttribute('opacity', panOpacity);
    show('stackGroup', S.built);
    show('plate', true);
    if (els.panGlow) els.panGlow.setAttribute('opacity', S.cooking ? '0.55' : '0');

    /* the egg changes colour as it cooks */
    if (S.phase === 'cook' || S.phase === 'ready') {
      const p = S.cookT / target;
      const yolk = p < 0.55 ? '#ffd34d' : p < 1.1 ? '#ffbf3a' : '#b96b2a';
      const white = p < 0.55 ? '#fffdf5' : p < 1.1 ? '#f8f0da' : '#d8b98a';
      if (els.panYolk) els.panYolk.setAttribute('fill', yolk);
      if (els.panEgg) els.panEgg.setAttribute('fill', white);
    }

    /* the sandwich layers */
    show('fillEgg', S.built && (S.filling === 'egg' || S.filling === 'eggcheese'));
    show('fillCheese', S.built && (S.filling === 'cheese' || S.filling === 'eggcheese'));
    show('fillBacon', S.built && S.filling === 'bacon');
    show('vegTomato', S.built && S.veg === 'tomato');
    show('vegSpinach', S.built && S.veg === 'spinach');
    show('vegLettuce', S.built && S.veg === 'lettuce');
    const bread = BREAD[S.bread] || BREAD.white;
    ['breadBottom', 'breadTop'].forEach(id => {
      const e = document.getElementById(id);
      if (e) e.setAttribute('fill', bread);
    });
    const spread = SPREAD[S.spread] || SPREAD.butter;
    const sp = document.getElementById('spreadLayer');
    if (sp) {
      sp.setAttribute('fill', spread);
      sp.setAttribute('opacity', S.spread === 'none' ? '0' : '1');
    }

    /* steam over the pan or the finished sandwich */
    const steamOn = S.cooking || S.built;
    for (let i = 0; i < steam.length; i++) {
      const s = steam[i];
      const f = ((now * 0.3 + i / steam.length) % 1);
      const baseX = S.built ? 246 : 116;
      s.setAttribute('cx', (baseX + Math.sin(now * 1.2 + i * 1.7) * 16).toFixed(1));
      s.setAttribute('cy', (300 - f * 70).toFixed(1));
      s.setAttribute('opacity', steamOn ? (Math.sin(f * Math.PI) * 0.35).toFixed(2) : '0');
    }

    /* labels */
    const labelVis = {
      pan: S.phase === 'cook' || S.phase === 'ready',
      egg: S.phase === 'cook',
      bread: S.built,
      spread: S.built,
      filling: S.built,
      veg: S.built,
      plate: S.built
    };
    document.querySelectorAll('#labels .lab').forEach(l => {
      l.classList.toggle('hide', !labelVis[l.dataset.lab]);
    });

    /* chrome */
    const lead = t('lead');
    if (lastLead !== lead) { lastLead = lead; if (els.lead) els.lead.textContent = lead; }
    const status = S.phase === 'build' ? t('statusBuild')
      : S.phase === 'cook' ? t('statusCook')
      : S.phase === 'ready' ? t('statusReady')
      : t('statusDone');
    if (lastStatus !== status) {
      lastStatus = status;
      if (els.status) {
        els.status.textContent = status;
        els.status.classList.toggle('busy', S.phase === 'cook');
      }
    }

    const noteKey = S.phase === 'build' ? 'tBuild'
      : S.phase === 'cook' ? 'tCook'
      : S.phase === 'ready' ? 'tReady'
      : S.reason;
    const note = t(noteKey);
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
