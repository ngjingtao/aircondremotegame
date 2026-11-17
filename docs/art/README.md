# Illustration handoff — Play & Learn

The app's scenes are hand-coded inline SVG. They are functional and schematic,
but they are not the illustrated children's-book look the lessons deserve.
This folder splits **art generation** out of the codebase so a better image
model can produce the pictures, while the app keeps working until the files
arrive.

## The split

| Task | Owner | Deliverable |
|---|---|---|
| **A · Art** | any image model / illustrator | 48 portrait lesson plates + 23 square home tiles, exact paths and sizes |
| **B · Integration** | already done in this repo | a drop-in loader, fallback to SVG, a gate that stays off until the files exist |
| **C · Acceptance** | you / a reviewer | run the checklist, flip two config flags, test one lesson and the home screen |

Task A is the part to hand to the other AI. It needs no knowledge of the code:
give it `BRIEF.md` + `PROMPTS.md`, and it writes files into `www/art/`.

## Read in this order

1. **[BRIEF.md](BRIEF.md)** — what to generate, the visual language, palette,
   sizes, naming, and what must never appear in an image.
2. **[SCENES.md](SCENES.md)** — what each of the 48 lesson steps and 23 tiles
   must show. This is the visual script.
3. **[PROMPTS.md](PROMPTS.md)** — a master style prompt, a negative prompt, and
   a copy-paste prompt for every asset.
4. **[INTEGRATION.md](INTEGRATION.md)** — where the files go, the two config
   gates, fallback behaviour, caching and tests.
5. **[CHECKLIST.md](CHECKLIST.md)** — the acceptance pass.
6. **[HANDOFF.md](HANDOFF.md)** — the message to copy to the image AI.

## Scope

**Phase 1 (this task):**

- 8 step lessons × 6 steps = **48 portrait plates** (`1024 × 1536`, WebP).
- **23 home tiles** (`512 × 512`, WebP).

**Not in this task:**

- The 15 older simulations (aircon, food, train, breathing, aircon care, toilet,
  Indah Water, hood, laundry, tree, sandwich, water home, water cycle, weather,
  engine). Their scenes are animated and part-interactive; replacing them needs
  a different design. Keep their SVGs for now.
- App icons, store screenshots, UI chrome, text, diagrams, or anything with
  letters in it.
- Code changes. The loader and fallback are already in the app; the art task
  only produces files.

## Current status

- `www/shared/art.js` is in place.
- Every lesson has an `#art-plate` image and calls `ARG.art.show(dir, step)`.
- The home screen can mount `www/art/tiles/<key>.webp`.
- The gates are **off**:
  `www/shared/config.js` → `art: { lessons: false, tiles: false }`.
- With the gates off there are **no requests and no 404s**; the hand-drawn SVG
  is the fallback.

Turn the gates on only after the files exist. See `INTEGRATION.md`.
