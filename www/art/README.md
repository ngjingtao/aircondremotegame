# Generated illustrations — drop-in folder

This folder is where AI-generated art goes. **Nothing here is required**: with
`www/shared/config.js` → `art.lessons` / `art.tiles` set to `false` (the default),
the app keeps using the hand-drawn SVGs and never requests these files.

```
www/art/
├─ lessons/
│  ├─ electric/01.webp … 06.webp
│  ├─ magnet/01.webp   … 06.webp
│  ├─ light/01.webp    … 06.webp
│  ├─ sunbear/01.webp  … 06.webp
│  ├─ speaker/01.webp  … 06.webp
│  ├─ computer/01.webp … 06.webp
│  ├─ power/01.webp    … 06.webp
│  └─ safety/01.webp   … 06.webp
├─ tiles/
│  ├─ aircond.webp … safety.webp   (23 files)
└─ manifest.json
```

The full task, prompts and acceptance criteria are in [`docs/art/`](../../docs/art/README.md).
Read `docs/art/INTEGRATION.md` before generating, and `docs/art/PROMPTS.md` for the
copy-paste prompt for every file.
