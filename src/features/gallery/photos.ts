/**
 * Gallery photo resolver — turns content-model photo entries into
 * pipeline-processed images.
 *
 * All masters are imported here via glob with gallery-tile directives
 * (grid tiles never render wider than ~24rem, so 1200w is the ceiling).
 * Because this module lives in the lazy-loaded gallery feature, the
 * image metadata ships only with the collection-page chunk.
 */
import type { Picture } from "vite-imagetools"

import type { ImageRef } from "@/content/types"

/** category/collection/file → responsive picture (all masters). */
const PICTURES = import.meta.glob("/src/assets/*/*/*.jpg", {
  query: "?w=400;800;1200&format=avif;webp;jpeg&as=picture",
  import: "default",
  eager: true,
}) as Record<string, Picture>

/** category/collection/file → inline LQIP data URL (all masters). */
const LQIPS = import.meta.glob("/src/assets/*/*/*.jpg", {
  query: "?w=24&format=webp&inline",
  import: "default",
  eager: true,
}) as Record<string, string>

/**
 * Resolves one photo's processed images.
 * @param folder content-model folder, e.g. "landscape/iceland"
 * @param file   photo file stem, e.g. "iceland_3"
 */
export function getPhotoImage(folder: string, file: string): ImageRef {
  const key = `/src/assets/${folder}/${file}.jpg`
  const picture = PICTURES[key]
  const lqip = LQIPS[key]
  if (!picture || !lqip) {
    throw new Error(
      `No master found for "${key}" — does the file exist under src/assets/ and match the content model?`,
    )
  }
  return { picture, lqip }
}
