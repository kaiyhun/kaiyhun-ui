/**
 * NotFound — 404 page. Also the landing spot for GitHub Pages deep links
 * that hit a real missing path (the 404.html shell renders the router,
 * which resolves here only when the URL truly matches nothing).
 */
import { Link } from "react-router"

import { Reveal } from "@/components/motion/reveal"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 px-6 text-center">
      <Reveal>
        <h1 className="text-display">
          404<span className="text-accent">.</span>
        </h1>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="text-lg text-muted-foreground">
          Nothing to see here — the shot you're after doesn't exist.
        </p>
      </Reveal>
      <Reveal delay={0.2}>
        <Button asChild size="lg">
          <Link to="/">Back to the work</Link>
        </Button>
      </Reveal>
    </main>
  )
}
