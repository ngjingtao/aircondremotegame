/* kitlab/js/scene.js — the bench, parts and effect */
window.ARG = window.ARG || {};

ARG.scene = (function () {
  let els = {};

  function $(id) { return document.getElementById(id); }
  function setText(el, v) { if (el && el.textContent !== v) el.textContent = v; }

  function build() {
    els.parts = $('bench-parts');
    els.effect = $('bench-effect');
    els.read = $('bench-read');
    els.wire = $('bench-wire');
    els.status = $('scene-status');
    els.title = $('bench-title');
    els.scene = $('scene');
  }

  function render() {
    const S = ARG.sim.s;
    const t = ARG.i18n.t;
    const ex = ARG.sim.ex();

    if (els.title) setText(els.title, t(ex.key));
    if (els.parts) {
      const html = S.built.map(id => {
        const c = ARG.sim.BY_ID[id];
        return c ? '<span class="bench-chip"><span>' + c.ico + '</span><b data-i18n="' + c.key + '"></b></span>' : '';
      }).join('');
      if (els.parts.dataset.sig !== html) {
        els.parts.dataset.sig = html;
        els.parts.innerHTML = html;
        ARG.i18n.apply(els.parts);
      }
    }
    if (els.effect) {
      els.effect.textContent = S.run ? ex.ico : '🧰';
      els.effect.className = 'bench-effect' + (S.run ? ' running effect-' + ex.id : '');
    }
    if (els.read) setText(els.read, S.run ? ex.read : '—');
    if (els.wire) els.wire.classList.toggle('closed', S.run);

    const key = S.run ? 'statusRun' : (ARG.sim.ready() ? 'statusReady' : 'statusBuild');
    if (els.status) {
      setText(els.status, t(key));
      els.status.classList.toggle('busy', S.run);
    }
    if (els.scene) els.scene.dataset.state = S.run ? 'run' : 'build';
  }

  return { build, render };
})();
