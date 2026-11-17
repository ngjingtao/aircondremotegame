/* ═══════════════════════════════════════════
   home.js — activity picker
   ═══════════════════════════════════════════ */
(function () {

  const $ = id => document.getElementById(id);

  const DICT = {
    en: {
      appName: 'Play & Learn',
      pickOne: 'What shall we play?',
      pickSub: 'Pick a topic, then an activity',
      allTopics: 'All topics',
      catHomeDesc: 'Air conditioning, servicing and laundry',
      catKitchenDesc: 'Food, sandwiches and the kitchen hood',
      catWaterDesc: 'Water at home, the toilet and the sewer',
      catNatureDesc: 'Trees, the water cycle and the weather',
      catBodyDesc: 'Breathing, trains and engines',
      catScienceDesc: 'Electricity, magnets, light and the sun bear',
      catMachinesDesc: 'Speaker, computer, power and safety',
      tileAirTitle: 'Play Aircond',
      tileAirSub: 'Drive the remote, make the boy happy, cold or hot',
      tileFoodTitle: 'Food Eating',
      tileFoodSub: 'Follow food from the mouth all the way out',
      tileTrainTitle: 'Train Driving',
      tileTrainSub: 'Drive the train, stop at the station, ding ding at the crossing',
      tileBreathTitle: 'Breathing & Blood',
      tileBreathSub: 'Run experiments: breathe, hold your breath, run and climb a mountain',
      tileCareTitle: 'Inside the Aircon',
      tileCareSub: 'See how it works — then learn how to wash it, step by step',
      tileToiletTitle: 'Toilet',
      tileToiletSub: 'See what a flush really does — the button, the flapper, the siphon and the water seal',
      tileIndahTitle: 'Indah Water',
      tileIndahSub: 'Follow the wastewater from the house to the treatment plant — and see how the bacteria clean it',
      tileHoodTitle: 'Kitchen Hood',
      tileHoodSub: 'Turn the fan up and watch how it pulls the smoke, grease and smell out of the kitchen',
      tileLaundryTitle: 'Laundry Day',
      tileLaundrySub: 'Wash the clothes, then dry them — without shrinking anything',
      tileTreeTitle: 'From Seed to Tree',
      tileTreeSub: 'Grow a seed into a tree — and learn what happens at every phase',
      tileSandwichTitle: 'Breakfast Sandwich',
      tileSandwichSub: 'Build a balanced sandwich, then cook the egg just right',
      tileWaterTitle: 'Water at Home',
      tileWaterSub: 'Follow water from the river to the tap, then heat it and draw a hot shower',
      tileCycleTitle: 'Water Cycle',
      tileCycleSub: 'Follow one drop from the sea to the clouds, the rain, the river and back',
      tileWeatherTitle: 'Weather Station',
      tileWeatherSub: 'Read the rain gauge, wind, pressure and river level, then forecast the weather',
      tileEngineTitle: 'How a Car Engine Works',
      tileEngineSub: 'Watch the piston, valves and spark plug through intake, compression, power and exhaust',
      tileElectricTitle: 'Electricity',
      tileElectricSub: 'Follow the current — one step, one sentence, read aloud',
      tileMagnetTitle: 'Magnets',
      tileMagnetSub: 'Poles, fields and a compass — step by step',
      tileLightTitle: 'Light & Shadow',
      tileLightSub: 'Shadows, mirrors and a straw that looks broken',
      tileSunbearTitle: 'Sun Bear',
      tileSunbearSub: 'The world\u2019s smallest bear — and how to help it',
      tileSpeakerTitle: 'Speaker',
      tileSpeakerSub: 'How a coil and a cone turn current into sound',
      tileComputerTitle: 'Computer',
      tileComputerSub: 'Input, CPU, memory, storage and output — inside the box',
      tilePowerTitle: 'Power Journey',
      tilePowerSub: 'From the generator to the socket, step by step',
      tileSafetyTitle: 'Electrical Safety',
      tileSafetySub: 'Six rules that keep electricity safe at home',
      groupHome: 'Home machines',
      groupKitchen: 'Kitchen',
      groupWater: 'Water systems',
      groupNature: 'Nature & weather',
      groupTravel: 'Body & transport',
      groupScience: 'Science lab',
      groupMachines: 'Electricity & machines',

      /* ── the sticker book ── */
      bookTitle: 'My sticker book',
      bookHint: 'Finish a run, or see an activity right through, to earn a sticker.',
      bookAll: 'Every sticker collected!',
      stAir0: 'Morning in the front room',
      stAir1: 'Hold it steady through a heatwave',
      stAir2: 'Warm him up in the cold snap',
      stTrain0: 'Drive the early service',
      stTrain1: 'Make it through the rush',
      stTrain2: 'Bring the night run in',
      stFood: 'See a meal all the way through',
      stBreath: 'Breathe three rounds with the pacer',
      stCare: 'Finish the whole wash',
      stToilet: 'See a flush right through',
      stIndah: 'Follow it to the end of the works',
      stHood: 'Pull every bit of the smoke out',
      stWash: 'Wash a load really clean',
      stDry: 'Dry it just right',
      stTree: 'Grow a seed all the way to a new seed',
      stSandwich: 'Cook a balanced breakfast sandwich',
      stWater: 'Follow the water and store it hot',
      stCycle: 'Follow a drop all the way round the water cycle',
      stWeather: 'Forecast the weather from the instruments',
      stEngine: 'See all four strokes of a car engine',
      stElectric: 'Follow the current all the way round',
      stMagnet: 'Find the poles, the field and the compass',
      stLight: 'Follow light, shadow, reflection and refraction',
      stSunbear: 'Meet the smallest bear and learn how to help it',
      stSpeaker: 'Follow a signal from the coil to the cone',
      stComputer: 'Follow data from input to output',
      stPower: 'Follow electricity from the plant to the socket',
      stSafety: 'Learn the six safety rules',
      foot: 'Made for curious kids',
      help: '?',
      helpTitle: 'Twenty-three activities',
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
        <h3>🚆 Train Driving</h3>
        <ul>
          <li>Notch up the throttle and feel how heavy a train is. Brakes need a long distance.</li>
          <li>Stop with the front of the train on the white mark at each station.</li>
          <li>Listen for <code>ding, ding, ding</code> at every level crossing — red lights flash and the barrier comes down.</li>
          <li>Horn, bell, headlights and doors all work. Doors must be shut before you move.</li>
        </ul>
        <h3>🫁 Breathing &amp; Blood</h3>
        <ul>
          <li>Choose an experiment: <code>Sleep</code>, <code>Rest</code>, <code>Walk</code>, <code>Run</code> or <code>High altitude</code>.</li>
          <li>Watch the lungs inflate and the heart beat faster when the body needs more oxygen.</li>
          <li>Press <code>TAKE A BREATH</code>, or <code>HOLD BREATH</code> and see the oxygen fall until the body forces a gasp.</li>
          <li>Blue blood cells carry carbon dioxide; they turn red in the lungs. The bubble shows the gas exchange.</li>
        </ul>
        <h3>❄ Inside the Aircon</h3>
        <ul>
          <li><code>How it works</code> — follow the refrigerant round its loop: compressor, condenser, expansion valve, evaporator.</li>
          <li>Watch the tube turn red where it is hot and blue where it is cold, and see heat coming in from your room and going out of the outdoor unit.</li>
          <li><code>How to wash it</code> — an eight-step service, from unplugging it to running the fan dry.</li>
        </ul>
        <h3>🚽 Toilet</h3>
        <ul>
          <li>Press the button and watch the chain lift the flapper, the cistern empty, the rim jets rinse the bowl and the siphon pull everything over the weir.</li>
          <li>The cutaway is a real gravity-flush toilet: fill valve, float, refill tube, overflow tube, siphon jet and one continuous trapway.</li>
          <li>Tap any stage, or use NEXT, to hear what happens at each one.</li>
        </ul>
        <h3>🚰 Indah Water</h3>
        <ul>
          <li><code>How it gets there</code> — from the house, through your own pipes and the inspection chamber, to the manhole at the boundary and into the public sewer.</li>
          <li><code>How it gets cleaned</code> — the extended-aeration plant: pumping station, screens and grit, aeration tank, flow distribution, final clarifier, out to the drain.</li>
          <li>On the plant tab you can switch the <code>blowers</code> off and watch the bacteria stop working.</li>
        </ul>
        <h3>🍳 Kitchen Hood</h3>
        <ul>
          <li>Turn the fan to <code>OFF</code> and watch the smoke escape into the room.</li>
          <li>Press <code>FILTER → DIRTY</code>: the airflow drops, the noise goes up and smoke starts leaking — exactly what a clogged filter does.</li>
          <li>Switch between <code>OUTSIDE</code> and <code>RECIRCULATE</code> to see where the air ends up.</li>
        </ul>
        <h3>🧺 Laundry Day</h3>
        <ul>
          <li>Pick a load, then set the programme, water temperature, spin and detergent. Press <code>START</code>.</li>
          <li>Warm water cleans better, but hot water shrinks wool and fades colours. A fast spin leaves less water for the dryer.</li>
          <li>Switch to <code>DRY</code>: <code>SENSOR</code> stops when the clothes are ready, while <code>TIMED</code> keeps going. Low heat protects wool and gym kit.</li>
        </ul>
        <h3>🌱 From Seed to Tree</h3>
        <ul>
          <li>Plant a seed, then keep the soil moisture in the green band and the light right for each of the eight phases.</li>
          <li>Press <code>WATER</code> to top up the soil. Full sun dries it faster, so watch the marker.</li>
          <li>Too dry, too wet or the wrong light stalls growth and drains health. Reach seed dispersal with a healthy tree to earn the stars.</li>
        </ul>
        <h3>🥪 Breakfast Sandwich</h3>
        <ul>
          <li>Choose a bread, spread, filling and vegetable, then cook the egg.</li>
          <li>Stop while the marker is in the green band: low heat about 8 s, medium 5 s, high 3.5 s.</li>
          <li>Wholemeal, avocado, egg and a vegetable make a balanced breakfast. A spread stops tomato juice making the bread soggy.</li>
        </ul>
        <h3>💧 Water at Home</h3>
        <ul>
          <li><code>FROM THE RIVER</code> — follow the eight treatment steps from source to tap.</li>
          <li><code>HOT WATER</code> — set a temperature and watch the cylinder stratify. Draw hot water through the mixing valve.</li>
          <li>Store at 60 °C or above for Legionella safety; the mixing valve brings it down to about 50 °C at the tap.</li>
        </ul>
        <h3>🌍 Water Cycle</h3>
        <ul>
          <li>Follow one drop through evaporation, transpiration, condensation, precipitation, runoff, river, lake and back to the sea.</li>
          <li>Press <code>WATCH</code> to let the cycle play by itself, or tap any stage.</li>
        </ul>
        <h3>🌦️ Weather Station</h3>
        <ul>
          <li>Read the barometer, hygrometer, wind, rain gauge, river gauge and sunshine recorder.</li>
          <li>Choose <code>FAIR</code>, <code>RAIN</code> or <code>STORM</code>, then reveal the weather and see why.</li>
          <li>Falling pressure + rising humidity + strengthening wind usually means rain. High, rising pressure usually means fair.</li>
        </ul>
        <h3>⚙️ How a Car Engine Works</h3>
        <ul>
          <li>Watch one cylinder through the four strokes: intake, compression, power and exhaust.</li>
          <li>Press <code>START</code> and change <code>IDLE</code>, <code>CRUISE</code> or <code>REV</code>. This is slow motion: a real engine does this many times a second.</li>
          <li><code>STEP</code> freezes one stroke at a time. Only the power stroke makes power; the other three prepare and clean up.</li>
        </ul>
        <h3>🔬 Electricity</h3>
        <ul>
          <li>Six steps around one circuit: battery, closed loop, switch, bulb, conductors, safety.</li>
          <li>Each step is read aloud as it opens. Tap a key word to hear it and see what it means.</li>
          <li>The switch closes and the bulb lights as you move through the lesson.</li>
        </ul>
        <h3>🔬 Magnets</h3>
        <ul>
          <li>What a magnet pulls, the two poles, like poles repelling, the field, magnetising and a compass.</li>
          <li>Watch the iron things lift off the shelf, and the field lines appear around the bar magnet.</li>
        </ul>
        <h3>🔬 Light &amp; Shadow</h3>
        <ul>
          <li>Light sources, straight beams, shadows, why a shadow grows, reflection and refraction.</li>
          <li>Bring the lamp closer and watch the tree's shadow grow; then see a straw bend in water.</li>
        </ul>
        <h3>🐻 Sun Bear</h3>
        <ul>
          <li>Meet the smallest bear in the world — its sun-shaped chest patch, 20–25 cm tongue and climbing claws.</li>
          <li>Find out what it eats, where it lives, and why it is listed as Vulnerable.</li>
          <li>Every step is read aloud; tap a key word to hear what it means.</li>
        </ul>
        <h3>🔌 Speaker</h3>
        <ul>
          <li>Six steps from the signal to the magnet, coil, cone and sound waves.</li>
          <li>Pitch is frequency; volume is amplitude. The waveform changes with the step.</li>
        </ul>
        <h3>💻 Computer</h3>
        <ul>
          <li>Input → processor → memory → storage → output, drawn on one cutaway.</li>
          <li>RAM forgets when the power goes off; storage keeps files.</li>
          <li>Everything inside is 0s and 1s.</li>
        </ul>
        <h3>⚡ Power Journey</h3>
        <ul>
          <li>Generator → step-up transformer → pylons → substation → meter → 230 V socket.</li>
          <li>High voltage means a smaller current, so less energy is lost on the way.</li>
        </ul>
        <h3>⚠️ Electrical Safety</h3>
        <ul>
          <li>Never poke a socket; keep water away; do not overload one lead.</li>
          <li>Replace damaged cords; use the earth pin and the RCD.</li>
          <li>In a storm or a short circuit: switch off if safe, tell a grown-up, call 999 for a fire.</li>
        </ul>
        <h3>Buttons in the top bar</h3>
        <ul>
          <li><code>‹ Menu</code> — back to this topic (inside an activity).</li>
          <li><code>EN / 中文</code> — switch language.</li>
          <li><code>🔊 / 🔇</code> — sound on or off.</li>
        </ul>
      `
    },
    zh: {
      appName: '边玩边学',
      pickOne: '今天玩什么？',
      pickSub: '先选主题，再选活动',
      allTopics: '全部主题',
      catHomeDesc: '空调、空调清洗和洗衣',
      catKitchenDesc: '吃东西、三明治和抽油烟机',
      catWaterDesc: '家里的水、马桶和污水',
      catNatureDesc: '树木、水循环和天气',
      catBodyDesc: '呼吸、火车和发动机',
      catScienceDesc: '电、磁铁、光和马来熊',
      catMachinesDesc: '扬声器、电脑、电和安全',
      tileAirTitle: '玩空调',
      tileAirSub: '操作遥控器，看看男孩是舒服、冷还是热',
      tileFoodTitle: '吃东西',
      tileFoodSub: '跟着食物从嘴巴一路走到外面',
      tileTrainTitle: '开火车',
      tileTrainSub: '开动火车、停准站台，道口叮叮叮',
      tileBreathTitle: '呼吸与血液循环',
      tileBreathSub: '做实验：呼吸、屏气、跑步、上高山',
      tileCareTitle: '空调的秘密',
      tileCareSub: '看它怎么工作 — 再一步步学会清洗空调',
      tileToiletTitle: '马桶',
      tileToiletSub: '看看冲水到底做了什么 — 按钮、橡胶阀、虹吸和水封',
      tileIndahTitle: '英达丽水',
      tileIndahSub: '跟着污水从住家一路走到污水厂 — 看细菌怎么把它变干净',
      tileHoodTitle: '抽油烟机',
      tileHoodSub: '把风速调大，看它怎么把油烟、油和味道抽走',
      tileLaundryTitle: '洗衣日',
      tileLaundrySub: '先把衣服洗干净，再烘干 — 一件都不要缩水',
      tileTreeTitle: '从种子到大树',
      tileTreeSub: '把一颗种子种成大树 — 看看它一生里的每个阶段',
      tileSandwichTitle: '早餐三明治',
      tileSandwichSub: '搭配一份均衡的三明治，再把蛋煎得刚刚好',
      tileWaterTitle: '家里的水',
      tileWaterSub: '跟着水从河到水龙头，再加热、放出热水',
      tileCycleTitle: '水循环',
      tileCycleSub: '跟着一滴水从大海升上云层，变成雨、流进河，再回到大海',
      tileWeatherTitle: '气象站',
      tileWeatherSub: '读雨量、风、气压和河水水位，然后预报天气',
      tileEngineTitle: '汽车发动机怎样工作',
      tileEngineSub: '看活塞、气门和火花塞走完进气、压缩、做功和排气',
      tileElectricTitle: '电的旅行',
      tileElectricSub: '跟着电流走：一步一步，一边看一边读',
      tileMagnetTitle: '磁铁的秘密',
      tileMagnetSub: '磁极、磁场和指南针：一步一步来',
      tileLightTitle: '光和影子',
      tileLightSub: '影子、镜子，还有插在水里像断了的吸管',
      tileSunbearTitle: '马来熊',
      tileSunbearSub: '世界上最小的熊，以及怎样保护它',
      tileSpeakerTitle: '扬声器',
      tileSpeakerSub: '线圈和振膜怎样把电流变成声音',
      tileComputerTitle: '电脑',
      tileComputerSub: '看看输入、处理器、内存、存储和输出',
      tilePowerTitle: '电的旅程',
      tilePowerSub: '跟着电从发电机一路走到插座',
      tileSafetyTitle: '安全用电',
      tileSafetySub: '让家里用电安全的六条规则',
      groupHome: '家里的机器',
      groupKitchen: '厨房',
      groupWater: '水系统',
      groupNature: '自然与天气',
      groupTravel: '身体与出行',
      groupScience: '科学实验室',
      groupMachines: '电与机器',

      /* ── 贴纸本 ── */
      bookTitle: '我的贴纸本',
      bookHint: '通关一个任务，或者把一个活动从头玩到尾，就能拿到一张贴纸。',
      bookAll: '贴纸全部集齐了！',
      stAir0: '客厅的早晨',
      stAir1: '热浪里一直让他舒服',
      stAir2: '寒潮里把他暖回来',
      stTrain0: '开好早班车',
      stTrain1: '顺利赶过高峰',
      stTrain2: '把夜班车开完',
      stFood: '看着一顿饭走完全程',
      stBreath: '跟着节拍器呼吸三轮',
      stCare: '把整套清洗做完',
      stToilet: '看完整一次冲水',
      stIndah: '一路跟到污水厂最后一步',
      stHood: '把油烟全部抽走',
      stWash: '把一桶衣服洗得干干净净',
      stDry: '把衣服烘得刚刚好',
      stTree: '把一颗种子种成大树，再结出新的种子',
      stSandwich: '做一份均衡的早餐三明治',
      stWater: '跟着水走完全程，并把水加热储存',
      stCycle: '跟着一滴水走完整个水循环',
      stWeather: '用仪器读数预报天气',
      stEngine: '看完汽车发动机的四个冲程',
      stElectric: '跟着电流走完一整圈',
      stMagnet: '找到磁极、磁场和指南针',
      stLight: '跟着光，看见影子、反射和折射',
      stSunbear: '认识世界上最小的熊，学会保护它',
      stSpeaker: '跟着信号从线圈走到振膜',
      stComputer: '跟着数据从输入走到输出',
      stPower: '跟着电从发电厂走到插座',
      stSafety: '记住六条安全用电规则',
      foot: '给充满好奇心的小朋友',
      help: '?',
      helpTitle: '二十三个小游戏',
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
        <h3>🚆 开火车</h3>
        <ul>
          <li>推动油门，感受火车有多重。刹车需要很长的距离。</li>
          <li>让车头停在每个车站的白色标线上。</li>
          <li>每个道口都要听 <code>叮、叮、叮</code> — 红灯闪烁，栏杆落下。</li>
          <li>风笛、铃声、车灯、车门都能用。门没关好火车不会动。</li>
        </ul>
        <h3>🫁 呼吸与血液循环</h3>
        <ul>
          <li>选择实验：<code>睡觉</code>、<code>休息</code>、<code>走路</code>、<code>跑步</code> 或 <code>高海拔</code>。</li>
          <li>看肺怎么鼓起来，身体需要更多氧气时心脏怎么跳得更快。</li>
          <li>按 <code>深吸一口气</code>；或按 <code>屏住呼吸</code>，看含氧量一直下降直到身体逼你吸气。</li>
          <li>蓝色的血细胞带着二氧化碳，到肺里就变成红色。小圆窗展示气体交换。</li>
        </ul>
        <h3>❄ 空调的秘密</h3>
        <ul>
          <li><code>怎么工作的</code> — 跟着制冷剂走一圈：压缩机、冷凝器、节流阀、蒸发器。</li>
          <li>看管子哪里变红（热）、哪里变蓝（冷），屋里吸热、室外放热。</li>
          <li><code>怎么清洗</code> — 从断电到开送风干燥，一共八个步骤。</li>
        </ul>
        <h3>🚽 马桶</h3>
        <ul>
          <li>按下按钮，看链条把橡胶阀抬起、水箱排空、冲水孔冲洗内壁，最后虹吸把东西拉过溢流堰。</li>
          <li>这张剖面图是真的重力冲水马桶：进水阀、浮球、补水软管、溢流管、喷射孔，还有一整条连通的弯管。</li>
          <li>点任意一个阶段，或按“下一步”，听听每一段发生了什么。</li>
        </ul>
        <h3>🚰 英达丽水</h3>
        <ul>
          <li><code>污水怎么来</code> — 从住家出来，经过自己的管子和检查井，到围墙下的人孔，进入公共污水管。</li>
          <li><code>污水厂怎么清洁</code> — 延时曝气厂：抽水站、格栅与沉砂、曝气池、配水、最终沉淀池，最后出水排走。</li>
          <li>在污水厂那页可以把<code>鼓风机</code>关掉，看细菌怎么停工。</li>
        </ul>
        <h3>🍳 抽油烟机</h3>
        <ul>
          <li>把风速按到 <code>关闭</code>，看油烟怎么跑进屋里。</li>
          <li>按 <code>滤网 → 脏了</code>：风量掉下来、噪音变大、油烟开始外漏 — 这就是滤网堵住的样子。</li>
          <li>在 <code>排到室外</code> 和 <code>室内循环</code> 之间切换，看空气最后去了哪里。</li>
        </ul>
        <h3>🧺 洗衣日</h3>
        <ul>
          <li>选一桶衣物，再选程序、水温、脱水和洗衣液，然后按 <code>开始</code>。</li>
          <li>温水洗得更干净，但热水会让羊毛缩水、颜色变淡。脱水转得快，衣服带的水少，烘干就更省时间。</li>
          <li>切到 <code>烘干</code>：<code>湿度感应</code>在衣服干时自动停，<code>定时</code>时间到了才停。羊毛和运动服要用低温。</li>
        </ul>
        <h3>🌱 从种子到大树</h3>
        <ul>
          <li>种下一颗种子，然后让土壤水分保持在绿色区域，并给每个阶段配对的光照。</li>
          <li>按 <code>浇水</code> 给土加水。全日照下干得快，要盯着水分标记。</li>
          <li>太干、太湿或光照不对，生长就会停下，健康也会下降。让树健康地走到传播种子，就能拿到星星。</li>
        </ul>
        <h3>🥪 早餐三明治</h3>
        <ul>
          <li>选面包、涂抹、馅料和蔬菜，然后煎蛋。</li>
          <li>水分标记停在绿色区域时关火：小火约 8 秒，中火 5 秒，大火 3.5 秒。</li>
          <li>全麦、牛油果、蛋和蔬菜就是均衡早餐。先涂一层酱，番茄汁才不会把面包泡软。</li>
        </ul>
        <h3>💧 家里的水</h3>
        <ul>
          <li><code>从河到水龙头</code> — 跟着八个净水步骤，从水源走到水龙头。</li>
          <li><code>热水器</code> — 设定温度，看水箱怎么分层。再放出热水，经过混水阀。</li>
          <li>储水保持 60°C 以上才安全；混水阀把出水降到约 50°C，防止烫伤。</li>
        </ul>
        <h3>🌍 水循环</h3>
        <ul>
          <li>跟着一滴水经历蒸发、蒸腾、凝结、降水、径流、河流、湖泊，再回到大海。</li>
          <li>按 <code>自动播放</code> 让循环自己走，也可以点任意一个阶段。</li>
        </ul>
        <h3>🌦️ 气象站</h3>
        <ul>
          <li>读气压计、湿度计、风、雨量筒、水位计和日照计。</li>
          <li>选 <code>晴天</code>、<code>下雨</code> 或 <code>暴风雨</code>，再揭晓天气，看看为什么。</li>
          <li>气压下降 + 湿度上升 + 风变大，通常要下雨；气压高而且在上升，通常是好天气。</li>
        </ul>
        <h3>⚙️ 汽车发动机怎样工作</h3>
        <ul>
          <li>看一个气缸走完四个冲程：进气、压缩、做功和排气。</li>
          <li>按 <code>启动</code>，再切换 <code>怠速</code>、<code>巡航</code> 或 <code>高转</code>。这是慢动作：真实发动机每秒会做好多次。</li>
          <li><code>单步</code> 可以一次停在一个冲程上。只有做功冲程产生动力，其他三个在准备和清理。</li>
        </ul>
        <h3>🔬 电的旅行</h3>
        <ul>
          <li>沿着一个电路走六步：电池、闭合电路、开关、灯泡、导体、安全用电。</li>
          <li>每一步打开时都会自动读出来。点关键词，可以听它的意思。</li>
          <li>走到开关那一步，开关合上，灯泡亮起来。</li>
        </ul>
        <h3>🔬 磁铁的秘密</h3>
        <ul>
          <li>磁铁吸什么、两个磁极、同极相斥、看不见的磁场、磁化，还有指南针。</li>
          <li>看铁钉和回形针被吸起来，看磁场线在磁铁周围出现。</li>
        </ul>
        <h3>🔬 光和影子</h3>
        <ul>
          <li>光源、光走直线、影子、影子为什么变大、反射和折射。</li>
          <li>把灯靠近树，影子会变大；再看看插在水里的吸管怎样“折断”。</li>
        </ul>
        <h3>🐻 马来熊</h3>
        <ul>
          <li>认识世界上最小的熊：像太阳的胸斑、20–25 厘米的长舌头，还有爬树的爪子。</li>
          <li>看看它吃什么、住在哪里，为什么被列为“易危”。</li>
          <li>每一步都会读出来；点关键词，可以听它的意思。</li>
        </ul>
        <h3>🔌 扬声器</h3>
        <ul>
          <li>从信号到磁铁、线圈、振膜和声音，一共六步。</li>
          <li>频率决定音高，振幅决定音量；波形也会跟着变。</li>
        </ul>
        <h3>💻 电脑</h3>
        <ul>
          <li>输入 → 处理器 → 内存 → 存储 → 输出，都画在一张剖面图里。</li>
          <li>内存一关机就忘；硬盘和固态硬盘会把文件留下来。</li>
          <li>电脑里面的一切，最后都是 0 和 1。</li>
        </ul>
        <h3>⚡ 电的旅程</h3>
        <ul>
          <li>发电机 → 升压变压器 → 铁塔 → 变电站 → 电表 → 230 伏插座。</li>
          <li>电压高、电流小，路上损失的电就少。</li>
        </ul>
        <h3>⚠️ 安全用电</h3>
        <ul>
          <li>不碰插座；水和电分开；一个插线板不要接太多电器。</li>
          <li>换掉破损电线；用接地线和漏电保护器。</li>
          <li>雷雨或短路时：安全的话先关总开关，告诉大人；起火打 999。</li>
        </ul>
        <h3>顶栏按钮</h3>
        <ul>
          <li><code>‹ 菜单</code> — 回到这个主题（在小游戏里）。</li>
          <li><code>EN / 中文</code> — 切换语言。</li>
          <li><code>🔊 / 🔇</code> — 开关声音。</li>
        </ul>
      `
    }
  };

  let lang = ARG.store.get('arg.lang');
  if (!lang || !DICT[lang]) lang = 'zh';   // Chinese unless you switch it
  if (ARG.config && ARG.config.lockLang) lang = ARG.config.lockLang;

  /* ─────────── the sticker book ─────────── */
  const ACTIVITY = {
    aircond: { icon: '❄', tint: '#22a8c4' },
    food:    { icon: '🍎', tint: '#e8935a' },
    train:   { icon: '🚆', tint: '#e63946' },
    breath:  { icon: '🫁', tint: '#e2445c' },
    aircare: { icon: '🌀', tint: '#5fb6ef' },
    toilet:  { icon: '🚽', tint: '#5fd0ff' },
    indah:   { icon: '🚰', tint: '#3f9fd8' },
    hood:    { icon: '🍳', tint: '#f0a03a' },
    laundry: { icon: '🧺', tint: '#5fb6ef' },
    tree:    { icon: '🌱', tint: '#6fbf5f' },
    sandwich: { icon: '🥪', tint: '#f0a03a' },
    waterhome: { icon: '💧', tint: '#5fb6ef' },
    cycle:   { icon: '🌍', tint: '#3f9fd8' },
    weather: { icon: '🌦️', tint: '#8ecf72' },
    engine:  { icon: '⚙️', tint: '#f0a03a' },
    electric: { icon: '⚡', tint: '#ffd166' },
    magnet:  { icon: '🧲', tint: '#e85d5d' },
    light:   { icon: '💡', tint: '#ffc978' },
    sunbear: { icon: '🐻', tint: '#ffb347' },
    speaker: { icon: '🔊', tint: '#8fd0ff' },
    computer: { icon: '💻', tint: '#3f9fd8' },
    power:   { icon: '⚡', tint: '#ffd166' },
    safety:  { icon: '⚠️', tint: '#f87171' }
  };

  /* level 1 → one card per group; level 2 → that group's tiles.
     A new group needs its section in index.html plus one line here and its
     cat…Desc strings in both dictionaries. */
  const GROUP_META = {
    home:     { title: 'groupHome',     desc: 'catHomeDesc' },
    kitchen:  { title: 'groupKitchen',  desc: 'catKitchenDesc' },
    water:    { title: 'groupWater',    desc: 'catWaterDesc' },
    nature:   { title: 'groupNature',   desc: 'catNatureDesc' },
    body:     { title: 'groupTravel',   desc: 'catBodyDesc' },
    science:  { title: 'groupScience',  desc: 'catScienceDesc' },
    machines: { title: 'groupMachines', desc: 'catMachinesDesc' }
  };

  let lastCategory = null;

  function countText(n) {
    return lang === 'zh' ? n + ' 个活动' : n + (n === 1 ? ' activity' : ' activities');
  }

  function scrollHomeTop() {
    const h = $('home');
    if (h) h.scrollTop = 0;
  }

  function buildCategories() {
    const host = $('cat-grid');
    const groupsHost = $('groups');
    if (!host || !groupsHost) return;

    host.innerHTML = '';
    const groups = Array.prototype.slice.call(groupsHost.querySelectorAll('.group'));

    groups.forEach(group => {
      const key = group.dataset.group;
      const meta = GROUP_META[key];
      if (!meta) return;

      const iconEl = group.querySelector('.gt-ico');
      const count = group.querySelectorAll('.tile').length;
      const title = DICT[lang][meta.title];
      const desc = DICT[lang][meta.desc];

      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'cat-card';
      card.dataset.cat = key;
      card.setAttribute('aria-label', title + ' — ' + countText(count));

      const icon = document.createElement('span');
      icon.className = 'cat-ico';
      icon.textContent = iconEl ? iconEl.textContent : '•';
      icon.setAttribute('aria-hidden', 'true');

      const text = document.createElement('span');
      text.className = 'cat-text';

      const name = document.createElement('b');
      name.textContent = title;

      const sub = document.createElement('span');
      sub.className = 'cat-desc';
      sub.textContent = desc;

      const num = document.createElement('span');
      num.className = 'cat-count';
      num.textContent = countText(count);

      text.appendChild(name);
      text.appendChild(sub);
      text.appendChild(num);

      const go = document.createElement('span');
      go.className = 'cat-go';
      go.textContent = '›';
      go.setAttribute('aria-hidden', 'true');

      card.appendChild(icon);
      card.appendChild(text);
      card.appendChild(go);
      card.addEventListener('click', () => openCategory(key));

      host.appendChild(card);
    });
  }

  function openCategory(key) {
    if (ARG.audio && ARG.audio.blip) ARG.audio.blip();
    if (window.history && history.pushState) {
      try {
        history.pushState({ cat: key }, '', '#' + key);
      } catch (e) {
        location.hash = key;          // file:// can refuse pushState
      }
    } else {
      location.hash = key;
    }
    renderRoute({ focus: true });
  }

  function backToAll() {
    if (ARG.audio && ARG.audio.blip) ARG.audio.blip();
    /* replace, rather than history.back(): after a refresh the previous entry
       may be outside the app, and ‹ All topics must never leave it */
    if (window.history && history.replaceState) {
      try {
        history.replaceState(null, '', location.pathname + location.search);
      } catch (e) {
        location.hash = '';
      }
    } else {
      location.hash = '';
    }
    renderRoute({ focus: true });
  }

  function renderRoute(opts) {
    opts = opts || {};
    const groupsHost = $('groups');
    const catHost = $('cat-grid');
    const back = $('cat-back');
    const book = $('book');
    const titleEl = $('home-title');
    const subEl = $('home-sub');

    if (!groupsHost) return;
    const groups = Array.prototype.slice.call(groupsHost.querySelectorAll('.group'));
    const key = (location.hash || '').replace(/^#/, '');
    const group = groups.filter(g => g.dataset.group === key)[0];
    const meta = group ? GROUP_META[key] : null;

    if (!group || !meta) {
      if (key && window.history && history.replaceState) {
        try {
          history.replaceState(null, '', location.pathname + location.search);
        } catch (e) { /* file:// */ }
      }
      groupsHost.hidden = true;
      if (catHost) catHost.hidden = false;
      if (back) back.hidden = true;
      if (book) book.hidden = false;
      document.body.classList.remove('in-category');
      if (titleEl) titleEl.textContent = DICT[lang].pickOne;
      if (subEl) subEl.textContent = DICT[lang].pickSub;
      document.title = lang === 'zh' ? '边玩边学' : 'Play & Learn';
      scrollHomeTop();
      if (opts.focus && lastCategory) {
        const card = document.querySelector('.cat-card[data-cat="' + lastCategory + '"]');
        if (card) card.focus();
      }
      return;
    }

    lastCategory = key;
    groupsHost.hidden = false;
    groups.forEach(g => { g.hidden = g !== group; });
    if (catHost) catHost.hidden = true;
    if (back) back.hidden = false;
    if (book) book.hidden = true;
    document.body.classList.add('in-category');

    const title = DICT[lang][meta.title];
    if (titleEl) titleEl.textContent = title;
    if (subEl) subEl.textContent = DICT[lang][meta.desc] + ' · ' + countText(group.querySelectorAll('.tile').length);
    document.title = title + ' · ' + (lang === 'zh' ? '边玩边学' : 'Play & Learn');
    scrollHomeTop();
    if (opts.focus && back) back.focus();
  }

  function renderBook() {
    const host = $('book-grid');
    if (!host || !ARG.progress) return;

    const t = k => (DICT[lang][k] !== undefined ? DICT[lang][k] : k);
    const cards = ARG.progress.book();
    const got = ARG.progress.earned();

    host.innerHTML = cards.map(c => {
      const a = ACTIVITY[c.activity] || { icon: '★', tint: '#7aa2c8' };
      const stars = [0, 1, 2].map(i => '<i class="' + (i < c.stars ? 'on' : '') + '">★</i>').join('');
      return '<div class="sticker' + (c.stars ? ' got' : '') + '">' +
        '<span class="st-icon">' + a.icon + '</span>' +
        '<span class="st-stars">' + stars + '</span>' +
        '<span class="st-label">' + t(c.label) + '</span>' +
        '</div>';
    }).join('');

    /* the activity's colour goes on through the CSSOM rather than as a style=""
       attribute, because the Content-Security-Policy has no 'unsafe-inline' */
    Array.prototype.forEach.call(host.children, (el, i) => {
      const a = ACTIVITY[cards[i].activity];
      if (a && cards[i].stars) el.style.setProperty('--tint', a.tint);
    });

    $('book-count').textContent = got + ' / ' + ARG.progress.count;
    $('book-note').textContent = t(got === ARG.progress.count ? 'bookAll' : 'bookHint');
  }

  function apply() {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    document.title = lang === 'zh' ? '边玩边学' : 'Play & Learn';
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const v = DICT[lang][el.dataset.i18n];
      if (v !== undefined) el.textContent = v;
    });
    $('btn-lang').textContent = lang === 'en' ? 'EN' : '中文';
    if (ARG.config && ARG.config.lockLang) $('btn-lang').hidden = true;
    $('help-title').textContent = DICT[lang].helpTitle;
    $('help-body').innerHTML = DICT[lang].helpBody;
    renderBook();
    buildCategories();
    renderRoute();
  }

  /* optional AI tile art; the inline SVG tiles are the fallback */
  function mountTileArt() {
    if (!(ARG.config && ARG.config.art && ARG.config.art.tiles)) return;
    const tiles = document.querySelectorAll('.tile');
    Array.prototype.forEach.call(tiles, tile => {
      const key = (tile.getAttribute('href') || '').split('/')[0];
      const art = tile.querySelector('.tile-art');
      if (!key || !art || art.querySelector('.tile-img')) return;
      const img = document.createElement('img');
      img.className = 'tile-img';
      img.alt = '';
      img.hidden = true;
      img.onload = function () {
        img.hidden = false;
        const svg = art.querySelector('.tile-svg');
        if (svg) svg.style.display = 'none';
      };
      img.onerror = function () { img.remove(); };
      img.src = 'art/tiles/' + key + '.webp';
      art.appendChild(img);
    });
  }

  function boot() {
    $('btn-lang').addEventListener('click', () => {
      if (!(ARG.config && ARG.config.lockLang)) {
        lang = lang === 'en' ? 'zh' : 'en';
        ARG.store.set('arg.lang', lang);
      }
      apply();
      ARG.voice.syncLang();
      ARG.audio.blip();
    });

    $('btn-sound').addEventListener('click', e => {
      const on = ARG.audio.toggle();
      e.currentTarget.textContent = on ? '🔊' : '🔇';
    });
    $('btn-sound').textContent = ARG.audio.enabled ? '🔊' : '🔇';

    const back = $('cat-back');
    if (back) back.addEventListener('click', backToAll);
    if (window.history && window.addEventListener) {
      window.addEventListener('popstate', () => renderRoute({ focus: true }));
    }

    ARG.voice.attach();
    ARG.a11y.init();

    const overlay = $('help-overlay');
    $('btn-help').addEventListener('click', () => { overlay.hidden = false; });
    $('help-close').addEventListener('click', () => { overlay.hidden = true; });
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.hidden = true; });

    document.querySelectorAll('.tile').forEach(t => {
      t.addEventListener('pointerdown', () => ARG.audio.blip());
    });

    /* tap the help text to have it read out */
    ARG.voice.speakOnTap($('help-body'));

    apply();
    mountTileArt();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

})();
