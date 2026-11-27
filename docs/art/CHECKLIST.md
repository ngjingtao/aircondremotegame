# Acceptance checklist

Copy this into the review issue/task. Tick only what you actually inspected.

## Before generating

- [ ] The image tool can produce a consistent style across a batch (style
      reference/seed or character reference).
- [ ] It can output WebP or PNG at the requested aspect.
- [ ] The master prompt and negative prompt are pasted for every image.
- [ ] The six plates of a lesson are generated in one session.

## Every file

- [ ] Exact path and name (`www/art/lessons/<lesson>/01.webp` … `06.webp`,
      `www/art/tiles/<key>.webp`).
- [ ] Exact size: 1024×1536 (plates) or 512×512 (tiles).
- [ ] WebP, sRGB, no alpha.
- [ ] No text, letters, numbers, labels, UI, logo, watermark or frame.
- [ ] **Only allowed letters:** N and S on magnets/compass.
- [ ] Uses the palette; no second neon/pastel palette.
- [ ] No 3D, photorealism, glossy plastic, lens flare, clutter.
- [ ] No injury, no scary face, no extra limbs/fingers.
- [ ] Subject inside the central 80%; nothing important at the very edge.
- [ ] File size within budget.

## Lesson continuity

For each lesson, lay the six plates side by side:

- [ ] Same room/object/props, same light direction, same line weight.
- [ ] The change from step to step is the teaching point, not a redesign.
- [ ] A child can tell the step's idea without reading the panel.

### The 48 plates

| Lesson | 01 | 02 | 03 | 04 | 05 | 06 |
|---|---|---|---|---|---|---|
| electric | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| magnet | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| light | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| sunbear | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| speaker | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| computer | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| power | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| safety | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |

## Tiles

- [ ] 23 files, all keys from `www/art/manifest.json`.
- [ ] Readable at 76 px.
- [ ] No text; the app prints the title below.
- [ ] Consistent with the plates.

| aircond | food | train | breath | aircare | toilet |
|---|---|---|---|---|---|
| [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |

| indah | hood | laundry | tree | sandwich | waterhome |
|---|---|---|---|---|---|
| [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |

| cycle | weather | engine | electric | magnet | light |
|---|---|---|---|---|---|
| [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |

| sunbear | speaker | computer | power | safety |
|---|---|---|---|---|
| [ ] | [ ] | [ ] | [ ] | [ ] |

## Integration

- [ ] `config.art.lessons` is `true` only after all 48 plates exist.
- [ ] `config.art.tiles` is `true` only after all 23 tiles exist.
- [ ] One lesson was stepped through: all six images change, no flash of a
      broken image, SVG fallback works when a file is renamed.
- [ ] The home screen shows the tile images and the labels underneath.
- [ ] `npm test` passes (371 + 45 + 431 today).
- [ ] Service-worker cache name bumped, or `npm run stamp` ran.
- [ ] A hard reload shows the new art (no stale PWA cache).
- [ ] Total `www/art` size is within budget.
- [ ] No 404s in the console on a page where a gate is `false`.

## Sign-off

- [ ] The art is good enough to replace the hand-drawn scene, not merely
      different.
- [ ] Nothing in the images contradicts the lesson text (N/S, hot/cold,
      clean/dirty, live/earth).
- [ ] The app still reads, highlights and steps correctly with the art on.
