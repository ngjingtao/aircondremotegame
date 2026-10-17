/* ═══════════════════════════════════════════
   toilet/js/scene.js — the flush cutaway

   The treatment plant moved out to the Indah Water activity.
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.scene = (function () {

  const T = () => ARG.i18n.t;
  const M = () => ARG.sim.s;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  /* `hidden` is an HTML property — it is NOT reflected on SVG elements, so
     `svgGroup.hidden = true` silently does nothing and an authored `hidden`
     attribute can never be turned back off. Toggle the attribute instead. */
  function show(el, on) {
    if (!el) return;
    if (on) el.removeAttribute('hidden');
    else el.setAttribute('hidden', '');
  }

  let els = {};
  let parts = [];          // flush particles
  const seen = {};

  function build() {
    els.scene = document.getElementById('scene');
    els.labelsFlush = document.getElementById('labels-flush');
    els.flushFlow = document.getElementById('flushFlow');
    els.cisternWater = document.getElementById('cisternWater');
    els.bowlWater = document.getElementById('bowlWater');
    els.bowlWave = document.getElementById('bowlWave');
    els.bowlWave2 = document.getElementById('bowlWave2');
    els.trapWater = document.getElementById('trapWater');
    els.flapper = document.getElementById('flapper');
    els.chain = document.getElementById('chain');
    els.flushButton = document.getElementById('flushButton');
    els.float = document.getElementById('float');
    els.paneNote = document.getElementById('pane-note');
    els.status = document.getElementById('scene-status');
    els.lead = document.getElementById('scene-lead');
    els.toast = document.getElementById('toast');
    els.hudStage = document.getElementById('hud-stage');
    els.hudVal = document.getElementById('hud-val');
    els.hudLabel2 = document.getElementById('hud-label2');

    buildParticles();
  }

  function buildParticles() {
    let html = '';
    for (let i = 0; i < 8; i++) html += '<circle class="fp" r="3"/>';
    els.flushFlow.innerHTML = html;
    parts = Array.prototype.slice.call(els.flushFlow.children);
  }

  /* the trapway centreline, so the flow particles can follow the pipe
     instead of guessing at it */
  const TRAP_PTS = [
    [170, 368], [172, 392], [178, 410], [190, 424],
    [202, 427], [208, 412], [208, 380], [208, 352],
    [214, 340], [226, 340], [232, 356], [232, 460]
  ];

  function trapAt(k) {
    const n = TRAP_PTS.length - 1;
    const f = clamp(k, 0, 1) * n;
    const i = Math.min(n - 1, Math.floor(f));
    const u = f - i;
    const a = TRAP_PTS[i], b = TRAP_PTS[i + 1];
    return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u];
  }

  /* ─────────── render ─────────── */
  function render(dt) {
    const S = M();
    const t = T();
    const d = dt || 0.016;

    els.scene.dataset.step = String(S.step);
    renderFlush(S, t, d);

    /* ── note + step list highlight ── */
    const list = ARG.sim.FLUSH;
    const st = list[S.step] || list[0];

    if (seen.note !== st.key) {
      seen.note = st.key;
      els.paneNote.textContent = t(st.fact);
      els.paneNote.classList.add('show');
      document.querySelectorAll('.step').forEach((b, i) => {
        b.classList.toggle('on', i === S.step);
        b.classList.toggle('done', i < S.step);
      });
    }

    /* ── which part is highlighted ── */
    if (seen.lit !== st.lit) {
      seen.lit = st.lit;
      /* one step can point at several parts, so `lit` is a space-separated list */
      const want = String(st.lit || '').split(/\s+/).filter(Boolean);
      els.labelsFlush.querySelectorAll('.lab').forEach(l => l.classList.toggle('on', want.indexOf(l.dataset.lab) >= 0));
    }

    /* ── status ── */
    const status = S.flushing ? t('flushing') : t('ready');
    if (seen.status !== status) {
      seen.status = status;
      els.status.textContent = status;
      els.status.classList.toggle('busy', S.flushing);
    }
    const lead = t('tabFlush');
    if (seen.lead !== lead) { seen.lead = lead; els.lead.textContent = lead; }

    const stageTxt = (S.step + 1) + ' / ' + list.length;
    if (seen.stage !== stageTxt) { seen.stage = stageTxt; els.hudStage.textContent = stageTxt; }

    /* the second chip shows whether the water seal is there */
    const label2 = t('oSeal');
    const val2 = S.bowl > 0.66 ? t('yes') : '—';
    if (seen.val2 !== label2 + val2) {
      seen.val2 = label2 + val2;
      els.hudLabel2.textContent = label2;
      els.hudVal.textContent = val2;
      els.hudVal.style.color = '#7dd3fc';
    }
  }

  function renderFlush(S, t, d) {
    /* cistern water level (the tank interior is 100 units deep) */
    const cH = 100 * clamp(S.cistern, 0, 1);
    els.cisternWater.setAttribute('y', (180 - cH).toFixed(1));
    els.cisternWater.setAttribute('height', cH.toFixed(1));

    /* the float rides on the water; it is drawn at y=72 when the tank is full */
    const floatY = 172 - cH;
    els.float.setAttribute('transform', 'translate(0 ' + (floatY - 72).toFixed(1) + ')');

    /* pressing the button lifts the chain, and the chain lifts the far end of
       the flapper — which is hinged on the overflow tube at (196,180) */
    const lift = S.flushing && S.flushT < 3.2;
    const deg = lift ? 40 : 0;
    els.flapper.setAttribute('transform', 'rotate(' + deg + ' 196 180)');
    const rad = deg * Math.PI / 180;
    els.chain.setAttribute('d', 'M152,79 L' +
      (196 - 48 * Math.cos(rad)).toFixed(1) + ',' + (180 - 48 * Math.sin(rad)).toFixed(1));
    els.flushButton.setAttribute('transform', S.flushing && S.flushT < 0.35 ? 'translate(0 5)' : 'translate(0 0)');

    /* bowl water surface.
       At rest (bowl = 0.75) this lands on y = 332, which is exactly the crest
       of the weir — water can only stand as high as the weir, so the seal
       level and the weir are the same height. Raising the weir without moving
       this line would leave the seal sitting at the wrong level. */
    const bowlTop = 280 + (1 - clamp(S.bowl, 0, 1)) * 208;
    els.bowlWater.setAttribute('y', bowlTop.toFixed(1));
    els.bowlWater.setAttribute('height', Math.max(0, 376 - bowlTop).toFixed(1));
    if (els.bowlWave) {
      els.bowlWave.setAttribute('cy', (bowlTop + 3).toFixed(1));
      els.bowlWave.setAttribute('opacity', S.flushing ? '0.75' : '0.5');
      els.bowlWave2.setAttribute('cy', (bowlTop + 7).toFixed(1));
      els.bowlWave2.setAttribute('opacity', S.flushing ? '0.5' : '0.3');
    }

    /* trapway: full and fast while siphoning */
    els.trapWater.setAttribute('opacity', S.siphoning ? '1' : (S.flushing ? '0.95' : '0.85'));
    els.trapWater.setAttribute('stroke-width', S.siphoning ? '26' : '22');

    /* flow particles: cistern → under the rim → down the bowl → round the trap */
    const active = S.flushing && S.flushT >= 0;
    els.flushFlow.setAttribute('opacity', active ? '1' : '0');
    if (active) {
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        const f = ((S.flushT * 0.55) + i / parts.length) % 1;
        let x, y;
        if (f < 0.28) {                       /* falling out of the cistern */
          const k = f / 0.28;
          x = 170; y = 184 + k * 24;
        } else if (f < 0.52) {                /* out from under the rim */
          const k = (f - 0.28) / 0.24;
          x = 170 - k * 56; y = 210 + k * 40;
        } else if (f < 0.78) {                /* down the bowl to the outlet */
          const k = (f - 0.52) / 0.26;
          x = 114 + k * 56; y = 250 + k * 122;
        } else {                              /* round the U and over the weir */
          const q = trapAt((f - 0.78) / 0.22);
          x = q[0]; y = q[1];
        }
        p.setAttribute('cx', x.toFixed(1));
        p.setAttribute('cy', y.toFixed(1));
        p.setAttribute('opacity', (0.9 - Math.abs(0.5 - f) * 0.5).toFixed(2));
      }
    }
  }

  let toastTimer = null;
  function toast(msg, good) {
    if (!msg) return;
    els.toast.textContent = msg;
    els.toast.classList.toggle('good', good !== false);
    els.toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => els.toast.classList.remove('show'), 2600);
  }

  return { build, render, toast };
})();
