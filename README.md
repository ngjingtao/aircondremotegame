# ❄ Aircond Remote Game

[![Build Android APK](https://github.com/ngjingtao/aircondremotegame/actions/workflows/android.yml/badge.svg)](https://github.com/ngjingtao/aircondremotegame/actions/workflows/android.yml)

A little air-conditioner remote game. **The left half of the screen is a Haier-style remote
control. The right half is a room: a wall-mounted air-con at the top and a boy holding his
own mini remote.**

Press a key and three things react at once:

1. the remote's LCD changes,
2. the air-con responds (vanes open, air blows, display changes),
3. the boy's face and body show exactly how the room feels.

Keep him in the comfort zone — he will happily tell you when he is happy, cold, freezing,
hot, or boiling.

```
┌──────────────────┬───────────────────────────────┐
│  ┌────────────┐  │  ┌─────────────────────────┐  │
│  │  ❄ COOL 26°│  │  │      wall air-con       │  │
│  └────────────┘  │  └─────────────────────────┘  │
│  [ TURBO ]  (⏻)  │        ~~~ airflow ~~~        │
│  COOL SELF DRY   │                               │
│   (  TEMP ▲  )   │        "Ahh, just right~"     │
│   ◀  🌀   ▶      │                               │
│   (  TEMP ▼  )   │            ( o u o )          │
│  HEALTH SLEEP EX │             boy +             │
│  TIME  TIME CONF │          mini remote          │
│  LOCK LIGHT RESET│                               │
│      Haier       │                               │
└──────────────────┴───────────────────────────────┘
```

---

## Play it in a browser (fastest)

Everything is plain HTML/CSS/JS — no build step.

```bash
npm run serve
# open http://localhost:5173
```

…or just double-click `www/index.html`.

Want to see it at real phone sizes? Open **`www/_devicelab.html`**.

---

## Build an APK

### Option A — GitHub Actions (no Android Studio needed) ✅

Every push to `main` builds a debug APK for you.

```bash
git push origin main
```

Then on GitHub go to **Actions → Build Android APK → the latest run → Artifacts →
`aircond-remote-apk`**. Download, unzip, and install `aircond-remote-<sha>.apk` on your
phone (enable *Install unknown apps*).

You can also trigger it manually: **Actions → Build Android APK → Run workflow**.

### Option B — build locally

Requirements: **JDK 21**, **Android SDK (platform 36 + build-tools)**, and `ANDROID_HOME`
set. Then:

```bash
npm install
npx cap sync android
cd android
./gradlew assembleDebug        # macOS / Linux
gradlew.bat assembleDebug      # Windows
```

The APK lands in `android/app/build/outputs/apk/debug/app-debug.apk`.

Easiest way to get the toolchain: install **Android Studio**, open the `android/` folder,
and hit ▶ Run.

### Release (Play Store) build

```bash
keytool -genkey -v -keystore my-release.jks -keyalg RSA -keysize 2048 \
        -validity 10000 -alias aircond

cd android
./gradlew assembleRelease \
  -Pandroid.injected.signing.store.file=../my-release.jks \
  -Pandroid.injected.signing.store.password=YOUR_PASS \
  -Pandroid.injected.signing.key.alias=aircond \
  -Pandroid.injected.signing.key.password=YOUR_PASS
```

---

## The remote

Mirrors the Haier remote in the reference photo.

| Key | What it does |
|---|---|
| **Power** (green circle) | Turn the air-con on / off |
| **COOL** | Cycles the mode: `COOL → HEAT → FAN → COOL` (the LCD shows the active mode) |
| **DRY** | Dehumidify mode — cools gently and drops the humidity |
| **TEMP ▲ / ▼** | Set point, 16 °C … 30 °C |
| **SWING ◀** | Vertical louvre swing (up / down) |
| **SWING ▶** | Horizontal louvre swing (left / right) |
| **🌀 (centre)** | Fan speed: `AUTO → LOW → MED → HIGH` |
| **TURBO / QUIET** | Boost the airflow, or make it whisper quiet |
| **SELF CLEAN** | The unit runs a 5-second cleaning cycle (no cooling while it runs) |
| **HEALTH** | Fresh-ion air — the boy feels fresher |
| **SLEEP** | Night mode — the room temperature creeps up gently |
| **EXTRA FUNCTION** | Toggles **ECO** (weaker but power-saving) |
| **TIME ON / TIME OFF** | Add one hour, then **CONFIRM** to arm the timer (in-game 1 h ≈ 15 s) |
| **CONFIRM / CANCEL** | Arm or cancel the timer |
| **LOCK** | Child lock — every other key is ignored until you press LOCK again |
| **LIGHT** | LCD backlight + air-con display light |
| **RESET** | Back to factory settings |

---

## How the simulation works

The room has a real (if simplified) thermal model.

| Quantity | Behaviour |
|---|---|
| **Room temp** | Always leaks toward the outdoor temperature. The air-con pulls it toward the set point. |
| **Outdoor temp** | 33 °C by default; drops to 18 °C on a cold snap, jumps to 39 °C on a heatwave. |
| **Humidity** | 62 % baseline. DRY mode pulls it down to ~38 %. It raises the *feels-like* temperature. |
| **Feels-like** | `roomTemp + (humidity − 55) × 0.03` |
| **Cooling strength** | mode × fan speed × turbo/quiet × eco |
| **Leakage** | ×5 while a "door open" event is running |
| **Comfort zone** | feels-like **20.5 – 27 °C**. Setting 25–26 °C holds it there on a normal day; a heatwave needs 24 °C or lower. |

### Mood bands (on feels-like temperature)

| Feels-like | Mood | Boy |
|---|---|---|
| < 15.5 °C | 🥶 Freezing | X-eyes, shivering hard, blanket, breath puffs |
| 15.5 – 20.5 °C | 🥶 Cold | droopy eyes, wavy mouth, shivers |
| 20.5 – 27.0 °C | 😊 Just right | big smile, relaxed |
| 27.0 – 29.5 °C | 🥵 Hot | panting mouth, sweating, heat haze |
| > 29.5 °C | 🔥 Very hot | wide eyes, drenched, red cheeks |

### Challenge mode

The **Free Play / Challenge** button in the top bar switches modes.

* In **Challenge**, score climbs at `10 × combo` per second while he is comfortable.
* Combo grows to **×5** every 6 comfortable seconds and resets the moment he is uncomfortable.
* Random weather events hit every 15–27 s: **heatwave**, **cold snap**, **door open**,
  **humidity surge**. Each one announces itself with a toast and self-clears.
* Best score is saved on the device.

---

## Project layout

```
AircondRemoteGame/
├─ www/                     ← the whole game (no build step)
│  ├─ index.html            ← markup: remote, room, boy SVG, air-con SVG
│  ├─ styles.css            ← remote skin, LCD, room, character animations
│  ├─ _devicelab.html       ← dev-only: live phone-size previews
│  └─ js/
│     ├─ i18n.js            ← EN / 中文 strings + safe storage helper
│     ├─ audio.js           ← WebAudio blips (no audio files)
│     ├─ state.js           ← thermal simulation, key actions, events, scoring
│     ├─ remote.js          ← remote keys + LCD rendering
│     ├─ room.js            ← boy / air-con / airflow / speech rendering
│     └─ main.js            ← boot, game loop, responsive scaling, HUD
├─ android/                 ← Capacitor Android project (committed)
├─ capacitor.config.json
├─ package.json
└─ .github/workflows/android.yml   ← auto-builds the APK
```

### Adding your own artwork

Both characters are inline SVG, so you can restyle or replace them without touching any
logic:

* **Boy** — `#boy` in `www/index.html`. Mood variants are grouped by class
  (`m-ok`, `m-hot`, `m-cold`, `m-freeze`, `b-hot`, `b-cold`); CSS in `styles.css` swaps them
  off `#boy[data-mood="…"]`.
* **Air-con** — `#ac`. The two vanes are `#ac-vane-v` / `#ac-vane-h`.
* Airflow particles are plain `<div>`s built in `room.js` — a good spot for a snowflake sprite.

---

## Languages

English and 中文. The toggle in the top bar switches every label, speech bubble and the help
screen instantly. Add a language by copying the `en` object in `www/js/i18n.js`.
