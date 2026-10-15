/* ═══════════════════════════════════════════
   home.js — activity picker
   ═══════════════════════════════════════════ */
(function () {

  const $ = id => document.getElementById(id);

  const DICT = {
    en: {
      appName: 'Play & Learn',
      pickOne: 'What shall we play?',
      pickSub: 'Tap a picture to start',
      tileAirTitle: 'Play Aircond',
      tileAirSub: 'Drive the remote, make the boy happy, cold or hot',
      tileFoodTitle: 'Food Eating',
      tileFoodSub: 'Follow food from the mouth all the way out',
      foot: 'Made for curious kids',
      help: '?',
      helpTitle: 'Two activities',
      helpBody: `
        <h3>❄ Play Aircond</h3>
        <ul>
          <li>A Haier-style remote on the left, a boy and his air-con on the right.</li>
          <li>Every key changes the remote screen, the air-con <b>and</b> the boy's mood.</li>
          <li>Keep him in the comfort zone. Free Play to explore, Challenge for score + weather events.</li>
        </ul>
        <h3>🍎 Food Eating</h3>
        <ul>
          <li>Pick a food, chew it, swallow it and follow it all the way through the body.</li>
          <li>Six stages: mouth → oesophagus → stomach → small intestine → large intestine → out.</li>
          <li>Real science facts at every stop, plus a quiz at the end.</li>
          <li>Press <code>WATCH</code> to sit back and let the journey play by itself.</li>
        </ul>
        <h3>Buttons in the top bar</h3>
        <ul>
          <li><code>‹ Menu</code> — back to this screen (inside an activity).</li>
          <li><code>EN / 中文</code> — switch language.</li>
          <li><code>🔊 / 🔇</code> — sound on or off.</li>
        </ul>
      `
    },
    zh: {
      appName: '边玩边学',
      pickOne: '今天玩什么？',
      pickSub: '点一下图片就开始',
      tileAirTitle: '玩空调',
      tileAirSub: '操作遥控器，看看男孩是舒服、冷还是热',
      tileFoodTitle: '吃东西',
      tileFoodSub: '跟着食物从嘴巴一路走到外面',
      foot: '给充满好奇心的小朋友',
      help: '?',
      helpTitle: '两个小游戏',
      helpBody: `
        <h3>❄ 玩空调</h3>
        <ul>
          <li>左边是海尔风格的遥控器，右边是男孩和他的空调。</li>
          <li>每按一个键，遥控器屏幕、空调<b>和</b>男孩的表情都会一起变化。</li>
          <li>让他一直舒服。自由模式随便玩，挑战模式有分数和天气事件。</li>
        </ul>
        <h3>🍎 吃东西</h3>
        <ul>
          <li>选一样食物，咀嚼、吞下，然后跟着它走遍全身。</li>
          <li>六个阶段：口腔 → 食道 → 胃 → 小肠 → 大肠 → 排出。</li>
          <li>每一站都有真实的科学知识，最后还有小测验。</li>
          <li>按 <code>观看</code> 可以放手不管，让旅程自己播放。</li>
        </ul>
        <h3>顶栏按钮</h3>
        <ul>
          <li><code>‹ 菜单</code> — 回到这个页面（在小游戏里）。</li>
          <li><code>EN / 中文</code> — 切换语言。</li>
          <li><code>🔊 / 🔇</code> — 开关声音。</li>
        </ul>
      `
    }
  };

  let lang = ARG.store.get('arg.lang');
  if (!lang || !DICT[lang]) lang = (navigator.language || 'en').toLowerCase().startsWith('zh') ? 'zh' : 'en';

  function apply() {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const v = DICT[lang][el.dataset.i18n];
      if (v !== undefined) el.textContent = v;
    });
    $('btn-lang').textContent = lang === 'en' ? 'EN' : '中文';
    $('help-title').textContent = DICT[lang].helpTitle;
    $('help-body').innerHTML = DICT[lang].helpBody;
  }

  function boot() {
    $('btn-lang').addEventListener('click', () => {
      lang = lang === 'en' ? 'zh' : 'en';
      ARG.store.set('arg.lang', lang);
      apply();
      ARG.audio.blip();
    });

    $('btn-sound').addEventListener('click', e => {
      const on = ARG.audio.toggle();
      e.currentTarget.textContent = on ? '🔊' : '🔇';
    });
    $('btn-sound').textContent = ARG.audio.enabled ? '🔊' : '🔇';

    const overlay = $('help-overlay');
    $('btn-help').addEventListener('click', () => { overlay.hidden = false; });
    $('help-close').addEventListener('click', () => { overlay.hidden = true; });
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.hidden = true; });

    document.querySelectorAll('.tile').forEach(t => {
      t.addEventListener('pointerdown', () => ARG.audio.blip());
    });

    apply();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

})();
