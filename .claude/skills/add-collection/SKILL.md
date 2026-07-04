---
name: add-collection
description: Add new photos to the site — a new collection, additions to an existing one, or a whole new category. Use when the user drops images into originals/ or asks to add photo collections. Covers renaming, master generation, content-model drafting, and verification.
---

# Add a photo collection

The end-to-end workflow for getting raw images onto the site. Content
(titles, descriptions, alt text, tags, curation) is ALWAYS drafted for
user review — never shipped silently.

## 1. Originals in place

- Raw files belong in `originals/<category>/<collection>/` (git-ignored).
  Categories: `landscape`, `portrait` today; new categories are just new
  folders.
- Rename files to `<collection>_N.<ext>` (numbered, extension preserved,
  `.jpeg` → `.jpg`). Use a two-phase rename (temp names first) to avoid
  collisions. The user keeps their own backups; never delete originals.

## 2. Generate masters

- `npm run prepare-masters` — idempotent; mirrors the structure into
  `src/assets/<category>/<collection>/` as ≤2560px q80 JPEGs. Report the
  size reduction to the user.
- New CATEGORY? The gallery globs in `src/features/gallery/photos.ts`
  list live categories explicitly — add the new pattern ONLY when its
  wing actually renders, otherwise unused derivatives bloat dist.

## 3. View the photos (required before drafting)

- Build contact sheets (a sharp script exists in past sessions; recreate:
  4-col grid of 420×300 cover-fit thumbs per collection) and READ each
  sheet. Check dimensions (`sips -g pixelWidth -g pixelHeight`) — needed
  for masonry balance and any panel/art-direction picks.

## 4. Draft content (for user review)

- Append a draft section to `docs/content-draft.md`: display title, 1–2
  sentence description, curated photo order (strong opener, varied
  rhythm, deliberate closer), cover pick, per-photo alt text (concise,
  dignified — it doubles as the visible caption), per-photo tags from the
  existing controlled vocabulary (extend it only with justification;
  chips are curated per category in `TAG_CHIPS`).
- Mirror the draft into `src/content/collections.ts`: cover imports
  (`?w=400;800;1200&format=avif;webp;jpeg&as=picture` + `?w=24&format=webp&inline`
  LQIP), collection entry with `folder: "<category>/<collection>"`.
  Slugs must be unique site-wide.

## 5. Verify

- `npm run check` + `npm run build` green.
- Browser (production preview): collection card on `/photography`,
  masonry grid renders every photo, lightbox opens/navigates, tag pools
  include the new photos, counts updated everywhere (sections, gateway
  panels).

## 6. Hand off

- Summarize what was drafted, flag ALL content as pending review, remind
  the user they commit. Update `docs/implementation-plan.md` status if a
  milestone moved.
