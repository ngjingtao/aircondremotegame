# Integration — the app is already wired

The art task does **not** require code changes. This page explains what the
loader does, how to switch it on, and how to verify it.

## How the app consumes art

### Lesson plates

Every one of the eight lesson pages now contains:

```html
<div class="art-wrap">
  <img id="art-plate" class="art-plate" alt="" hidden />
  <svg id="art" …> … the hand-drawn scene … </svg>
</div>
```

and loads `shared/art.js`. Each `scene.show(step)` ends with:

```js
if (ARG.art) ARG.art.show('electric', n);   // one call per lesson
```

`ARG.art.show` builds `../art/lessons/<lesson>/<01..06>.webp`. On `load` it
shows the image and hides the SVG; on `error` it hides the image and restores
the SVG. Nothing is requested unless `config.art.lessons` is `true`.

The SVG stays in the page as the fallback, and the step text/word highlight in
the panel is unaffected. The image is decorative (`alt=""`); the accessible
text is the panel.

### Home tiles

`home.js` calls `mountTileArt()` once at boot. When `config.art.tiles` is
`true`, it derives the key from each tile's `href` (`aircond/index.html` →
`aircond`) and adds `art/tiles/<key>.webp`. On load it hides that tile's SVG;
on error it removes the image and leaves the SVG.

## Switch it on

Edit `www/shared/config.js`:

```js
art: {
  lessons: true,   // after the 48 plates exist
  tiles: true      // after the 23 tiles exist
},
```

Keep them `false` while the folders are empty. With `false` there are no
requests and no 404 noise; this is the current state.

You can enable one at a time.

## Add the files

```text
www/art/lessons/electric/01.webp … 06.webp
www/art/lessons/magnet/01.webp   … 06.webp
www/art/lessons/light/01.webp    … 06.webp
www/art/lessons/sunbear/01.webp  … 06.webp
www/art/lessons/speaker/01.webp  … 06.webp
www/art/lessons/computer/01.webp … 06.webp
www/art/lessons/power/01.webp    … 06.webp
www/art/lessons/safety/01.webp   … 06.webp

www/art/tiles/aircond.webp … safety.webp   (23 files)
```

Names are part of the contract: **`01`–`06`**, two digits, lowercase folder
names, `.webp`.

If the generator gives you PNG, convert:

```bash
cwebp -q 88 -resize 1024 1536 input.png -o 01.webp
# or
ffmpeg -i input.png -vf "scale=1024:1536:force_original_aspect_ratio=increase,crop=1024:1536" \
       -c:v libwebp -quality 88 01.webp
```

Do not stretch an image to the target ratio; crop from the centre. Keep the
subject in the central 80%. `www/art/manifest.json` lists every expected file.

## Cache and service worker

The app is a PWA. After changing JS/config or adding art:

1. Bump the cache name in `www/sw.js` (currently `play-learn-caption-1`).
   On Render/CI `npm run stamp` replaces it with the commit hash, so a deploy
   is enough there; a local test needs the manual bump.
2. Reload twice, or DevTools → Application → Service Workers → Update.

The 71 images are **not** in the precache list. Adding ~20 MB to the install
would make the first visit slow and blow the offline cache budget. They are
fetched on demand and the service worker's runtime cache keeps them after the
first view. If you want the lesson plates available offline from the first
visit, add only that lesson's six files to `ASSETS`, not all 71.

## Verify

### Automated

```bash
npm test
```

Expected today: **362** simulation + **45** voice + **427** render, 0 failed.
The render suite checks every lesson has the `#art-plate` slot, loads
`shared/art.js`, and asks for its plate on each step.

### Manual — lesson

1. Put one image at `www/art/lessons/electric/01.webp`.
2. Set `art.lessons: true`; reload `electric/`.
3. The first step shows the image instead of the SVG.
4. Press NEXT; the image changes to `02.webp`.
5. Rename `02.webp` to `02.webp.bak` and press NEXT: the old SVG must come back
   (that is the fallback). Restore the file.
6. Check the panel still reads and highlights words.

### Manual — tile

1. Put one image at `www/art/tiles/electric.webp`.
2. Set `art.tiles: true`; reload the home page.
3. The Electricity tile shows the image; the SVG is hidden.
4. Rename the image and reload: the SVG tile returns.

### Rollback

Set both gates back to `false` — the app is exactly as it is today. No code
changes are needed to undo.

## What is deliberately not covered

The 15 older simulations (aircon, food, train, breathing, aircon care, toilet,
Indah Water, hood, laundry, tree, sandwich, water home, water cycle, weather,
engine) are animated and interactive: parts light up, gauges move, characters
walk. A single still per page would freeze them. Replacing those needs either
background plates plus the existing vector actors, or a new per-state art
contract. Keep their SVGs for this phase; the eight step lessons and the home
tiles are the clean split.

## File budget

| Item | Target |
|---|---|
| Lesson plate | ≤ 300 KB each, 1024×1536 WebP |
| Tile | ≤ 120 KB each, 512×512 WebP |
| All 48 plates | ≤ 15 MB |
| All 23 tiles | ≤ 3 MB |

If a plate is heavier, lower WebP quality before lowering resolution; the scene
box is not huge, and 1024×1536 is already generous.

Commit the images under `www/art/`. Do not put them in `docs/`.
