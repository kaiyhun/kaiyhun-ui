/**
 * CollectionPager — previous/next collection navigation (curated order,
 * cover thumbnails) plus a link back to the index. No wrap-around: the
 * first collection has no "previous", the last no "next".
 */
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Link } from "react-router"

import { ResponsiveImage } from "@/components/media/responsive-image"
import { Button } from "@/components/ui/button"
import { COLLECTIONS } from "@/content/collections"
import type { Collection } from "@/content/types"
import { cn } from "@/lib/utils"

interface PagerCardProps {
  collection: Collection
  direction: "previous" | "next"
}

function PagerCard({ collection, direction }: PagerCardProps) {
  const isNext = direction === "next"
  return (
    <Link
      to={`/photography/${collection.slug}`}
      className={cn(
        "group flex items-center gap-4 outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        isNext && "flex-row-reverse text-right",
      )}
    >
      <div className="w-24 shrink-0 overflow-hidden rounded-lg sm:w-32">
        <ResponsiveImage
          picture={collection.cover.picture}
          placeholder={collection.cover.lqip}
          alt=""
          sizes="8rem"
          className="aspect-[3/2] transition-transform duration-(--motion-duration-slow) ease-(--ease-out-expo) group-hover:scale-105"
        />
      </div>
      <div>
        <p className="flex items-center gap-1.5 font-display text-xs font-semibold tracking-[0.15em] text-muted-foreground uppercase">
          {!isNext && <ArrowLeft aria-hidden className="size-3.5" />}
          {direction}
          {isNext && <ArrowRight aria-hidden className="size-3.5" />}
        </p>
        <p className="mt-1 font-display text-lg font-semibold tracking-tight transition-colors duration-(--motion-duration-fast) group-hover:text-primary">
          {collection.title}
        </p>
      </div>
    </Link>
  )
}

interface CollectionPagerProps {
  current: Collection
}

export function CollectionPager({ current }: CollectionPagerProps) {
  const index = COLLECTIONS.findIndex((c) => c.slug === current.slug)
  const previous = index > 0 ? COLLECTIONS[index - 1] : undefined
  const next =
    index < COLLECTIONS.length - 1 ? COLLECTIONS[index + 1] : undefined

  return (
    <nav
      aria-label="Collections"
      className="mt-16 border-t border-border pt-10"
    >
      <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
        {previous ? (
          <PagerCard collection={previous} direction="previous" />
        ) : (
          <span aria-hidden />
        )}
        {next ? (
          <PagerCard collection={next} direction="next" />
        ) : (
          <span aria-hidden />
        )}
      </div>
      <div className="mt-10 text-center">
        <Button asChild variant="outline">
          <Link to="/photography">All collections</Link>
        </Button>
      </div>
    </nav>
  )
}
