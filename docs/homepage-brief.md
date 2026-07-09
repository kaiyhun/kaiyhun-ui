# Homepage & site brief — the multi-domain "personal universe"

> **Status: APPROVED (2026-07-02) — implementation authorized.** Supersedes the "photography-only portfolio" framing;
> the approved gallery milestones survive, re-homed under `/photography`.

## What this site is

Not a photography portfolio — a personal universe with several wings:
photography, drawings, research, coding, blog, presets, tutorial videos,
and an about. The homepage introduces all of it and routes visitors;
it specializes in nothing.

## Content architecture (user-confirmed 2026-07-02)

```
PILLARS (doors)                          CROSS-CUTTING LAYERS
─────────────────────────────           ─────────────────────────────
Photography  ── standalone flagship      Blog (topic) — spans every
  ↳ satellites: Presets, Tutorials         pillar via tags
Drawings     ── standalone               Subjects (portrait, landscape…)
Research & Code ── technical pillar        — bridge the two visual
                                           mediums (photo ↔ drawing)
```

- **Photography** is the flagship: collections + gallery (approved M4/M5
  work lands here). Presets and tutorial videos are its practical
  satellites — top-level pages, but visually/navigationally attached to
  photography's orbit.
- **Drawings**: second visual wing, gallery-like treatment (reuses the
  photography grid machinery).
- **Research & Code**: one pillar — research writing + coding projects.
- **Blog** connects everything: posts are tagged by topic
  (photography/drawings/research/code/…) and appear as "related writing"
  on their pillar pages, plus a recent-writing band on the homepage.

### Cross-medium subjects (user revision, 2026-07-02)

Photography and drawings are **intertwined by subject**: portrait
photography relates to portrait drawings, landscape photography to
landscape drawings. Pillars stay medium-first (the doors don't change),
but subjects create lateral bridges:

- A controlled **subject vocabulary** (`portrait`, `landscape`, … grows as
  needed) lives inside the shared tag system, applied to both photo
  collections and drawing sets.
- **"Related work" modules**: a portrait collection page links sideways to
  portrait drawings and vice versa — the visitor crosses mediums without
  going back through the homepage.
- **Subject views** (via the M6 tag/filter work): `?tag=portrait` shows
  both mediums together — photographs and drawings of the same subject
  side by side.
- **Optional homepage moment (to consider, not committed)**: a "paired
  feature" block showing a photograph beside a drawing of the same
  subject — a strong signature for a two-medium artist. Decide when the
  drawings content is in hand.

All wings have real content available (user-confirmed). Wings still launch
incrementally — a door appears on the homepage only when its page is real
("hidden until real").

## Route map (target)

| Route                | Page                                                                                                              |
| -------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `/`                  | Homepage hub                                                                                                      |
| `/photography`       | Collection index + related writing + satellite links                                                              |
| `/photography/:slug` | Collection gallery (replaces `/c/:slug`)                                                                          |
| `/preset`            | Free preset downloads (photography satellite; LIVE placeholder)                                                   |
| `/tutorial`          | Tutorial videos, embedded/linked (photography satellite; LIVE placeholder)                                        |
| `/drawing`           | Drawing wing (LIVE — shipped as journey timeline w/ inline work rails, not a gallery; see `docs/drawing-wing.md`) |
| `/lab`               | Lab — research & code pillar (LIVE, mock content; `docs/lab.md`)                                                  |
| `/blog`              | All posts, filterable by topic                                                                                    |
| `/blog/:slug`        | Post                                                                                                              |
| `/about`             | Bio + contact                                                                                                     |

## Homepage composition (top to bottom)

1. **Hero — identity statement** (user-chosen direction). Bold display
   type: name + what you do, over one cinematic photograph. Copy and
   hero image are **user inputs** — drafts proposed for approval, never
   invented silently.
2. **Gateway — pillar panels.** Asymmetric, image-backed, motion-heavy
   (staggered reveals, parallax inside panels). Photography largest
   (flagship) with "Presets · Tutorials" satellite links on its panel;
   Drawings; Research & Code. Only live wings render.
3. **Recent writing band.** Because blog is the hallway: 2–3 newest posts
   with their topic tags, linking into `/blog`. (Lands with the blog
   milestone; section hidden until then.)
4. **About teaser.** Short human paragraph + link. Copy is a user input.
5. Footer (exists).

### Boundary page-turn (paged section scrolling)

Each homepage section is a full-viewport "page" (`[data-page-section]`,
`min-h-svh`, FULL-BLEED with an opaque `bg-background`; the content column
lives in an inner `max-w-6xl` div whose `py-24` clears the fixed header).
You scroll freely _within_ a section (tall ones scroll normally); at a
section's edge, accumulated wheel delta past a threshold turns the "page":
the outgoing section recedes (lags the scroll at `RECEDE_LAG`, shrinks,
dims — transform/opacity only) while the incoming one slides over it and
lands FLUSH at the viewport top. Controller:
`src/features/home/use-section-pager.ts`; drives (and syncs the active
highlight of) the floating `SectionNav` menu.

**Load-bearing decisions:**

- **Pointer + motion only (a11y escape hatch, user decision).** We only
  ever intercept `wheel`; keyboard (PageDown / Space / arrows / Tab),
  touch, and `prefers-reduced-motion` all keep native continuous
  scrolling. The escape hatch is literally "don't attach the wheel
  listener" — so the paged behavior can never trap anyone, and the page
  degrades to a normal scroll.
- **Turns are a Motion tween driving `window.scrollTo` (tokens:
  `duration.slower` + `ease.cinematic`).** This REVERSES the earlier
  "native `scrollIntoView` only" decision — the cinematic cover transition
  (user decision) needs per-frame progress that native smooth scroll can't
  provide. The tween's historic fragility (stale target after mid-turn
  reflow → under-shoot) is countered by re-deriving the landing position
  every frame and snapping exactly onto it on completion. `scrollTo` must
  pass `behavior:"instant"` (global CSS `scroll-behavior:smooth` would
  re-smooth each frame). Any keydown/pointerdown mid-turn cancels the
  tween, so scrollbar grabs and paging keys always beat the animation.
