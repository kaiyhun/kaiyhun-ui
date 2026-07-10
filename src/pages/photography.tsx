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
 *
 * Layout (2026-07-10 recomposition): the site's editorial magazine
 * language. Section headers are numbered kickers; each category opens
 * with a LEAD STORY (first curated collection — cover beside a
 * standfirst column) and the rest flow as a rhythm mosaic (pairs of
 * wide halves alternating with trios of tall thirds), every card
 * carrying the numbered meta row. The lead stays ≤ 2/3 content width
 * on purpose — covers ship at 1200w, so a full-bleed card would go
 * soft on retina.
 */
import { AnimatePresence, motion } from "motion/react"
import { Link, useSearchParams } from "react-router"

import { SectionKicker } from "@/components/layout/section-kicker"
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
import { SITE } from "@/content/site"
import type { Collection } from "@/content/types"
import { RelatedWriting } from "@/features/blog/related-writing"
import { CategoryMenu } from "@/features/gallery/category-menu"
import { Lightbox } from "@/features/gallery/lightbox"
import { MasonryGrid } from "@/features/gallery/masonry-grid"
import { TagFilter } from "@/features/gallery/tag-filter"
import { useLightboxState } from "@/features/gallery/use-lightbox-state"
import { MOTION } from "@/lib/motion-tokens"
import { cn } from "@/lib/utils"

/** Kicker-style meta row shared by every collection card. */
function CollectionMeta({
  number,
  collection,
}: {
  number: string
  collection: Collection
}) {
  return (
    <p className="flex items-center gap-3 font-display text-xs font-semibold tracking-[0.15em] text-muted-foreground uppercase">
      <span aria-hidden className="text-primary">
        {number}
      </span>
      <span aria-hidden className="h-px w-8 bg-muted-foreground/40" />
      {collection.photos.length}{" "}
      {collection.photos.length === 1 ? "photograph" : "photographs"}
    </p>
  )
}

/** One category's collections as an editorial mosaic: lead story on
 *  top, then a rhythm of wide halves and tall thirds. */
function CollectionMosaic({
  collections,
  eagerFirst = false,
}: {
  collections: Collection[]
  /** The lead cover of the first visible section is the likely LCP. */
  eagerFirst?: boolean
}) {
  const [lead, ...rest] = collections
  const numberFor = (index: number) => String(index + 1).padStart(2, "0")

  return (
    <div>
      {/* Lead story — cover beside its standfirst */}
      <Reveal distance={32}>
        <Link
          to={`/photography/${lead.slug}`}
          className="group grid gap-6 outline-none focus-visible:ring-3 focus-visible:ring-ring/50 lg:grid-cols-6 lg:gap-10"
        >
          <div className="overflow-hidden rounded-xl lg:col-span-4">
            <ResponsiveImage
              picture={lead.cover.picture}
              placeholder={lead.cover.lqip}
              alt={lead.coverAlt}
              sizes="(min-width: 64rem) 46rem, 100vw"
              eager={eagerFirst}
              className="aspect-[3/2] transition-transform duration-(--motion-duration-slow) ease-(--ease-out-expo) group-hover:scale-105"
            />
          </div>
          <div className="lg:col-span-2 lg:self-end lg:pb-2">
            <CollectionMeta number="01" collection={lead} />
            <h3 className="mt-4 font-display text-2xl font-bold tracking-tight text-balance transition-colors duration-(--motion-duration-fast) group-hover:text-primary sm:text-3xl">
              {lead.title}
            </h3>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              {lead.description}
            </p>
          </div>
        </Link>
      </Reveal>

      {/* The rest — halves (wide) and thirds (tall) in alternation */}
      <RevealGroup className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-6">
        {rest.map((collection, index) => {
          // Repeating rhythm: two wide halves, then three tall thirds
          const third = index % 5 >= 2
          return (
            <Reveal
              key={collection.slug}
              distance={32}
              className={third ? "lg:col-span-2" : "lg:col-span-3"}
            >
              <Link
                to={`/photography/${collection.slug}`}
                className="group block outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <div className="overflow-hidden rounded-xl">
                  <ResponsiveImage
                    picture={collection.cover.picture}
                    placeholder={collection.cover.lqip}
                    alt={collection.coverAlt}
                    sizes={
                      third
                        ? "(min-width: 64rem) 23rem, (min-width: 40rem) 45vw, 100vw"
                        : "(min-width: 64rem) 35rem, (min-width: 40rem) 45vw, 100vw"
                    }
                    className={cn(
                      "transition-transform duration-(--motion-duration-slow) ease-(--ease-out-expo) group-hover:scale-105",
                      third ? "aspect-[4/5]" : "aspect-[3/2]",
                    )}
                  />
                </div>
                <div className="mt-4">
                  <CollectionMeta
                    number={numberFor(index + 1)}
                    collection={collection}
                  />
                </div>
                <h3 className="mt-2 font-display text-xl font-semibold tracking-tight transition-colors duration-(--motion-duration-fast) group-hover:text-primary">
                  {collection.title}
                </h3>
                <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
                  {collection.description}
                </p>
              </Link>
            </Reveal>
          )
        })}
      </RevealGroup>
    </div>
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
      {/* React 19 hoists these into <head> (M11 SEO pass) */}
      <title>{`Photography — ${SITE.name}`}</title>
      <meta
        name="description"
        content="Landscape and portrait photography collections, filterable by subject."
      />

      <Reveal>
        <h1 className="text-display-lg">Photography</h1>
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
              {/* Numbered kicker — the category's identity numeral holds
                  even when the page is filtered to one section */}
              <SectionKicker
                number={String(PHOTO_CATEGORIES.indexOf(section) + 1).padStart(
                  2,
                  "0",
                )}
                id={`section-${section}`}
                label={CATEGORY_LABELS[section]}
                intro={`${collectionsIn(section).length} collections · ${photoCountIn(section)} photographs`}
              />
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
                      <p className="mb-6 font-display text-xs font-semibold tracking-[0.15em] text-muted-foreground uppercase">
                        <span className="text-primary">{tagged.length}</span>{" "}
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
                  <CollectionMosaic
                    collections={collectionsIn(section)}
                    eagerFirst={sectionIndex === 0}
                  />
                )}
              </div>
            </section>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* The hallway bridge: photography-topic posts (renders when real) */}
      <RelatedWriting topic="photography" />

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
