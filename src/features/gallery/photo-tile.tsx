/**
 * PhotoTile — one photograph in the gallery grid.
 *
 * Natural aspect ratio (masonry), lazy-loaded through ResponsiveImage.
 * Hover/focus: slow zoom (transform-only, clipped by the tile) with a
 * bottom scrim carrying the caption (the photo's approved alt text).
 * Sharp corners by design — the hairline-gap grid reads as one surface.
 *
 * M5 will wrap tiles in lightbox trigger buttons; keyboard focus and
 * click affordances arrive with that interactivity.
 */
import { ResponsiveImage } from "@/components/media/responsive-image"
import type { ImageRef, Photo } from "@/content/types"

interface PhotoTileProps {
  photo: Photo
  image: ImageRef
  /** Layout width hint for the grid context this tile renders in. */
  sizes: string
}

export function PhotoTile({ photo, image, sizes }: PhotoTileProps) {
  return (
    <figure className="group relative overflow-hidden">
      <ResponsiveImage
        picture={image.picture}
        placeholder={image.lqip}
        alt={photo.alt}
        sizes={sizes}
        className="w-full transition-transform duration-(--motion-duration-slow) ease-(--ease-out-expo) group-hover:scale-[1.04]"
      />
      <figcaption
        // Caption doubles the alt text for sighted users on hover; hidden
        // from screen readers so they don't hear the description twice.
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/85 to-transparent p-4 pt-12 text-sm text-foreground/90 opacity-0 transition-opacity duration-(--motion-duration-base) ease-(--ease-out-expo) group-hover:opacity-100"
      >
        {photo.alt}
      </figcaption>
    </figure>
  )
}
