/* ═══════════════════════════════════════════
   Indah Water — i18n
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

ARG.i18n = (function () {

  const DICT = {
    en: {
      title: 'Indah Water',
      menu: 'Menu',
      tabNetwork: 'How it gets there',
      tabPlant: 'How it gets cleaned',

      stage: 'Stage',
      next: 'NEXT',
      prev: 'BACK',
      restart: 'START AGAIN',

      /* ── 1. the connected sewerage system ── */
      n0: 'Sewage leaves the house',
      n1: 'Private sewerage pipeline',
      n2: 'Inspection chamber',
      n3: 'The manhole at the boundary',
      n4: 'Public sewerage pipeline',
      n5: 'Raw sewage reaches the plant',

      g0: 'Toilet, kitchen sink, shower, washing machine — every drop you send down a drain starts here. Toilet waste is called blackwater and the rest is greywater, but both end up in the same pipe.',
      g1: 'The stretch from the house out to your boundary is the private sewerage pipeline. It runs downhill on a slight fall, because sewage moves by gravity, not by pressure. This part belongs to the owner — if it blocks, you have to get it cleared.',
      g2: 'That is the little box with a lid inside your boundary. Its job is to let you open the lid and see whether the water is still flowing, and where it has backed up. The jetting hose goes in at the inspection chamber.',
      g3: 'The shaft standing at the foot of the boundary wall is a manhole. This is the handover point: the private pipeline ends here and the public system begins. Before the manhole is yours to look after; after it, it is Indah Water\u2019s.',
      g4: 'The public sewerage pipeline collects wastewater from the whole neighbourhood and carries it downhill to the treatment plant. It is much wider than the pipe from your house and usually runs under the road. Indah Water maintains all of it.',
      g5: 'By the time it reaches the plant the water is still dirty — this is what the diagram calls raw sewage. It goes into the pumping station first, because the treatment tanks sit above ground and the water has to be lifted up to them.',

      /* ── 2. the works ── */
      p0: 'Pumping station',
      p1: 'Screens, grit removal, flow measurement',
      p2: 'Aeration tank',
      p3: 'Flow distribution',
      p4: 'Final clarifier',
      p5: 'Effluent to drain',

      w0: 'The sewage arrives in a pipe that sits lower than the tanks, so it is pumped up first. The pumps are usually submersible ones sitting down in the wet well, with a standby ready to take over the moment one fails.',
      w1: 'Three jobs in one stretch. The screens are a big comb that catches wet wipes, cotton buds and plastic before they wreck a pump. The grit channel slows the flow so sand and coffee grounds settle out. Then a measuring flume records exactly how much is arriving.',
      w2: 'This is the clever part of the plant. The tank holds billions of bacteria, and blowers pump air in so they can breathe and eat the organic waste in the water. Extended aeration means the water stays here a long time — long enough for the bacteria to finish the job.',
      w3: 'Coming out of the aeration tank, the flow is split evenly between several clarifiers by a small dividing weir. That way each tank carries the same load, instead of one being swamped while another sits idle.',
      w4: 'Now the water is left to settle. The bacteria clump together and sink to the bottom as sludge. Some of it is pumped back to the aeration tank to keep working — that is return activated sludge — and the surplus is dried and used as fertiliser. The clear water on top flows away over a weir.',
      w5: 'By this point the water meets the discharge standard, so it is released into the drain and finds its way back to the river. Between your toilet and the river there is really only a treatment plant and a few billion bacteria.',

      /* ── labels ── */
      oHouse: 'house', oPrivate: 'private pipeline', oChamber: 'inspection chamber',
      oBoundary: 'boundary wall', oManhole: 'manhole', oPublic: 'public pipeline',
      oInlet: 'raw sewage',
      oPump: 'pumping station', oScreens: 'screens', oGrit: 'grit',
      oFlow: 'flow measurement', oAeration: 'aeration tank', oSplit: 'flow distribution',
      oClarifier: 'final clarifier', oSludge: 'return sludge', oEffluent: 'effluent',

      /* ── controls ── */
      airOn: 'BLOWERS ON',
      airOff: 'BLOWERS OFF',
      waterQ: 'water',
      cleanRaw: 'raw',
      cleanHalf: 'partly treated',
      cleanDone: 'clean',
      youAreHere: 'wastewater',

      helpTitle: 'Where it goes after you flush',
      helpBody: `
        <h3>Two halves</h3>
        <ul>
          <li><code>How it gets there</code> — from the house, through your own pipes and the inspection chamber, to the manhole at the boundary and into the public sewer.</li>
          <li><code>How it gets cleaned</code> — the extended-aeration plant: pumping station, screens and grit, aeration tank, flow distribution, final clarifier, then out to the drain.</li>
        </ul>
        <h3>The three big ideas</h3>
        <ul>
          <li>Sewage moves by <b>gravity</b>, not pressure. Every pipe is laid on a slight fall, which is why the treatment plant is usually the lowest ground around.</li>
          <li>The manhole at your boundary is the <b>handover point</b>. Before it, the pipes are the owner's problem; after it, they belong to Indah Water.</li>
          <li>The cleaning is done by <b>living bacteria</b>. People build the tanks and pump in air; the bacteria do the actual work. Turn the blowers off and they stop.</li>
        </ul>
        <h3>Never flush</h3>
        <ul>
          <li>Wet wipes, cotton buds, cooking oil or sanitary items. They do not break down, they wrap around the pumps, and they are the number one cause of blocked sewers.</li>
        </ul>
      `
    },

    zh: {
      title: '英达丽水',
      menu: '菜单',
      tabNetwork: '污水怎么来',
      tabPlant: '污水厂怎么清洁',

      stage: '阶段',
      next: '下一步',
      prev: '上一步',
      restart: '重新开始',

      /* ── 1. 污水管网 ── */
      n0: '家里排出来的污水',
      n1: '私人污水管',
      n2: '检查井',
      n3: '围墙下的人孔',
      n4: '公共污水管',
      n5: '原污水进厂',

      g0: '厕所、厨房水槽、浴室、洗衣机 — 家里用过的每一滴水都从这里开始。马桶排出来的叫黑水，其余的叫灰水，但最后都进同一条管。',
      g1: '从家里接出来到地界那一段，叫私人污水管。它有一点点坡度，靠重力往下流 — 污水不是被压力推走的。这一段属于业主，堵了要自己找人通。',
      g2: '地界里那个带盖子的方井就是检查井。它的用处是让你能揭开盖子，看水还在不在流、堵在哪一段。通管子的高压水枪就是从检查井伸进去的。',
      g3: '围墙脚下那个立起来的井是人孔。这里是交接点：私人污水管到此结束，公共系统从这里开始。人孔之前是你负责，人孔之后归英达丽水。',
      g4: '公共污水管把整片住宅区的污水汇集起来，一路靠重力送到污水厂。它比家里的管子粗很多，通常埋在马路下面，全部由英达丽水维护。',
      g5: '到了污水厂，水还是脏的 — 图上叫它原污水。它先进抽水站，因为厂里的池子都建在地面上，水得先被抽上去。',

      /* ── 2. 污水厂 ── */
      p0: '抽水站',
      p1: '格栅、沉砂、流量测量',
      p2: '曝气池',
      p3: '配水（分流）',
      p4: '最终沉淀池',
      p5: '出水排入排水道',

      w0: '污水从地下管道进来，位置比厂里的池子低，所以要先抽上去。泵一般泡在水里的潜水泵，另外备一台 — 一台坏了马上顶上。',
      w1: '这一格干三件事。格栅像一把大梳子，把湿纸巾、棉签、塑料拦下来，免得它们打坏水泵；沉砂槽让水流慢下来，沙子和咖啡渣沉底；后面的量水槽记录到底进来了多少水。',
      w2: '这是整个厂最聪明的地方。池子里养着上亿个细菌，鼓风机不停往水里打空气，让它们能呼吸、把水里的有机物吃掉。"延时曝气"的意思是水在这里待很久，久到细菌把能吃的都吃完。',
      w3: '水从曝气池出来后，用一道小堰口把它平均分给几个沉淀池。这样每个池子的负担都一样，不会一个忙死、一个闲着。',
      w4: '现在让水静下来。细菌抱成团，变成污泥沉到池底。一部分污泥被抽回曝气池继续干活 — 这叫回流污泥；多出来的排出去干化当肥料。上层已经变清的水从堰口流走。',
      w5: '到这里水已经干净到符合排放标准，可以排进排水道，最后流回河里。所以从你的马桶到河流，中间其实只隔着一个污水厂和几亿个细菌。',

      /* ── 标注 ── */
      oHouse: '住家', oPrivate: '私人污水管', oChamber: '检查井',
      oBoundary: '围墙', oManhole: '人孔', oPublic: '公共污水管',
      oInlet: '原污水',
      oPump: '抽水站', oScreens: '格栅', oGrit: '沉砂',
      oFlow: '量水槽', oAeration: '曝气池', oSplit: '配水',
      oClarifier: '最终沉淀池', oSludge: '回流污泥', oEffluent: '出水',

      /* ── 控制 ── */
      airOn: '鼓风机 开',
      airOff: '鼓风机 关',
      waterQ: '水质',
      cleanRaw: '原污水',
      cleanHalf: '处理中',
      cleanDone: '干净的水',
      youAreHere: '污水',

      helpTitle: '冲完之后它去了哪里',
      helpBody: `
        <h3>两个部分</h3>
        <ul>
          <li><code>污水怎么来</code> — 从住家出来，经过自己的管子和检查井，到围墙下的人孔，进入公共污水管。</li>
          <li><code>污水厂怎么清洁</code> — 延时曝气厂：抽水站 → 格栅与沉砂 → 曝气池 → 配水 → 最终沉淀池 → 出水排走。</li>
        </ul>
        <h3>三个重点</h3>
        <ul>
          <li>污水靠<b>重力</b>流，不是靠压力。每根管子都有一点点坡度，所以污水厂通常建在最低的地方。</li>
          <li>围墙下的人孔是<b>交接点</b>：之前的管子是业主的事，之后就归英达丽水。</li>
          <li>真正干活的是<b>活着的细菌</b>。人只是建池子、打空气；把鼓风机关掉，它们就停工。</li>
        </ul>
        <h3>这些东西千万别冲</h3>
        <ul>
          <li>湿纸巾、棉签、废油、卫生用品。它们不会分解，会缠住水泵 — 是污水管堵塞的第一大原因。</li>
        </ul>
      `
    }
  };

  let lang = ARG.store.get('arg.lang');
  if (!lang || !DICT[lang]) lang = 'zh';   // Chinese unless you switch it
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
