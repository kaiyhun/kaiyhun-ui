/**
 * Collection page — /c/:slug
 *
 * M1 placeholder: proves routing, params, and deep-link refresh on GitHub
 * Pages. M4 replaces the body with the real gallery grid driven by the
 * content model (src/content/), which will also 404 unknown slugs.
 */
import { Link, useParams } from "react-router"

import { Reveal } from "@/components/motion/reveal"
import { Button } from "@/components/ui/button"

export default function Collection() {
  const { slug } = useParams()

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 px-6 text-center">
      <Reveal>
        <h1 className="text-display-sm capitalize">{slug}</h1>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="text-muted-foreground">
          Collection gallery lands in milestone M4.
        </p>
      </Reveal>
      <Reveal delay={0.2}>
        <Button asChild variant="outline">
          <Link to="/">Home</Link>
        </Button>
      </Reveal>
    </main>
  )
}
