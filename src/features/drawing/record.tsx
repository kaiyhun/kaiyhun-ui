/**
 * Record — the actual drawings, grouped as the journey's evidence:
 * 2022 sketches (small, honest), current studies from reference (given
 * room), imagined pieces (the point of it all, unfinished).
 *
 * Tiles reuse the gallery's PhotoTile (hover caption, lightbox trigger);
 * one Lightbox spans ALL drawings in page order, so flipping through the
 * record follows the journey. Continues the narrative thread visually —
 * groups hang off the same left border as the chapters.
 */
import { Reveal } from "@/components/motion/reveal"
import { DRAWING_GROUPS, DRAWING_SEQUENCE } from "@/content/drawings"
import { Lightbox } from "@/features/gallery/lightbox"
import { PhotoTile } from "@/features/gallery/photo-tile"
import { getPhotoImage } from "@/features/gallery/photos"
import { useLightboxState } from "@/features/gallery/use-lightbox-state"
import { cn } from "@/lib/utils"

/** Tiles render at ~50% of a narrow column — modest by design. */
const TILE_SIZES = "(min-width: 40rem) 21rem, 50vw"

export function Record() {
  const lightbox = useLightboxState()

  return (
    <>
      <ol>
        {DRAWING_GROUPS.map((group) => (
          <li
            key={group.slug}
            className="relative border-l border-border pb-16 pl-8 sm:pl-12"
          >
            <span
              aria-hidden
              className="absolute top-1 -left-[5.5px] size-2.5 rounded-full bg-primary/60"
            />
            <Reveal distance={16}>
              <h2 className="font-display text-lg font-semibold tracking-tight">
                {group.title}
              </h2>
              <p className="mt-1.5 max-w-prose text-sm text-muted-foreground">
                {group.description}
              </p>
            </Reveal>
            <div
              className={cn(
                "mt-6 grid gap-1",
                // Pairs read well in the narrow column; single landscape
                // pieces may span both tracks via the tile's natural ratio
                "grid-cols-2",
              )}
            >
              {group.photos.map((photo) => (
                <Reveal key={photo.file} distance={16}>
                  <PhotoTile
                    photo={photo}
                    image={getPhotoImage(group.folder, photo.file)}
                    folder={group.folder}
                    sizes={TILE_SIZES}
                    onOpen={() => lightbox.open(photo.file)}
                  />
                </Reveal>
              ))}
            </div>
          </li>
        ))}
      </ol>

      <Lightbox
        photos={DRAWING_SEQUENCE}
        title="Drawing record"
        file={lightbox.file}
        onNavigate={lightbox.goTo}
        onClose={lightbox.close}
      />
    </>
  )
}
