/**
 * Tutorials page — /tutorial
 *
 * Placeholder proving the route; the real wing (embedded videos from the
 * YouTube channel) lands with milestone M10.
 */
import { Link } from "react-router"

import { Reveal } from "@/components/motion/reveal"
import { Button } from "@/components/ui/button"

export default function Tutorials() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 px-6 text-center">
      <Reveal>
        <h1 className="text-display-sm">Tutorials</h1>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="text-muted-foreground">
          Video walkthroughs land in milestone M10.
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
