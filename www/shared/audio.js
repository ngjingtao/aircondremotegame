/* ═══════════════════════════════════════════
   shared/audio.js — tiny WebAudio blips (no audio assets)
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

  function noise(dur, vol, freq, q) {
    if (!enabled) return;
    const c = ensure();
    if (!c) return;
    const len = Math.max(1, Math.floor(c.sampleRate * dur));
    const buf = c.createBuffer(1, len, c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = c.createBufferSource();
    src.buffer = buf;
    const filt = c.createBiquadFilter();
    filt.type = 'bandpass';
    filt.frequency.value = freq || 900;
    filt.Q.value = q || 1;
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
    beep() { tone(2100, 0.07, 'square', 0.045); tone(1500, 0.06, 'square', 0.03, 0.05); },
    deny() { tone(220, 0.16, 'sawtooth', 0.05); },
    blip() { tone(1300, 0.06, 'sine', 0.05); },
    powerOn() { tone(660, 0.1, 'triangle', 0.06); tone(990, 0.14, 'triangle', 0.06, 0.09); },
    powerOff() { tone(880, 0.1, 'triangle', 0.06); tone(440, 0.16, 'triangle', 0.05, 0.09); },
    clean() { noise(1.4, 0.05, 1400); },
    toast() { tone(520, 0.12, 'triangle', 0.06); tone(780, 0.12, 'triangle', 0.06, 0.1); },
    chime() { tone(784, 0.12, 'sine', 0.05); tone(1046, 0.16, 'sine', 0.05, 0.1); },
    /* food-eating set */
    chomp() { noise(0.09, 0.09, 700, 2); tone(180, 0.07, 'sawtooth', 0.035); },
    gulp() { tone(320, 0.13, 'sine', 0.06); tone(180, 0.18, 'sine', 0.05, 0.09); },
    rumble() { tone(70, 0.6, 'sawtooth', 0.05); noise(0.6, 0.035, 160, 0.8); },
    squirt() { noise(0.35, 0.06, 2200, 0.6); },
    absorb() { tone(1100, 0.09, 'sine', 0.045); tone(1650, 0.09, 'sine', 0.04, 0.06); },
    plop() { tone(300, 0.16, 'sine', 0.07); tone(150, 0.22, 'sine', 0.05, 0.05); },
    flush() { noise(1.1, 0.055, 800, 0.5); },
    cheer() { [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.14, 'triangle', 0.055, i * 0.09)); },
    ouch() { tone(300, 0.14, 'sawtooth', 0.055); tone(200, 0.2, 'sawtooth', 0.05, 0.12); },

    /* ── train set ── */
    /** level-crossing bell: one clear "ding" */
    ding() {
      tone(1160, 0.34, 'sine', 0.060);
      tone(1740, 0.24, 'sine', 0.030, 0.004);
      tone(2330, 0.15, 'sine', 0.014, 0.008);
    },
    /** two-tone train horn */
    horn() {
      tone(155, 1.15, 'triangle', 0.030);
      [311, 370, 466].forEach((f, i) => tone(f, 1.10, 'sawtooth', 0.028, i * 0.018));
    },
    /** brake release / air hiss */
    air() { noise(0.85, 0.05, 1500, 0.7); },
    /** brake squeal */
    squeal() { noise(0.45, 0.04, 2900, 3); },
    /** door chime */
    doorChime() { tone(880, 0.16, 'sine', 0.05); tone(660, 0.22, 'sine', 0.045, 0.15); },
    /** combination lever / notch click */
    notch() { tone(640, 0.035, 'square', 0.03); noise(0.03, 0.02, 2400, 1); },
    /** button that is not allowed right now */
    warn() { tone(300, 0.14, 'square', 0.05); tone(240, 0.18, 'square', 0.045, 0.13); }
  };
})();
