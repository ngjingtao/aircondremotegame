# Character bible & style guide

Everything here is written to match what is **already** in the code — the hex
values are the real ones, and each rule says where it lives. Where something is
only a plan, it says so.

The point of this document is that the eight activities stop looking like eight
separate projects. A child should recognise the boy, the room, the light and the
outlines as *the same world* before they read a single word.

---

## 1 · The character

**Kai** — 8 years old, endlessly curious, asks "why" about everything, and is
convinced every machine in the house is his to operate.

* **The one prop:** a small white remote control. It is the thing that ties the
  activities together — he is holding it in Play Aircond (`#mini-remote`), and it
  is the reason he is always the one pressing the button.
* **Personality in one line:** he does not want to be told how the air-conditioner
  works, he wants to *take it apart and find out*.
* **Nothing about him is clever or superheroic.** He is a normal, slightly
  impatient kid. That is what makes him worth watching.

### Locked design

Nothing here should drift. These are the exact values in `aircond/index.html`.

| Part | Value | Where |
|---|---|---|
| Skin | `#ffd7b0` → `#f6bb8a` | `#skinGrad` |
| Hair | `#2f2a35` (flat, with a tuft at `#2f2a35`) | `.boy-hair`, `.boy-hair-tuft` |
| Shirt | `#67e8f9` → `#22a8c4` | `#shirtGrad` |
| Trousers | `#3b4a63` | `#boy-legs` |
| Ground shadow | `#000` at 18 % | `.boy-ground-shadow` |
| Drop shadow | `#0b1220` @ 22 %, dy 4, blur 4 | `#boyShadow` |

**Silhouette test.** Filled in black, Kai must still be recognisable by three
things: the round head, the tuft of hair, and the little rectangle of the remote
in his raised hand. If a pose loses all three, it is the wrong pose.

### The emotion table

The moods are not invented — they are the states the simulation already produces.
`moodFor()` in `aircond/js/state.js` decides which one he is in, from how the
room actually feels:

| State | Feels-like | Face | Body | Effect |
|---|---|---|---|---|
| `freezing` | < 15.5 °C | eyes squeezed shut, blue lips | shoulders up, hugging himself | shiver, hair frosting over |
| `cold` | 15.5–20.5 | eyes half closed, flat mouth | arms folded | small shake |
| `ok` | 20.5–27 | eyes curved up, big smile | relaxed, leaning back | calm breathing |
| `hot` | 27–29.5 | eyes open wide, mouth open | one hand fanning | sweat drops |
| `veryhot` | > 29.5 | tongue out, eyes as slits | slumped forward | sweat pouring, panting |

Two rules that matter more than the drawings:

1. **Colour and shape must both carry the state.** Cold is blue *and* pinched-in
   (arms folded, shoulders up); hot is red *and* spread out (slumped, fanning).
   A colour-blind child must still read it.
2. **He never goes back to neutral instantly.** Coming out of `veryhot` he should
   pass through `hot`, which is what the model does anyway.

The other activities use the same face library against their own states:
`breath` (calm / working / out-of-breath), `food` (hungry / chewing / full /
tummy-ache), `hood` (fumes / clear air), `train` (the driver, seen from behind).

---

## 2 · Style guide

### Shape language

* **Round everything.** The smallest corner radius in the whole app should be
  ~2 px at design size; most shapes want 8–28 px. No sharp corners, ever.
* **One outline decision, applied everywhere.** The current build is the
  "no outline" branch: shapes are separated by *value* (a light shape on a dark
  background, `#c8d1dd` hairlines on white ceramic), never by a dark keyline.
  Keep that. Mixing outlined and unoutlined art in one app is the single fastest
  way to make it look unfinished.
* **Hairlines are `1.4–1.6` px at design size**, drawn in `#c8d1dd`, `#b9c6d6`
  or `#d8e0ea`. That is the ceramic/shell language from the toilet and the hood.

