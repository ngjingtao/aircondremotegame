/* ═══════════════════════════════════════════
   audio.js — tiny WebAudio blips (no assets)
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.audio = (function () {

  let ctx = null;
  let enabled = ARG.store.get('arg.sound') !== 'off';

  function ensure() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function tone(freq, dur, type, vol, when) {
    if (!enabled) return;
    const c = ensure();
    if (!c) return;
    const t0 = c.currentTime + (when || 0);
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type || 'square';
    osc.frequency.setValueAtTime(freq, t0);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(vol || 0.06, t0 + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }

  function noise(dur, vol, freq) {
    if (!enabled) return;
    const c = ensure();
    if (!c) return;
    const len = Math.floor(c.sampleRate * dur);
    const buf = c.createBuffer(1, len, c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = c.createBufferSource();
    src.buffer = buf;
    const filt = c.createBiquadFilter();
    filt.type = 'bandpass';
    filt.frequency.value = freq || 900;
    const gain = c.createGain();
    gain.gain.value = vol || 0.05;
    src.connect(filt); filt.connect(gain); gain.connect(c.destination);
    src.start();
  }

  return {
    get enabled() { return enabled; },
    toggle() {
      enabled = !enabled;
      ARG.store.set('arg.sound', enabled ? 'on' : 'off');
      if (enabled) { ensure(); tone(880, 0.08, 'square', 0.05); }
      return enabled;
    },
    /** remote button blip — the AC acknowledging the command */
    beep() { tone(2100, 0.07, 'square', 0.045); tone(1500, 0.06, 'square', 0.03, 0.05); },
    /** button that does nothing / locked */
    deny() { tone(220, 0.16, 'sawtooth', 0.05); },
    powerOn() { tone(660, 0.1, 'triangle', 0.06); tone(990, 0.14, 'triangle', 0.06, 0.09); },
    powerOff() { tone(880, 0.1, 'triangle', 0.06); tone(440, 0.16, 'triangle', 0.05, 0.09); },
    clean() { noise(1.4, 0.05, 1400); },
    toast() { tone(520, 0.12, 'triangle', 0.06); tone(780, 0.12, 'triangle', 0.06, 0.1); },
    chime() { tone(784, 0.12, 'sine', 0.05); tone(1046, 0.16, 'sine', 0.05, 0.1); },
    unlock() { if (ctx) { ensure(); } }
  };
})();
