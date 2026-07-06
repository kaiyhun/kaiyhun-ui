# Drawing wing — /drawing

The most personal page on the site: a progress record of learning to
draw, not a showcase (full brief: `docs/drawing-page-context.md`). The
narrative is the user's own voice; treat every word in
`src/content/drawings.ts` as user-approved content.

## Two views (?view, URL-driven)

A Story/Gallery sub-menu under the title (`ViewMenu`, underline tabs
mirroring the photography CategoryMenu) switches the page:

- **Story** (default; no URL param) — the journey timeline below.
- **Gallery** (`?view=gallery`) — just the work (`DrawingGallery`): each
  group's title + description as a section heading with a masonry grid.

Switching views clears `?photo` (fresh context). The PAGE owns the one
lightbox over `DRAWING_SEQUENCE`; both views only report tile clicks up
via `onOpen`, so `?photo` deep links work in either view.

## Story layout: journey timeline with inline work rails

One narrow column (`max-w-3xl`), main component: `JourneyRail`
(`src/features/drawing/journey-rail.tsx`).

- A thin vertical **thread** (`border-l`) connects short first-person
  chapters, each a dot + year marker + prose. The years of silence render
  as a tall, nearly-empty stretch of dashed thread ("Two years later.");
  the current chapter's dot is primary blue. The page closes on an open
  dashed thread + `JOURNEY_CLOSER` — it's meant to keep growing.
- **Chapters with work attached carry a collapsible image rail** on
  their left. Collapsed: ~1rem slivers of the drawings peek out beside
  the thread and the chapter wears a count pill ("6 drawings") — the two
  discoverability cues. Expanded: the rail slides in, pushing that
  chapter's thread dot + prose right; the prose does NOT rewrap — it
  slides under a soft right-edge fade.
- Rails are one standard **single column**, height-capped
  (`--rail-max-h`: 24rem / 32rem on `sm+`) and scrollable inside
  (wheel/touch, hidden scrollbar) with up/down chevron buttons and edge
  fades appearing only in directions that still hold hidden drawings.
  A right-edge gradient at half opacity softens the collapsed slivers
  (user-tuned); the expanded drawings show at full contrast.
- Tiles are the gallery's `PhotoTile` (hover caption, intent prefetch);
  **one lightbox spans ALL drawings in page order** (`DRAWING_SEQUENCE`,
  `?photo=` URL-driven), so flipping through the record follows the
  journey.

### Rail geometry (all in `RAIL_VARS`)

`--rail-w` (rail width), `--rail-peek` (collapsed sliver width, 1.75rem),
`--rail-max-h` (scroll cap). The collapse/expand is a pure transform:
`translateX(-(rail-w − peek))` ↔ `0`. Two alignment invariants:

- Plain chapters offset by the peek (`ml-7` = `--rail-peek`) so the
  thread runs straight through rail and plain chapters alike (the page
  closer in `pages/drawing.tsx` carries the same `ml-7`).
- The prose column is `calc(100% − var(--rail-peek))` wide — collapsed it
  ends exactly at the `overflow-hidden` clip edge (same wrapping as plain
  chapters); only the expanded push slides it under the fade. `w-full`
  here would silently clip ~28px of every line on small screens.

If `--rail-w` changes, update `RAIL_SIZES` (the `sizes` hint = rail width
minus the 0.75rem gutter) to match.

## Content model (`src/content/drawings.ts`)

- `JOURNEY: JourneyChapter[]` — markers, paragraphs, `gap`, `current`.
- `DRAWING_GROUPS: Collection[]` — reuses the Collection shape so gallery
  machinery works unchanged; deliberately NOT in `COLLECTIONS`
  (photography pages must never pick them up). The imagination group
  (`drawing/random`) is currently commented out until those pieces
  return — restore its cover imports together with the group.
- `DRAWING_SEQUENCE` — flat lightbox order derived from the groups.
- `CHAPTER_WORK` — chapter `marker` → group slugs; which rail hangs off
  which chapter (user-curated). **Keys must match `JOURNEY` markers** —
  renaming a marker silently detaches its rail. A group absent from
  `CHAPTER_WORK` still appears in the lightbox sequence, just not on the
  page.

## Adding drawings

1. Drop originals in `originals/drawing/<group>/`, run
   `npm run prepare-masters drawing`.
2. Append to the group's `photos` in `drawings.ts` (user-approved alt
   text; `@…_add_later` markers flag pending reference credits).
3. The gallery glob in `features/gallery/photos.ts` already includes
   `drawing/*/*` — new masters resolve automatically.

## Accessibility

- The count pill is the real disclosure control (`aria-expanded` +
  `aria-controls`); the sliver strip is a pointer-only duplicate target
  (`tabIndex={-1}`, `aria-hidden`).
- Collapsed rails are `inert` — hidden tiles never trap tabbing or leak
  into the a11y tree.
- Transform/opacity only; slide + chevron scrolling respect
  reduced-motion (`motion-reduce:transition-none`, `behavior: "auto"`).
