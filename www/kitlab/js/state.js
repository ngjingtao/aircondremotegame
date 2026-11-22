/* kitlab/js/state.js — the electromagnet kit as a guided lab */
window.ARG = window.ARG || {};

ARG.sim = (function () {

  const COMPONENTS = [
    { id: 'battery', key: 'cBattery', ico: '🔋' },
    { id: 'switch', key: 'cSwitch', ico: '🎚️' },
    { id: 'bulb', key: 'cBulb', ico: '💡' },
    { id: 'wires', key: 'cWires', ico: '🔌' },
    { id: 'resistor', key: 'cResistor', ico: '🟫' },
    { id: 'ammeter', key: 'cAmmeter', ico: '🅐' },
    { id: 'voltmeter', key: 'cVoltmeter', ico: '🅥' },
    { id: 'rheostat', key: 'cRheostat', ico: '🎛️' },
    { id: 'bell', key: 'cBell', ico: '🔔' },
    { id: 'motor', key: 'cMotor', ico: '⚙️' },
    { id: 'fan', key: 'cFan', ico: '🌀' },
    { id: 'coil', key: 'cCoil', ico: '🧵' },
    { id: 'nail', key: 'cNail', ico: '🔩' },
    { id: 'clips', key: 'cClips', ico: '📎' },
    { id: 'handgen', key: 'cHandgen', ico: '🔄' },
    { id: 'led', key: 'cLed', ico: '🔴' },
    { id: 'solar', key: 'cSolar', ico: '☀️' },
    { id: 'magnet', key: 'cMagnet', ico: '🧲' },
    { id: 'compass', key: 'cCompass', ico: '🧭' },
    { id: 'powder', key: 'cPowder', ico: '⚫' },
    { id: 'electroscope', key: 'cElectroscope', ico: '⚡' },
    { id: 'fur', key: 'cFur', ico: '🟫' },
    { id: 'rod', key: 'cRod', ico: '🥢' },
    { id: 'silk', key: 'cSilk', ico: '🧣' },
    { id: 'photo', key: 'cPhoto', ico: '🌗' },
    { id: 'screwdriver', key: 'cScrewdriver', ico: '🪛' },
    { id: 'car', key: 'cCar', ico: '🚗' },
    { id: 'ring', key: 'cRing', ico: '⭕' },
    { id: 'alligator', key: 'cAlligator', ico: '🦀' },
    { id: 'copper', key: 'cCopper', ico: '🟧' },
    { id: 'zinc', key: 'cZinc', ico: '⬜' },
    { id: 'tube', key: 'cTube', ico: '🥤' },
    { id: 'straw', key: 'cStraw', ico: '🥤' },
    { id: 'sandpaper', key: 'cSandpaper', ico: '🟫' },
    { id: 'ruler', key: 'cRuler', ico: '📏' },
    { id: 'guide', key: 'cGuide', ico: '📘' }
  ];
  const BY_ID = {};
  COMPONENTS.forEach(c => { BY_ID[c.id] = c; });

  const EXPERIMENTS = [
    { id: 'bulb', key: 'expBulb', how: 'howBulb', fact: 'factBulb', ico: '💡', parts: ['battery', 'switch', 'bulb', 'wires'], read: '2.5 V · 0.3 A' },
    { id: 'meter', key: 'expMeter', how: 'howMeter', fact: 'factMeter', ico: '🅐', parts: ['battery', 'switch', 'resistor', 'ammeter', 'wires'], read: '0.12 A' },
    { id: 'electromagnet', key: 'expMagnet', how: 'howMagnet', fact: 'factMagnet', ico: '🧲', parts: ['battery', 'switch', 'coil', 'nail', 'clips', 'wires'], read: '6 📎' },
    { id: 'motor', key: 'expMotor', how: 'howMotor', fact: 'factMotor', ico: '⚙️', parts: ['battery', 'switch', 'motor', 'fan', 'wires'], read: '1 800 rpm' },
    { id: 'generator', key: 'expGen', how: 'howGen', fact: 'factGen', ico: '🔄', parts: ['handgen', 'led', 'wires'], read: '2.1 V' },
    { id: 'solar', key: 'expSolar', how: 'howSolar', fact: 'factSolar', ico: '☀️', parts: ['solar', 'motor', 'fan', 'wires'], read: '3.0 V' },
    { id: 'magnet', key: 'expField', how: 'howField', fact: 'factField', ico: '🧭', parts: ['magnet', 'compass', 'powder'], read: 'N →' },
    { id: 'static', key: 'expStatic', how: 'howStatic', fact: 'factStatic', ico: '⚡', parts: ['fur', 'rod', 'electroscope'], read: '⚡' }
  ];

  function fresh() {
    return {
      exp: 0,
      built: [],
      run: false,
      runs: [],
      done: false
    };
  }

  let S = fresh();

  function ex() { return EXPERIMENTS[S.exp]; }
  function required() { return ex().parts; }
  function ready() { return required().every(id => S.built.indexOf(id) >= 0); }

  function factKey() {
    return S.run ? ex().fact : ex().how;
  }

  const ACTIONS = {
    exp(el) {
      const i = +(el && el.dataset ? el.dataset.i : -1);
      if (!(i >= 0 && i < EXPERIMENTS.length)) return { sound: 'deny' };
      if (i === S.exp) return { sound: 'blip' };
      S.exp = i;
      S.built = [];
      S.run = false;
      return { sound: 'notch' };
    },
    place(el) {
      const id = el && el.dataset ? el.dataset.part : null;
      if (!BY_ID[id]) return { sound: 'deny' };
      if (S.built.indexOf(id) >= 0) return { sound: 'blip' };
      if (required().indexOf(id) < 0) return { sound: 'deny', wrong: true };
      S.built.push(id);
      S.run = false;
      return { sound: 'beep' };
    },
    run() {
      if (!ready()) return { sound: 'deny' };
      S.run = true;
      if (S.runs.indexOf(ex().id) < 0) S.runs.push(ex().id);
      if (S.runs.length === EXPERIMENTS.length) S.done = true;
      return { sound: 'chime', say: true };
    },
    reset() {
      S.built = [];
      S.run = false;
      return { sound: 'blip' };
    }
  };

  function press(action, el) {
    const fn = ACTIONS[action];
    if (!fn) return null;
    return fn(el) || { sound: 'blip' };
  }

  return {
    get s() { return S; },
    press, fresh: () => { S = fresh(); return S; },
    ex, required, ready, factKey,
    COMPONENTS, EXPERIMENTS, BY_ID
  };
})();
