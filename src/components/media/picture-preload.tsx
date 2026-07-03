/**
 * PicturePreload — invisibly warms an image's derivatives in the browser
 * cache so a later real render is instant.
 *
 * Renders a 1px <picture> (not display:none — kept in-flow so every
 * browser honors source selection and actually fetches) with full
 * type/media negotiation, so exactly the file a future <picture> will
 * request gets cached. Used by: hero orientation swap, lightbox
 * neighbors, grid-tile hover intent.
 */
import type { Picture } from "vite-imagetools"

import { mimeType } from "@/lib/images"

interface PicturePreloadProps {
  picture: Picture
  /** Must match the sizes the future real render will use. */
  sizes?: string
  /** Fires when the warm-up finishes (e.g. to unmount the preloader). */
  onDone?: () => void
}

export function PicturePreload({
  picture,
  sizes = "100vw",
  onDone,
}: PicturePreloadProps) {
  return (
    <picture
      aria-hidden
      className="pointer-events-none absolute size-px overflow-hidden opacity-0"
    >
      {Object.entries(picture.sources).map(([format, srcSet]) => (
        <source
          key={format}
          type={mimeType(format)}
          srcSet={srcSet}
          sizes={sizes}
        />
      ))}
      <img
        src={picture.img.src}
        alt=""
        sizes={sizes}
        decoding="async"
        onLoad={onDone}
        onError={onDone}
      />
    </picture>
  )
}
