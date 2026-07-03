/**
 * Gallery photo resolver — turns content-model photo entries into
 * pipeline-processed images.
 *
 * All masters are imported here via glob with gallery-tile directives
 * (grid tiles never render wider than ~24rem, so 1200w is the ceiling).
 * Because this module lives in the lazy-loaded gallery feature, the
 * image metadata ships only with the collection-page chunk.
 *
 * The globs cover LIVE categories only (landscape + portrait) — masters
 * can sit in src/assets ahead of their wing shipping (e.g. drawings)
 * without being built into dist. Add a pattern to the three globs when
 * a category's wing goes live.
 */
import type { Picture } from "vite-imagetools"

import type { ImageRef } from "@/content/types"

/** category/collection/file → responsive picture (all masters). */
const PICTURES = import.meta.glob(
  ["/src/assets/landscape/*/*.jpg", "/src/assets/portrait/*/*.jpg"],
  {
    query: "?w=400;800;1200&format=avif;webp;jpeg&as=picture",
    import: "default",
    eager: true,
  },
) as Record<string, Picture>

/** category/collection/file → inline LQIP data URL (all masters). */
const LQIPS = import.meta.glob(
  ["/src/assets/landscape/*/*.jpg", "/src/assets/portrait/*/*.jpg"],
  {
    query: "?w=24&format=webp&inline",
    import: "default",
    eager: true,
  },
) as Record<string, string>

/** Full-size tiers for the lightbox — the one full-viewport context
 *  where the largest derivatives are justified. */
const LIGHTBOX_PICTURES = import.meta.glob(
  ["/src/assets/landscape/*/*.jpg", "/src/assets/portrait/*/*.jpg"],
  {
    query: "?w=1200;2000;2560&format=avif;webp;jpeg&as=picture",
    import: "default",
    eager: true,
  },
) as Record<string, Picture>

function resolve<T>(map: Record<string, T>, key: string): T {
  const value = map[key]
  if (!value) {
    throw new Error(
      `No master found for "${key}" — does the file exist under src/assets/ and match the content model?`,
    )
  }
  return value
}

/**
 * Resolves one photo's processed images (grid tiles: ≤1200w + LQIP).
 * @param folder content-model folder, e.g. "landscape/iceland"
 * @param file   photo file stem, e.g. "iceland_3"
 */
export function getPhotoImage(folder: string, file: string): ImageRef {
  const key = `/src/assets/${folder}/${file}.jpg`
  return { picture: resolve(PICTURES, key), lqip: resolve(LQIPS, key) }
}

/** Resolves the lightbox (full-screen) rendition of a photo. */
export function getLightboxImage(folder: string, file: string): ImageRef {
  const key = `/src/assets/${folder}/${file}.jpg`
  return {
    picture: resolve(LIGHTBOX_PICTURES, key),
    lqip: resolve(LQIPS, key),
  }
}
