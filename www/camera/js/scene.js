/* camera/js/scene.js — the viewfinder, blur and the Sony body */
window.ARG = window.ARG || {};

ARG.scene = (function () {

  let els = {};

  function $(id) { return document.getElementById(id); }
  function show(el, on) { if (el) el.classList.toggle('off', !on); }
  function setText(el, v) { if (el && el.textContent !== v) el.textContent = v; }

  function build() {
    els.shot = $('shot');
    els.bg = $('bg');
    els.subject = $('subject');
    els.bgRunner = $('bg-runner');
    els.bgWater = $('bg-waterfall');
    els.bgPortrait = $('bg-portrait');
    els.subRunner = $('subject-runner');
    els.subWater = $('subject-waterfall');
    els.subPortrait = $('subject-portrait');
    els.noise = $('noise');
    els.flash = $('flash');
    els.result = $('shot-result');
    els.status = $('scene-status');
    els.preview = $('preview');
  }

  function resultText() {
    const r = ARG.sim.s.result;
    if (!r) return '';
    const t = ARG.i18n.t;
    const base = r.pass ? t('shotPass') :
      (r.exposure === 'under' ? t('shotUnder') :
        (r.exposure === 'over' ? t('shotOver') : t('shotSoft')));
    const tip = r.scene === 'runner' ? t('tipRunner') :
      (r.scene === 'waterfall' ? t('tipWaterfall') : t('tipPortrait'));
    return base + ' ' + tip;
  }

  function render() {
    const S = ARG.sim.s;
    const m = ARG.sim.metrics();
    const scene = ARG.sim.scene();
    const t = ARG.i18n.t;

    show(els.bgRunner, scene.id === 'runner');
    show(els.bgWater, scene.id === 'waterfall');
    show(els.bgPortrait, scene.id === 'portrait');
    show(els.subRunner, scene.id === 'runner');
    show(els.subWater, scene.id === 'waterfall');
    show(els.subPortrait, scene.id === 'portrait');

    if (els.shot) {
      const bright = Math.max(0.35, Math.min(2.2, 1 + m.stops * 0.22));
      els.shot.style.filter = 'brightness(' + bright.toFixed(2) + ')';
    }
    if (els.bg) {
      els.bg.style.filter = m.bg > 0.2 ? 'blur(' + Math.min(8, m.bg).toFixed(1) + 'px)' : '';
    }
    if (els.subject) {
      const blur = scene.id === 'portrait' ? 0 : Math.min(8, m.motion * 0.65);
      els.subject.style.filter = blur > 0.2 ? 'blur(' + blur.toFixed(1) + 'px)' : '';
    }
    if (els.noise) els.noise.style.opacity = String(Math.min(0.62, m.noise / 10));
    if (els.preview) els.preview.dataset.scene = scene.id;

    if (els.status) setText(els.status, ARG.sim.shutter().label + ' · ISO ' + m.isoV + ' · ' + ARG.sim.aperture().label);

    const r = S.result;
    if (els.result) {
      els.result.hidden = !r;
      if (r) {
        const stars = '★★★☆☆☆'.slice(3 - r.stars, 6 - r.stars);
        els.result.innerHTML = '<span class="sr-stars">' + stars + '</span>' +
          '<span class="sr-text">' + resultText() + '</span>';
      } else {
        els.result.innerHTML = '';
      }
    }
    void t;
  }

  function flash() {
    if (!els.flash) return;
    els.flash.classList.remove('on');
    void els.flash.offsetWidth;
    els.flash.classList.add('on');
    setTimeout(() => els.flash.classList.remove('on'), 420);
  }

  return { build, render, flash, resultText };
})();
