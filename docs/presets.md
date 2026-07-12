# Presets — /preset + /preset/2020 (M10-B)

Free presets treated like open source (user's framing — the intro asks
users to pay it forward). User's raw notes: docs/preset.md.

## /preset — the index

Intro (DRAFT) + two full-width rows:

- **Preset V2.0** — coming soon: accent badge + tagline, NO buttons
  (user decision: no dead controls). Static backdrop (user pick:
  lakeLouise_1, placeholder).
- **Preset Pack 2020** — the row itself links to /preset/2020;
  "View the collection" + "Download — free" buttons sit BELOW the row
  so interactives never nest inside the Link. Backdrop is a
  RotatingBackdrop: crossfades 3 example shots every 5s (opacity-only,
  pauses off-screen, static first frame under reduced motion). Current
  picks are PLACEHOLDERS (KY01_4 user pick + KY03_1/KY04_1).

## /preset/2020 — the pack detail

Image-forward (user direction: "the image should do the talking, the
text secondary"): header (pack contents + download), then one section
per preset — KY01–KY08 + BONUS — each a compact title/description/
feature row above a large MasonryGrid of its examples. One Lightbox
spans all 36 examples in page order (?photo URL-driven). Unknown
:slug → 404 (only "2020" exists).

## Content model (src/content/presets.ts)

- Preset descriptions/features = USER'S WORDS from docs/preset.md.
- Sections reuse the Collection shape (like drawings) so gallery
  machinery works unchanged; NOT in COLLECTIONS. Cover fields are
  shape-fillers, never rendered.
- Example images live in `src/assets/preset/<CODE>/` and resolve via
  the gallery globs (preset added as a LIVE category). They were
  committed directly (≤1920px, within the master budget; imagetools
  strips metadata at build).
- ⚠ PLACEHOLDERS: Gumroad URL (https://gumroad.com/), rotating backdrop
  picks, generic alt text, page intro + V2.0 tagline (drafts).

## Swapping placeholders

1. Real Gumroad link → PACK_2020_DOWNLOAD_URL.
2. Final row/backdrop picks → the imports at the top of presets.ts.
3. Reviewed alt text → replace the generated `examples()` alts with
   hand-written ones when ready.


## Pack-detail spine timeline (2026-07-10 recomposition)

/preset/2020's preset sections hang off a vertical timeline: a
track with one node per preset (KY01 → BONUS), a primary fill bar
scroll-linked via Motion useScroll→scaleY (transform-only; spring
smoothing is scroll-linked, safe under reduced motion), line-driven
node states (nodes subscribe to the same spring as the bar and flip
the instant the tip passes their measured position; ResizeObserver
re-measures as masonry images settle),
and a gentle dim on non-active section text. Spine parts are
aria-hidden; heading ids/aria-labelledby unchanged. Feature lines
render as pill chips — all preset copy verbatim.


## /preset/v2 — V2.0 preview page (2026-07-11, WIP by design)

Deliberately UNLINKED from the index (the V2 row stays a no-link
coming-soon). Structure: header from PACK_V2 + WIP banner → THE MIXER →
the shared spine timeline (PresetTimeline, extracted from /preset/2020;
currently fed PRESET_SECTIONS verbatim as stand-ins).

The mixer (features/presets/preset-mixer.tsx) is styled as an EDITING
PANEL: frame left, tool panel right (stacks on mobile). Each filter is
a LAYER row — Switch (on/off) + opacity Slider + % readout — plus a
header strip with hold-to-compare (eye, flashes the original) and
reset. Layer model: enabled filters build a bottom→top stack of
CUMULATIVE combo images (original → +tone → +tone+grain → …, keys from
v2ComboKey over V2_MIXER_IMAGES in content/presets.ts); each layer
renders at its slider's opacity, so sliders blend real exports like
layer opacity in an editor. All 16 images are 2020-example STAND-INS
(partial opacities blend two DIFFERENT photos until real same-frame
exports land); going real = replacing the 16 imports. Delivery: layers
fully covered by an opaque layer above are not mounted (default all-on
fetches original + top combo only); hovering/focusing a row pre-warms
every combo its slider or switch could reveal. Slider/Switch primitives
came from the shadcn registry, restyled in components/ui.
