# Tutorials — /tutorial (M10-A)

Two views under the shared UnderlineTabs sub-menu (?view, URL-driven):

- **Videos** (default): featured tutorials large, the rest two-up,
  closing with the channel link. Videos are **facade embeds** — the page
  ships only a thumbnail + play button (zero YouTube JS on load);
  clicking swaps in the privacy-enhanced youtube-nocookie player with
  autoplay.
- **Before & After** (?view=before-after): the why-we-edit essay over
  draggable comparison sliders.

## Content model (src/content/tutorials.ts)

- `TUTORIALS`: videoId + fallback title (+ `featured`). Page order =
  array order. Adding a video = one line.
- `BEFORE_AFTER`: image pairs (imagetools imports) + alt + caption.
  ⚠ Current pairs are PLACEHOLDERS (two different photos) until true
  before/after exports of one frame exist.
- `WHY_WE_EDIT`: ⚠ PLACEHOLDER essay awaiting the user's own voice.

## Video metadata (config/youtube-oembed-plugin.ts)

`virtual:youtube-meta` maps videoId → { title, thumbnailUrl }, fetched
at build from YouTube's public oEmbed (no key) for every
`videoId: "..."` literal in tutorials.ts. SOFT-FAIL: offline/removed →
entry omitted → UI falls back to the hand-written title + the
predictable `i.ytimg.com/vi/<id>/hqdefault.jpg` thumbnail. Real titles
win over fallbacks so the page always matches YouTube.

## BeforeAfterSlider (features/tutorials/before-after-slider.tsx)

After = base layer; Before = top layer clipped by
`clip-path: inset(0 X% 0 0)`. Interaction contract:

- Pointer: press anywhere sets the divider, drag scrubs (pointer
  capture). Container is `touch-pan-y` so pages still scroll on touch;
  only the handle is `touch-none`. Position is set BEFORE capture —
  capture failures must never break press-to-set.
- Keyboard: the handle is a real `role="slider"` (arrows ±5%, Home/End,
  aria-valuetext "N% before").
- Both layers render via ResponsiveImage in a fixed 3:2 cover frame so
  slightly different crops still align.

## Swapping placeholders

1. Export true before/after JPEGs of one frame through
   `npm run prepare-masters` (any collection folder works).
2. Update the imports + alt/caption in `BEFORE_AFTER`; drop the
   [PLACEHOLDER] markers.
3. Rewrite `WHY_WE_EDIT` in your own voice (content-draft §14).


## Videos-view layout (2026-07-10 recomposition)

Featured tutorials render as numbered editorial media rows (facade
7/12 + text column 5/12, alternating sides); the rest as a two-up card
grid under a label-only SectionKicker; a full-width channel panel
closes the view. Per-video `description` + `focus` fields live in the
content model (DRAFTS, content-draft §20). VideoFacade tries the 1280px
maxresdefault thumbnail first and steps down via onError; layouts that
show the title themselves pass `showTitle={false}` and resolve it with
`tutorialTitle()`.
