/**
 * Collection page — /photography/:slug
 *
 * M3 placeholder driven by the content model: shows the real title and
 * description, and hands unknown slugs to the 404. M4 replaces the body
 * with the full gallery grid.
 */
import { Link, useParams } from "react-router"

import { Reveal } from "@/components/motion/reveal"
import { Button } from "@/components/ui/button"
import { getCollection } from "@/content/collections"
import NotFound from "@/pages/not-found"

export default function Collection() {
  const { slug } = useParams()
  const collection = slug ? getCollection(slug) : undefined

  if (!collection) return <NotFound />

  return (
    <main className="mx-auto max-w-6xl px-6 pt-32 pb-24">
      <Reveal>
        <h1 className="text-display-sm">{collection.title}</h1>
        <p className="mt-4 max-w-prose text-muted-foreground">
          {collection.description}
        </p>
      </Reveal>
      <Reveal delay={0.1} className="mt-10">
        <p className="text-sm text-muted-foreground">
          Full gallery ({collection.photos.length} photographs) lands in
          milestone M4.
        </p>
        <Button asChild variant="outline" className="mt-6">
          <Link to="/photography">All collections</Link>
        </Button>
      </Reveal>
    </main>
  )
}
