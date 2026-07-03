/**
 * Photography — collection index (/photography) with subject filtering.
 *
 * Default view: the curated collection-card grid. Selecting a tag chip
 * (or arriving at ?tag=x) switches to a pooled masonry of every matching
 * photo across collections; clicking one opens the lightbox IN PLACE,
 * navigating the tag pool (not the photo's home collection). Filter
 * state lives in the URL (pushed, so back/forward walk filter history)
 * and unknown tags get an empty state rather than a blank page.
 */
import { AnimatePresence, motion } from "motion/react"
import { Link, useSearchParams } from "react-router"

import { ResponsiveImage } from "@/components/media/responsive-image"
import { Reveal, RevealGroup } from "@/components/motion/reveal"
import { Button } from "@/components/ui/button"
import {
  COLLECTIONS,
  PHOTO_COUNT,
  getTaggedPhotos,
} from "@/content/collections"
import { Lightbox } from "@/features/gallery/lightbox"
import { MasonryGrid } from "@/features/gallery/masonry-grid"
import { TagFilter } from "@/features/gallery/tag-filter"
import { useLightboxState } from "@/features/gallery/use-lightbox-state"
import { MOTION } from "@/lib/motion-tokens"

export default function Photography() {
  const [searchParams, setSearchParams] = useSearchParams()
  const lightbox = useLightboxState()

  const tag = searchParams.get("tag")
  const setTag = (next: string | null) => {
    setSearchParams((params) => {
      if (next) params.set("tag", next)
      else params.delete("tag")
      return params
    })
  }

  const tagged = tag ? getTaggedPhotos(tag) : []

  return (
    <main className="mx-auto max-w-6xl px-6 pt-32 pb-24">
      <Reveal>
        <h1 className="text-display-sm">Photography</h1>
        <p className="mt-4 max-w-prose text-muted-foreground">
          {COLLECTIONS.length} collections · {PHOTO_COUNT} photographs
        </p>
        <div className="mt-8">
          <TagFilter value={tag} onChange={setTag} />
        </div>
      </Reveal>

      {/* Crossfade between the card index and pooled tag views */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tag ?? "all"}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: MOTION.duration.base,
            ease: MOTION.ease.outExpo,
          }}
          className="mt-12"
        >
          {tag ? (
            tagged.length > 0 ? (
              <>
                <p className="mb-6 text-sm text-muted-foreground">
                  {tagged.length}{" "}
                  {tagged.length === 1 ? "photograph" : "photographs"} tagged “
                  {tag}”
                </p>
                <MasonryGrid
                  key={tag}
                  photos={tagged}
                  onOpen={(entry) => lightbox.open(entry.photo.file)}
                />
              </>
            ) : (
              <div className="py-16 text-center">
                <p className="text-muted-foreground">
                  No photographs tagged “{tag}” yet.
                </p>
                <Button
                  variant="outline"
                  className="mt-6"
                  onClick={() => setTag(null)}
                >
                  Show everything
                </Button>
              </div>
            )
          ) : (
            <RevealGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {COLLECTIONS.map((collection, index) => (
                <Reveal key={collection.slug} distance={32}>
                  <Link
                    to={`/photography/${collection.slug}`}
                    className="group block outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    <div className="overflow-hidden rounded-xl">
                      <ResponsiveImage
                        picture={collection.cover.picture}
                        placeholder={collection.cover.lqip}
                        alt={collection.coverAlt}
                        sizes="(min-width: 64rem) 23rem, (min-width: 40rem) 45vw, 100vw"
                        // First card is above the fold — don't lazy-load the LCP
                        eager={index === 0}
                        className="aspect-[4/3] transition-transform duration-(--motion-duration-slow) ease-(--ease-out-expo) group-hover:scale-105"
                      />
                    </div>
                    <div className="mt-4 flex items-baseline justify-between gap-4">
                      <h2 className="font-display text-xl font-semibold tracking-tight transition-colors duration-(--motion-duration-fast) group-hover:text-primary">
                        {collection.title}
                      </h2>
                      <span className="shrink-0 text-sm text-muted-foreground">
                        {collection.photos.length}{" "}
                        {collection.photos.length === 1 ? "photo" : "photos"}
                      </span>
                    </div>
                    <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
                      {collection.description}
                    </p>
                  </Link>
                </Reveal>
              ))}
            </RevealGroup>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Lightbox over the pooled view: navigation, counter, and
          preloading all follow TAG order — not the photos' home
          collections. ?tag and ?photo coexist in the URL, so links
          into a filtered viewer keep their context. */}
      {tag && (
        <Lightbox
          photos={tagged}
          title={`Photos tagged ${tag}`}
          file={lightbox.file}
          onNavigate={lightbox.goTo}
          onClose={lightbox.close}
        />
      )}
    </main>
  )
}