### Light

**One light source: upper-left, slightly in front.** This is already true in
three places and should become true in all of them:

* the boy's skin and shirt gradients run top-to-bottom
* `#boyShadow` drops `dy 4` down
* the toilet ceramic is `#ffffff` at the top → `#dbe2ec` at the bottom

Practical rules: a top highlight is `rgba(255,255,255,.9)` on white surfaces and
`rgba(255,255,255,.26)` on dark ones; a bottom shade is `rgba(0,0,0,.18)` to
`.4`. Shadows on the floor are a blurred black ellipse at 18–38 %, never a hard
shape.

### Colour

Each activity has **one accent**, and the accent is the same in the menu tile and
inside the activity. These are the live values:

| Activity | Accent | Tile background |
|---|---|---|
| Play Aircond | `#22a8c4` / `#67e8f9` | `#12324a → #0d2233` |
| Food Eating | `#e8935a` | `#4a2a12 → #33200d` |
| Train Driving | `#e63946` + `#f4d35e` | `#173049 → #0c2233` |
| Breathing & Blood | `#e2445c` (red) / `#3b82f6` (blue) | `#123c3a → #0b2a2c` |
| Inside the Aircon | `#5fb6ef` | `#123049 → #0a2131` |
| Toilet | `#5fd0ff` | `#123a45 → #0a2530` |
| Indah Water | `#5fd0ff` (clean) / `#a98a5a` (raw) | `#1b3050 → #0b1726` |
| Kitchen Hood | `#f0a03a` | `#3a3226 → #231e16` |

**Cold and warm are semantic, not decorative.**

* Cold is **blue**: `#7dd3fc`, `#93c5fd`, `#5fb6ef`.
* Hot is **orange-red**: `#fbbf24`, `#f87171`, `#ff8b7a`.
* Comfortable is **green**: `#3ddc84`, `#8ef0b4`, `#6ee89a`.
* Dirty water is **brown**: `#6b4a25` → `#9c7d48`; clean water is **blue**:
  `#a8e2ff` → `#4aa8de`.

A child should be able to tell how the room feels from the colour of the
thermometer alone.

**Interface neutrals** (shared across every activity, in `shared/ui.css`):
`#0b1220` background, `rgba(255,255,255,.16)` hairlines, `#d6e4f5` text,
`#93a3bd` dim text.

### Motion

Six rules, in priority order. Most of the app already does the first three.

1. **Idle is never still.** He breathes and blinks on a loop
   (`.boy-breathe`, `blink` in `aircond.css`). Every character added later gets
   the same treatment.
2. **Anticipation before big actions.** He pulls the remote back before pressing
   (`#arm-r-inner`, `transform-origin:168px 180px`).
3. **Squash and stretch on impact** — `@keyframes boyBump` is the reference.
4. **Particles carry the feedback, not the score.** Heat = rising shimmer,
   cold = drifting snow, clean water = rising bubbles, a rescue = a sparkle.
5. **Nothing snaps.** All state transitions are `.12s–.3s`. The single
   exception is the level-crossing flash, which *should* be abrupt.
6. **Every important action gets a short sound.** The vocabulary already exists
   in `shared/audio.js` — reach for `beep`, `blip`, `chime`, `air`, `warn`,
   `deny`, `ding` before inventing a new one.

### Information design

* **Icon first, words second.** Every button already pairs an emoji with a short
  label; keep that ratio even when the label is long.
* **Big numbers, small sentences.** The temperature, the score and the time get
  large tabular numerals (`font-variant-numeric: tabular-nums`, already set on
  the HUD chips).
* **The screen carries keywords; the `?` overlay carries the paragraphs.** This
  is the rule that keeps the app readable for a five-year-old.
* **Never rely on colour alone** — see the emotion table above.

---

## 3 · The house style for cutaway diagrams

`aircare`, `toilet`, `indah` and `hood` are all cross-sections, and they should
look like pages from the same book:

