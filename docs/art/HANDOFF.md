# Handoff message — copy this to the image AI

You are the illustrator for **Play & Learn**, a children's science app. Your job
is to replace schematic diagrams with warm, consistent illustrations. You do
**not** touch the app code; you produce image files at exact paths.

## Inputs

Read, in this order:

1. `docs/art/BRIEF.md` — audience, style, palette, hard rules.
2. `docs/art/SCENES.md` — what each image must show.
3. `docs/art/PROMPTS.md` — the master prompt, the negative prompt and the
   scene line for every file.
4. `www/art/manifest.json` — the exact list of expected files.

## Output

- **48 lesson plates:** `www/art/lessons/<lesson>/01.webp` … `06.webp`,
  1024×1536, WebP.
- **23 home tiles:** `www/art/tiles/<key>.webp`, 512×512, WebP.
- Names exactly as above. No extra files in those folders.
- If your tool cannot write WebP, deliver PNG at the same size and say so;
  conversion is a separate step.

## Rules

- Every image = `MASTER STYLE` + `Scene: <line>` + `NEGATIVE`.
- **No text** — no letters, words, numbers, labels, captions, UI, logos or
  watermarks. The only exception is **N** and **S** on magnets and a compass.
- No 3D, photorealism, CGI, glossy plastic, neon, lens flare, clutter, scary
  faces, extra limbs or injuries.
- The six plates of one lesson must look like six frames of the same scene:
  same room, props, light direction and line weight.
- Keep the subject inside the central 80%; the app crops with `object-fit:
  cover`.
- Use the palette in `BRIEF.md`; do not invent a second palette.

## Work order

1. One lesson at a time: generate all six plates, review them side by side,
   regenerate any that break continuity.
2. Move to the next lesson.
3. Then the 23 tiles, all in one session with the same style reference.
4. For each image, keep the prompt and seed in a `notes.md` (not in the image
   folder) so a bad frame can be reproduced.

## Reply with

- A table of file path → generated yes/no.
- The prompt and seed used per file.
- Any file you could not make (do not silently skip).
- A contact sheet for review, separate from the deliverable files.

## Do not

- Do not draw a grid/contact sheet **as** the deliverable.
- Do not put the lesson title or step number in the image.
- Do not change the lesson order or file names.
- Do not modify anything outside `www/art/`.
