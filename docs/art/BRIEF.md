# Art brief — lesson plates and home tiles

## 1 · What this is for

The eight science/machines lessons are step players: one illustration per step,
six steps per lesson, with the explanation in the panel below. The current
inline SVGs are deliberately simple diagrams. Replacing them with warm,
consistent children's-book illustrations is the single biggest visual upgrade
the app can get.

The art is **decorative and explanatory, not interactive**. The app supplies
every word, label and highlight; the image must not contain text.

## 2 · Deliverables

### A · Lesson plates — 48 files

```
www/art/lessons/<lesson>/<01..06>.webp
```

| Lesson | Folder | Six steps |
|---|---|---|
| Electricity | `electric` | battery · closed loop · switch · lit bulb · conductors · safe socket |
| Magnetism | `magnet` | attraction · poles · repel/attract · field lines · magnetised chain · compass |
| Light | `light` | sources · straight travel · shadow · closer = bigger · mirror · refraction |
| Sun bear | `sunbear` | size · chest patch · tongue · forest food · climbing · protection |
| Speaker | `speaker` | cutaway · magnet + coil · signal · cone pushes air · pitch · volume |
| Computer | `computer` | input · CPU · RAM · storage · output · program |
| Power journey | `power` | plant · step-up · pylons · substation · meter · socket |
| Electrical safety | `safety` | socket · water · overload · damaged cord · earth/RCD · storm/short |

- **Size:** 1024 × 1536 px (portrait 2:3).
- **Format:** WebP, sRGB, no alpha. Quality ~88; target **≤ 300 KB** each.
- **Composition:** the scene is displayed with `object-fit: cover` in a tall
  scene box. Keep the subject inside the central **80%**; the outer 10% on each
  side may be cropped on wide screens.
- **Continuity:** the six plates of one lesson must look like six frames of the
  same room/object: same palette, same line weight, same light direction, same
  props. Do not redesign the object between steps.

### B · Home tiles — 23 files

```
www/art/tiles/<key>.webp
```

`aircond`, `food`, `train`, `breath`, `aircare`, `toilet`, `indah`, `hood`,
`laundry`, `tree`, `sandwich`, `waterhome`, `cycle`, `weather`, `engine`,
`electric`, `magnet`, `light`, `sunbear`, `speaker`, `computer`, `power`,
`safety`.

- **Size:** 512 × 512 px (square 1:1), WebP, no alpha.
- **Composition:** one clear moment, readable at **76 px**. Large silhouette,
  simple background. The title and description are printed below the tile by
  the app — do not put text in the image.
- **Consistency:** all 23 share the palette and line language of the plates.

## 3 · Art direction

**Audience:** curious children, roughly 5–9, reading with an adult.

**Look:** flat 2D children's science illustration; hand-drawn vector feel;
thick, soft, rounded shapes; a little paper grain; warm, friendly light; calm
negative space. Think a modern picture-book diagram, not a corporate icon set
and not a 3D render.

**Palette (use these, do not add a second palette):**

| Role | Hex |
|---|---|
| Ink / outline | `#1b2430` |
| Paper / light | `#f4efe4` |
| Cyan highlight | `#67e8f9` |
| Teal | `#22a8c4` |
| Amber / warm | `#f0a03a` |
| Coral / warning | `#e85d5d` |
| Leaf / safe | `#6fbf5f` |
| Sky | `#8fd0ff` |

**Semantic colours (must stay correct):**

- Magnet **N = coral/red**, **S = sky/blue**.
- Hot = amber/coral; cold = sky/cyan.
- Clean water = sky/cyan; dirty water = muted brown/olive.
- Live/danger = coral/red; earth/safe = leaf/green.
- Light = warm amber; shadow = cool ink/teal.

**Characters:** the lessons currently have no recurring human. A small,
friendly child guide may appear if it helps scale, but do not add a new cast
per lesson. The sun bear must look like a sun bear: short black fur, a pale
muzzle, and the orange chest patch.

## 4 · Hard rules

1. **No text.** No letters, words, numbers, labels, captions, callouts, arrows
   with words, UI, logos or watermarks. The app supplies language and can
   translate it; baked-in text cannot.
2. **One exception:** the letters **N** and **S** may be painted on magnets and
   a compass, because they are the concept. No other letters.
3. **No 3D, photorealism, CGI, glossy plastic, neon, lens flare, heavy
   gradients, drop shadows on every object, clutter, or scary faces.**
4. **No anatomy errors.** The sun bear has four legs, one head, a long tongue;
   hands have five fingers when shown.
5. **No cultural or brand marks.** No real product logos, no flags, no
   copyrighted characters.
6. **No frames or borders.** The image is full-bleed; the app rounds the
   corners.
7. **Do not depict injury.** Safety images show danger averted, a red arc, a
   pull-back — not burns or shock.

## 5 · Acceptance in one line

A plate passes if a child can tell what is happening **without reading**, the
six plates of a lesson feel like one continuous scene, and nothing in the image
is text.

Use `CHECKLIST.md` for the file-by-file pass.
