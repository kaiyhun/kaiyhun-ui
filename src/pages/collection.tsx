/**
 * Collection page — /photography/:slug
 *
 * Compact text header, then the full masonry gallery, then prev/next
 * navigation. Entirely content-model-driven; unknown slugs render the
 * shared 404 view.
 */
import { useParams } from "react-router"

import { NotFoundView } from "@/components/layout/not-found-view"
import { Reveal } from "@/components/motion/reveal"
import { getCollection } from "@/content/collections"
import { SITE } from "@/content/site"
import { CollectionPager } from "@/features/gallery/collection-pager"
import { Lightbox } from "@/features/gallery/lightbox"
import { MasonryGrid } from "@/features/gallery/masonry-grid"
import { useLightboxState } from "@/features/gallery/use-lightbox-state"

export default function Collection() {
  const { slug } = useParams()
  const collection = slug ? getCollection(slug) : undefined
  const lightbox = useLightboxState()

  if (!collection) return <NotFoundView />

  // One shared sequence for the grid AND the lightbox (same order)
  const entries = collection.photos.map((photo) => ({ photo, collection }))

  return (
    <main className="mx-auto max-w-6xl px-6 pt-32 pb-24">
      {/* React 19 hoists these into <head> (M11 SEO pass) */}
      <title>{`${collection.title} — ${SITE.name}`}</title>
      <meta name="description" content={collection.description} />

      <Reveal>
        <h1 className="text-display-lg">{collection.title}</h1>
        <p className="mt-4 max-w-prose text-muted-foreground">
          {collection.description}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {collection.photos.length} photographs
        </p>
      </Reveal>

      <div className="mt-14">
        {/* key forces a clean grid remount when paging between collections */}
        <MasonryGrid
          key={collection.slug}
          photos={entries}
          onOpen={(entry) => lightbox.open(entry.photo.file)}
        />
      </div>

      <CollectionPager current={collection} />

      <Lightbox
        photos={entries}
        title={collection.title}
        file={lightbox.file}
        onNavigate={lightbox.goTo}
        onClose={lightbox.close}
      />
    </main>
  )
}
