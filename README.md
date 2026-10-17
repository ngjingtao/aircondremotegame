# ✦ Play &amp; Learn

[![Build Android APK](https://github.com/ngjingtao/aircondremotegame/actions/workflows/android.yml/badge.svg)](https://github.com/ngjingtao/aircondremotegame/actions/workflows/android.yml)

One little app, three activities for a curious kid. The home screen shows three picture tiles —
tap one and you are in.

```
┌──────────────────────────────────────────────────────────────┐
│  ✦ Play & Learn                          EN  🔊              │
│                                                              │
│                 What shall we play?                          │
│                                                              │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐          │
│  │ [ air-con ]  │ │ [ innards  ] │ │  [ train ]   │          │
│  │Play Aircond ›│ │Food Eating  ›│ │Train Driving ›│         │
│  └──────────────┘ └──────────────┘ └──────────────┘          │
└──────────────────────────────────────────────────────────────┘
```

Everything is hand-drawn in **CSS + inline SVG** — no images, no sprite sheets, no build step.
All three activities speak **English and 中文** and work offline.

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
(heatwave, cold snap, open door, humidity surge).

Keys: Power · COOL (cycles mode) · DRY · TEMP ▲▼ · SWING ◀▶ · fan speed · TURBO/QUIET ·
SELF CLEAN · HEALTH · SLEEP · EXTRA (ECO) · TIME ON/OFF + CONFIRM · LOCK · LIGHT · RESET.

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
| rolled past | −20 — *You went past the platform!* |

Mind your speed in the platform, and use the horn — it is good manners.

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

## 6 · 🚽 Toilet & Indah Water

Where it actually goes. Two tabs: what a flush does, and the journey through the treatment works.

### How it flushes

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
you can also tap through by hand, with the relevant part highlighted (cistern, flapper, S-bend,
water seal, drain).

The point of the whole thing: **a toilet does not push the waste away — it siphons it.** Once
the S-bend is completely full, the falling water drags the rest after it. And the little pool
left behind, the **water seal**, is what stops sewer smells coming back up.

### How it gets cleaned — an Indah Water plant

Eight stages, top to bottom, with the water getting visibly cleaner as it goes:

| # | Stage | What happens |
|---|---|---|
| 1 | Arrives | everything from the house flows downhill to the plant |
| 2 | **Screening** | bar screens catch rags, wet wipes and plastic |
| 3 | **Grit removal** | sand and coffee grounds sink out |
| 4 | **Primary tank** | solids sink as sludge, grease floats and is skimmed |
| 5 | **Aeration tank** | air is pumped in and **bacteria eat the waste** |
| 6 | **Secondary clarifier** | the bacteria clump and settle; some go back to work |
| 7 | **Disinfection** | the remaining germs are killed |
| 8 | **Out to the river** | clean enough to meet the standard; sludge becomes fertiliser |

The aeration tank is the big one, and it has a working **AIR ON / AIR OFF** button — switch it
off and the bubbles stop and the tank greys out, which is exactly what happens when a blower
fails. The sludge line runs off to the side, ending at *sludge → fertiliser*.

There is no fake chemistry here on purpose: the honest answer is that **living bacteria do the
work**, and people just build tanks and pump air for them.

---

## 7 · 🍳 Kitchen Hood

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

## Play it in a browser (fastest)

Everything is plain HTML/CSS/JS — no build step.

```bash
npm start
# open http://localhost:5173
```

…or just double-click `www/index.html`.

`www/_devicelab.html` opens every screen at real phone **and** iPad sizes, portrait and
landscape, side by side.

### Hosting it as a website

`server.js` is a zero-dependency static server for `www/`. It binds to `$PORT` when the host
provides one, so it drops straight onto Render / Railway / Fly with no configuration.

| Setting | Value |
|---|---|
| Build command | `npm ci --omit=dev` |
| Start command | `node server.js` |
| Health check | `/` |

`render.yaml` in the repo root is a ready-made Render blueprint; if your service was created
by hand in the dashboard, just copy those three values into Settings.

Live: **https://jk-play-n-learn.onrender.com**

---

## Languages and voice

**The interface starts in 中文.** It stays in Chinese unless you press the language button in
the top bar — that choice is remembered on the device. Every label, speech bubble, science fact
and help screen exists in both English and Chinese.

**🗣️ Voice** — every activity has a voice button next to the sound button. Narration uses the
browser's built-in speech voices (Web Speech API), so nothing is downloaded and it works
offline. It follows the interface language: pick a Chinese voice for Chinese, an English voice
for English.

**While it reads, the words light up.** Tap a fact card or the help text and each word is
highlighted as it is spoken (on browsers that report word boundaries — Chrome and Edge do; on
iOS the card is outlined instead). Narrated steps outline the note card so you can see which
text is being talked about.

Where it speaks:

| Activity | What it reads |
|---|---|
| **Inside the Aircon** | Tap any of the four parts to hear it explained — the part is also ringed on the diagram. **READ IT TO ME** narrates the whole cycle in order. Switching to *How to wash it* reads the intro, and every step is read out with its servicing note. |
| **Food Eating** | Each stop is announced with its science fact as the food arrives, and the fact card highlights word by word. |
| **Breathing & Blood** | Each experiment is announced with what it does to the body. Tap the fact card to hear it again. |
| **All activities** | Tap the help text to have the instructions read out. |

If the device has no speech voices, the button hides itself and nothing else changes.

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
| `sw.js` service worker | caches all 44 files, so it opens instantly and works with no wifi |
| `viewport-fit=cover` + `env(safe-area-inset-*)` | keeps controls clear of the notch and home indicator |

Android works the same way — Chrome will offer **Install app** automatically.

> Bump `CACHE` in `www/sw.js` whenever you ship a change, so installed copies pick it up.

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
├─ index.html  home.css  home.js        the activity picker
├─ manifest.webmanifest                 PWA: standalone display, icons, shortcuts
├─ sw.js                                service worker — caches all 44 files for offline
├─ pwa.js                               registers the service worker, detects standalone
├─ icons/                               120/152/167/180/192/512 px + maskable
├─ shared/
│  ├─ ui.css                            top bar, help overlay, toast, colour vars
│  ├─ store.js                          ARG namespace + safe localStorage
│  ├─ audio.js                          WebAudio blips (no audio files)
│  └─ voice.js                          spoken narration (Web Speech API)
├─ aircond/                             ── activity 1 ──
│  ├─ index.html
│  ├─ aircond.css                       remote skin, LCD, room, character animations
│  └─ js/ i18n.js · state.js · remote.js · room.js · main.js
├─ food/                                ── activity 2 ──
│  ├─ index.html
│  ├─ food.css                          deck, body, organs, effects, quiz
│  └─ js/ i18n.js · state.js · body.js · deck.js · main.js
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
│  ├─ toilet.css                        flush cutaway, treatment train, step animations
│  └─ js/ i18n.js · state.js · scene.js · panel.js · main.js
├─ hood/                                ── activity 7 ──
│  ├─ index.html
│  ├─ hood.css                          kitchen, blower, damper, smoke, airflow
│  └─ js/ i18n.js · state.js · scene.js · panel.js · main.js
└─ _devicelab.html                      dev-only: phone & iPad previews

server.js                               zero-dependency static server ($PORT aware)
render.yaml                             Render blueprint (build + start commands)
android/                                Capacitor Android project (committed)
capacitor.config.json
.github/workflows/android.yml           auto-builds the APK
```

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

### Adding a language

Copy the `en` object in either `i18n.js` and translate. The top-bar toggle switches every
label, speech bubble, science fact and the help screen instantly.

> Naming note: the repo is called `aircondremotegame` and the Android application id is still
> `com.ngjingtao.aircondremote`, left as-is so existing installs keep updating. Rename both in
> `capacitor.config.json` + `android/app/build.gradle` if you would rather.
