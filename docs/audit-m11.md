# M11 audit log — findings, fixes, and the pre-launch checklist

The record of everything evaluated in the M11 sweep (2026-07-07/08).
Fixed items are checked; unchecked items are YOURS to complete or
consciously skip before launch. Check them off here as you go.

## Fixed during the audit ✅

- [x] **Invalid list semantics** (a11y): WritingBand, PostList,
      RelatedWriting, PapersShelf rendered `<ol>` → Reveal `<div>` →
      `<li>`; Reveal now sits INSIDE each `<li>`. (Lighthouse a11y
      90 → 100 on home.)
- [x] **CLS 0.176 on every route**: the route Suspense fallback was
      null, so the footer painted high and jumped when the page chunk
      mounted. Fallback now reserves `min-h-svh` (app.tsx).
- [x] **CLS on post pages**: same story for the lazy MDX body —
      fallback now reserves `min-h-[60svh]` (post.tsx).
- [x] **Contrast failure**: topic-tag lines used `text-primary/80`
      (below AA on the dark background) → full `text-primary` in
      post.tsx, post-list, writing-band.
- [x] **UnderlineTabs migration**: CategoryMenu, drawing ViewMenu, blog
      TopicMenu are now thin wrappers over `components/ui/underline-tabs`
      (no more hand-rolled copies; regression-checked).
- [x] **Per-page SEO meta**: photography, collection (:slug-specific),
      drawing, about, 404 now set `<title>`/description via React 19
      hoisting (blog/lab/tutorial/preset pages already did).
- [x] **/about shipped** (bio, goals timeline, contact, colophon) +
      nav/mobile-menu link + sitemap entry.

## Lighthouse (production build, desktop)

- [x] `/` — 100 a11y · 100 BP · 100 SEO (after fixes; was 90 a11y)
- [x] `/blog/why-i-started-coding` — 100 · 100 · 100 (was 95 a11y)
- [ ] Run the remaining routes when content is final (photography,
      drawing, lab, tutorial, preset, preset/2020, about) — the fixed
      issues were site-wide patterns, but verify before launch.
- [ ] Repeat on mobile emulation before launch.

## Operational notes

- [x] **Never kill a running Vite process mid-build**: a pkill'd
      preview corrupted the imagetools cache → cryptic rolldown
      "oneshot canceled" build failure. Remedy:
      `rm -rf node_modules/.cache/imagetools`.

## Pre-launch checklist (unchecked = waiting on you)

### Real content replacing placeholders

- [ ] site.ts: real email + social URLs (currently placeholders except
      YouTube), then click-verify every outbound link
- [ ] Logo: header still uses the React starter SVG (kickoff "for now")
- [ ] og:image: pick a default social-share image; wire it in
      scripts/postbuild-blog.mjs (M8 open item)
- [ ] Blog: delete the two [PLACEHOLDER] posts
- [ ] Blog: fill @pinterest_reference_add_later credits in drawings.ts
      alt text
- [ ] Homepage: drawing panel horizontal image (lake_4 is a temp
      placeholder per your commit note)
- [ ] Lab: swap [MOCK] projects + papers for real repos/papers
      (docs/lab.md § swapping)
- [ ] Tutorials: true before/after image pairs (current sliders use two
      different photos); rewrite WHY_WE_EDIT in your voice
- [ ] Presets: real Gumroad URL; final backdrop picks (V2.0 +
      rotating trio); hand-written alt text for the 36 examples
- [ ] About: rewrite BIO / GOALS / COLOPHON in your voice
      (content-draft §16)
- [ ] Decide fate of untracked docs (content-draft.md,
      drawing-page-context.md, claude-code-kickoff.md,
      phase-0-scaffold.md) — commit or ignore; drawing-page-context.md
      is personal, consider keeping it out of the public repo

### Nice-to-haves (deliberate deferrals)

- [ ] RSS feed (declined in M8 — revisit if readers ask)
- [ ] ?tech filtering on Lab cards (once real projects exist)
- [ ] Cross-medium "related work" modules (photo ↔ drawing subjects,
      deferred from M7 until drawings mature)
- [ ] Homepage about teaser section (brief item #4 — nav link shipped
      instead; add the teaser if the page bottom feels abrupt)
