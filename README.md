# ✦ Play &amp; Learn

[![Build Android APK](https://github.com/ngjingtao/aircondremotegame/actions/workflows/android.yml/badge.svg)](https://github.com/ngjingtao/aircondremotegame/actions/workflows/android.yml)

One little app, **thirty** activities for a curious kid. The home screen shows thirty picture
tiles — tap one and you're in.

```
┌───────────────────────────────────────────────────────────────────────┐
│  ✦ Play & Learn                                  🗣️  EN  🔊  ◧  ?     │
│                                                                       │
│                    今天玩什么？ / What shall we play?                  │
│                                                                       │
│  🏠 HOME MACHINES                                                     │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐                         │
│  │[ warm boy ]│ │[ pipes    ]│ │[ washer & ]│                         │
│  │玩空调      │ │空调的秘密  │ │洗衣日      │                         │
│  └────────────┘ └────────────┘ └────────────┘                         │
│  🍳 KITCHEN                                                           │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐                         │
│  │[ apple    ]│ │[ sandwich ]│ │[ the wok  ]│                         │
│  │吃东西      │ │早餐三明治  │ │抽油烟机    │                         │
│  └────────────┘ └────────────┘ └────────────┘                         │
│  💧 WATER SYSTEMS                                                     │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐                         │
│  │[ tap/tank ]│ │[ S-bend   ]│ │[ the works]│                         │
│  │家里的水    │ │马桶        │ │英达丽水    │                         │
│  └────────────┘ └────────────┘ └────────────┘                         │
│  🌱 NATURE & WEATHER                                                  │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐                         │
│  │[ seed →   ]│ │[ the drop ]│ │[ weather  ]│                         │
│  │从种子到大树│ │水循环      │ │气象站      │                         │
│  └────────────┘ └────────────┘ └────────────┘                         │
│  🚆 BODY & TRANSPORT                                                  │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐                         │
│  │[ the hill ]│ │[ tunnel   ]│ │[ engine   ]│                         │
│  │呼吸与血液  │ │开火车      │ │汽车发动机  │                         │
│  └────────────┘ └────────────┘ └────────────┘                         │
│  🔬 SCIENCE LAB                                                       │
│  ┌────────────┐ ┌────────────┐                                         │
│  │[ the bulb ]│ │[ magnet   ]│                                         │
│  │电的旅行    │ │磁铁的秘密  │                                         │
│  └────────────┘ └────────────┘                                         │
│  ┌────────────┐ ┌────────────┐                                         │
│  │[ the lamp ]│ │[ sun bear ]│                                         │
│  │光和影子    │ │马来熊      │                                         │
│  └────────────┘ └────────────┘                                         │
│  🔌 ELECTRICITY & MACHINES                                            │
│  ┌────────────┐ ┌────────────┐                                         │
│  │[ speaker  ]│ │[ laptop   ]│                                         │
│  │扬声器      │ │电脑        │                                         │
│  └────────────┘ └────────────┘                                         │
│  ┌────────────┐ ┌────────────┐                                         │
│  │[ pylon    ]│ │[ warning  ]│                                         │
│  │电的旅程    │ │安全用电    │                                         │
│  └────────────┘ └────────────┘                                         │
└───────────────────────────────────────────────────────────────────────┘
```

> The screen above is the **activity level** inside a topic. The first screen is seven topic
> cards; tap one to get here.

Everything is hand-drawn in **CSS + inline SVG** — no images, no sprite sheets, no build step.
All thirty activities speak **English and 中文**, work offline, and are installable as an app.

The thirty tiles are SVG scenes rather than icons: each shows a *moment* from its activity,
painted from one shared palette and split into three depth layers that drift gently and pull
apart on hover. They are the only place the character guidelines in
[`docs/character-bible.md`](docs/character-bible.md) are applied so far.

The activities are grouped under seven topics: **Home machines** (3), **Kitchen** (3),
**Water systems** (3), **Nature & weather** (3), **Body & transport** (3), **Science lab** (4)
and **Electricity & machines** (4).

### The two-level menu

With thirty activities, the home is a **two-level menu** rather than one long scroll:

1. **Topics** — seven cards, each with its icon, name, a one-line description and the number of
   activities. The newest group spans the full row, so the odd count stays tidy.
2. **Activities** — tapping a topic shows only its tiles, under the topic's name, with a
   `‹ All topics` button. The topic lives in the URL (`index.html#science`), so the browser's
   Back button, a refresh and a shared link all land in the same place.

Every activity's `‹ Menu` button carries its own topic hash, so leaving an activity returns to
the topic you came from, not the very top. The sticker book stays on the topics screen, where
it is the reward you come back to.

### Phone and tablet layout

The layout is tuned for a phone held in portrait (Xiaomi 14, 393 × 852 CSS px) and for an iPad
in either orientation (768 × 1024 and 1024 × 768).

- **Home** — level 1 is seven topic cards: two columns on a phone, three on a tablet, with the
  newest topic spanning the row. Level 2 is the activity grid: the three-per-row groups stay
  three across; the four-lesson groups are 2 × 2 on a phone and a row of four on a tablet.
- **Activities on a phone** — a side-by-side split left the illustration about 170 px wide and
  the control text under 5 px, so portrait phones stack instead: the scene gets the full width
  on top, and the control panel becomes a full-width sheet at the bottom. The sheet **hugs the
  active pane**: a short step list gets a short sheet, while a dense heater or breathing panel
  grows to at most half the screen and scrolls. The controls scale **up** with the screen (about
  1.22×) instead of shrinking to fit the 300 × 640 design. Note and meter cards no longer
  stretch to fill the card, so there is no empty white block below the text or gauges; the
  sheet is only as tall as the work it contains. The ◧ button still folds the sheet away.
- **Activities on an iPad** — the two-column layout stays: the scene keeps about half the
  screen, the panel scales to about 1.1–1.2×, and the top-bar buttons grow to 40 px tall. The
  control card is fitted to its own controls and centred in the panel, so the old full-height
  white fact box is gone.
- **Landscape phones and the train** keep their own layouts; the train uses a bottom cab bar
  instead of a design panel, so it is left out of the stacking rule.

The shared rules live in `www/shared/ui.css` (phone sheet, fitted card and top bar) and
`www/shared/shell.js` (`isStacked()`, `stackPanel()` and the content fit); each activity's
`js/main.js` only has to ask the shell for the stacked placement.

### Safety, language and accessibility

- **Safety first:** *Inside the Aircon* marks the coil, drain and outdoor-unit steps with a **👤**
  badge and a grown-up warning; *Breakfast Sandwich* shows a stove warning when the pan appears;
  *Water at Home* shows a scald warning beside the hot-water controls; *Breathing & Blood* warns
  against forcing breath-holds. Each help card repeats the guidance.
- **Chinese throughout:** the locked Chinese build has Chinese page titles and descriptions, the
  sandwich scene labels are translated, and the pre-render speech bubbles no longer flash English.
- **Metadata:** every page has a page-specific `<meta name="description">` and a localized
  `<title>`; the web app manifest is Chinese too.
- **Accessible names:** the shared icon toolbar and the air-conditioning remote's power, fan, lock,
  light, reset, temperature and swing keys have bilingual `aria-label`s.

### The sticker book

Under the tiles is the one thing that ties the thirty activities together: a collection that
every activity writes to. Thirty-five stickers, earned by doing the thing the activity is about —
`shared/progress.js` holds the catalogue and the storage, and each activity awards its own from
its render loop.

| Activity | Stickers | Earned by |
|---|---|---|
| ❄ Play Aircond | 3 | each of the three missions, with its star rating |
| 🚆 Train Driving | 3 | each of the three timetabled runs, with its rating |
| 🍎 Food Eating | 1 | seeing a meal all the way through |
| 🫁 Breathing & Blood | 1 | three full rounds with the breathing pacer |
| 🌀 Inside the Aircon | 1 | finishing the whole wash |
| 🚽 Toilet | 1 | seeing a flush right through |
| 🚰 Indah Water | 1 | following it to the last stage of the works |
| 🍳 Kitchen Hood | 1 | pulling every bit of the smoke out |
| 🧺 Laundry Day | 2 | a clean wash, and a dry that stops in time, each with its star rating |
| 🌱 From Seed to Tree | 1 | growing a seed all the way to seed dispersal, with its star rating |
| 🥪 Breakfast Sandwich | 1 | cooking a balanced sandwich, with its star rating |
| 💧 Water at Home | 1 | following the supply journey and drawing hot water, with its star rating |
| 🌍 Water Cycle | 1 | following one drop through the whole cycle |
| 🌦️ Weather Station | 1 | forecasting all three weather rounds, with its star rating |
| ⚙️ How a Car Engine Works | 1 | watching all four strokes of the engine |
| ⚡ Electricity | 1 | reading every step of the circuit |
| 🧲 Magnets | 1 | reaching the compass at the end of the lesson |
| 💡 Light & Shadow | 1 | following light through shadow, reflection and refraction |
| 🐻 Sun Bear | 1 | reaching the conservation step at the end of the lesson |
| 🔊 Speaker | 1 | following the signal to the cone and the sound |
| 💻 Computer | 1 | following data from input to output |
| ⚡ Power Journey | 1 | following electricity from the plant to the socket |
| ⚠️ Electrical Safety | 1 | reading all six safety rules |
| ⚙️ Electric Motor | 1 | seeing a spin, a load, a stall and the heat warning |
| 📷 Photo Camera | 1 | all three photo challenges |
| 🧪 Test & Check Panel | 1 | no-load 0 W, a load, standby and an RCD trip |
| 🧰 Electromagnet Kit Lab | 1 | all eight kit experiments |
| 👂 How the Ear Hears | 1 | follow the sound from pinna to brain |
| 👁️ How the Eye Sees | 1 | follow the light from cornea to brain |
| 🌈 Rainbow & Light | 1 | follow white light through a prism and raindrop |

An earned sticker takes its activity's accent colour and shows the stars; the rest sit dimmed
behind a dashed outline, so there is always something obviously missing. Awards only ever go
up, so earning one twice cannot lose it, and a corrupt saved book reads as empty rather than
taking the home screen down.

---

## 1 · ❄ Play Aircond

A Haier-style remote on the left, a boy and his air-con on the right.

Press a key and three things react at once: the **remote LCD**, the **air-con** (vanes open,
air blows, display changes, beep), and the **boy's face and body**.

| Room feels like | The boy |
|---|---|
| < 15.5 °C | 🥶 X-eyes, shivering hard, blanket, breath puffs |
| 15.5 – 20.5 °C | Droopy eyes, wavy mouth, shivers |
| 20.5 – 27 °C | 😊 Big smile — "Ahh, just right~" |
| 27 – 29.5 °C | 🥵 Panting, sweating, heat haze |
| > 29.5 °C | 🔥 Drenched, red cheeks |

It runs on a real (if simplified) thermal model: the room leaks toward the outdoor temperature,
the compressor has a rate ceiling, humidity shifts the feels-like temperature, a cooler only
cools, and an open door beats the air-con entirely.

**Free Play** to explore. **Challenge** for score, combo and random weather events
(heatwave, cold snap, open door, humidity surge). **Mission** for a goal and a clock.

### Missions — a goal, a clock and a price

The mode button cycles Free Play → Challenge → Mission. A mission hands you an
uncomfortable room and a countdown, and pays up to three stars:

| ★ | For |
|---|---|
| ★ | finishing with him comfortable |
| ★★ | never letting him slip back out once you had him there |
| ★★★ | doing it without spending more than the power budget |

The second and third stars pull against each other, which is the whole point: the
easy way to never slip is to run the machine hard, and that is exactly what costs
you the power star. Measured, from the tests:

| Mission | Setting | Outcome | Power used |
|---|---|---|---|
| Spring afternoon (90 s, 29° outside) | 20 °C, HIGH, TURBO | win, **2 ★** | 51 Wh |
| | 25 °C, AUTO | win, **3 ★** | 20 Wh |
| | 26 °C, LOW, ECO | win, **3 ★** | 12 Wh |
| | 30 °C | **lose** — "set warmer than the comfort zone" | 17 Wh |
| Summer heatwave (120 s, 38° outside) | 20 °C, HIGH, TURBO | win, **2 ★** | 77 Wh |
| | 24 °C, AUTO | win, **3 ★** | 36 Wh |
| | 26 °C, LOW, ECO | **lose** — too gentle to make it in time | 19 Wh |
| Winter cold snap (120 s, 11° outside) | 24 °C, HEAT | win, **3 ★** | 38 Wh |
| | 30 °C, HEAT, TURBO | **lose** — overshoots, then he is too cold | 85 Wh |

When a mission ends the card says *which* star you missed and why, in one line —
"you left it set warmer than the comfort zone", "he slipped back out of the
comfort zone", "the door was still open the whole time". The retry button
restarts the same mission with a fresh clock, and the next one only unlocks once
you have passed it.

**Challenge points come from results, not from waiting** — you score when you actually *rescue*
him back into the comfort zone:

| What happened | Points |
|---|---|
| Brought him back into the comfort zone | **+100 × combo** |
| Kept him comfortable right through a weather event | **+150** |
| Recovered again without losing him in between | combo climbs to **×5** |
| Let him slip out | combo resets to ×1 |

Set 25 °C and walk away and you score **nothing** (there is a test that asserts exactly this).
The **door** is the one event you can do something about: it swings open in the room with a
**TAP TO CLOSE** hint — tap it before all the cold air escapes.

Keys: Power · COOL (mode key — steps through COOL → DRY → HEAT → FAN) · DRY · TEMP ▲▼ ·
SWING ◀▶ · fan speed · TURBO/QUIET · SELF CLEAN · HEALTH · SLEEP · EXTRA (ECO) ·
TIME ON/OFF + CONFIRM · LOCK · LIGHT · RESET.

---

## 2 · 🍎 Food Eating

Follow a bite of food from the plate all the way out. The boy is drawn see-through so the whole
digestive tract is visible, and the food actually travels along it.

**Six stops**

| # | Stop | What happens |
|---|---|---|
| 1 | 👄 **Mouth** | Pick a food, tap `CHEW`. Teeth grind it, saliva starts on starch. |
| 2 | ⬇ **Oesophagus** | Peristalsis squeezes it down in ~7 s (no gravity needed). |
| 3 | 🫧 **Stomach** | Tap `CHURN`. Acid + pepsin + churning turn it into chyme. |
| 4 | 🌀 **Small intestine** | ~6 m of villi absorb nutrients into the blood → your energy meter fills. |
| 5 | 💧 **Large intestine** | Water is absorbed, waste forms, gut bacteria make vitamin K. |
| 6 | 🚽 **Out** | `GO TO TOILET`. The belly empties and he feels great. |

**It teaches real habits, not just names**

* Chew a lot → nutrients absorb well and the boy is happy.
* Swallow a lump → the stomach can't break it down, absorption drops, **tummy ache**.
* Eat and eat → the belly fills up and the boy says he is too full (and eventually aches).
* `WATCH` plays the whole journey by itself if you would rather just watch.

A **science fact card** under the body changes at every stop, with the real numbers:
amylase, pH 1.5–3.5, ~6 m of small intestine, ~30 m² of villi, 12–48 h transit time.
There is a **4-question quiz** in the top bar for afterwards.

**After a meal — can I run?** A button on the control deck opens a short lesson with a blood-flow
diagram and a pain meter. The child chooses **sit and rest** or **run right away**; the lesson
shows the blood moving from the gut to the muscles, digestion slowing, and the pain signal rising
if they keep running. The rule at the end: rest first, wait 1–2 hours before hard exercise, and a
gentle walk is fine. It reads itself and highlights the words.

---

## 3 · 🚆 Train Driving

A full-width view out of the cab, with a driver's desk along the bottom.

**It drives like a train, not a car.** The consist weighs what a train weighs: notch the
throttle up to 100 % and it still takes 10 seconds to reach 37 km/h, half a minute to reach
90. Take the power off and it coasts for kilometres. Brakes act on the whole train — from
60 km/h you need **165 metres** to stop, so you have to plan your stop long before you see
the platform.

<img width="1" height="1" alt="" src="data:,">

| Control | What it does |
|---|---|
| **THROTTLE ▲▼** | OFF · 25 · 50 · 75 · 100 %. Power also releases the brake. |
| **BRAKE ▲▼** | RELEASE · step 1 · 2 · 3 · FULL · **EMERGENCY**. Applying brake cuts the power. |
| **HORN** | Two-tone horn (a low chord, like the real thing) |
| **BELL** | Rings the bell |
| **LIGHTS** | Headlights off / dim / bright — the beam lights up the track ahead |
| **DOORS** | Only open at a platform, and the train **will not move until they are shut** |

**The level crossing.** Every crossing warns you from 300 m out: the two red lights begin
flashing alternately, the red-and-white barrier swings down across the road, the bell rings
`ding, ding, ding`, and a car pulls up and waits. Drive past and the barrier lifts again and
the car moves off. (You hear the bell before you see the crossing — just like real life.)

**Your job** — stop with the front of the train on the **white mark** in each platform:

| How close | Points |
|---|---|
| within 6 m | 150 — *Perfect stop!* |
| within 16 m | 80 — *Good stop.* |
| on the platform | 30 — *A bit far from the mark* |
| rolled past | **−60** and it counts as a missed stop |

**Level crossings now have teeth.** They always had the barrier, the flashing lights and the
`ding ding ding`, but going through flat out had no consequence. Now:

| Through the crossing at | Result |
|---|---|
| over **80 km/h** | **−60** and *"Too fast over the crossing!"* |
| under 80 km/h | **+40** and *"Nice — eased off over the crossing."* |

So you have to plan your braking for the crossing as well as the platform, which is exactly
what a real driver does. The little track under the station sign shows your progress between the
two stations.

### Missions — a timetable, a clock and three stars

The mode button in the top bar switches between **Free drive** and a timetabled run. A mission
hands you a clock and a number of stations to serve, and pays up to three stars:

| ★ | For |
|---|---|
| ★ | getting everyone to the stations before the clock runs out |
| ★★ | never running past a platform |
| ★★★ | and never taking a level crossing over the limit |

The second and third stars pull against the clock: the only way to miss the deadline is to drive
slowly, and the only way to be rough is to drive fast. Measured, and asserted in the tests:

| Mission | Driver | Outcome | Time |
|---|---|---|---|
| Morning service (2 stops, 150 s) | careful, slows at crossings | win, **3 ★** | 107 s |
| | ignores the crossings | win, **2 ★** — one crossing over the limit | 108 s |
| The rush (3 stops, 190 s) | careful | win, **3 ★** | 184 s |
| | crawls at 12 m/s | **lose** — the clock ran out | 190 s |
| Night run (3 stops, 178 s) | careful | **lose** — 6 s too slow | 178 s |
| | brakes late, keeps to the limits | win, **3 ★** | 175 s |

When a run ends the card says which star you missed and why in one line — "you ran past a
platform", "you took a crossing too fast", "the clock ran out". Retry restarts the same run with
a fresh clock, and the next mission only opens once you have passed this one.

---

## 4 · 🫁 Breathing & Blood

A science lab you can poke. Choose an experiment on the left, watch the boy's insides on the
right — lungs, heart, and a blood circuit with cells that actually change colour.

**Think of it as a lab bench with five experiments.** Each one changes how much oxygen the
body is asking for, and everything else follows. These are the real numbers it settles at:

| Experiment | Heart rate | Breaths / min | Oxygen in blood | CO₂ |
|---|---|---|---|---|
| 😴 Sleep | 63 | 11 | 98.9 % | 38.9 |
| 🧘 Rest | 75 | 14 | 98.6 % | 39.0 |
| 🚶 Walk | 111 | 23 | 97.8 % | 39.1 |
| 🏃 Run | 167 | 38 | 96.6 % | 39.1 |
| 🏔️ High altitude | 142 | 47 | **87.7 %** | 37.8 |

Notice how **carbon dioxide barely moves** while the other numbers swing. That is the whole
point: CO₂ is what your body actually regulates, and breathing rate is the knob it turns.
At altitude there is less oxygen in every breath, so the heart and lungs have to work much
harder for a lower result.

**The two buttons are the experiments that go wrong on purpose**

- **TAKE A BREATH** — a deep breath. Watch oxygen climb.
- **HOLD BREATH** — stop breathing and watch it unwind:

| Held for | Oxygen | CO₂ | Urge to breathe |
|---|---|---|---|
| 5 s | 95.6 % | 43.0 | 0.04 |
| 10 s | 92.5 % | 47.1 | 0.39 |
| 15 s | 89.5 % | 51.2 | 0.75 |
| ~17 s | — | — | **your body forces a gasp** |

You cannot cheat it. Once the urge maxes out (or oxygen drops far enough) the body takes over
and gasps for you.

### 🫁 Guided breathing — actually breathe with it

A pacer circle expands and contracts over the boy while a countdown tells you what to do, and the
physiology responds for real. Measured after settling:

| Pattern | Breaths/min | Heart rate | CO₂ |
|---|---|---|---|
| Normal (your own) | 14 | 75 | 39.0 |
| **Box 4-4-4-4** | 4 | **69** | 47.2 |
| **Relax 4-7-8** | 3 | **66** | 49.3 |
| **Fast** | 30 | **93** | **37.4** |

That is real physiology, not decoration:

- Slow patterns **calm the heart** — 4-7-8 drops it to 66 bpm.
- Slow breathing **retains carbon dioxide**, so CO₂ climbs to 49.
- Fast breathing **blows CO₂ off** — it falls to 37.4, which is exactly why you feel light-headed
  when you hyperventilate. The note card says so while you do it.

A soft breath sound plays on each phase change, and tapping **NORMAL** hands the breathing back
to you.

### Look closer, and check what you learned

- **Tap the alveoli bubble** for a magnified gas-exchange view: one alveolus with a capillary
  wrapped round it, red blood cells flowing past, and O₂ and CO₂ crossing the membrane in the
  right directions — read aloud.
- **Quiz** in the top bar: four questions on what breathing does, what carries oxygen, what fast
  breathing does to CO₂, and why your heart speeds up when you run.

**What to watch on the boy**

- **Lungs** inflate and deflate with every breath, and air particles move down the windpipe as you inhale and back up as you exhale.
- **Heart** beats in a proper *lub-dub*, and its rate follows the experiment.
- **Blood cells** flow in a single loop — heart → lungs → heart → body → heart. They are **blue** carrying CO₂ and turn **red** in the lungs. When oxygen is low they come out a duller red.
- **The gas exchange bubble** up in the corner: the alveolus with a capillary wrapped round it, O₂ molecules crossing in and CO₂ crossing out, ticking over faster the harder you breathe.

---

## 5 · ❄ Inside the Aircon

Two things in one: **how an air-con works**, and **how to wash it**.

### How it works — the refrigerant loop

The scene is a cutaway of a split unit: the indoor half on the wall, the outdoor half below,
joined by the two pipes. A stream of refrigerant dots travels one closed loop through all four
parts, and **the tube changes colour as it goes**:

| Where | What happens | Colour |
|---|---|---|
| **Compressor** | squeezes the gas → very hot, high pressure | 🔴 red |
| **Condenser** (outdoor) | gives its heat to the outside air and turns back into a liquid | 🟠 amber |
| **Expansion valve** | a tiny hole — the pressure crashes and it goes cold | 🔵 cyan |
| **Evaporator** (indoor) | soaks heat out of your room air and boils back to a gas | 🔵 blue |

Verified behaviour: the room cools 30 → 27.4 °C, the evaporator settles at **5.6 °C** and the
condenser at **53 °C**, the highlight walks the four parts on a loop, and switching the power
off stops the refrigerant dead and the evaporator drifts back to room temperature. Lowering the
set point from 26 °C to 20 °C drops the coil from 6.5 °C to 3.8 °C.

Red dots show **warm room air** being pulled in over the top, blue dots show **cool air** coming
out of the vent, and hot dots fly out of the outdoor fan. The panel spells out the one big idea:

> **An air conditioner does not make cold. It moves heat from inside your room to outside.**

### How to wash it — an eight-step service

Tap through, or use NEXT/BACK, and the drawing animates each step:

| # | Step | What you see |
|---|---|---|
| 1 | Switch off and **unplug** | a red power-off badge pulses, the unit greys out |
| 2 | **Open the front panel** | the panel lifts and tilts |
| 3 | **Take out the filters** | both mesh filters slide out and park below |
| 4 | **Wash the filters** | water runs over them and foam bubbles up |
| 5 | **Clean the coil** | a spray can, foam on the fins, a brush scrubbing |
| 6 | **Clear the drain** | water flushes the pan and runs down the pipe |
| 7 | **Clean the outdoor unit** | a brush scrubs the outdoor coil, water rinses it |
| 8 | **Put it back and dry** | filters slide home, the panel closes |

Each step carries a real servicing note — *never work on a live unit, the fan can start by
itself*, *rinse from the clean side so dust falls out, and dry in the shade because sun cracks
the mesh*, *sharp fins, go gently*, *run FAN only for two hours to dry the inside*.

---

## 6 · 🚽 Toilet

What a flush actually does, drawn as a real gravity-flush toilet in section.

Press **PRESS TO FLUSH** and watch the whole sequence run — verified timing:

| Time | What happens | Cistern | Bowl | S-bend |
|---|---|---|---|---|
| 0.0 s | the button lifts the flapper | 1.00 | 0.75 | 0.35 |
| 1.4 s | water rushes in | 0.46 | 0.93 | 0.94 |
| 2.1 s | **the siphon catches** | 0.19 | 0.95 | 0.99 |
| 2.8 s | everything is pulled away | 0.00 | 0.65 | 0.99 |
| 4.9 s | the cistern refills | 1.00 | 0.74 | 0.68 |
| 6.2 s | settled, water seal restored | 1.00 | 0.75 | 0.68 |

The float rides down with the water and shuts the fill valve when the cistern is full. Six steps
you can also tap through by hand, with the mechanism highlighted as you go: the button and chain,
then the cistern, flapper, overflow tube and rim jets, then the siphon jet and the weir, then the
water seal, the drain, and finally the fill valve and float topping the seal back up.

The point of the whole thing: **a toilet does not push the waste away — it siphons it.** Once
the S-bend is completely full, the falling water drags the rest after it. And the little pool
left behind, the **water seal**, is what stops sewer smells coming back up.

---

## 7 · 🚰 Indah Water

Where the water goes next, following the connected-sewerage diagram. Two tabs.

### How it gets there — six steps

| # | Stage | What happens |
|---|---|---|
| 1 | **Sewage leaves the house** | toilet, kitchen, shower and washing machine all start here |
| 2 | **Private sewerage pipeline** | runs downhill to your boundary; the owner's responsibility |
| 3 | **Inspection chamber** | the little box with a lid you open to see if it is still flowing |
| 4 | **The manhole at the boundary** | the handover point — after this, it belongs to Indah Water |
| 5 | **Public sewerage pipeline** | collects the whole neighbourhood, under the road |
| 6 | **Raw sewage reaches the plant** | still dirty; pumped up into the works |

The one idea worth keeping: **sewage moves by gravity, not pressure.** Every pipe is laid on a
slight fall, which is why the treatment plant is usually the lowest ground around.

### How it gets cleaned — the extended-aeration works

The six stages labelled down the middle of the diagram, in order:

| # | Stage | What happens |
|---|---|---|
| 1 | **Pumping station** | the incoming pipe is lower than the tanks, so it is pumped up |
| 2 | **Screens, grit removal, flow measurement** | a comb catches wipes and plastic; sand settles; a flume measures the flow |
| 3 | **Aeration tank** | air is pumped in and **billions of bacteria eat the waste** |
| 4 | **Flow distribution** | a dividing weir splits the flow evenly between the clarifiers |
| 5 | **Final clarifier** | the bacteria clump and settle; some go back to work as return sludge |
| 6 | **Effluent to drain** | clear enough to meet the standard, and out to the river |

The aeration tank has a working **BLOWERS ON / OFF** button — switch it off and the bubbles stop,
the tank greys out and the return-sludge pump stops with it. That is exactly what happens when a
blower fails, and it makes the point better than any caption: the cleaning is done by **living
bacteria**, and people only build the tanks and pump air for them.

---

## 8 · 🍳 Kitchen Hood

Turn the fan up and watch where the smoke goes. Everything reacts live, and I measured it:

| Setting | Airflow | Smoke caught | Noise |
|---|---|---|---|
| Fan 2, clean | 600 m³/h | 97 % | 55 dB |
| Fan 3, clean | 830 m³/h | 100 % | 63 dB |
| **Fan off** | 0 m³/h | 0 % — it all escapes into the room | 0 dB |
| **Fan 3, dirty filter** | 457 m³/h | 74 % — it leaks again | **67 dB** |
| Fan 3, recirculating | 730 m³/h | 100 % | 63 dB |

That dirty-filter row is the whole point of the activity, and it is the reason the button says
**WASH IT** when you press it: a clogged grease filter cuts the airflow nearly in half, makes
the hood *louder* and lets the smoke back into the kitchen. Exactly what happens in a real one.

**The journey of the smoke** — the note card under the scene changes to match whatever you are
doing:

1. Cooking makes hot smoke, and hot air rises by itself.
2. The **blower** — a wheel of curved blades — throws air outwards, which leaves a low pressure
   in the middle, so air keeps rushing in. That is what makes the suction.
3. Higher pressure in the room pushes the smoke up into the hood.
4. The **grease filter** catches the oil droplets; the oil runs down and drips into the oil cup,
   which visibly fills up while you are frying.
5. Clean air goes up the **duct** and outside, pushing the **damper** open on the way. Switch the
   fan off and the damper falls shut, so smells, draughts and birds stay outside.

Switching to **RECIRCULATE** hides the duct and opens a front grille instead: grease is caught,
but the air comes straight back into the room, smell and all.

The one thing it teaches that most adults get wrong: **a hood does not suck like a vacuum
cleaner.** It makes a low-pressure area, and the air around it pushes the smoke up.

---

## 9 · 🧺 Laundry Day

Two machines, one basket of clothes, and the same trade-offs a real laundry has. Pick a load,
wash it, then carry the wet clothes over to the dryer — the spin you chose is what decides how
much work the dryer has left.

### The washing machine

The load changes what "careful" means:

| Load | How dirty | No hotter than | No faster than | Dryer heat |
|---|---|---|---|---|
| 🧺 Everyday | 55 % | 60 °C | 1400 rpm | high is fine |
| 👕 Gym kit | 85 % | 40 °C | 1000 rpm | **low only** |
| 🧶 Woollens | 35 % | 30 °C | 600 rpm | **low only** |

Four programmes (wash phase: Quick 8 s · Cotton 14 s · Heavy 18 s · Wool 10 s), four water
temperatures, three spin speeds and three detergent doses. Warm water and more detergent clean better, but
hot water shrinks wool, a fast spin roughs up delicates, and too much detergent makes foam that
traps dirt and leaves residue.

Measured, and asserted in the tests:

| Load | Settings | Clean | Care | Outcome |
|---|---|---|---|---|
| 🧺 Everyday | Cotton · 40 °C · 1000 · normal | **89 %** | 1.00 | **3 ★** — clean, safe, thrifty |
| 🧺 Everyday | Quick · 20 °C · 600 · low | 64 % | 1.00 | **0 ★** — still dirty |
| 🧺 Everyday | Heavy · 40 °C · 1000 · normal | 94 % | 1.00 | **2 ★** — clean, but over the water/power budget |
| 👕 Gym kit | Heavy · 40 °C · 1000 · normal | **91 %** | 1.00 | **3 ★** — the heavy programme is the right one |
| 👕 Gym kit | Cotton · 40 °C · 1000 · normal | 84 % | 1.00 | **0 ★** — not quite clean |
| 🧶 Woollens | Wool · 30 °C · 600 · normal | **87 %** | 1.00 | **3 ★** — gentle and clean |
| 🧶 Woollens | Cotton · 60 °C · 1400 · high | 100 % | **0.00** | **0 ★** — ruined: too hot, too fast |

### The drying machine

A dryer does not simply heat clothes: it tumbles them through warm air so the water can
evaporate. **SENSOR** stops when the moisture reaches the dryness you asked for; **TIMED** keeps
heating until the clock runs out, even after the clothes are bone dry.

| Load | Dryer setting | Moisture at the end | Care | Outcome |
|---|---|---|---|---|
| 🧺 Everyday | SENSOR · cupboard · high | **6 %** | 1.00 | **3 ★** — dry, not over-dried |
| 🧺 Everyday | TIMED · high (from 32 % after a fast spin) | **0 %** | 0.80 | **1 ★** — scorched and creased |
| 🧶 Woollens | SENSOR · cupboard · **low** | **6 %** | 1.00 | **3 ★** — warm air, no damage |
| 🧶 Woollens | SENSOR · cupboard · **high** | 6 % | **0.70** | **1 ★** — the heat damaged the wool |

The two machines are connected: a **600 rpm** spin leaves the clothes at 75 % water, a **1400 rpm**
spin leaves them at 32 %. The faster spin saves dryer time, but it may cost a wash star if the
load is wool or gym kit. That trade-off — not a timer — is the game.

The scene shows both machines at once: the drum turns, water rises and drains, foam builds when
you over-dose the detergent, dirt specks disappear as the wash works, and the dryer's steam dies
away as the moisture falls.

---

## 10 · 🌱 From Seed to Tree

A seed in a soil cutaway, the sun overhead, a watering can, and eight phases to keep alive.

**It is a watering game, not a waiting game.** The tree only grows while the soil moisture is
inside the green band and the light matches what that phase needs. Get it wrong and growth
stops and health falls; leave it wrong and the seedling wilts. Every phase changes the target,
so you cannot leave one setting on and walk away.

| # | Phase | What happens | Soil band | Light |
|---|---|---|---|---|
| 1 | 🌰 **Seed** | A tiny plant in a tough coat, carrying its own food, waiting for warmth and moisture | 45–85 % | Shade |
| 2 | 🌱 **Germination** | Water softens the coat; the root pushes down, the shoot pushes up — still on stored food | 55–90 % | Shade |
| 3 | 🌿 **Seedling** | The first true leaves open and photosynthesis begins; the roots are still shallow | 40–75 % | Part sun |
| 4 | 🌳 **Sapling** | A woody stem, taller than a seedling; roots spread wider than the branches above | 35–70 % | Full sun |
| 5 | 🌳 **Young tree** | A new ring of wood under the bark every year; the canopy catches light and the roots store food | 30–65 % | Full sun |
| 6 | 🌸 **Flowering** | Flowers are the reproductive organs; pollen travels between them by insects, birds or wind | 35–70 % | Full sun |
| 7 | 🍎 **Fruiting** | The ovary swells into fruit, protecting the seeds and attracting animals with its ripe colour | 30–65 % | Full sun |
| 8 | 🌰 **Dispersal** | Seeds leave by wind, water or animals; a few land somewhere with light, water and space | 20–55 % | Full sun |

The measured behaviour, asserted in the tests:

| Run | Outcome | Health |
|---|---|---|
| Careful gardener, all eight phases | **3 ★** — seed dispersal reached, no stress | 100 % |
| One three-second wrong-light patch at the seedling phase | **2 ★** — survives, but the calm-hand star is gone | min 83 % |
| Full sun on the seed and keep it watered | **wilts** — *"It could not cope with the light at that phase."* | 0 % |
| Water every frame | **wilts** — *"Its roots drowned in too much water."* | 0 % |
| Never water after planting | **wilts** — *"It dried out and wilted before it could make seeds."* | 0 % |

### The three stars

| ★ | For |
|---|---|
| ★ | reaching the seed-dispersal phase |
| ★★ | finishing with health never below **75 %** |
| ★★★ | finishing with health never below **95 %** — a calm, steady hand throughout |

The stars watch the **lowest** health the tree ever reached, not just the final number, so a
brief slip cannot be healed back into a perfect score. The water count sits in the top bar as a
visible record of how often you watered; full sun dries the soil about four times as fast as
shade, so the marker on the moisture bar is the thing to watch.

### What the scene shows

The seed sits under the soil; the root and shoot appear at germination; two cotyledons open at
the seedling phase; the sapling grows a woody stem; the young tree gets a canopy and a wider root
system; flowers appear; the flowers become fruit; and at dispersal the fruit opens and seeds
drift away on the wind while a new sprout starts at the edge of the soil. A shade net drops over
the tree in shade, the sun dims, the soil turns blue as it gets wetter, the watering can pours
when you press **WATER**, and the leaves lose their colour when the tree is in trouble.

---

## 11 · 🥪 Breakfast Sandwich

A build-and-cook game in two parts: choose the ingredients, then stop the egg at the right
moment in the pan.

| Choice | Options |
|---|---|
| Bread | white, wholemeal, sourdough |
| Spread | butter, avocado, mayo, none |
| Filling | fried egg, cheese, egg + cheese, bacon |
| Vegetable | tomato, spinach, lettuce, none |

The pan is a timing game. Low heat takes about **8 s**, medium **5 s** and high **3.5 s**. Stop
while the marker is in the green band; too early leaves the egg runny, too late makes it rubbery
and browned. The spread is not just flavour: it is a water barrier, so a wet tomato does not soak
into the bread.

Measured, and asserted in the tests:

| Choices | Cook | Balance | Outcome |
|---|---|---|---|
| White · butter · egg · tomato | 5 s | 55 % | **2 ★** — cooked well, but not a balanced breakfast |
| Wholemeal · avocado · egg + cheese · spinach | 5 s | **100 %** | **3 ★** — balanced and cooked just right |
| White · butter · egg · tomato | 2.5 s | 55 % | **1 ★** — *"the egg is still runny"* |
| White · butter · egg · tomato | 9 s | 55 % | **1 ★** — *"rubbery and browned"* |
| White · **none** · egg · tomato | 5 s | 49 % | **2 ★** — *"the tomato juice soaked straight in"* |

The facts on the card explain the real reasons: wholemeal gives fibre, avocado gives healthy fat,
egg gives protein, vegetables add vitamins and fibre, and eggs should be cooked until white and
yolk are set, especially for young children and older people.

---

## 12 · 💧 Water at Home

Two connected halves: the **supply journey** from the river to the tap, and the **hot-water
cylinder** in the house.

### From the river to the tap

| # | Stage | What happens |
|---|---|---|
| 1 | **Source** | river, reservoir or groundwater; protecting it is the first defence |
| 2 | **Screens & grit** | bars catch sticks and plastic; sand and grit settle out |
| 3 | **Coagulation** | alum or an iron salt makes fine dirt clump into flocs |
| 4 | **Sedimentation** | the flocs settle as sludge and clear water flows off the top |
| 5 | **Filtration** | sand, gravel and sometimes activated carbon trap what is left |
| 6 | **Disinfection** | chlorine, chloramine, ozone or UV kills germs; a chlorine residual protects the pipes |
| 7 | **Storage & pumps** | a covered tank or service reservoir keeps the mains under pressure |
| 8 | **Meter & tap** | the meter measures use and the supply pipe delivers it to the tap |

### The hot-water cylinder

Cold water enters through a **dip tube** and is delivered near the bottom, so it does not mix
with the hot water at the top. The cylinder has **two elements and two thermostats**:

- The **upper element** heats the top first. Hot water rises, so the upper thermostat is
  satisfied first and switches it off.
- The **lower element** then takes over and heats the bottom. The panel shows both temperatures
  and two element LEDs, so you can see which one is working.
- The **anode rod** sacrifices itself to protect the steel tank, the **T&P relief valve** lets
  expanding water escape, and the **insulation** slows standing losses.
- A **mixing valve** blends the hot water down to about **50 °C** at the tap.

Storing at **60 °C or above** kills Legionella bacteria. The game uses a time-lapse:
**1.6 °C per second**, so 20 → 60 °C takes about 25 seconds.

Measured:

| Run | Result |
|---|---|
| Complete the eight supply steps, heat to 60 °C, draw | **3 ★** — safe storage, hot water; upper element off, lower element still warming the bottom at about 31 °C |
| Complete the supply, set 40 °C, heat and draw | **2 ★** — comfortable, but below the Legionella-safe storage temperature |
| Press **DRAW** at 20 °C | refused — *cold* |

The cutaway labels the dip tube, upper and lower elements, upper and lower thermostats, anode
rod, T&P valve, insulation, drain valve, mixing valve and tap.

The scene shows the works, the water tower, the house and tap; on the heater tab it shows the
tank cutaway, the growing hot layer, the element glow, the thermostat, the anode, the mixing
valve and the draw.

---

## 13 · 🌍 Water Cycle

Follow one drop around a closed loop. The sun drives it upward and gravity brings it back.

| # | Stage | What happens |
|---|---|---|
| 1 | **Evaporation** | the sun lifts water from the sea and lakes; about 86 % of global evaporation is from the oceans |
| 2 | **Transpiration** | plants release water vapour through stomata; together with evaporation this is evapotranspiration |
| 3 | **Condensation** | vapour cools and condenses on dust and sea salt; clouds are tiny droplets, not vapour |
| 4 | **Precipitation** | droplets grow and fall as rain, snow or hail; a raindrop is about 0.5–5 mm |
| 5 | **Runoff** | water flows over the ground into streams; plants and soil slow it and help it soak in |
| 6 | **River** | streams join and carry water and soil downhill; a river gauge measures level and flow |
| 7 | **Lake & groundwater** | water is stored in lakes or aquifers, sometimes for years |
| 8 | **Back to the sea** | the river reaches the sea and the sun lifts it again |

The droplet travels along the whole loop, the current part glows, rain only appears at the
precipitation stage, and **WATCH** advances automatically every four seconds. The cycle has no
start or end — the same water has been going round for billions of years.

---

## 14 · 🌦️ Weather Station

Read the instruments, then make a forecast. The sky stays neutral until you submit, so the
answer has to come from the measurements.

| Instrument | What it measures | How to read it |
|---|---|---|
| **Barometer** | air pressure | high and rising → fair; low and falling → cloud and rain |
| **Hygrometer** | humidity | closer to 100 % → more likely cloud and rain |
| **Anemometer** | wind speed | strengthening wind often means a front is arriving |
| **Wind vane** | wind direction | shows where the wind is coming from |
| **Rain gauge** | rainfall | millimetres; 1 mm is one litre per square metre |
| **Thermometer** | temperature | warm air holds more water vapour |
| **Sunshine recorder** | hours of sun | bright, high-pressure days have more sun |
| **River gauge** | river level | rises after rain, often lagging behind it |

**Every instrument explains itself.** Tap a reading in the panel — or the instrument itself in the
picture — to open a card with three sections: *what it measures*, *how it works*, and *how to read
it*. The panel's **HOW EVERY INSTRUMENT WORKS** link opens the full list of eight, and each card
has a **Read aloud** button. The thermometer and wind vane are reached by tapping them in the
scene or through that list. The pressure reading carries a **↗ / ↘ trend arrow** — the barometer
card explains why the trend matters more than the number itself.

The three rounds and their readings:

| Round | Pressure | Humidity | Wind | Rain | River | Sun | Forecast |
|---|---|---|---|---|---|---|---|
| 1 | **1024 rising** | 48 % | 8 km/h NW | 0 mm | 1.1 m | 8 h | **FAIR** |
| 2 | **1006 falling** | 78 % | 22 km/h SW | 5 mm | 1.6 m | 2 h | **RAIN** |
| 3 | **993 falling** | 92 % | 48 km/h W | 22 mm | 2.7 m | 0.5 h | **STORM** |

Three correct forecasts earn **3 ★**, two earn **2 ★**, and any run that finishes gets at least
**1 ★**. After each guess the scene changes to the real weather — sun, rain or a storm with
wind lines — and the card explains why. The test plays all three correctly for 3 ★ and also
checks that guessing *fair* every time scores exactly one.

---

## 15 · ⚙️ How a Car Engine Works

A cutaway of one cylinder, animated through the four-stroke cycle.

| # | Stroke | Piston | Valves | What happens |
|---|---|---|---|---|
| 1 | **Intake** | down | intake open | air and fuel are drawn into the cylinder |
| 2 | **Compression** | up | both closed | the mixture is squeezed to about one tenth of its volume and heats up |
| 3 | **Power** | down | both closed | the spark plug fires; burning gas pushes the piston down |
| 4 | **Exhaust** | up | exhaust open | the burnt gas is pushed out, and the cycle repeats |

The scene shows the piston, connecting rod, crankshaft, flywheel, intake and exhaust valves,
camshafts, spark plug and combustion chamber. The piston follows the crank angle, the rod turns
the up-and-down motion into rotation, the intake and exhaust valves lift at the right part of the
cycle, and the fuel/air and exhaust particles travel through their ports.

**It is deliberately slow.** At idle, a real engine completes this cycle about **13 times every
second**; the animation uses about **4 seconds per cycle** so you can see the strokes. The HUD
still shows the real rpm:

| Throttle | RPM | Animation |
|---|---|---|
| **IDLE** | 800 | 4.0 s per cycle |
| **CRUISE** | 2500 | 2.2 s per cycle |
| **REV** | 5000 | 1.1 s per cycle |

**RUN** animates the engine continuously; **STEP** freezes one stroke at a time with BACK and
NEXT, and tapping a stroke jumps to it. Only the power stroke makes power — the other three are
preparation and clean-up. Four strokes take **two turns of the crankshaft**, and the camshaft
turns at half the crank speed to open the valves at the right moment.

The test starts the engine at idle and checks that all four strokes are seen and the sticker is
earned, then walks through the same four strokes with STEP.

---

## The science lab — one step, one sentence, one read

The eight step-by-step lessons — four in Science lab, four in Electricity & machines — are built
on one shared engine: `www/shared/lesson.js` and `www/shared/lesson.css`. They are the first
activities where the teaching unit is a **step**, not a free-play simulation:

* every step is a numbered card in the rail, and tapping one jumps straight to it;
* the sentence for that step is **read aloud as the step opens** (Web Speech API), with the
  same word-by-word highlight as the rest of the app;
* the **key words** under the sentence are buttons — tap one and it is spoken with a one-line,
  kid-sized meaning;
* the picture changes with the step: a switch closes, iron things lift, a shadow grows;
* reaching the last step marks the lesson complete and pays its sticker.

Each activity supplies only its strings (`js/i18n.js`), its six steps with their words
(`js/state.js`), and the picture (`js/scene.js`). There is no `panel.js`: the engine owns the
card, the rail, the navigation and the reading. Adding a fourth lesson means adding those three
files, a stylesheet and a tile — not another copy of the step UI.

Because every step is one short sentence, the screen stays readable for a five-year-old: the
card carries the sentence and the three key words, while the `?` overlay carries the paragraphs.

---

## 16 · ⚡ Electricity

A six-step tour of one circuit. The switch closes and the current starts to move as the lesson
reaches it; the bulb lights at the bulb step.

| # | Step | The picture | What it teaches |
|---|---|---|---|
| 1 | **Battery** | a cell with + and − terminals | stored chemical energy pushes current out of the positive terminal |
| 2 | **Closed circuit** | the whole loop | current only flows round a complete loop; break it and it stops |
| 3 | **Switch** | the lever swings shut | a switch is a gate for the current |
| 4 | **Bulb** | the filament glows | electrical energy becomes light and heat |
| 5 | **Conductors** | a nail and a paperclip beside an eraser, wood and a plastic ruler | metals conduct; plastic, rubber and wood insulate |
| 6 | **Safety** | the wall socket and its lightning bolt | mains is 230 V — never poke anything into a socket |

The key words are 电池 · 正极和负极 · 电路 · 电流 · 开关 · 灯丝 · 电能 · 导体 · 绝缘体 ·
市电 · 安全用电.

---

## 17 · 🧲 Magnets

Six steps that build from "what does it pull?" to why a compass points north.

| # | Step | The picture | What it teaches |
|---|---|---|---|
| 1 | **What it attracts** | the nail and paperclip lift off the shelf | iron, steel and nickel are magnetic; plastic, wood and glass are not |
| 2 | **Two poles** | dashed rings on the two ends | a north and a south pole, strongest at the ends |
| 3 | **Attract and repel** | two pairs of magnets with arrows | like poles repel, opposite poles attract |
| 4 | **The field** | three field lines appear | the field is invisible; iron filings show its shape |
| 5 | **Magnetising** | a nail hangs from the magnet with paperclips on it | stroking iron makes a temporary magnet |
| 6 | **Compass and Earth** | a compass needle settles north | the needle is a tiny magnet; the Earth is a giant one |

The key words are 磁铁 · 铁 · 磁极 · 北极 · 吸引 · 排斥 · 磁场 · 铁屑 · 磁化 · 指南针 · 地磁.

---

## 18 · 💡 Light & Shadow

Six steps from "where does light come from?" to why a straw looks broken in water. The lamp
physically moves closer at step 4, and the tree's shadow grows with it.

| # | Step | The picture | What it teaches |
|---|---|---|---|
| 1 | **Sources** | the lamp's rays and an eye | the Sun, lamps and fireflies make their own light; light entering the eye is seeing |
| 2 | **Straight lines** | a beam through a slit in a card | light does not bend around corners |
| 3 | **The shadow** | a tree and the dark shape beside it | an opaque object blocks light and leaves a shadow |
| 4 | **Shadows change** | the lamp slides closer, the shadow grows | closer light = bigger shadow, always on the opposite side |
| 5 | **Reflection** | a mirror on a stand, incident and reflected beams | light bounces off a mirror; we see most objects by reflected light |
| 6 | **Refraction** | a straw in a glass of water, with a dashed "unbent" line | light changes direction entering water |

The key words are 光源 · 眼睛 · 直线传播 · 挡住 · 影子 · 不透明 · 方向 · 大小 · 反射 ·
镜子 · 折射 · 吸管.

---

## 19 · 🐻 Sun Bear

Six steps through the life of the sun bear — the smallest bear in the world, and one that
lives in Malaysia's rainforests.

| # | Step | The picture | What it teaches |
|---|---|---|---|
| 1 | **The smallest bear** | a measuring line beside the bear | about 1.2–1.5 m long and 25–65 kg; it lives in the Southeast Asian rainforest |
| 2 | **The sun patch** | the chest patch glows and grows rays | the orange patch looks like a sun, and every bear's patch is unique |
| 3 | **A very long tongue** | the tongue reaches a hive on the trunk | a 20–25 cm tongue licks honey out of tree holes |
| 4 | **Honey and insects** | a termite mound, ants, beetles and fruit appear | its diet, and why it is also called the honey bear |
| 5 | **A rainforest climber** | the bear climbs the trunk, claws showing | curved claws make it a strong climber that sleeps in trees |
| 6 | **Protecting the sun bear** | a shield with a paw and hearts | it is Vulnerable: protect forests and never buy wildlife products |

The key words are 马来熊 · 雨林 · 胸斑 · 指纹 · 舌头 · 蜂巢 · 白蚁 · 蜜熊 · 攀爬 · 爪子 ·
易危 · 保护.

The step-by-step lessons sit in two groups of four — **Science lab** and **Electricity & machines**.
Each group is a 2 × 2 panel on a phone and one row of four on a tablet, which keeps the menu's
three-per-row rhythm intact.

---

## 20 · 🔊 Speaker

A cutaway speaker: the signal and the coil on the left, the cone and the sound waves on the right.
The waveform swaps for each step, and the cone visibly moves.

| # | Step | The picture | What it teaches |
|---|---|---|---|
| 1 | **What a speaker does** | the whole cutaway | it turns an electrical signal into sound |
| 2 | **Magnet and coil** | the coil in the magnet gap | current makes the coil an electromagnet |
| 3 | **The signal moves it** | a changing waveform | reversing current reverses the push |
| 4 | **The cone moves air** | cone, air dots and waves | the cone pushes the air, and that is sound |
| 5 | **Frequency is pitch** | a dense waveform | faster vibration = higher pitch |
| 6 | **Amplitude is volume** | a tall waveform | bigger vibration = louder sound |

The key words are 扬声器 · 信号 · 线圈 · 磁铁 · 振膜 · 振动 · 频率 · 音高 · 振幅 · 音量.

---

## 21 · 💻 Computer

A laptop above and its inside below: keyboard, CPU, RAM, SSD, fan and battery, with a data path
that changes for each job.

| # | Step | The picture | What it teaches |
|---|---|---|---|
| 1 | **Input** | keyboard, mouse and a path into the board | information coming in |
| 2 | **The processor** | the CPU glows | it follows the program and does the work |
| 3 | **Memory** | RAM sticks | fast, temporary, forgotten when off |
| 4 | **Storage** | the SSD and a file | long-term, survives a power cut |
| 5 | **Output** | a path up to the lit screen | the result comes back to you |
| 6 | **Programs and binary** | `0101` across the board | instructions, and everything is 0s and 1s |

The key words are 输入 · 处理器 · 内存 · 存储 · 输出 · 程序 · 二进制.

---

## 22 · ⚡ Power Journey

One landscape, left to right: power plant, step-up transformer, pylons, substation, house with a
meter, and a socket callout at the end.

| # | Step | The picture | What it teaches |
|---|---|---|---|
| 1 | **Making electricity** | plant with a spinning generator and smoke | turbine + generator |
| 2 | **Stepping up** | the transformer beside the plant | higher voltage, smaller current, less loss |
| 3 | **High-voltage transmission** | pylons and moving current | the grid crosses the country |
| 4 | **The substation** | fenced transformers | voltage comes down step by step |
| 5 | **Distribution and meter** | the wire to the house and its meter | the meter records what you use |
| 6 | **At the socket** | a 230 V / 50 Hz callout | Malaysian sockets and safety |

The key words are 涡轮 · 发电机 · 变压器 · 高压 · 变电站 · 电表 · 伏特 · 赫兹.

---

## 23 · ⚠️ Electrical Safety

Six hazards on one wall. Each step brings one forward, with the warning sign, the RCD and the
earth wire in place.

| # | Step | The picture | What it teaches |
|---|---|---|---|
| 1 | **Never poke a socket** | a key, a red cross and a 230 V sign | fingers and metal never go in |
| 2 | **Water and electricity** | a dripping tap and a plug in a puddle | wet hands stay away |
| 3 | **Do not overload** | an extension lead with too many plugs | heat and fire |
| 4 | **Damaged cords** | a broken cord with bare copper and sparks | replace it, do not tape it |
| 5 | **Earth and the RCD** | a three-pin plug, earth wire and RCD | leaking current goes to ground |
| 6 | **Short circuits and storms** | lightning, smoke and a short | switch off, tell a grown-up, call 999 for fire |

The key words are 插座 · 绝缘 · 接地线 · 漏电保护器 · 过载 · 短路 · 雷雨.

---

## 24 · ⚙️ Electric Motor

A cutaway DC motor on the bench: a battery, a coil between N and S magnets, a commutator,
brushes and a fan. The child changes voltage and load, then does the two dangerous things on
purpose — and sees the current and heat respond.

| Experiment | What happens | The lesson |
|---|---|---|
| **Power on** | current flows, the coil is pushed, the shaft spins | a motor is a coil in a magnetic field |
| **Add load** | speed drops, current rises, the coil warms | torque costs current |
| **Hold the shaft** | no back EMF, current spikes, heat climbs | a stalled motor burns |
| **Turn by hand, power off** | the LED lights | a motor is also a generator |
| **Turn by hand, power on** | it helps the shaft, current falls | back EMF fights the supply |
| **Overheat** | smoke, then a burnt coil | release the shaft; reset and try again |

The badge is earned by seeing a spin, a loaded motor, a stall and the heat warning. The
help panel explains why a stalled motor has no back EMF and why that is the burn case.

---

## 25 · 📷 Photo Camera

A Sony-style mirrorless body with a large viewfinder and three real controls: shutter speed,
ISO and aperture. The child balances exposure and uses the controls to solve three photo
challenges. The illustration is a stylised camera, not a real menu; there is no brand UI.

| Control | What it changes | Trade-off |
|---|---|---|
| **Shutter** 1/1000 → 1/30 | freezes or blurs motion | slow shutter also blurs hand shake |
| **ISO** 100 → 6400 | brightness | high ISO adds noise |
| **Aperture** f/1.8 → f/16 | light and depth of field | wide blurs the background, narrow needs more light |

Three challenges: **freeze the runner**, **silky waterfall**, **blurry background**. The
viewfinder previews brightness, motion blur, background blur and noise live; the result card
says whether the exposure is under, over or right, and what to change.

---

## 26 · 🧪 Test & Check Panel

A yellow "TEST & CHECK" board, after the electrical-shop display: fluorescent and LED
tubes, E27/E14/MR16 holders, three sockets, and an RCD with a test button. The child plugs a
load into the board and watches the meter.

| Experiment | What it shows | The lesson |
|---|---|---|
| **Nothing plugged in** | **0 W**, 0 kWh, even with the RCD on | no load → no current → no energy; the safety switch is not an appliance |
| **Fluorescent tube** | 36 W | older tube, magnetic ballast |
| **LED tube** | 18 W | about half the power for the same light |
| **E27 bulb models** | 5 W LED · 9 W LED · 40 W incandescent · 60 W incandescent | compare light for the same fitting; higher wattage means higher current |
| **E14 bulb models** | 4 W LED · 25 W incandescent | smaller fitting, same comparison |
| **MR16** | 20 W | small spotlight |
| **Charger with no phone** | about 0.3 W | standby is not a true no-load; unplug it |
| **Press TEST** | the RCD trips and cuts the power | the safety switch works; find the fault and reset |
| **SHORT CIRCUIT** | current spikes, the RCD trips instantly | protection works; never energise a short |

The badge needs all five: prove 0 W with no load, run a real load, find the standby draw, trip
the RCD with TEST, and trip it with a short circuit. The panel explicitly teaches that **leaving the RCD on with no load does not
waste energy**, while still saying to isolate before changing a lamp.

---

## 27 · 🧰 Electromagnet Kit Lab

A guided lab built around the 52-kind / 87-piece electromagnet kit. The tray holds 36 key parts —
battery box, switch, bulb and holder, wires, 10 Ω resistor, ammeter, voltmeter, rheostat, bell,
motor and fan, coil, nail, paperclips, hand generator, LED, solar panel, magnets, compass, iron
filings, electroscope, fur, rod, silk, photoresistor, screwdriver, magnetic car, ring magnet, alligator clips, copper and zinc sheets and more —
and eight experiments use them:

| Experiment | Parts | What happens |
|---|---|---|
| **Light the bulb** | battery, switch, bulb, wires | closed loop, bulb glows |
| **Measure current** | + resistor, ammeter | ammeter reads about 0.12 A |
| **Electromagnet** | + coil, nail, paperclips | picks up six paperclips |
| **Motor** | + motor, fan blade | fan spins at 1 800 rpm |
| **Hand generator** | hand generator, LED | crank lights the LED |
| **Solar fan** | solar panel, motor, fan | light drives the fan |
| **See the field** | bar magnet, compass, iron filings | compass and filings show the field |
| **Static charge** | fur, rubber rod, electroscope | leaves repel |

Tap the parts the experiment needs; wrong parts are refused. Press **RUN** when the bench is
complete. The badge needs all eight experiments. The tray also keeps the kit's other pieces
(bell, photoresistor, rheostat, magnetic car, ring magnets, alligator clips and more) for future
experiments.

---

## 28 · 👂 How the Ear Hears

A six-step lesson through the hearing path, with the part highlighted at each step.

| # | Step | The picture | What it teaches |
|---|---|---|---|
| 1 | **Sound is vibration** | pressure waves travelling to the ear | sound is a vibration, not a thing |
| 2 | **Outer ear** | pinna and ear canal | the visible ear funnels sound in |
| 3 | **Eardrum** | thin membrane at the end of the canal | sound makes it vibrate |
| 4 | **Three tiny bones** | malleus, incus, stapes | the smallest bones amplify the movement |
| 5 | **Cochlea** | snail-shaped organ with hair cells | vibration becomes electrical signals; pitch maps to different hairs |
| 6 | **Brain + protection** | auditory nerve, brain and an earplug | the brain hears; loud sound damages hair cells permanently |

The hearing-protection step teaches the 60/60 headphone rule, moving away from loud
speakers, and wearing earplugs around noisy tools.

---

## 29 · 👁️ How the Eye Sees

A six-step lesson through the seeing path.

| # | Step | The picture | What it teaches |
|---|---|---|---|
| 1 | **Light comes in** | rays enter the eye | you see light reflected from things |
| 2 | **Cornea** | clear curved front | it does most of the bending |
| 3 | **Pupil and iris** | coloured ring, black hole | bright light shrinks the pupil; dark widens it |
| 4 | **Lens** | flexible lens with ciliary muscles | accommodation — flatter for far, rounder for near |
| 5 | **Retina** | rods and cones at the back | ~120 million rods for dim light, ~6 million cones for colour; the image is upside down |
| 6 | **Brain + protection** | optic nerve and brain | the brain flips the image; sunglasses, 20-20-20 screen breaks and eye checks |

The protection step also says never to look directly at the sun or a laser.

---

## 30 · 🌈 Rainbow & Light

A six-step lesson on white light and how a rainbow forms.

| # | Step | The picture | What it teaches |
|---|---|---|---|
| 1 | **White light is a mixture** | sunshine | white light contains all the colours |
| 2 | **Refraction** | light entering water | it slows and bends |
| 3 | **The prism** | glass prism and a fan of colour | dispersion separates the spectrum |
| 4 | **Inside a raindrop** | the path through a drop | refract, reflect, refract — colours fan out |
| 5 | **The colours** | seven arcs | red outside, violet inside; red bends least |
| 6 | **Make one safely** | sun, spray and sunglasses | sun behind you, water in front, about 42°; never look at the sun |

The last step also mentions the fainter secondary rainbow outside the first, with the colour
order reversed.

---

## Play it in a browser (fastest)

Everything is plain HTML/CSS/JS — no build step.

```bash
npm start
# open http://localhost:5173
```

…or just double-click `www/index.html`. Everything works from `file://` except two things that
browsers only allow over http(s): the **service worker** (so no offline caching) and the
**manifest install prompt**. Use `npm start` if you want to test those.

`www/_devicelab.html` opens every screen at real phone **and** iPad sizes, portrait and
landscape, side by side. It is dev-only — the server returns 404 for it, and for anything else
starting with `_`.

### Hosting it as a website

`server.js` serves `www/` and hosts the `/tts` neural voice route. It binds to `$PORT` when the
host provides one, so it drops straight onto Render / Railway / Fly with little configuration.
`msedge-tts` is the only runtime dependency; it has a pnpm-only install hook, so the repo sets
`ignore-scripts=true` in `.npmrc` and the deploy commands also pass `--ignore-scripts`.

| Setting | Value |
|---|---|
| Build command | `npm ci --omit=dev --ignore-scripts && npm run stamp` |
| Start command | `node server.js` |
| Health check | `/` |

`render.yaml` in the repo root is a ready-made Render blueprint — **but it is only applied to
services created from the blueprint.** If you created the service by hand in the dashboard,
set those three values in *Settings* yourself. There is no `yarn.lock` in the repo, so a Node
service created by hand will get Render's own default build command rather than the one above,
and the cache stamp will never run.

That said, nothing breaks if the stamp is skipped: `sw.js` serves **page loads network-first**,
so a new deploy is picked up on the next launch anyway. The stamp only keeps the *asset* cache
fresh, and `npm run stamp` also runs in CI before every APK build.

Live: **https://jk-play-n-learn.onrender.com**

---

## Languages and voice

**Chinese is always the default.** The EN / 中文 button is visible again, but it is gated:
tapping it opens a **five-correct one-digit addition quiz**. A wrong answer asks a new sum and
does not count. Five correct answers unlock **English for five minutes**, with a visible `EN · 4:59` countdown chip. When the timer reaches zero the app
switches back to Chinese, and the next page load starts in Chinese again.

An active English session survives page navigation (the deadline is stored as `arg.enUntil`), so
the five minutes do not restart on every page. The gate lives in `www/shared/lang.js`; set
`lockLang: 'zh'` in `www/shared/config.js` to hard-lock the app again.

Every label, speech bubble, science fact and help screen exists in both languages. There is a
test for the gate (`— Language gate —` in `npm test`).

**🗣️ Voice** — every activity has a voice button next to the sound button. On desktop and
Android, narration prefers a **neural voice** from the server (below); the iPad uses the built-in
Apple voices. It follows the interface language and falls back to a device voice when the
network is unavailable.

**On Android the browser's speech is replaced by the phone's own engine.** A Capacitor WebView
often reports no voices, or silently never starts an utterance — which is why narration used to
fail in the APK. `MainActivity` now hands the page `window.AndroidTts`, a tiny bridge to
`android.speech.tts.TextToSpeech` (`SystemTts.java`), and `shared/voice.js` prefers it:

* the sentence goes to the same TTS engine the rest of the phone uses, at normal media volume;
* the voice follows the interface language (`zh-CN` / `en-US`); if no Chinese voice is installed,
  Android offers to download one;
* word-by-word highlighting still works on Android 8+ through
  `UtteranceProgressListener.onRangeStart`; older phones just outline the card;
* this is the fallback when the neural voice cannot be reached.

This depends on an installed system TTS engine (Google TTS or the vendor's), which nearly every
Android phone has.

**Neural voice on desktop and Android.** The server exposes `GET /tts?text=…&lang=zh`. It
synthesizes with Microsoft Edge's Read Aloud voices through `msedge-tts` — **no API key** — and
returns an MP3 plus word timings, so the read-along highlight is kept. `shared/voice.js` prefers
it on every non-Apple device and falls back to the device engine (or Web Speech) when the request
fails or the phone is offline. Browsers block audible autoplay, so the **first sentence is kept
ready and starts on the first tap** (anywhere, the sentence, or READ AGAIN) rather than dropping
to the old device voice. The iPad keeps its Apple voices. Set `tts.mode` in
`shared/config.js` to `system` to stay entirely offline, or `cloud` to try the neural voice
everywhere.

Two things to know: this is an **unofficial Microsoft endpoint, not a paid SLA** — the device
fallback is deliberate — and the sentence text is sent to Microsoft for synthesis. The web app
uses the same-origin route; the Android app points `tts.base` at the public site.

**While it reads, the words light up — everywhere.** Every utterance now has a visible
transcript: if the activity already shows the sentence (a fact card, a note, a lesson step),
that card is highlighted word by word; if it only calls `speak()` — a status, a result, a
spoken hint — the shared **caption bar** at the bottom shows the sentence and highlights the
current word. That is true for the neural, native and Web Speech engines alike.

**Pages read themselves on entry.** After a page loads, `shared/voice.js` reads its main visible
passage once (the fact card or the instruction note); lesson pages read step one through their
own engine. Browsers block audible autoplay until a gesture, so on desktop/Android the first
sentence is fetched and waits: a **“点一下开始朗读 / Tap to listen”** caption appears, and the
first tap plays it. The iPad's local voices usually start without that step.

Where it speaks:

| Activity | What it reads |
|---|---|
| **Inside the Aircon** | Tap any of the four parts to hear it explained — the part is also ringed on the diagram. **READ IT TO ME** narrates the whole cycle in order. Switching to *How to wash it* reads the intro, and every step is read out with its servicing note. |
| **Food Eating** | Each stop is announced with its science fact as the food arrives, and the fact card highlights word by word. |
| **Breathing & Blood** | Each experiment is announced with what it does to the body. Tap the fact card to hear it again. |
| **Laundry Day** | The instructions when either machine starts, and the result card when a wash or dry finishes. |
| **From Seed to Tree** | Each phase is announced with its science fact as the tree reaches it, and the result card is read out. |
| **Breakfast Sandwich** | The cooking window and the result card are read out. |
| **Water at Home** | Every supply step is read out, and the heater safety notes are spoken when you change the setpoint or draw water. |
| **Water Cycle** | Every stage is announced with its fact, in step mode or while WATCH plays. |
| **Weather Station** | The forecast feedback and the reason for the weather are read out. |
| **How a Car Engine Works** | Each stroke is read out in STEP mode, and the result card when all four have been seen. |
| **Electricity · Magnets · Light · Sun Bear · Speaker · Computer · Power · Safety** | Every step reads itself as it opens, word by word; tap a key word to hear the word and its meaning. |
| **All activities** | Tap the help text to have the instructions read out. |

If neither a device voice nor the neural route is available, the button hides itself and nothing
else changes.

## Optional: AI-generated illustrations

The eight step lessons and the 23 home tiles can be replaced by illustrated
plates without touching the lesson logic. The hand-drawn SVG stays as the
fallback, and two gates in `shared/config.js` stay off until the files exist.

The illustration work is deliberately split into a **standalone handoff task**
for a stronger image model:

| File | What it is |
|---|---|
| [`docs/art/README.md`](docs/art/README.md) | the split and reading order |
| [`docs/art/BRIEF.md`](docs/art/BRIEF.md) | style, palette, sizes, rules |
| [`docs/art/SCENES.md`](docs/art/SCENES.md) | what each of the 48 plates and 23 tiles must show |
| [`docs/art/PROMPTS.md`](docs/art/PROMPTS.md) | master/negative prompt and a prompt per file |
| [`docs/art/INTEGRATION.md`](docs/art/INTEGRATION.md) | paths, gates, fallback, cache, verification |
| [`docs/art/CHECKLIST.md`](docs/art/CHECKLIST.md) | acceptance pass |
| [`docs/art/HANDOFF.md`](docs/art/HANDOFF.md) | the message to copy to the image AI |

- **48 lesson plates:** `www/art/lessons/<lesson>/01..06.webp`, 1024×1536.
- **23 tiles:** `www/art/tiles/<key>.webp`, 512×512.
- Enable with `art: { lessons: true, tiles: true }` in `shared/config.js`.
- With the gates off there are no requests and no 404s.

## ◧ Bigger picture on a small screen

Every activity has a **◧ button** in the top bar that folds the control panel away so the
illustration gets the whole screen — handy on a phone. Tap it again to bring the controls back,
and the preference is remembered. On Train Driving it hides the bottom desk instead, so the
view out of the cab fills the screen (512 px → 802 px on a phone).

---

## Install it on an iPad (home-screen app)

The site is a **PWA**, so on an iPad you can install it and it runs full screen with no
Safari address bar or toolbars — like a native app.

> ⚠️ **If you added it to the home screen before, delete that icon and do it again.** The old
> icon was created without the standalone tags, so iOS keeps wrapping it in Safari. iOS reads
> those tags only at the moment you add it.

**How to install**

1. Open the site in **Safari** (it must be Safari, not Chrome on iOS).
2. Pull down to **reload the page once**, so Safari picks up the manifest and tags.
3. Tap the **Share** button (the square with an arrow, top right).
4. Scroll down and tap **Add to Home Screen**, then **Add**.
5. Launch it from the new home-screen icon — no browser chrome, and it works offline.

You should get a full-screen app with the ✦ icon, a black status bar, and no Safari UI.

**What makes it behave like an app**

| Piece | Why |
|---|---|
| `<meta name="apple-mobile-web-app-capable" content="yes">` | the actual switch that removes Safari's chrome |
| `manifest.webmanifest` with `"display": "standalone"` | the modern equivalent (iOS 16.4+, and Chrome/Android) |
| `apple-touch-icon` at 120/152/167/180 px | a real icon instead of a screenshot of the page |
| `apple-mobile-web-app-status-bar-style` | a black status bar that matches the dark theme |
| `sw.js` service worker | caches every page and asset, so it opens instantly and works with no wifi |
| `viewport-fit=cover` + `env(safe-area-inset-*)` | keeps controls clear of the notch and home indicator |

Android works the same way — Chrome will offer **Install app** automatically.

> Bump `CACHE` in `www/sw.js` whenever you ship a change, so installed copies pick it up.

---

## Accessibility

- Every icon-only button carries a real `aria-label` (language, sound, voice, help, fold, quiz).
- **Full keyboard support** — the controls listen on `pointerdown` for instant response, which a
  keyboard never fires, so `shared/a11y.js` bridges Enter/Space into the same path.
- Keyboard users get a visible focus ring; mouse and touch users do not.
- Decorative SVGs are `aria-hidden` so screen readers skip them.

---

## Build an APK

### Option A — GitHub Actions (no Android Studio needed) ✅

Every push to `main` builds a debug APK for you.

```bash
git push origin main
```

Then on GitHub go to **Actions → Build Android APK → the latest run → Artifacts →
`play-and-learn-apk`**. Download, unzip, install `play-and-learn-<sha>.apk` on your phone
(allow *Install unknown apps*). You can also trigger it by hand:
**Actions → Build Android APK → Run workflow**.

### Option B — build locally

Needs **JDK 21**, **Android SDK 36**, and `ANDROID_HOME` set.

```bash
npm install
npx cap sync android
cd android
./gradlew assembleDebug        # macOS / Linux
gradlew.bat assembleDebug      # Windows
```

The APK lands in `android/app/build/outputs/apk/debug/app-debug.apk`.
Easiest route to the toolchain: install **Android Studio**, open the `android/` folder, hit ▶ Run.

### Release (Play Store) build

```bash
keytool -genkey -v -keystore my-release.jks -keyalg RSA -keysize 2048 \
        -validity 10000 -alias playlearn

cd android
./gradlew assembleRelease \
  -Pandroid.injected.signing.store.file=../my-release.jks \
  -Pandroid.injected.signing.store.password=YOUR_PASS \
  -Pandroid.injected.signing.key.alias=playlearn \
  -Pandroid.injected.signing.key.password=YOUR_PASS
```

---

## Project layout

```
www/                          ← the whole app (no build step)
├─ index.html  home.css  home.js        the two-level topic picker
├─ manifest.webmanifest                 PWA: standalone display, icons, shortcuts
├─ sw.js                                service worker — caches every page and asset
├─ pwa.js                               registers the service worker, detects standalone
├─ icons/                               120/152/167/180/192/512 px + maskable
├─ shared/
│  ├─ config.js                         build switches — lockLang, TTS/art gates
│  ├─ ui.css                            top bar, help overlay, toast, colour vars
│  ├─ store.js                          ARG namespace + safe localStorage
│  ├─ progress.js                       the sticker book every activity writes to
│  ├─ audio.js                          WebAudio blips (no audio files)
│  ├─ voice.js                          spoken narration (Web Speech API)
│  ├─ shell.js                          the ◧ fold-away control panel
│  ├─ a11y.js                           aria labels + keyboard support
│  ├─ lesson.js                         the step-by-step lesson engine (steps · words · reading)
│  └─ lesson.css                        the lesson card, step rail and key-word chips
├─ aircond/                             ── activity 1 ──
│  ├─ index.html
│  ├─ aircond.css                       remote skin, LCD, room, character animations
│  └─ js/ i18n.js · state.js · remote.js · room.js · main.js
├─ food/                                ── activity 2 ──
│  ├─ index.html
│  ├─ food.css                          deck, body, organs, effects, quiz, after-meal
│  └─ js/ aftermeal.js · i18n.js · state.js · body.js · deck.js · main.js
├─ train/                               ── activity 3 ──
│  ├─ index.html
│  ├─ train.css                         sky, track, train, crossing, driver's desk
│  └─ js/ i18n.js · state.js · scene.js · cab.js · main.js
├─ breath/                              ── activity 4 ──
│  ├─ index.html
│  ├─ breath.css                        lab panel, organs, gas-exchange bubble, ECG
│  └─ js/ i18n.js · state.js · scene.js · panel.js · main.js
├─ aircare/                             ── activity 5 ──
│  ├─ index.html
│  ├─ aircare.css                       cutaway unit, refrigerant loop, wash-step animations
│  └─ js/ i18n.js · state.js · scene.js · panel.js · main.js
├─ toilet/                              ── activity 6 ──
│  ├─ index.html
│  ├─ toilet.css                        flush cutaway, mechanism, step animations
│  └─ js/ i18n.js · state.js · scene.js · panel.js · main.js
├─ indah/                               ── activity 7 ──
│  ├─ index.html
│  ├─ indah.css                         sewer journey, works, step animations
│  └─ js/ i18n.js · state.js · scene.js · panel.js · main.js
├─ hood/                                ── activity 8 ──
│  ├─ index.html
│  ├─ hood.css                          kitchen, blower, damper, smoke, airflow
│  └─ js/ i18n.js · state.js · scene.js · panel.js · main.js
├─ laundry/                             ── activity 9 ──
│  ├─ index.html
│  ├─ laundry.css                       both machines, drums, water, foam, steam
│  └─ js/ i18n.js · state.js · scene.js · panel.js · main.js
├─ tree/                                ── activity 10 ──
│  ├─ index.html
│  ├─ tree.css                          seed, roots, eight tree phases, shade net, weather
│  └─ js/ i18n.js · state.js · scene.js · panel.js · main.js
├─ sandwich/                            ── activity 11 ──
│  ├─ index.html
│  ├─ sandwich.css                      kitchen, pan, egg, sandwich stack, steam
│  └─ js/ i18n.js · state.js · scene.js · panel.js · main.js
├─ waterhome/                           ── activity 12 ──
│  ├─ index.html
│  ├─ waterhome.css                     supply works, pipes, cylinder, hot layer, tap
│  └─ js/ i18n.js · state.js · scene.js · panel.js · main.js
├─ cycle/                               ── activity 13 ──
│  ├─ index.html
│  ├─ cycle.css                         sea, cloud, rain, river, lake, droplet
│  └─ js/ i18n.js · state.js · scene.js · panel.js · main.js
├─ weather/                             ── activity 14 ──
│  ├─ index.html
│  ├─ weather.css                       station, instruments, dials, sky states
│  └─ js/ i18n.js · state.js · scene.js · panel.js · main.js
├─ engine/                              ── activity 15 ──
│  ├─ index.html
│  ├─ engine.css                        cutaway cylinder, piston, rod, valves, crank
│  └─ js/ i18n.js · state.js · scene.js · panel.js · main.js
├─ electric/                            ── activity 16 ──
│  ├─ index.html
│  ├─ electric.css                      circuit, switch, bulb, conductor tray
│  └─ js/ i18n.js · state.js · scene.js · main.js
├─ magnet/                              ── activity 17 ──
│  ├─ index.html
│  ├─ magnet.css                        bar magnet, poles, field, compass
│  └─ js/ i18n.js · state.js · scene.js · main.js
├─ light/                               ── activity 18 ──
│  ├─ index.html
│  ├─ light.css                         lamp, beam, tree shadow, mirror, glass
│  └─ js/ i18n.js · state.js · scene.js · main.js
├─ sunbear/                             ── activity 19 ──
│  ├─ index.html
│  ├─ sunbear.css                       rainforest, the bear, hive, termite mound
│  └─ js/ i18n.js · state.js · scene.js · main.js
├─ speaker/                             ── activity 20 ──
│  ├─ index.html
│  ├─ speaker.css                       cutaway speaker, coil, cone, waveform
│  └─ js/ i18n.js · state.js · scene.js · main.js
├─ computer/                            ── activity 21 ──
│  ├─ index.html
│  ├─ computer.css                      laptop, board, CPU, RAM, SSD, data paths
│  └─ js/ i18n.js · state.js · scene.js · main.js
├─ power/                               ── activity 22 ──
│  ├─ index.html
│  ├─ power.css                         plant, pylons, substation, house, socket
│  └─ js/ i18n.js · state.js · scene.js · main.js
├─ safety/                              ── activity 23 ──
│  ├─ index.html
│  ├─ safety.css                        socket, water, lead, cord, RCD, storm
│  └─ js/ i18n.js · state.js · scene.js · main.js
├─ motor/                               ── activity 24 ──
│  ├─ index.html
│  ├─ motor.css                         motor cutaway, magnet, coil, fan, heat
│  └─ js/ i18n.js · state.js · scene.js · panel.js · main.js
├─ camera/                              ── activity 25 ──
│  ├─ index.html
│  ├─ camera.css                        Sony-style body, viewfinder, preview
│  └─ js/ i18n.js · state.js · scene.js · panel.js · main.js
├─ testpanel/                           ── activity 26 ──
│  ├─ index.html
│  ├─ testpanel.css                     yellow test board, tubes, RCD, sockets
│  └─ js/ i18n.js · state.js · scene.js · panel.js · main.js
├─ kitlab/                              ── activity 27 ──
│  ├─ index.html
│  ├─ kitlab.css                        kit tray, bench, effects
│  └─ js/ i18n.js · state.js · scene.js · panel.js · main.js
├─ ear/                                 ── activity 28 ──
│  ├─ index.html
│  ├─ ear.css                           head, pinna, canal, eardrum, ossicles, cochlea
│  └─ js/ i18n.js · state.js · scene.js · main.js
├─ eye/                                 ── activity 29 ──
│  ├─ index.html
│  ├─ eye.css                           eyeball, cornea, iris, lens, retina
│  └─ js/ i18n.js · state.js · scene.js · main.js
├─ rainbow/                             ── activity 30 ──
│  ├─ index.html
│  ├─ rainbow.css                       sun, prism, raindrop, rainbow arcs
│  └─ js/ i18n.js · state.js · scene.js · main.js
├─ _devicelab.html                      dev-only: phone & iPad previews
docs/character-bible.md                 the character, the palettes and the house style
docs/art/                               illustration handoff: brief, prompts, integration
www/art/                                drop-in AI plates + tiles (empty until generated)
www/shared/art.js                       optional plate loader with SVG fallback

server.js                               static server + /tts neural voice ($PORT aware)
.npmrc                                  ignore dependency install scripts (msedge-tts)
render.yaml                             Render blueprint (build + start commands)
scripts/stamp.js                        stamps the sw.js cache from the git commit
scripts/build-apk.js                    cross-platform APK build
test/sim.test.js                        362 assertions over the thirty activities
test/voice.test.js                       45 assertions: neural voice, autoplay, native/Web Speech fallback, word ranges
test/render.test.js                     427 assertions: every page booted, the menu, the art hook, the language gate, the book, and nothing inline
test/server.test.js                     hammers the server with malformed URLs
android/                                Capacitor Android project (committed)
│  └─ app/src/main/java/.../SystemTts.java   native TTS bridge (window.AndroidTts)
capacitor.config.json
.github/workflows/android.yml           runs the tests, then builds the APK
```

## Tests

```bash
npm test              # the models, the voice router, then every page booted and run
npm run test:server   # malformed URLs, traversal, security headers (needs npm start running)
```

`test/sim.test.js` loads each `state.js` into a sandbox with a minimal `window` and asserts the
numbers this README quotes — so if the thermal model, the braking distance, the flush timing or
the breathing physiology drifts, the build fails. It caught two mistakes while it was being
written. No framework, no dependencies; it runs in the GitHub Action before every APK build.

`test/render.test.js` covers the half that `sim.test.js` cannot see. The simulation tests never
call a scene, so a `render()` that throws still passes every one of them while the page is
completely dead. It happened: the train's scene referenced an undefined `clamp`, which threw on
every frame — and because `main.js` calls `render()` *before* it schedules
`requestAnimationFrame`, the throw killed the animation loop at boot. Pressing the throttle did
nothing at all, yet all 56 simulation assertions passed. So this test boots each of the thirty
pages for real — reading the exact `<script>` list out of its own HTML and loading it in order
into a small fake DOM — then drives the `requestAnimationFrame` loop for ~3 seconds of frames and
fails on any throw, on boot or on any later frame. The train is checked as behaviour too: apply
the throttle, run the loop, and the train must actually roll.

### Adding your own artwork

* **The boy (aircond)** — `#boy` in `www/aircond/index.html`. Mood variants are grouped by
  class (`m-ok`, `m-hot`, `m-cold`, `m-freeze`, `b-hot`, `b-cold`); CSS swaps them off
  `#boy[data-mood="…"]`.
* **The air-con** — `#ac`, with the vanes at `#ac-vane-v` / `#ac-vane-h`.
* **The digestive tract (food)** — `www/food/js/body.js`. The geometry lives in a handful of
  point lists (`MOUTH_ESO`, `STOMACH`, `DUODENUM`, `coilPoints()`, `LARGE`). One smoothed path
  is generated from them and used both to draw the organs *and* to carry the food particle,
  so moving a point moves the drawing and the animation together.
* **The train (train)** — `www/train/js/scene.js`. Everything in the world is measured in
  **metres** and scaled by a single CSS variable, `--ppm` (pixels per metre), which is derived
  from how wide the scene is, so the train always fills the same share of the screen on a phone
  and on an iPad. The route is generated from `CYCLE`/`STATION_OFFSET`/`CROSSING_OFFSET` in
  `state.js` — change those to re-space the stations and crossings.

  The track's vertical geometry lives in one block of custom properties at the top of
  `train.css` (`--track-h`, `--rail-y`, `--ground-top`, and `--rail-top` derived from them).
  Everything that has to line up reads from those: the rails, the scenery baseline, the
  treeline, the pantograph wire and the train itself. `--rail-top` is what puts the wheels *on*
  the rail rather than sunk below it, so if you move the track, move it there and not in five
  places.

  Two traps worth knowing about, both of which bit this scene:

  * A `background-repeat: repeat-x` tile is still **clipped at its own height**, so a
    `radial-gradient` puff that is taller than `background-size` gets sliced off flat — which is
    what drew a straight horizontal seam across the sky. Every puff must fit inside the tile,
    and the element must be at least as tall as the tile. `npm test` asserts both.
  * Scenery is planted **on the far side** of the track. The baseline is derived from
    `--rail-top`, not a bare percentage; a stray `31%` planted trunks and fence posts in the
    middle of the sleepers.
* **The blood circuit (breath)** — `www/breath/js/scene.js`. `CIRCUIT` is a list of points for
  one closed loop; it is smoothed into a path, sampled once into a lookup table, and the cells
  ride along it. `LUNG_I` / `BODY_I` mark the two points where a cell changes colour, so moving
  a point moves the drawing, the tube and the colour change together.
* **The breathing model (breath)** — `www/breath/js/state.js`. `SCENARIOS` sets how much oxygen
  the body wants; heart rate, breathing rate, SpO₂ and CO₂ then follow. Nudge the numbers in
  `SCENARIOS` or the tuning constants in `tick()` to make it easier or harder.
* **The refrigerant loop (aircare)** — `www/aircare/js/scene.js`. `LOOP` is a point list for one
  closed circuit through the four parts, smoothed into a path and sampled once for the moving
  dots. `I_EVAP_OUT` / `I_COMP_OUT` / `I_COND_OUT` are the indices where the colour changes, and
  the gradient stops are derived from them, so moving a point moves the drawing, the colour
  changes and the particles together.
* **The wash steps (aircare)** — `www/aircare/js/state.js` holds the eight steps, each with a
  `lit` part to highlight. The scene writes `data-wash-step` on `#scene`, and all the animation
  lives in plain CSS keyed off that attribute — add a step by adding an entry to `STEPS` and a
  `#scene[data-wash-step="N"]` rule.
* **The toilet cutaway (toilet)** — `www/toilet/index.html`, the `#flushScene` group. It is drawn
  as a real gravity-flush toilet: a chain from the button down to a rubber flapper that is hinged
  on the overflow tube, a fill valve with a float and a refill tube, holes under the rim, a
  siphon jet, and **one continuous trapway** running from the bowl, round the U and over the weir
  to the drain. The ceramic is drawn twice (outer shell + inner cavity) so the wall thickness and
  the water path both read.

  Two numbers in that drawing are physically tied together and must be changed as a pair:
  the crest of the weir (`#trapWater`, currently ending at `220,332`) and the resting bowl water
  level (`bowlTop` in `www/toilet/js/scene.js`, `280 + (1 - bowl) * 208`, which gives 332 at the
  idle `bowl = 0.75`). Water can only stand as high as the weir, so the seal line and the weir
  crest **have** to be the same height — `npm test` asserts it.

  Note on tab switching: `hidden` is an HTML property and is **not** reflected on SVG elements,
  so `someGroup.hidden = true` is a silent no-op on a `<g>`. Both the toilet and Indah Water use
  the `show()` helper in their `scene.js` (or `setAttribute('hidden', '')`) instead. There is a
  test for this in each activity, because it once left Indah Water's second tab permanently
  invisible.
* **The sewer and the works (indah)** — `www/indah/js/scene.js`. `NET_PTS` is the wastewater's
  route from the house to the plant, and the works is a **serpentine**: `plantPts()` walks
  `STAGES` and turns the direction each tank, so adding a stage re-routes the flow automatically.
  Both the pipe-fill animation and the moving dots are driven off that route, so they can never
  disagree with the drawing.

  The pipe "fills up" as you advance because it carries `pathLength="1"` and the renderer sets
  `stroke-dasharray` to `<flow> 1` — no `getTotalLength()` call, which keeps it testable in Node.
* **The washer and dryer (laundry)** — `www/laundry/index.html` holds both cutaways, and
  `www/laundry/js/scene.js` builds the clothes, dirt specks, bubbles and steam with
  `createElementNS`, then sets their positions and opacity every frame. The water level is a
  single `rect` clipped to the washer drum, so it can never spill outside the glass.
  `www/laundry/js/state.js` is the whole game: `LOADS` says how dirty each basket is and how much
  heat, spin and water it will take; `PROGRAMS`, `TEMPS`, `SPINS` and `DETERGENTS` set the wash;
  `DRY_PROGRAMS`, `DRYNESS` and `HEATS` set the dry. Change a number there and the panel, the
  measured result and the star rating all follow. The spin you choose writes `wetness`, which is
  handed to the dryer as its starting `moisture` — that is the link between the two machines.
* **The tree (tree)** — `www/tree/index.html` holds all eight stage drawings. The young tree is
  defined once in `<defs>` as `#treeBody` and reused for phases 4–7, with flowers, fruit and
  seeds layered on top. `#t0`…`#t7` are crossfaded by the `data-stage` attribute on `#scene`;
  `www/tree/js/state.js` holds `STAGES`, where each phase's moisture band and light requirement
  live, plus the growth and health model. The active stage is scaled from its base by
  `growth`, so you can see it swell a little inside each phase. Water drops and wind-blown
  seeds are built with `createElementNS` and animated in `scene.js`.
* **The sandwich (sandwich)** — `www/sandwich/js/state.js` holds the four choice lists and the
  cooking heat targets. `sandwich/js/scene.js` sets the bread and spread fills from the chosen
  ids and reveals the filling/vegetable groups; `#panYolk` warms from yellow to brown with
  `cookT`. The stack is drawn once in `index.html` with a layer per ingredient, and the pan and
  plate crossfade as the phase changes.
* **Water at home (waterhome)** — `www/waterhome/js/state.js` holds the eight supply steps and
  the dual-element cylinder model (`HEAT_RATE`, upper/lower thermostats, `bottom`, `maxTemp`).
  The upper element heats the top first; the lower element takes over once the upper thermostat
  is satisfied. The supply diagram is a set of `.part` groups keyed by the current step's
  `lit`; the heater's `#hotLayer` height follows the top temperature, and `#upperGlow` /
  `#lowerGlow` show which element is on. The dots along the main pipe and the draw drops are
  created in `scene.js`; the labels name the dip tube, both elements, both thermostats, anode,
  T&P valve, insulation, drain valve and mixing valve.
* **Water cycle (cycle)** — `www/cycle/js/state.js` holds the eight stages and `WATCH_SECONDS`.
  `cycle/js/scene.js` has the drop's `PTS` stops; the drop interpolates between the current and
  next point while WATCH runs, and the current `.part` and label are highlighted. Rain and
  evaporation wisps are separate groups toggled by the stage.
* **Weather station (weather)** — `www/weather/js/state.js` holds `ROUNDS`, each with a complete
  set of instrument readings and the correct forecast. `weather/js/scene.js` drives the
  anemometer, vane, rain gauge, thermometer, hygrometer, barometer, sunshine recorder and river
  gauge from those readings. The sky is neutral during `read` and changes only after `submit`,
  using the `fairSun` / `stormClouds` / `rainGroup` / `windLines` groups.
* **The engine (engine)** — `www/engine/js/state.js` holds the four `STROKES` and the three
  `THROTTLES` (800/2500/5000 rpm and their slow-motion cycle times). The crank angle runs
  0–720°; `engine/js/scene.js` turns it into the piston height, the connecting-rod endpoints,
  the crank-pin position, the valve lifts (intake 0–180°, exhaust 540–720°), the spark and the
  combustion glow. The air and exhaust dots are created with `createElementNS`. STEP mode sets
  the angle to the middle of a stroke, so the card and the drawing can be read together.

### Adding a language

Copy the `en` object in either `i18n.js` and translate. The top-bar toggle switches every
label, speech bubble, science fact and the help screen instantly.

> Naming note: the repo is called `aircondremotegame` and the Android application id is still
> `com.ngjingtao.aircondremote`, left as-is so existing installs keep updating. Rename both in
> `capacitor.config.json` + `android/app/build.gradle` if you would rather.
