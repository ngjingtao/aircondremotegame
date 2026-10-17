/* ═══════════════════════════════════════════════════════════
   shared/voice.js — spoken narration (Web Speech API)

   Reads the teaching text out loud. Uses the browser's own
   voices, so there is nothing to download and it works offline.

   iOS notes:
   • voices arrive asynchronously — we listen for voiceschanged
   • the first utterance must come from a user gesture
   ═══════════════════════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.voice = (function () {

  const synth = window.speechSynthesis || null;
  let enabled = ARG.store.get('arg.voice') !== 'off';     // on by default
  let lang = ARG.store.get('arg.lang') || 'zh';

  let voices = [];
  let current = null;
  let unlocked = false;
  const watchers = [];

  function refreshVoices() {
    try { voices = synth ? (synth.getVoices() || []) : []; }
    catch (e) { voices = []; }
    notify();
  }

  if (synth) {
    refreshVoices();
    if (typeof synth.addEventListener === 'function') {
      synth.addEventListener('voiceschanged', refreshVoices);
    } else {
      synth.onvoiceschanged = refreshVoices;
    }
  }

  /* the first real tap unlocks audio on iOS */
  function unlock() {
    unlocked = true;
    refreshVoices();
    document.removeEventListener('pointerdown', unlock);
    document.removeEventListener('touchend', unlock);
  }
  document.addEventListener('pointerdown', unlock);
  document.addEventListener('touchend', unlock);

  function pickVoice() {
    if (!voices.length) refreshVoices();
    if (!voices.length) return null;
    const want = lang === 'zh' ? 'zh' : 'en';
    let v = voices.find(x => (x.lang || '').toLowerCase().replace('_', '-').startsWith(want));
    if (!v && want === 'zh') {
      v = voices.find(x => /chinese|mandarin|中文|普通话|ting-?ting|mei-?jia|sin-?ji/i.test(x.name || ''));
    }
    if (!v && want === 'en') {
      v = voices.find(x => /english/i.test(x.name || ''));
    }
    return v || null;
  }

  function clean(text) {
    return String(text == null ? '' : text)
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /* the element whose text is being read, so we can highlight word by word */
  let speakingEl = null;
  let wordMarks = null;

  function clearHighlight() {
    if (speakingEl && wordMarks) {
      speakingEl.innerHTML = wordMarks.html;   // put the original markup back
    }
    speakingEl = null;
    wordMarks = null;
  }

  /* Chrome/Edge give us word boundaries; iOS gives nothing, so we fall back to
     simply marking the whole card as "being read". */
  function showProgress(u, charIndex, charLength, total) {
    if (!speakingEl || !wordMarks || !wordMarks.plain) return;
    if (charIndex >= total) return;
    const { plain } = wordMarks;
    const end = charLength ? charIndex + charLength : charIndex + 1;
    speakingEl.innerHTML =
      escapeHTML(plain.slice(0, charIndex)) +
      '<mark class="tts-word">' + escapeHTML(plain.slice(charIndex, end)) + '</mark>' +
      escapeHTML(plain.slice(end));
  }

  function escapeHTML(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /* speak, and highlight the words inside `el` while it reads */
  function speakIn(el, text, opts) {
    clearHighlight();
    if (el && enabled) {
      speakingEl = el;
      wordMarks = { plain: clean(text), html: el.innerHTML };
      el.classList.add('tts-reading');
    }
    const ok = speak(text, opts);
    if (!ok && speakingEl) { speakingEl.classList.remove('tts-reading'); clearHighlight(); }
    return ok;
  }

  function speak(text, opts) {
    if (!enabled || !synth) return false;
    const body = clean(text);
    if (!body) return false;
    options = opts || {};
    try { synth.cancel(); } catch (e) {}
    const u = new SpeechSynthesisUtterance(body);
    const v = pickVoice();
    if (v) u.voice = v;
    u.lang = lang === 'zh' ? 'zh-CN' : 'en-US';
    u.rate = (options.rate || 0.92);
    u.pitch = 1;
    u.volume = 1;
    u.onstart = () => {
      current = u;
      if (speakingEl) speakingEl.classList.add('tts-reading');
      notify();
    };
    u.onboundary = (ev) => {
      if (!speakingEl) return;
      const total = clean(u.text).length;
      showProgress(u, ev.charIndex, ev.charLength, total);
    };
    u.onend = () => {
      if (current === u) current = null;
      if (speakingEl) speakingEl.classList.remove('tts-reading');
      clearHighlight();
      notify();
    };
    u.onerror = () => {
      if (current === u) current = null;
      if (speakingEl) speakingEl.classList.remove('tts-reading');
      clearHighlight();
      notify();
    };
    try { synth.speak(u); } catch (e) { return false; }
    return true;
  }

  let options = {};

  function stop() {
    if (!synth) return;
    try { synth.cancel(); } catch (e) {}
    current = null;
    if (speakingEl) speakingEl.classList.remove('tts-reading');
    clearHighlight();
    notify();
  }

  function toggle() {
    enabled = !enabled;
    ARG.store.set('arg.voice', enabled ? 'on' : 'off');
    if (!enabled) stop();
    notify();
    return enabled;
  }

  function setLang(l) { lang = l === 'zh' ? 'zh' : 'en'; }

  function notify() { watchers.forEach(fn => { try { fn(state()); } catch (e) {} }); }
  function watch(fn) { watchers.push(fn); fn(state()); }
  function state() {
    return {
      enabled,
      supported: !!synth,
      speaking: !!current,
      lang,
      voiceName: (pickVoice() || {}).name || ''
    };
  }

  /* wires up the 🗣️ button in the top bar */
  function attach(btnId) {
    syncLang();
    const b = document.getElementById(btnId || 'btn-voice');
    if (!b) return;
    if (!synth) { b.hidden = true; return; }
    const paint = () => {
      b.textContent = enabled ? '🗣️' : '🔇';
      b.classList.toggle('on', enabled);
      b.title = enabled ? 'Voice on' : 'Voice off';
    };
    b.addEventListener('click', () => {
      const on = toggle();
      paint();
      if (on) speak(ARG.i18n && ARG.i18n.t ? ARG.i18n.t('title') : 'Voice on');
    });
    watch(paint);
    paint();
  }

  /* keep the button honest if the page is hidden mid-sentence */
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });

  /* tap any element to hear it read out */
  function speakOnTap(el, getText) {
    if (!el) return;
    el.style.cursor = 'pointer';
    el.addEventListener('pointerdown', ev => {
      ev.stopPropagation();
      if (current) { stop(); return; }
      const txt = typeof getText === 'function' ? getText() : (el.textContent || '');
      speakIn(el, txt);
    });
  }

  /* like speakIn, but for narration whose words are not the card's words —
     it just outlines the card so the reader can see what is being talked about */
  function speakLinked(el, text, opts) {
    clearHighlight();
    if (el && enabled) {
      speakingEl = el;
      wordMarks = { plain: '', html: el.innerHTML };
      el.classList.add('tts-reading');
    }
    const ok = speak(text, opts);
    if (!ok && speakingEl) { speakingEl.classList.remove('tts-reading'); clearHighlight(); }
    return ok;
  }

  /* keep the speech language in step with the interface */
  function syncLang() {
    setLang(ARG.i18n && ARG.i18n.lang ? ARG.i18n.lang : 'zh');
  }

  return {
    speak, say: speak, speakIn, speakLinked, stop, toggle, setLang, watch, attach, speakOnTap, syncLang,
    get enabled() { return enabled; },
    get supported() { return !!synth; },
    get speaking() { return !!current; }
  };
})();
