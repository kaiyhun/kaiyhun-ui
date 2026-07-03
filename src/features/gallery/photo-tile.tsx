/**
 * PhotoTile — one photograph in the gallery grid, as a lightbox trigger.
 *
 * Natural aspect ratio (masonry), lazy-loaded through ResponsiveImage.
 * Hover/focus: slow zoom (transform-only, clipped by the tile) with a
 * bottom scrim carrying the caption (the photo's approved alt text).
 * Sharp corners by design — the hairline-gap grid reads as one surface.
 *
 * The whole tile is a real <button> (keyboard focusable), marked with
 * data-photo so the lightbox can return focus to it on close.
 */
import { ResponsiveImage } from "@/components/media/responsive-image"
import type { ImageRef, Photo } from "@/content/types"

interface PhotoTileProps {
  photo: Photo
  image: ImageRef
  /** Layout width hint for the grid context this tile renders in. */
  sizes: string
  /** Opens the lightbox on this photo. */
  onOpen: (file: string) => void
}

export function PhotoTile({ photo, image, sizes, onOpen }: PhotoTileProps) {
  return (
    <button
      type="button"
      data-photo={photo.file}
      onClick={() => onOpen(photo.file)}
      aria-label={`View photo: ${photo.alt}`}
      className="group relative block w-full cursor-zoom-in overflow-hidden outline-none focus-visible:ring-3 focus-visible:ring-ring/70 focus-visible:ring-inset"
    >
      <ResponsiveImage
        picture={image.picture}
        placeholder={image.lqip}
        alt={photo.alt}
        sizes={sizes}
        className="w-full transition-transform duration-(--motion-duration-slow) ease-(--ease-out-expo) group-hover:scale-[1.04] group-focus-visible:scale-[1.04]"
      />
      <span
        // Caption doubles the alt text for sighted users on hover/focus;
        // hidden from screen readers (the button label already carries it)
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/85 to-transparent p-4 pt-12 text-left text-sm text-foreground/90 opacity-0 transition-opacity duration-(--motion-duration-base) ease-(--ease-out-expo) group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        {photo.alt}
      </span>
    </button>
  )
}
