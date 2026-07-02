/**
 * Photography — collection index (/photography).
 *
 * Renders the curated collection grid entirely from the content model
 * (src/content/collections.ts). Related-writing and satellite links
 * (presets, tutorials) join when their wings ship (M8/M10).
 */
import { Link } from "react-router"

import { ResponsiveImage } from "@/components/media/responsive-image"
import { Reveal, RevealGroup } from "@/components/motion/reveal"
import { COLLECTIONS, PHOTO_COUNT } from "@/content/collections"

export default function Photography() {
  return (
    <main className="mx-auto max-w-6xl px-6 pt-32 pb-24">
      <Reveal>
        <h1 className="text-display-sm">
          Photography
        </h1>
        <p className="mt-4 max-w-prose text-muted-foreground">
          {COLLECTIONS.length} collections · {PHOTO_COUNT} photographs
        </p>
      </Reveal>

      <RevealGroup className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
    </main>
  )
}