- **Flush-top landings, no `scroll-mt`.** Sections carry no scroll margin;
  header clearance is internal padding. This keeps the takeover truly
  full-screen and the edge detection symmetric (with an 80px offset,
  scrolling onward needed 80px of native creep before the next seam
  engaged).
- **Cover pairing is adjacent-only.** Menu jumps ≥2 pages away glide
  without the recede effect — pairing pages viewports apart would animate
  content that is never on screen. `activeId` is pinned to the target for
  the duration so the menu highlight can't flicker through intermediate
  sections.
- **Momentum guard.** After a turn the accumulator is parked at a sentinel
  so trackpad inertia can't cascade into a second turn; only a real pause
  (`IDLE_RESET_MS`) clears it.

**Tuning knobs** (feel is hardware-dependent — tune in a real browser):
`TURN_THRESHOLD`, `IDLE_RESET_MS`, `RECEDE_LAG`, `RECEDE_SCALE`,
`RECEDE_DIM` in the hook; turn duration/curve via the `--motion-*` tokens
(`slower`/`cinematic`); gate `min-h-svh` to `md:` if the full-height
layout feels too airy on mobile.

## Unified content model (basis for M3)

One base shape so the homepage, tag filtering, and "related writing" work
across domains:

```ts
interface ContentItem {
  type: "collection" | "drawing-set" | "post" | "project" | "preset" | "video"
  slug: string
  title: string
  description: string
  date: string // ISO — drives "latest" ordering
  tags: string[] // cross-cutting: topics (blog) + SUBJECTS (portrait,
  //                landscape, …) bridging photo ↔ drawing mediums
  cover?: ImageRef // pipeline import; required for visual types
}
```

Subject tags are a documented controlled vocabulary within `tags` (not a
separate field) so one filtering system serves both the blog's topics and
the visual mediums' subjects; "related work" = same subject tag, different
visual type.

Per-type extensions (e.g. collections add images+alt, videos add embed
URL, presets add download file). Everything declared in `src/content/`.

## Constraints & flags

- **Presets must remain free downloads** on GitHub Pages (no commerce per
  ToS — kickoff doc). Selling later ⇒ different host; flag, don't build.
- Videos live on YouTube (or similar) and are embedded — zero bandwidth
  cost to Pages.
- Blog/research = markdown-based authoring pipeline; its own milestone.
- Repo size: drawings + preset files go through the same "masters"
  discipline as photos where applicable.

## Revised milestone sequence (PROPOSED — replaces approved M3–M7)

| #   | Delivers                                                                                                                                                                                          |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| M3  | Unified content model + homepage hub (hero, gateway, about teaser) + `/photography` index page                                                                                                    |
| M4  | Collection pages `/photography/:slug` (as approved, re-homed)                                                                                                                                     |
| M5  | Lightbox (as approved)                                                                                                                                                                            |
| M6  | Cross-domain tags/filtering (as approved, now spanning types; subject vocabulary defined here)                                                                                                    |
| M7  | ✅ Drawing wing — shipped at `/drawing` as a personal journey timeline with inline work rails (reuses gallery tiles/lightbox); cross-medium "related work" modules deferred until drawings mature |
| M8  | ✅ Blog engine — shipped: MDX pipeline, `/blog` + post pages, homepage Writing band, related-writing modules on both visual pillars                                                               |
| M9  | ✅ Lab pillar — shipped: /lab project cards (+build-time GitHub stats), papers shelf, code-topic writing, page navigator; mock content until real repos/papers land                               |
| M10 | ✅ A Tutorials (/tutorial: facade embeds + before/after view) · ✅ B Presets (/preset rows + /preset/2020 image-forward detail)                                                                   |
| M11 | ✅ About page + audit complete — remaining pre-launch items tracked in docs/audit-m11.md                                                                                                          |

Every milestone still ships deploy-green with docs updated.

## User inputs needed before M3 starts

1. **Identity statement** for the hero (name/tagline) — or approve drafts
2. **Hero photograph** — pick one (or approve a proposal)
3. **Photography content**: per-collection title, description, tags; per-image
   alt text — user writes, or reviews Claude-drafted proposals
4. **Naming**: "Lab" vs "Research" vs other for the technical pillar
5. Explicit **go-ahead** for this brief + revised milestones
