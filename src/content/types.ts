/**
 * Content model types — the shapes every wing of the site declares its
 * content in. Components render whatever the model provides; no content
 * strings live in components. See docs/homepage-brief.md § content model.
 *
 * Approved copy source: docs/content-draft.md (user-reviewed).
 */
import type { Picture } from "vite-imagetools"

/** A processed image reference: responsive picture + inline blur placeholder. */
export interface ImageRef {
  picture: Picture
  /** Base64 LQIP data URL (see docs/images.md). */
  lqip: string
}

/** One photograph inside a collection. */
export interface Photo {
  /** File stem inside the collection folder, e.g. "iceland_3". */
  file: string
  /** User-approved description for screen readers. Never empty. */
  alt: string
}

/** A photography collection (one folder under src/assets/). */
export interface Collection {
  slug: string
  /** Asset path under src/assets/, as "<category>/<collection>"
   *  (e.g. "landscape/iceland"; may differ from slug). */
  folder: string
  title: string
  /** Short user-approved blurb shown on index cards and collection pages. */
  description: string
  /** Cross-cutting vocabulary: subjects + topics (docs/homepage-brief.md). */
  tags: string[]
  /** Cover image shown on index cards / gateway panels. */
  cover: ImageRef
  /** Alt text for the cover (from the photo it belongs to). */
  coverAlt: string
  photos: Photo[]
}
