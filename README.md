# ✦ Play &amp; Learn

[![Build Android APK](https://github.com/ngjingtao/aircondremotegame/actions/workflows/android.yml/badge.svg)](https://github.com/ngjingtao/aircondremotegame/actions/workflows/android.yml)

One little app, two activities for a curious kid. The home screen shows two picture tiles —
tap one and you are in.

```
┌─────────────────────────────────────────────┐
│  ✦ Play & Learn              EN  🔊         │
│                                             │
│        What shall we play?                  │
│                                             │
│  ┌────────────────┐  ┌────────────────┐     │
│  │  [ air-con ]   │  │  [ innards  ]  │     │
│  │  Play Aircond ›│  │ Food Eating   ›│     │
│  └────────────────┘  └────────────────┘     │
└─────────────────────────────────────────────┘
```

Everything is hand-drawn in **CSS + inline SVG** — no images, no sprite sheets, no build step.
Both activities speak **English and 中文** and work offline.

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

## Play it in a browser (fastest)

Everything is plain HTML/CSS/JS — no build step.

```bash
npm run serve
# open http://localhost:5173
```

…or just double-click `www/index.html`.

`www/_devicelab.html` opens all three screens side by side at real phone size.

---

## Build an APK

### Option A — GitHub Actions (no Android Studio needed) ✅

Every push to `main` builds a debug APK for you.

```bash
git push origin main
```

Then on GitHub go to **Actions → Build Android APK → the latest run → Artifacts →
`aircond-remote-apk`**. Download, unzip, install the `.apk` on your phone
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
└─ _devicelab.html                      dev-only: phone-size previews
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

### Adding a language

Copy the `en` object in either `i18n.js` and translate. The top-bar toggle switches every
label, speech bubble, science fact and the help screen instantly.

> Naming note: the repo is called `aircondremotegame` and the Android application id is still
> `com.ngjingtao.aircondremote`, left as-is so existing installs keep updating. Rename both in
> `capacitor.config.json` + `android/app/build.gradle` if you would rather.
