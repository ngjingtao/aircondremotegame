/* ═══════════════════════════════════════════════════════════
   test/voice.test.js — the narration router

   voice.js has two engines: the Android system TTS (window.AndroidTts,
   added by MainActivity) and the browser's Web Speech API. Android's
   WebView is the reason the native one exists, so this checks:

   • native is preferred when it is present
   • the cleaned sentence, language and rate reach the native engine
   • a refused native call falls back to Web Speech
   • a browser with no native bridge still uses Web Speech
   • word ranges from Android still highlight the card
   • the voice button stays hidden only when neither engine exists
   • state() does not recurse when the WebView reports no voices
     (that recursion used to spin on Android)
   ═══════════════════════════════════════════════════════════ */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const WWW = path.join(__dirname, '..', 'www');

let passed = 0, failed = 0;
const failures = [];

function ok(label, cond, extra) {
  if (cond) { passed++; console.log('  ok   ' + label.padEnd(56)); }
  else {
    failed++;
    failures.push(label + (extra ? ': ' + extra : ''));
    console.log('  FAIL ' + label.padEnd(56) + (extra || ''));
  }
}
function eq(label, actual, want) {
  ok(label, actual === want, 'got ' + JSON.stringify(actual) + ', want ' + JSON.stringify(want));
}

function makeButton() {
  const classes = new Set();
  return {
    hidden: false,
    textContent: '',
    title: '',
    classList: {
      add: c => classes.add(c),
      remove: c => classes.delete(c),
      toggle: (c, on) => { if (on === undefined) { classes.has(c) ? classes.delete(c) : classes.add(c); } else if (on) classes.add(c); else classes.delete(c); },
      contains: c => classes.has(c)
    },
    addEventListener() {}
  };
}

function makeCard(html) {
  const classes = new Set();
  return {
    innerHTML: html,
    textContent: html,
    classList: {
      add: c => classes.add(c),
      remove: c => classes.delete(c),
      toggle: (c, on) => { if (on) classes.add(c); else classes.delete(c); },
      contains: c => classes.has(c)
    }
  };
}

function load(opts) {
  opts = opts || {};
  const calls = { synth: [], native: [], utterances: [], nativeStop: 0, fetched: [], audios: [] };
  const store = {};
  let seq = 0;

  const synth = opts.noSynth ? null : {
    getVoices: () => opts.voices || [],
    speak(u) { calls.synth.push(u.text); calls.utterances.push(u); if (u.onstart) u.onstart(); },
    cancel() {},
    addEventListener() {},
    removeEventListener() {}
  };

  const native = opts.noNative ? null : {
    isReady: () => true,
    speak(text, lang, rate) {
      calls.native.push({ text, lang, rate });
      if (opts.nativeFails) return '';
      return 'u' + (++seq);
    },
    stop() { calls.nativeStop++; }
  };

  const els = {};
  const getEl = id => {
    if (!els[id]) els[id] = makeButton();
    return els[id];
  };

  class AudioStub {
    constructor() { this.src = ''; this.played = false; this.paused = false; calls.audios.push(this); }
    play() { this.played = true; return Promise.resolve(); }
    pause() { this.paused = true; }
  }

  const document = {
    addEventListener() {},
    removeEventListener() {},
    getElementById: id => (opts.buttons ? getEl(id) : null),
    querySelectorAll: () => [],
    documentElement: { lang: 'zh-CN', classList: { add() {}, remove() {}, toggle() {} } },
    hidden: false
  };

  const sandbox = {
    console, Math, Date, JSON, Number, String, Array, Object, Boolean, RegExp,
    setTimeout: () => 0,
    clearTimeout() {},
    document,
    navigator: {
      language: 'zh-CN',
      userAgent: opts.ua || (opts.android ? 'Mozilla/5.0 (Linux; Android 14; Pixel 8)' : 'node-test')
    },
    localStorage: {
      getItem: k => (k in store ? store[k] : null),
      setItem: (k, v) => { store[k] = String(v); },
      removeItem: k => { delete store[k]; }
    },
    speechSynthesis: synth,
    SpeechSynthesisUtterance: function (text) { this.text = text; },
    AndroidTts: native,
    innerWidth: 1200,
    innerHeight: 700
  };

  if (opts.cloud) {
    sandbox.fetch = function (url) {
      calls.fetched.push(String(url));
      if (opts.fetchFails) {
        return Promise.resolve({ ok: false, status: 502, json: function () { return Promise.resolve({}); } });
      }
      return Promise.resolve({
        ok: true,
        status: 200,
        json: function () {
          return Promise.resolve({
            audio: 'SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA',
            words: [{ text: '你好', start: 0.1, end: 0.5, startChar: 0, endChar: 2 }]
          });
        }
      });
    };
    sandbox.Audio = AudioStub;
    sandbox.Blob = class { constructor(parts, options) { this.parts = parts; this.type = options && options.type; } };
    sandbox.URL = { createObjectURL: function () { return 'blob:tts'; }, revokeObjectURL: function () {} };
    sandbox.atob = global.atob;
    sandbox.AbortController = global.AbortController;
  }
  sandbox.window = sandbox;
  sandbox.self = sandbox;
  vm.createContext(sandbox);

  vm.runInContext(fs.readFileSync(path.join(WWW, 'shared', 'store.js'), 'utf8'), sandbox, { filename: 'shared/store.js' });
  vm.runInContext(fs.readFileSync(path.join(WWW, 'shared', 'voice.js'), 'utf8'), sandbox, { filename: 'shared/voice.js' });

  sandbox.ARG.i18n = { lang: 'zh', t: k => k };
  sandbox.ARG.config = opts.config || { tts: { enabled: false } };
  sandbox.ARG.voice.syncLang();

  return { ARG: sandbox.ARG, calls, els, document };
}

