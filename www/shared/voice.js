/* ═══════════════════════════════════════════════════════════
   shared/voice.js — spoken narration

   Two engines, one voice button:

   1. ANDROID — window.AndroidTts, added by MainActivity/SystemTts.
      This is android.speech.tts.TextToSpeech, i.e. the phone's own TTS
      engine. It is used whenever it exists, because the WebView's
      speechSynthesis is unreliable on Android (often no voices, and
      sometimes it never starts). The native engine also reports word
      ranges, so the word-by-word highlight still works.

   2. EVERYWHERE ELSE — the browser's Web Speech API, exactly as before.
      Nothing to download, works offline, follows the interface language.

   iOS notes for the fallback:
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
  let nativeId = null;
  let gen = 0;
  let nativeGen = 0;
  let unlocked = false;
  const watchers = [];

  /* a marker, so "is it speaking?" is true even before the TTS engine
     finishes starting */
  const NATIVE = { native: true };

  function native() {
    try { return window.AndroidTts || null; } catch (e) { return null; }
  }

  function hasSpeech() { return !!native() || !!synth; }

  function langTag() { return lang === 'zh' ? 'zh-CN' : 'en-US'; }

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

  /* pure lookup — never refreshes or notifies, so state() cannot recurse */
  function findVoice() {
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

  function pickVoice() {
    if (!voices.length) refreshVoices();
    return findVoice();
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
      const now = speakingEl.innerHTML;
      /* Only put the original markup back if the card still holds this
         narration. The lesson engine may already have painted the next step;
         restoring the old sentence then would overwrite it. */
      if (now === wordMarks.html || now.indexOf('<mark class="tts-word">') >= 0) {
        speakingEl.innerHTML = wordMarks.html;
      }
    }
    speakingEl = null;
    wordMarks = null;
  }

  function escapeHTML(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /* Chrome/Edge give us word boundaries; Android's native engine gives us
     onRangeStart; iOS gives nothing, so there the card is only outlined. */
  function showProgress(charIndex, charLength) {
    if (!speakingEl || !wordMarks || !wordMarks.plain) return;
    const plain = wordMarks.plain;
    const total = plain.length;
    if (charIndex >= total) return;
    const end = charLength ? charIndex + charLength : charIndex + 1;
    speakingEl.innerHTML =
      escapeHTML(plain.slice(0, charIndex)) +
      '<mark class="tts-word">' + escapeHTML(plain.slice(charIndex, end)) + '</mark>' +
      escapeHTML(plain.slice(end));
  }

  function beginHighlight(el, text) {
    clearHighlight();
    if (el && enabled) {
      speakingEl = el;
      wordMarks = { plain: clean(text), html: el.innerHTML };
      el.classList.add('tts-reading');
    }
  }

  function endHighlight() {
    if (speakingEl) speakingEl.classList.remove('tts-reading');
    clearHighlight();
  }

  /* Begin a new narration. The generation makes every callback from the
     previous sentence a no-op, so a late onend cannot clear the new card. */
  function startSpeech() {
    gen++;
    halt();
  }

  /* stop whatever is speaking, whichever engine owns it */
  function halt() {
    if (synth) { try { synth.cancel(); } catch (e) {} }
    const n = native();
    if (n) { try { n.stop(); } catch (e) {} }
    nativeId = null;
    current = null;
  }

  /* ─────────── the Android system engine ─────────── */

  function speakNative(body, rate, myGen) {
    const n = native();
    if (!n) return false;
    try {
      const id = n.speak(body, langTag(), rate);
      if (!id) return false;             // no engine, or it refused
      nativeId = String(id);
      nativeGen = myGen;
      current = NATIVE;
      notify();
      return true;
    } catch (e) {
      return false;
    }
  }

  function nativeMatches(id) {
    if (!nativeId || !id) return true;
    return String(id) === nativeId;
  }

  function _nativeStart(id) {
    if (nativeGen !== gen || !nativeMatches(id)) return;
    current = NATIVE;
    if (speakingEl) speakingEl.classList.add('tts-reading');
    notify();
  }

  function _nativeRange(id, start, end) {
    if (nativeGen !== gen || !nativeMatches(id)) return;
    showProgress(start, end - start);
  }

  function _nativeDone(id) {
    if (nativeGen !== gen || !nativeMatches(id)) return;
    nativeId = null;
    current = null;
    if (speakingEl) speakingEl.classList.remove('tts-reading');
    clearHighlight();
    notify();
  }

  function _nativeError(id) {
    _nativeDone(id);
  }

  /* ─────────── the Web Speech fallback ─────────── */

  function speakWeb(body, rate, myGen) {
    if (!synth || typeof SpeechSynthesisUtterance === 'undefined') return false;
    const u = new SpeechSynthesisUtterance(body);
    const v = pickVoice();
    if (v) u.voice = v;
    u.lang = langTag();
    u.rate = rate;
    u.pitch = 1;
    u.volume = 1;
    u.onstart = () => {
      if (myGen !== gen) return;
      current = u;
      if (speakingEl) speakingEl.classList.add('tts-reading');
      notify();
    };
    u.onboundary = (ev) => {
      if (myGen !== gen) return;
      showProgress(ev.charIndex, ev.charLength);
    };
    u.onend = () => {
      if (myGen !== gen) return;
      if (current === u) current = null;
      if (speakingEl) speakingEl.classList.remove('tts-reading');
      clearHighlight();
      notify();
    };
    u.onerror = () => {
      if (myGen !== gen) return;
      if (current === u) current = null;
      if (speakingEl) speakingEl.classList.remove('tts-reading');
      clearHighlight();
      notify();
    };
    try { synth.speak(u); } catch (e) { return false; }
    return true;
  }

  /* ─────────── public speaking ─────────── */

  function speakIn(el, text, opts) {
    startSpeech();
    beginHighlight(el, text);
    const ok = runSpeech(text, opts);
    if (!ok) endHighlight();
    return ok;
  }

  function speak(text, opts) {
    startSpeech();
    return runSpeech(text, opts);
  }

  function runSpeech(text, opts) {
    if (!enabled) return false;
    const body = clean(text);
    if (!body) return false;
    const o = opts || {};
    const rate = o.rate || 0.92;

    if (speakNative(body, rate, gen)) return true;
    nativeGen = -1;                      // ignore any late native callback
    return speakWeb(body, rate, gen);
  }

  function stop() {
    gen++;
    halt();
    endHighlight();
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
      supported: hasSpeech(),
      native: !!native(),
      speaking: !!current,
      lang,
      voiceName: native() ? 'Android system TTS' : ((findVoice() || {}).name || '')
    };
  }

  /* wires up the 🗣️ button in the top bar */
  function attach(btnId) {
    syncLang();
    const b = document.getElementById(btnId || 'btn-voice');
    if (!b) return;
    const paint = () => {
      const ok = hasSpeech();
      b.hidden = !ok;
      if (!ok) return;
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

    /* on Android the native bridge can land just after the page boots; check
       again so the button does not stay hidden if the WebView has no voices */
    if (!hasSpeech() && typeof navigator !== 'undefined' &&
        /Android/i.test(navigator.userAgent || '')) {
      setTimeout(paint, 500);
      setTimeout(paint, 1500);
      setTimeout(paint, 3000);
    }
  }

  /* keep the button honest if the page is hidden mid-sentence */
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });

  /* a native utterance outlives the page if nobody stops it on navigation */
  if (typeof window.addEventListener === 'function') {
    window.addEventListener('pagehide', stop);
  }

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
    startSpeech();
    clearHighlight();
    if (el && enabled) {
      speakingEl = el;
      wordMarks = { plain: '', html: el.innerHTML };
      el.classList.add('tts-reading');
    }
    const ok = runSpeech(text, opts);
    if (!ok) endHighlight();
    return ok;
  }

  /* keep the speech language in step with the interface */
  function syncLang() {
    setLang(ARG.i18n && ARG.i18n.lang ? ARG.i18n.lang : 'zh');
  }

  return {
    speak, say: speak, speakIn, speakLinked, stop, toggle, setLang, watch, attach, speakOnTap, syncLang,
    _nativeStart, _nativeRange, _nativeDone, _nativeError,
    get enabled() { return enabled; },
    get supported() { return hasSpeech(); },
    get speaking() { return !!current; }
  };
})();
