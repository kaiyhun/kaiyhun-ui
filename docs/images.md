# Image pipeline

> Built in milestone M2. See `docs/architecture.md` for where this sits in
> the system; `docs/implementation-plan.md` for milestone status.

Two stages: **masters** (committed, prepared once per new image) and
**derivatives** (generated at build time, never committed).

## Stage 1 — masters (`npm run prepare-masters`)

`scripts/prepare-masters.mjs` reads raw originals from `originals/<collection>/`
(git-ignored) and writes optimized masters to `src/assets/<collection>/`:

- longest edge ≤ 2560px, never upscaled
- mozjpeg quality 80, EXIF orientation baked in, metadata stripped (GPS etc.)
- always `.jpg` output; idempotent (skips masters newer than their original)

Result on the initial set: **179.6 MB of originals → 23.7 MB of masters.**
Keep true originals backed up wherever you store them; `originals/` is just
the staging area and never gets committed.

**Adding a collection:** drop the folder into `originals/`, run
`npm run prepare-masters`, describe it in `src/content/` (M3+), commit the
new masters.

## Stage 2 — build-time derivatives (vite-imagetools)

Configured in `vite.config.ts` (`removeMetadata`, disk cache in
`node_modules/.cache/imagetools`). Images are imported with directives:

```ts
import shot from "@/assets/iceland/iceland_1.jpg?w=400;800;1200;2000&format=avif;webp;jpeg&as=picture"
import shotLqip from "@/assets/iceland/iceland_1.jpg?w=24&format=webp&inline"
```

- `as=picture` → `{ sources: { avif, webp, jpeg → srcsets }, img: { src, w, h } }`
- `inline` → base64 data URL (~1 kB, the LQIP)
- Everything is content-hashed by Vite → immutable browser caching despite
  GitHub Pages' fixed `max-age=600`
- Type declarations for both query shapes: `src/types/imagetools.d.ts`
  (directives must end in `&as=picture` or `&inline` to match)

## Rendering — `<ResponsiveImage>` (the only way to render images)

`src/components/media/responsive-image.tsx` owns `<picture>`/`srcset`/`sizes`,
LQIP blur-up (placeholder as background, real image fades in on load), lazy
loading, and `width`/`height` to prevent layout shift.

```tsx
<ResponsiveImage
  picture={shot}
  placeholder={shotLqip}
  alt="…meaningful description (required by the type)…"
  sizes="(min-width: 64rem) 30rem, (min-width: 40rem) 50vw, 100vw"
  eager // hero/above-fold only: fetchpriority=high + eager loading
/>
```

**Get `sizes` right** — it's the browser's only pre-layout width hint.
Account for container caps: a 50vw column inside `max-w-5xl` never exceeds
~32rem, so say so. Wrong hints silently over-fetch (verified during M2:
an uncapped `50vw` on a wide viewport selects the 2000w tier when 1200w
suffices).

## Verified behavior (M2, production build via `vite preview`)

- Chrome selects **AVIF**, correct tier for slot × DPR (1200w for a
  480 CSS px slot at DPR 2)
- Below-fold images make **zero requests** until scrolled near (only the
  inline LQIPs are present up-front)
- Under Slow-3G throttling: LQIP shows while the real image is at
  opacity 0, fade-in on load, placeholder removed after
- Derivative set per master: 4 widths × 3 formats (+1 LQIP)
