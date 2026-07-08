/**
 * NotFoundView — shared 404 presentation.
 *
 * Rendered by the catch-all route page AND by content pages whose params
 * resolve to nothing (e.g. an unknown collection slug). Lives in
 * components/ because pages are leaves — they must never import each
 * other (docs/code-conventions.md).
 */
import { Link } from "react-router"

import { Reveal } from "@/components/motion/reveal"
import { Button } from "@/components/ui/button"

export function NotFoundView() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 px-6 text-center">
      <title>404 — Kaiyhun</title>
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
