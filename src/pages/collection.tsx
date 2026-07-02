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
import { CollectionPager } from "@/features/gallery/collection-pager"
import { MasonryGrid } from "@/features/gallery/masonry-grid"

export default function Collection() {
  const { slug } = useParams()
  const collection = slug ? getCollection(slug) : undefined

  if (!collection) return <NotFoundView />

  return (
    <main className="mx-auto max-w-6xl px-6 pt-32 pb-24">
      <Reveal>
        <h1 className="text-display-sm">{collection.title}</h1>
        <p className="mt-4 max-w-prose text-muted-foreground">
          {collection.description}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {collection.photos.length} photographs
        </p>
      </Reveal>

      <div className="mt-14">
        {/* key forces a clean grid remount when paging between collections */}
        <MasonryGrid key={collection.slug} collection={collection} />
      </div>

      <CollectionPager current={collection} />
    </main>
  )
}