console.log('\n— Voice: Android system TTS first —');
{
  const p = load();
  const v = p.ARG.voice;

  ok('the native engine is reported as supported', v.supported);
  eq('speaking the sentence succeeds', v.speak('你好 <b>世界</b>'), true);
  eq('the native engine got the cleaned sentence', p.calls.native[0].text, '你好 世界');
  eq('  → in the interface language', p.calls.native[0].lang, 'zh-CN');
  eq('  → at the reading rate', p.calls.native[0].rate, 0.95);
  eq('  → and Web Speech was left alone', p.calls.synth.length, 0);
  eq('it reports that it is speaking', v.speaking, true);
  let st = null;
  v.watch(s => { st = s; });
  eq('the state names the native engine', st && st.voiceName, 'Android system TTS');
  eq('  → and marks it supported', st && st.supported, true);

  v.setLang('en');
  v.speak('Hello');
  eq('switching to English changes the TTS language', p.calls.native[1].lang, 'en-US');

  v.stop();
  ok('stop reaches the native engine', p.calls.nativeStop > 0);
  eq('  → and clears the speaking flag', v.speaking, false);
}

console.log('\n— Voice: word highlighting from Android ranges —');
{
  const p = load();
  const v = p.ARG.voice;
  const card = makeCard('你好世界');

  eq('speakIn starts speaking', v.speakIn(card, '你好世界'), true);
  v._nativeRange('u1', 0, 2);
  ok('the spoken word is marked', card.innerHTML.indexOf('<mark class="tts-word">你好</mark>') >= 0, card.innerHTML);

  v._nativeDone('u999');
  ok('a stale utterance cannot clear the live one', v.speaking === true);

  v._nativeDone('u1');
  ok('finishing restores the original text', card.innerHTML === '你好世界', card.innerHTML);
  eq('  → and clears the speaking flag', v.speaking, false);
}

console.log('\n— Voice: fallbacks —');
{
  const p = load({ nativeFails: true });
  const v = p.ARG.voice;
  eq('a refused native call falls back to Web Speech', v.speak('你好'), true);
  eq('  → the native engine was tried', p.calls.native.length, 1);
  eq('  → and Web Speech spoke', p.calls.synth.length, 1);
}
{
  const p = load({ noNative: true });
  const v = p.ARG.voice;
  eq('without the bridge, Web Speech works', v.speak('Hello <b>there</b>'), true);
  eq('  → with the sentence cleaned', p.calls.synth[0], 'Hello there');
  eq('  → and the native path was not used', p.calls.native.length, 0);
}
{
  const p = load({ noNative: true });
  const v = p.ARG.voice;
  const card = makeCard('你好世界');
  v.speakIn(card, '你好世界');
  p.calls.utterances[0].onboundary({ charIndex: 0, charLength: 2 });
  ok('Web Speech boundaries also mark the word', card.innerHTML.indexOf('<mark class="tts-word">你好</mark>') >= 0);
  p.calls.utterances[0].onend();
  ok('  → and the card is restored on end', card.innerHTML === '你好世界');
}