* Ceramic/plastic is **white with a hairline**, drawn as an outer shell **and** an
  inner cavity so the wall thickness reads (`toilet/index.html`, `#flushScene`).
* Water is always the same two-stop blue gradient (`#waterGrad` in the toilet,
  `#clearWater` in Indah Water).
* Moving contents are **round particles along a point list**, never CSS-animated
  divs — that is why the toilet's `TRAP_PTS`, the train's route and Indah Water's
  `NET_PTS` all look consistent.
* **Every stage that a step can point at carries a `data-lab`.** The step's `lit`
  list lights it. A part without a `data-lab` can never be highlighted, and
  `npm test` now fails if a step lights nothing.

---

## 4 · Status: what is done, what is not

**Done, and matching this guide**

* the light direction, the no-outline decision and the colour semantics in
  Play Aircond, Toilet and Indah Water
* idle breathing and blinking on the boy
* the emotion faces for all five aircond moods
* the mission layer: goal, clock, three stars, a visible power meter, and a
  one-line reason when it goes wrong (`aircond/js/state.js`)
* every stage in the cross-sections is nameable and highlightable
* **both Play Aircond and Train Driving run on the same mission pattern** — a
  goal, a clock, three stars that pull against each other, a named reason when
  it goes wrong, a retry, and missions that unlock as you pass them. The train's
  is in `train/js/state.js`: ★ for delivering everyone before the clock, ★★ for
  never running past a platform, ★★★ for never taking a crossing over the limit.
* **the eight home tiles are illustrations**, drawn as SVG scenes in
  `www/index.html` and painted from one shared palette declared at the top of
  that file. Every tile has three depth layers (`tl back` / `tl mid` /
  `tl front`) which drift gently and separate on hover, and the whole set can
  be stilled by `prefers-reduced-motion`. `npm test` asserts the count, the
  canvas, the layers, and that no shape references a paint that does not exist.
* **Kai appears in the tiles too** — the same skin, hair, shirt and remote as
  in Play Aircond, so the character is already shared between the menu and the
  activity.

**Not done yet — in the order I would do it**

1. **Kai only exists in two places.** He is drawn separately in Play Aircond
   and in two tiles. He should be a shared sprite (`shared/kai.svg` or a
   `<symbol>`) so Food Eating, Breathing and the rest can use the same face
   library instead of each inventing a figure.
2. **Texture.** Everything is flat fills. A very light paper grain over each
   scene would soften the vector look — but only if it costs no frames.
3. **A helper character** for the four cutaways, to point at the part being
   explained.
4. **The remaining activities' art** (food as characters, the train's station
   detail, the breathing lungs) — the tiles are the only part that has had the
   treatment so far.

---

## 5 · The home tiles

Done. Each tile is a *moment*, not an object — which is what makes a child want
to tap it. All eight are SVG scenes in `www/index.html`, on one 96×96 canvas,
painted from the shared `#t…` palette declared just above them.

| Tile | The moment |
|---|---|
| Play Aircond | Kai holding the remote up, snow outside the window, sweat on his forehead |
| Food Eating | an apple with a bite taken out, with the tract it is about to travel down behind it |
| Train Driving | the loco bursting out of a tunnel, the crossing lamp already flashing |
| Breathing & Blood | Kai on the hill, out of breath, O₂ drifting past |
| Inside the Aircon | the panel off, one pipe glowing red and one blue |
| Toilet | the real cutaway scaled down, water climbing to the weir |
| Indah Water | out of the house, under the garden, down the pipe to the works |
| Kitchen Hood | the wok smoking, the fan turning, the smoke bending up into the hood |

Each tile uses its own accent from the table in §2, so it is recognisable at a
glance, and each has **three depth layers** that drift slowly and pull apart on
hover or focus. The idle drift is deliberately tiny (1–2 px): enough that the
menu is not a static wall of pictures, not enough to be busy.
