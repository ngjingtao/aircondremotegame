/* baggage/js/i18n.js */
window.ARG = window.ARG || {};

ARG.i18n = (function () {
  const DICT = {
    en: {
      title: 'Airport Baggage',
      menu: 'Menu',
      lead: 'Baggage handling',
      hudScore: 'Sorted', hudMistakes: 'Mishandled',
      bagTag: 'Bag tag', flight: 'Flight', destination: 'Destination',
      chute: 'Choose the make-up chute',
      start: 'START SHIFT', reset: 'NEW SHIFT',
      factIntro: 'A checked bag gets a tag with a barcode. The belt carries it through an X-ray scanner, the tag is read, and a diverter pushes it into the right make-up chute for its flight.',
      factSort: 'Read the destination on the tag, then choose the matching chute before the bag reaches the end of the belt.',
      factDone: 'Shift complete. Every bag that reaches the right chute is loaded; a wrong chute makes it mishandled and it has to be found and re-routed.',
      statusIdle: 'Ready at check-in',
      statusRun: 'Bag on the belt',
      statusDone: 'Shift complete',
      ok: 'Right chute — loaded!',
      wrong: 'Wrong chute — mishandled bag.',
      miss: 'Too slow — the bag passed the diverter.',
      resultTitle: 'Shift complete',
      resultText: 'You sorted {s} of {n} bags with {m} mishandled.',
      again: 'PLAY AGAIN',
      toastDone: 'Baggage badge earned!',
      helpTitle: 'How airport baggage works',
      helpSub: 'Check-in to the aircraft',
      helpBody: `
        <h3>The path</h3>
        <ul>
          <li><code>Check-in</code> — the bag is weighed and tagged with a barcode.</li>
          <li><code>Belt</code> — it travels to the security scanner.</li>
          <li><code>X-ray</code> — security checks the contents.</li>
          <li><code>Scan + sort</code> — the tag is read; a diverter pushes the bag to its make-up chute.</li>
          <li><code>Make-up</code> — bags for one flight are collected and loaded into the aircraft.</li>
          <li><code>Tracking</code> — every scan updates the bag's location; a missed bag is re-routed.</li>
        </ul>
        <p>In a real airport this is a BHS (baggage handling system): kilometres of belt, scanners, diverter switches and sortation computers. A mis-sorted bag can miss its flight.</p>`
    },
    zh: {
      title: '机场行李系统',
      menu: '菜单',
      lead: '行李处理',
      hudScore: '已分拣', hudMistakes: '错分',
      bagTag: '行李牌', flight: '航班', destination: '目的地',
      chute: '选择正确的行李滑槽',
      start: '开始值班', reset: '重新值班',
      factIntro: '托运的行李会贴上有条码的行李牌。传送带把它送到 X 光安检机，系统读取行李牌，再用分流器把它推进正确航班的分拣滑槽。',
      factSort: '看清行李牌上的目的地，在行李到达传送带末端之前选择对应的滑槽。',
      factDone: '值班结束。进入正确滑槽的行李会被装上飞机；进错滑槽的行李会被错运，需要找回来重新分拣。',
      statusIdle: '值机柜台准备就绪',
      statusRun: '行李在传送带上',
      statusDone: '值班结束',
      ok: '滑槽正确——装上了！',
      wrong: '滑槽错了——行李被错运。',
      miss: '太慢了——行李越过了分流器。',
      resultTitle: '值班结束',
      resultText: '你分拣了 {s} / {n} 件行李，错运 {m} 件。',
      again: '再玩一次',
      toastDone: '机场行李徽章到手！',
      helpTitle: '机场行李怎样运输',
      helpSub: '从值机到飞机',
      helpBody: `
        <h3>行李的路径</h3>
        <ul>
          <li><code>值机</code>——行李称重，贴上有条码的行李牌。</li>
          <li><code>传送带</code>——把行李送到安检机。</li>
          <li><code>X 光</code>——安检检查行李内容。</li>
          <li><code>扫描 + 分拣</code>——读取行李牌，分流器把行李推进对应航班的滑槽。</li>
          <li><code>分拣区</code>——同一航班的行李集中起来，装上飞机。</li>
          <li><code>追踪</code>——每次扫描都更新行李位置；漏掉的行李要重新送回。</li>
        </ul>
        <p>真实机场里这是一整套 BHS（行李处理系统）：几公里的传送带、安检机、分流器和分拣计算机。分错的行李可能会错过航班。</p>`
    }
  };

  let lang = ARG.store.get('arg.lang');
  if (!lang || !DICT[lang]) lang = 'zh';
  if (ARG.config && ARG.config.lockLang) lang = ARG.config.lockLang;

  const t = k => (DICT[lang] && DICT[lang][k] !== undefined) ? DICT[lang][k] : k;

  function apply() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const v = DICT[lang][el.dataset.i18n];
      if (v !== undefined) el.textContent = v;
    });
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    const ht = document.getElementById('help-title');
    if (ht) ht.textContent = t('helpTitle');
    const hs = document.getElementById('help-sub');
    if (hs) hs.textContent = t('helpSub');
    const hb = document.getElementById('help-body');
    if (hb) hb.innerHTML = DICT[lang].helpBody;
    const bl = document.getElementById('btn-lang');
    if (bl) {
      bl.textContent = lang === 'en' ? '中文' : 'EN';
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
