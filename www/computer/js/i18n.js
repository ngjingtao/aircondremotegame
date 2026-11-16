/* ═══════════════════════════════════════════
   Computer — i18n
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.i18n = (function () {

  const DICT = {
    en: {
      title: 'Computer',
      menu: 'Menu',
      hudStep: 'Step',
      lead: 'Computer',
      status: 'Following the data',

      s1t: 'Input',
      s2t: 'The processor',
      s3t: 'Memory',
      s4t: 'Storage',
      s5t: 'Output',
      s6t: 'Programs and binary',

      s1f: 'A keyboard, mouse, touchscreen or microphone sends information into the computer. That is input.',
      s2f: 'The processor — the CPU — is like the computer\u2019s brain. It follows the program, one instruction at a time, doing maths and making decisions.',
      s3f: 'RAM is the fast, temporary workbench. It holds what you are using right now, and it is cleared when the power goes off.',
      s4f: 'A hard drive or SSD keeps your photos, games and homework for later. It remembers them even when the computer is off.',
      s5f: 'The screen, speaker and printer give the result back to you. That is output.',
      s6f: 'A program is a list of instructions. The computer turns everything — words, pictures, sounds — into 0s and 1s to work on it.',

      wInput: 'input',
      wInputD: 'Information going into a computer, from a keyboard, mouse, touchscreen or microphone.',
      wCpu: 'processor (CPU)',
      wCpuD: 'The part that follows instructions and does the calculations.',
      wRam: 'memory (RAM)',
      wRamD: 'Fast temporary storage for the work you are doing right now.',
      wStorage: 'storage',
      wStorageD: 'A hard drive or SSD that keeps files when the power is off.',
      wOutput: 'output',
      wOutputD: 'The result a computer gives back, such as a picture on the screen or sound from a speaker.',
      wProgram: 'program',
      wProgramD: 'A list of instructions that tells the computer what to do.',
      wBinary: 'binary',
      wBinaryD: 'A way of writing everything with just two digits: 0 and 1.',

      lScreen: 'screen',
      lKeyboard: 'keyboard',
      lCpu: 'CPU',
      lRam: 'RAM',
      lSsd: 'SSD',
      lInput: 'input',
      lOutput: 'output',
      lBinary: '0 and 1',

      note: 'Look at one step, read it, then tap NEXT. Tap any key word to hear what it means.',
      readAgain: 'Read again',
      back: 'BACK',
      next: 'NEXT',
      again: 'START AGAIN',
      result: 'You followed data from the keyboard, through the CPU, and back out to the screen.',

      helpTitle: 'What is inside a computer',
      helpBody: `
        <h3>Four jobs</h3>
        <ul>
          <li><b>Input</b> — keyboard, mouse, touchscreen and microphone bring information in.</li>
          <li><b>Process</b> — the CPU follows the program and does the work.</li>
          <li><b>Store</b> — RAM is the fast temporary desk; the SSD or hard drive keeps files when the power is off.</li>
          <li><b>Output</b> — the screen, speaker and printer show the result.</li>
        </ul>
        <h3>Everything is 0 and 1</h3>
        <ul>
          <li>A program is a list of instructions.</li>
          <li>The computer turns words, pictures and sounds into <b>binary</b> — only 0s and 1s.</li>
        </ul>
        <h3>Remember</h3>
        <ul>
          <li>RAM forgets when the power goes off. Storage does not.</li>
        </ul>
      `
    },

    zh: {
      title: '电脑',
      menu: '菜单',
      hudStep: '步骤',
      lead: '电脑',
      status: '跟着数据走',

      s1t: '输入',
      s2t: '处理器',
      s3t: '内存',
      s4t: '存储',
      s5t: '输出',
      s6t: '程序和二进制',

      s1f: '键盘、鼠标、触摸屏或麦克风把信息送进电脑，这叫输入。',
      s2f: '处理器（CPU）像电脑的大脑。它按照程序，一条一条地做计算和判断。',
      s3f: '内存（RAM）是又快又临时的工作台，放着你现在正在用的东西；一关机，它就清空了。',
      s4f: '硬盘或固态硬盘（SSD）长期保存照片、游戏和作业，关机也不会丢。',
      s5f: '屏幕、扬声器和打印机把结果交还给你，这叫输出。',
      s6f: '程序是一串指令。电脑把文字、图片和声音都变成 0 和 1 来处理。',

      wInput: '输入',
      wInputD: '从键盘、鼠标、触摸屏或麦克风送进电脑的信息。',
      wCpu: '处理器（CPU）',
      wCpuD: '按照指令做计算和判断的零件。',
      wRam: '内存（RAM）',
      wRamD: '又快又临时的工作台，放着现在正在用的东西。',
      wStorage: '存储',
      wStorageD: '硬盘或固态硬盘，关机也能把文件保存下来。',
      wOutput: '输出',
      wOutputD: '电脑把结果交还给你，比如屏幕上的画面或扬声器的声音。',
      wProgram: '程序',
      wProgramD: '告诉电脑要做什么的一串指令。',
      wBinary: '二进制',
      wBinaryD: '只用 0 和 1 两个数字来表示所有信息的方法。',

      lScreen: '屏幕',
      lKeyboard: '键盘',
      lCpu: '处理器',
      lRam: '内存',
      lSsd: '硬盘',
      lInput: '输入',
      lOutput: '输出',
      lBinary: '0 和 1',

      note: '看一步，读一步。按“下一步”继续；点关键词，听听它是什么意思。',
      readAgain: '再读一次',
      back: '上一步',
      next: '下一步',
      again: '重新开始',
      result: '你跟着数据从键盘出发，经过处理器，再从屏幕出来。',

      helpTitle: '电脑里面有什么',
      helpBody: `
        <h3>四件事</h3>
        <ul>
          <li><b>输入</b> — 键盘、鼠标、触摸屏和麦克风把信息送进来。</li>
          <li><b>处理</b> — 处理器（CPU）按程序做事。</li>
          <li><b>存储</b> — 内存是临时工作台；硬盘或固态硬盘关机也能保存。</li>
          <li><b>输出</b> — 屏幕、扬声器和打印机把结果给你。</li>
        </ul>
        <h3>一切都是 0 和 1</h3>
        <ul>
          <li>程序是一串指令。</li>
          <li>电脑把文字、图片和声音变成<b>二进制</b>——只有 0 和 1。</li>
        </ul>
        <h3>记住</h3>
        <ul>
          <li>内存一关机就忘；存储不会忘。</li>
        </ul>
      `
    }
  };

  let lang = ARG.store.get('arg.lang');
  if (!lang || !DICT[lang]) lang = 'zh';
  if (ARG.config && ARG.config.lockLang) lang = ARG.config.lockLang;

  function t(key) {
    const v = DICT[lang][key];
    if (v !== undefined) return v;
    return DICT.en[key] !== undefined ? DICT.en[key] : key;
  }

  function apply(root) {
    (root || document).querySelectorAll('[data-i18n]').forEach(el => {
      const v = DICT[lang][el.dataset.i18n];
      if (v !== undefined) el.textContent = v;
    });
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    const lt = document.getElementById('help-title');
    if (lt) lt.textContent = t('helpTitle');
    const hb = document.getElementById('help-body');
    if (hb) hb.innerHTML = DICT[lang].helpBody;
    const bl = document.getElementById('btn-lang');
    if (bl) {
      bl.textContent = lang === 'en' ? 'EN' : '中文';
      if (ARG.config && ARG.config.lockLang) bl.hidden = true;
    }
  }

  function setLang(l) {
    if (ARG.config && ARG.config.lockLang) l = ARG.config.lockLang;
    if (!DICT[l]) l = 'en';
    lang = l;
    ARG.store.set('arg.lang', l);
    apply();
  }

  return {
    t, apply, setLang,
    toggle: () => setLang(lang === 'en' ? 'zh' : 'en'),
    get lang() { return lang; }
  };
})();
