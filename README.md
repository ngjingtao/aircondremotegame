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
├─ shared/
│  ├─ ui.css                            top bar, help overlay, toast, colour vars
│  ├─ store.js                          ARG namespace + safe localStorage
│  └─ audio.js                          WebAudio blips (no audio files)
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

### Adding a language

Copy the `en` object in either `i18n.js` and translate. The top-bar toggle switches every
label, speech bubble, science fact and the help screen instantly.

> Naming note: the repo is called `aircondremotegame` and the Android application id is still
> `com.ngjingtao.aircondremote`, left as-is so existing installs keep updating. Rename both in
> `capacitor.config.json` + `android/app/build.gradle` if you would rather.
