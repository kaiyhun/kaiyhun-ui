/**
 * DrawingGallery — the drawing page's Gallery view: just the work, no
 * narrative. Each group is headed by a numbered SectionKicker (the
 * site's editorial magazine language; titles + descriptions verbatim
 * from the content model) with a masonry grid under it, so the record
 * stays organized as eras and new groups slot in as the content grows.
 *
 * Tiles open the same page-wide lightbox sequence as the Story view's
 * rails (the page owns the lightbox; this only reports clicks). The
 * Story view's JourneyRail deliberately keeps its own bespoke design.
 */
import { SectionKicker } from "@/components/layout/section-kicker"
import { Reveal } from "@/components/motion/reveal"
import { DRAWING_GROUPS } from "@/content/drawings"
import { MasonryGrid } from "@/features/gallery/masonry-grid"

interface DrawingGalleryProps {
  /** Opens the lightbox on this photo file. */
  onOpen: (file: string) => void
}

export function DrawingGallery({ onOpen }: DrawingGalleryProps) {
  return (
    <div className="mt-12">
      {DRAWING_GROUPS.map((group, index) => (
        <section
          key={group.slug}
          aria-labelledby={`drawing-group-${group.slug}`}
          className={index > 0 ? "mt-16 border-t border-border pt-12" : ""}
        >
          <Reveal distance={16}>
            <SectionKicker
              number={String(index + 1).padStart(2, "0")}
              id={`drawing-group-${group.slug}`}
              label={group.title}
              intro={group.description}
            />
          </Reveal>
          <div className="mt-6">
            <MasonryGrid
              photos={group.photos.map((photo) => ({
                photo,
                collection: group,
              }))}
              onOpen={(entry) => onOpen(entry.photo.file)}
            />
          </div>
        </section>
      ))}
    </div>
  )
}
