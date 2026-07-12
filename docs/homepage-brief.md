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

| Route                | Page                                                                                                                                                                                                                                                                                                          |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`                  | Homepage hub                                                                                                                                                                                                                                                                                                  |
| `/photography`       | Collection index + related writing + satellite links. Homepage door: CategoryDoors — full-bleed reactive backdrop (hover/focus a category, its cover crossfades in; idle rotation), giant type links; scales to future categories (collaboration…). Same treatment on the Editing section (Tutorials/Presets) |
| `/photography/:slug` | Collection gallery (replaces `/c/:slug`)                                                                                                                                                                                                                                                                      |
| `/preset`            | Free preset downloads (photography satellite; LIVE placeholder)                                                                                                                                                                                                                                               |
| `/tutorial`          | Tutorial videos, embedded/linked (photography satellite; LIVE placeholder)                                                                                                                                                                                                                                    |
| `/drawing`           | Drawing wing (LIVE — shipped as journey timeline w/ inline work rails, not a gallery; see `docs/drawing-wing.md`). Homepage door: full cinematic door — rotating landscape-photo backdrop (RotatingBackdrop; DRAFT picks content-draft §18) + text over scrim; the old panel (TEMP lake_4) is retired         |
| `/lab`               | Lab — research & code pillar (LIVE, mock content; `docs/lab.md`). Homepage door: BinaryScene — an ambient 0/1 pixel cat watching the moon, canvas glyph grid, theme-token colored (`features/home/binary-scene.tsx`; art = editable string bitmaps)                                                           |
| `/blog`              | All posts, filterable by topic                                                                                                                                                                                                                                                                                |
| `/blog/:slug`        | Post                                                                                                                                                                                                                                                                                                          |
| `/about`             | Bio + contact                                                                                                                                                                                                                                                                                                 |

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
`min-h-dvh` (DYNAMIC viewport height — `svh` left a gap at the bottom
on phones once the URL bar collapsed mid-scroll, showing the next
section's top; `dvh` tracks the browser chrome), FULL-BLEED with an
opaque `bg-background`; the content column
lives in an inner `max-w-6xl` div whose padding — `py-16`, `md:py-24` —
clears the fixed header). Content is vertically centered at every
width (user decision — phones match desktop); text is left-aligned
throughout. The HERO is "00" in the same system
(`features/home/hero.tsx`): bottom-anchored stack — numbered eyebrow
(DRAFT label "Personal universe"), colossal wordmark (text-display-2xl),
approved tagline, CTAs, live meta counts bottom-right (lg+) — with a
signature intro choreography (Ken Burns settle, drawn rule, masked
wordmark rise, staggered fades; pointer parallax on fine pointers; all
transform/opacity, reduced-motion safe, LCP still eager).
Composition is the EDITORIAL KICKER system (user decision):
each section's h2 is a tiny numbered eyebrow ("01 —— PHOTOGRAPHY",
`features/home/section-kicker.tsx`; number+rule aria-hidden, so the
accessible name stays clean) and the section has exactly ONE big type
moment — the category doors (display-lg) on Photography/Editing, the
statement line (display-md) on Drawing/Lab/Blog.
You scroll within a section (the pager OWNS the wheel and applies the
scroll itself, clamped to the section); at a section's edge, accumulated
wheel delta past a threshold turns the "page"
with a FADE-THROUGH: the page fades to the background, the scroll jumps
invisibly, the new page fades in, landing FLUSH at the viewport top.
Controller: `src/features/home/use-section-pager.ts`; drives (and syncs
the active highlight of) the floating `SectionNav` menu and the
`ScrollHint` chevron (bobbing bottom-center affordance, visible while any
paged content remains below the viewport).

**Load-bearing decisions:**

- **Pointer + motion only (a11y escape hatch, user decision).** We only
  ever intercept `wheel`; keyboard (PageDown / Space / arrows / Tab),
  touch, and `prefers-reduced-motion` all keep native continuous
  scrolling. The escape hatch is literally "don't attach the wheel
  listener" — so the paged behavior can never trap anyone, and the page
  degrades to a normal scroll.
- **Touch = free scroll + magnet snap (user decision 2026-07-12 —
  `mandatory` page-forcing felt glitchy on real phones).**
  `@media (pointer: coarse)` + `html:has([data-page-snap])` applies
  `scroll-snap-type: y proximity` with `scroll-snap-align: start` on
  sections (index.css; the homepage opts in via `data-page-snap` on
  `<main>`): scrolling is completely normal, and the browser only
  snaps a gesture that SETTLES near a section top. No JS touches
  touch: gestures stay native, tall sections scroll freely inside
  (snap areas larger than the snapport are scrollable within by
  spec), and the `pointer: coarse` gate is mutually exclusive with
  the pager's
  `pointer: fine` wheel ownership. (The homepage renders no footer —
  gated in app.tsx — so the document ends on the last page and every
  scroll position has a snap target.)
- **Fade-through, not a transform "cover" turn (user decision — the cover
  felt stiff).** A Motion tween (tokens: `duration.slow` +
  `ease.cinematic`) fades ALL sections out, jumps with
  `scrollTo({behavior:"instant"})` (global CSS `scroll-behavior:smooth`
  would re-animate the hidden jump), and fades back in. Fading every
  section — not just the pair — covers viewports that span a boundary, and
  makes the same fade serve any jump distance. Any keydown/pointerdown
  mid-turn cancels the tween, so scrollbar grabs and paging keys always
  beat the animation.
- **Flush-top landings, no `scroll-mt`.** Sections carry no scroll margin;
  header clearance is internal padding. Keeps the takeover truly
  full-screen and the edge detection symmetric.
- **Wheel ownership, not native scroll + prediction (the tall-section
  fix).** On pointer + motion we `preventDefault` EVERY wheel event and
  apply the scroll ourselves, CLAMPED to the anchored section's flush
  range. Earlier versions let the browser scroll natively inside a section
  and predicted the seam from each event's `deltaY` — but macOS scroll
  ACCELERATION scrolls many times the `deltaY`, so a fast flick leapt clean
  over a tall section's seam (the next event already read the NEXT section
  as current) and the homepage scrolled straight through. Owning the wheel
  makes a boundary un-overshootable: a giant flick just lands on the wall,
  and only accumulated intent AT the wall turns the page. The anchored
  section advances ONLY via a turn, so acceleration can't silently move us
  off it. Trade-off: within-section scrolling loses OS inertia (minor for
  these moderate sections). Carve-out: at the last section's bottom (and
  the footer beneath it) native scroll is allowed so the footer stays
  reachable.
- **Momentum guard with pause / reversal / rising-edge re-arms (Magic
  Mouse).** After a turn the accumulator parks at a sentinel so inertia
  can't cascade into a second turn; while parked, the tail is also
  suppressed mid-section so landings stay flush. Magic Mouse tails tick
  for seconds, constantly refreshing the idle clock — pause-only
  re-arming made scrolling feel DEAD (a fresh swipe merged into the tail
  was swallowed; users had to stop/click to recover). Re-arms: a genuine
  pause (`IDLE_RESET_MS`), a direction reversal, or — since a tail's
  |deltaY| only ever decays — a delta rising above `RE_ARM_RATIO ×` the
  decaying recent peak (`PEAK_DECAY` per event).
- **`activeId` is pinned to the target during a turn** so the menu
  highlight can't flicker through intermediate sections.

**Tuning knobs** (feel is hardware-dependent — tune in a real browser):
`TURN_THRESHOLD`, `IDLE_RESET_MS`, `RE_ARM_RATIO`, `PEAK_DECAY` in the
hook; fade duration/curve via the `--motion-*` tokens (`slow` /
`cinematic`); `y proximity` is the shipped touch mode (mandatory was
tried first and reverted — too insistent on real phones).

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