console.log('\n— Voice: the button and the empty-voice recursion —');
{
  const p = load({ noSynth: true, buttons: true });
  const v = p.ARG.voice;
  v.attach('btn-voice');
  eq('with native TTS and no Web Speech the button stays', p.els['btn-voice'].hidden, false);
}
{
  const p = load({ noSynth: true, noNative: true, buttons: true });
  const v = p.ARG.voice;
  v.attach('btn-voice');
  eq('with neither engine the button hides', p.els['btn-voice'].hidden, true);
  eq('  → and speaking is refused', v.speak('你好'), false);
}
{
  /* Android WebView often reports no voices. state() must not call
     refreshVoices() → notify() → state() forever. */
  const p = load({ voices: [], buttons: true });
  const v = p.ARG.voice;
  let states = 0;
  v.watch(() => { states++; });
  v.attach('btn-voice');
  ok('state() survives a device with no voices', states >= 1, 'watcher calls: ' + states);
  eq('  → and the button is shown because the native engine exists', p.els['btn-voice'].hidden, false);
}

console.log('\n— Voice: a new sentence owns the card —');
{
  const p = load();
  const v = p.ARG.voice;
  const card = makeCard('第一句');
  v.speakIn(card, '第一句');
  card.innerHTML = '第二句';          // the lesson has painted the next step
  v.stop();
  eq('stopping does not restore the previous step', card.innerHTML, '第二句');
}
{
  const p = load({ noNative: true });
  const v = p.ARG.voice;
  const first = makeCard('第一句');
  const second = makeCard('第二句');
  v.speakIn(first, '第一句');
  const old = p.calls.utterances[0];
  v.speakIn(second, '第二句');
  old.onend();
  eq('a stale end leaves the new sentence alone', second.innerHTML, '第二句');
}

(async () => {
  const flush = () => new Promise(resolve => setImmediate(resolve));

  console.log('\n— Voice: the neural cloud voice —');
  {
    const p = load({
      cloud: true,
      config: { tts: { enabled: true, mode: 'auto', base: '' } }
    });
    const v = p.ARG.voice;
    eq('the cloud voice reports as supported', v.supported, true);
    eq('speaking succeeds', v.speak('你好世界'), true);
    await flush();
    eq('it asked /tts once', p.calls.fetched.length, 1);
    ok('  → with the sentence and language',
       /\/tts\?lang=zh/.test(p.calls.fetched[0]) && /text=%E4%BD%A0%E5%A5%BD%E4%B8%96%E7%95%8C/.test(p.calls.fetched[0]),
       p.calls.fetched[0]);
    eq('  → and an audio element is playing', p.calls.audios.length, 1);
    eq('  → with playback started', p.calls.audios[0].played, true);
    v.stop();
    eq('stopping pauses the audio', p.calls.audios[0].paused, true);
  }
  {
    const p = load({
      cloud: true,
      noNative: true,
      ua: 'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X)',
      config: { tts: { enabled: true, mode: 'auto', base: '' } }
    });
    const v = p.ARG.voice;
    v.speak('你好');
    await flush();
    eq('an iPad keeps its device voice', p.calls.fetched.length, 0);
    eq('  → and Web Speech speaks', p.calls.synth.length, 1);
  }
  {
    const p = load({
      cloud: true,
      noNative: true,
      fetchFails: true,
      config: { tts: { enabled: true, mode: 'auto', base: '' } }
    });
    const v = p.ARG.voice;
    v.speak('你好');
    await flush(); await flush(); await flush();
    eq('a failed neural request falls back', p.calls.synth.length, 1);
  }
  {
    const p = load({
      cloud: true,
      config: { tts: { enabled: true, mode: 'system', base: '' } }
    });
    const v = p.ARG.voice;
    v.speak('你好');
    await flush();
    eq('system mode never calls the network', p.calls.fetched.length, 0);
  }

  console.log('\n' + '─'.repeat(72));
  console.log(passed + ' passed, ' + failed + ' failed');
  if (failed) {
    console.log('\nFailures:');
    failures.forEach(f => console.log('  • ' + f));
    process.exit(1);
  }
})();
