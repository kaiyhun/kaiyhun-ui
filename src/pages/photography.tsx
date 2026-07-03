/**
 * Photography — collection index (/photography), split into Landscape
 * and Portrait sections.
 *
 * A category sub-menu under the title filters the page: "All" (default)
 * stacks both sections with a separator; picking a category shows just
 * that section. Each section has its own curated tag chips; selecting a
 * tag focuses its category (so the pooled masonry + lightbox are always
 * unambiguous) and pools matching photos across that category's
 * collections. All state is URL-driven (?category, ?tag, ?photo) —
 * shareable, refresh-proof, back/forward-friendly.
 */
import { AnimatePresence, motion } from "motion/react"
import { Link, useSearchParams } from "react-router"

import { ResponsiveImage } from "@/components/media/responsive-image"
import { Reveal, RevealGroup } from "@/components/motion/reveal"
import { Button } from "@/components/ui/button"
import {
  CATEGORY_LABELS,
  PHOTO_CATEGORIES,
  TAG_CHIPS,
  collectionsIn,
  getTaggedPhotos,
  photoCountIn,
  type PhotoCategory,
} from "@/content/collections"
import type { Collection } from "@/content/types"
import { CategoryMenu } from "@/features/gallery/category-menu"
import { Lightbox } from "@/features/gallery/lightbox"
import { MasonryGrid } from "@/features/gallery/masonry-grid"
import { TagFilter } from "@/features/gallery/tag-filter"
import { useLightboxState } from "@/features/gallery/use-lightbox-state"
import { MOTION } from "@/lib/motion-tokens"

/** One category's collection cards (the section's unfiltered view). */
function CollectionCards({
  collections,
  eagerFirst = false,
}: {
  collections: Collection[]
  /** First card of the first visible section is the likely LCP. */
  eagerFirst?: boolean
}) {
  return (
    <RevealGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {collections.map((collection, index) => (
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
                eager={eagerFirst && index === 0}
                className="aspect-[4/3] transition-transform duration-(--motion-duration-slow) ease-(--ease-out-expo) group-hover:scale-105"
              />
            </div>
            <div className="mt-4 flex items-baseline justify-between gap-4">
              <h3 className="font-display text-xl font-semibold tracking-tight transition-colors duration-(--motion-duration-fast) group-hover:text-primary">
                {collection.title}
              </h3>
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
  )
}

export default function Photography() {
  const [searchParams, setSearchParams] = useSearchParams()
  const lightbox = useLightboxState()

  const rawCategory = searchParams.get("category")
  const category = PHOTO_CATEGORIES.includes(rawCategory as PhotoCategory)
    ? (rawCategory as PhotoCategory)
    : null
  // Tags are category-scoped, so ?tag is only honored with a category
  const tag = category ? searchParams.get("tag") : null

  const setCategory = (next: PhotoCategory | null) => {
    setSearchParams((params) => {
      if (next) params.set("category", next)
      else params.delete("category")
      // Category is a fresh context — clear tag/photo state with it
      params.delete("tag")
      params.delete("photo")
      return params
    })
  }

  /** Selecting a tag inside a section focuses that section's category. */
  const setTag = (sectionCategory: PhotoCategory, next: string | null) => {
    setSearchParams((params) => {
      if (next) {
        params.set("category", sectionCategory)
        params.set("tag", next)
      } else {
        params.delete("tag")
      }
      params.delete("photo")
      return params
    })
  }

  const tagged = category && tag ? getTaggedPhotos(tag, category) : []
  const sections = category ? [category] : PHOTO_CATEGORIES

  return (
    <main className="mx-auto max-w-6xl px-6 pt-32 pb-24">
      <Reveal>
        <h1 className="text-display-sm">Photography</h1>
        <div className="mt-8">
          <CategoryMenu value={category} onChange={setCategory} />
        </div>
      </Reveal>

      {/* Crossfade whenever the visible view changes */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${category ?? "all"}:${tag ?? ""}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: MOTION.duration.base,
            ease: MOTION.ease.outExpo,
          }}
        >
          {sections.map((section, sectionIndex) => (
            <section
              key={section}
              aria-labelledby={`section-${section}`}
              className={
                sectionIndex > 0
                  ? "mt-20 border-t border-border pt-16"
                  : "mt-12"
              }
            >
              <h2
                id={`section-${section}`}
                className="font-display text-3xl font-bold tracking-tight"
              >
                {CATEGORY_LABELS[section]}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {collectionsIn(section).length} collections ·{" "}
                {photoCountIn(section)} photographs
              </p>
              <div className="mt-6">
                <TagFilter
                  chips={TAG_CHIPS[section]}
                  value={category === section ? tag : null}
                  onChange={(next) => setTag(section, next)}
                />
              </div>

              <div className="mt-10">
                {category === section && tag ? (
                  tagged.length > 0 ? (
                    <>
                      <p className="mb-6 text-sm text-muted-foreground">
                        {tagged.length}{" "}
                        {tagged.length === 1 ? "photograph" : "photographs"}{" "}
                        tagged “{tag}”
                      </p>
                      <MasonryGrid
                        key={`${section}:${tag}`}
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
                        onClick={() => setTag(section, null)}
                      >
                        Show everything
                      </Button>
                    </div>
                  )
                ) : (
                  <CollectionCards
                    collections={collectionsIn(section)}
                    eagerFirst={sectionIndex === 0}
                  />
                )}
              </div>
            </section>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Lightbox over a pooled tag view: navigation, counter, and
          preloading all follow the TAG pool within one category.
          ?category, ?tag and ?photo coexist — links keep full context. */}
      {category && tag && (
        <Lightbox
          photos={tagged}
          title={`${CATEGORY_LABELS[category]} photos tagged ${tag}`}
          file={lightbox.file}
          onNavigate={lightbox.goTo}
          onClose={lightbox.close}
        />
      )}
    </main>
  )
}
