/* ═══════════════════════════════════════════
   Sun Bear — i18n
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.i18n = (function () {

  const DICT = {
    en: {
      title: 'Sun Bear',
      menu: 'Menu',
      hudStep: 'Step',
      lead: 'Sun bear',
      status: 'Into the rainforest',

      s1t: 'The smallest bear',
      s2t: 'The sun patch',
      s3t: 'A very long tongue',
      s4t: 'Honey and insects',
      s5t: 'A rainforest climber',
      s6t: 'Protecting the sun bear',

      s1f: 'The sun bear is the smallest bear in the world — about 1.2 to 1.5 metres long and 25 to 65 kilograms. It lives in the rainforests of Southeast Asia.',
      s2f: 'It has an orange-yellow patch on its chest shaped like the sun, which is why it is called the sun bear. Every bear\u2019s patch is different, like a fingerprint.',
      s3f: 'Its tongue is long and thin — up to 20 to 25 centimetres — so it can reach into tree holes and honeycombs to lick honey.',
      s4f: 'It loves honey, termites, ants, beetles and fruit, and sometimes small animals. Because it loves honey so much, it is also called the honey bear.',
      s5f: 'Its curved, powerful claws make it a strong climber. It often sleeps in trees, and uses its claws to tear open dead wood looking for insects.',
      s6f: 'Forests are being cut down and bears are still poached, so sun bears are becoming rarer. They are listed as Vulnerable. Protecting forests and never buying wildlife products helps them.',

      wBear: 'sun bear',
      wBearD: 'The smallest bear in the world, living in the rainforests of Southeast Asia.',
      wRain: 'rainforest',
      wRainD: 'A hot, wet forest where the trees grow tall and close together.',
      wPatch: 'chest patch',
      wPatchD: 'The orange-yellow marking on a sun bear\u2019s chest, shaped like a sun.',
      wPrint: 'fingerprint',
      wPrintD: 'The unique pattern on a fingertip. Every sun bear\u2019s chest patch is unique too.',
      wTongue: 'tongue',
      wTongueD: 'A sun bear\u2019s tongue can reach 20 to 25 centimetres out of its mouth.',
      wComb: 'honeycomb',
      wCombD: 'The wax home where bees store their honey.',
      wTermite: 'termite',
      wTermiteD: 'A small insect that sun bears love to eat.',
      wHoneybear: 'honey bear',
      wHoneybearD: 'Another name for the sun bear, because it loves honey.',
      wClimb: 'climb',
      wClimbD: 'To move up a tree using your claws and legs.',
      wClaw: 'claw',
      wClawD: 'A curved, strong nail. A sun bear uses its claws to climb and to dig into wood.',
      wVulnerable: 'vulnerable',
      wVulnerableD: 'A conservation status for animals whose numbers are falling and who need protection.',
      wProtect: 'protect',
      wProtectD: 'To keep forests and animals safe — never buy wildlife products.',

      lBear: 'sun bear',
      lPatch: 'chest patch',
      lTongue: 'tongue',
      lHoney: 'honey',
      lTermite: 'termite mound',
      lClaw: 'claws',
      lVU: 'vulnerable',

      note: 'Look at one step, read it, then tap NEXT. Tap any key word to hear what it means.',
      readAgain: 'Read again',
      back: 'BACK',
      next: 'NEXT',
      again: 'START AGAIN',
      result: 'You met the smallest bear in the world — and learned how to help it.',

      helpTitle: 'The sun bear',
      helpBody: `
        <h3>The smallest bear</h3>
        <ul>
          <li>About <b>1.2–1.5 m</b> long and <b>25–65 kg</b> — much smaller than other bears.</li>
          <li>Short black fur with a pale muzzle, and a <b>sun-shaped chest patch</b> that is different on every bear.</li>
          <li>Its <b>tongue</b> can reach 20–25 cm out of its mouth.</li>
        </ul>
        <h3>Life in the rainforest</h3>
        <ul>
          <li>It eats <b>honey, termites, ants, beetles and fruit</b>, and sometimes small animals.</li>
          <li>Strong curved <b>claws</b> make it an excellent climber; it often sleeps in trees.</li>
          <li>It lives in the tropical forests of Southeast Asia, including Malaysia.</li>
        </ul>
        <h3>How to help</h3>
        <ul>
          <li>Sun bears are <b>Vulnerable</b>: forests are cut down and bears are still poached.</li>
          <li>Never buy wildlife products or keep wild animals as pets.</li>
          <li>Support forest protection and sanctuaries such as the Bornean Sun Bear Conservation Centre.</li>
        </ul>
      `
    },

    zh: {
      title: '马来熊',
      menu: '菜单',
      hudStep: '步骤',
      lead: '马来熊',
      status: '走进雨林',

      s1t: '最小的熊',
      s2t: '太阳一样的胸斑',
      s3t: '长长的舌头',
      s4t: '蜂蜜和昆虫',
      s5t: '雨林里的攀爬高手',
      s6t: '保护马来熊',

      s1f: '马来熊是世界上最小的熊，身体大约 1.2–1.5 米长，25–65 公斤重。它住在东南亚的热带雨林里。',
      s2f: '它的胸前有一块橙黄色的斑纹，形状像太阳，所以大家叫它“太阳熊”。每只熊的斑纹都不一样，就像我们的指纹。',
      s3f: '马来熊的舌头又长又细，可以伸出 20–25 厘米，伸进树洞和蜂巢里舔蜂蜜。',
      s4f: '它爱吃蜂蜜、白蚁、蚂蚁、甲虫和水果，也会吃小动物。因为它特别爱吃蜂蜜，所以也叫“蜜熊”。',
      s5f: '马来熊的爪子弯弯的，很有力，爬树又快又稳。它常常在树上睡觉，也会用爪子挖开木头找虫子。',
      s6f: '森林被砍伐，还有人偷猎，马来熊的数量越来越少，被列为“易危”。保护森林、不买野生动物制品，就是在帮助它们。',

      wBear: '马来熊',
      wBearD: '世界上最小的熊，住在东南亚的热带雨林。',
      wRain: '雨林',
      wRainD: '又热又湿、树木很密的大森林。',
      wPatch: '胸斑',
      wPatchD: '马来熊胸前橙黄色的斑纹，形状像太阳。',
      wPrint: '指纹',
      wPrintD: '每人手指上独一无二的花纹。每只马来熊的胸斑也不一样。',
      wTongue: '舌头',
      wTongueD: '马来熊的舌头能伸出 20–25 厘米。',
      wComb: '蜂巢',
      wCombD: '蜜蜂储存蜂蜜的地方。',
      wTermite: '白蚁',
      wTermiteD: '一种小昆虫，是马来熊爱吃的食物。',
      wHoneybear: '蜜熊',
      wHoneybearD: '因为特别爱吃蜂蜜，马来熊也叫蜜熊。',
      wClimb: '攀爬',
      wClimbD: '用爪子和四肢爬上树。',
      wClaw: '爪子',
      wClawD: '马来熊弯弯的爪子，爬树和挖木头都很有力。',
      wVulnerable: '易危',
      wVulnerableD: '数量正在减少、需要保护的等级。',
      wProtect: '保护',
      wProtectD: '不乱砍森林、不买野生动物制品。',

      lBear: '马来熊',
      lPatch: '胸斑',
      lTongue: '舌头',
      lHoney: '蜂蜜',
      lTermite: '白蚁丘',
      lClaw: '爪子',
      lVU: '易危',

      note: '看一步，读一步。按“下一步”继续；点关键词，听听它是什么意思。',
      readAgain: '再读一次',
      back: '上一步',
      next: '下一步',
      again: '重新开始',
      result: '你认识了世界上最小的熊，也知道了怎样帮助它。',

      helpTitle: '马来熊',
      helpBody: `
        <h3>世界上最小的熊</h3>
        <ul>
          <li>大约 <b>1.2–1.5 米</b> 长、<b>25–65 公斤</b> 重，比其他熊小得多。</li>
          <li>黑色短毛，口鼻颜色浅，胸前有一块<b>像太阳的斑纹</b>，每只都不一样。</li>
          <li>它的<b>舌头</b>能伸出 20–25 厘米。</li>
        </ul>
        <h3>雨林里的生活</h3>
        <ul>
          <li>爱吃<b>蜂蜜、白蚁、蚂蚁、甲虫和水果</b>，有时也吃小动物。</li>
          <li>弯弯的<b>爪子</b>让它很会爬树，常常在树上睡觉。</li>
          <li>住在东南亚的热带雨林，包括马来西亚。</li>
        </ul>
        <h3>怎样帮助它</h3>
        <ul>
          <li>马来熊属于<b>易危</b>：森林被砍伐，还有人偷猎。</li>
          <li>不买野生动物制品，也不把野生动物当宠物养。</li>
          <li>支持保护森林和收容中心，比如沙巴的婆罗洲马来熊保育中心。</li>
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
