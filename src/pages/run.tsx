/**
 * run — /run: the hidden gravity-flip runner (easter egg; full design
 * doc in docs/game.md, copy drafts in content-draft §23).
 *
 * DELIBERATELY UNLINKED: no nav entry, excluded from the sitemap, and
 * noindex'd — you get here by typing the URL, typing `run` in the
 * Matrix terminal, or reading the dev-console hint. The page is a thin
 * mono-flavored frame; the game itself is features/game/runner.tsx.
 */
import { Runner } from "@/features/game/runner"
import { SITE } from "@/content/site"

export default function Run() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-4xl flex-col justify-center px-6 pt-24 pb-16">
      <title>{`run_ — ${SITE.name}`}</title>
      <meta name="robots" content="noindex" />

      <p className="font-mono text-xs tracking-[0.15em] text-muted-foreground uppercase">
        <span aria-hidden className="text-accent">
          ➜{" "}
        </span>
        ./run — found it, huh?
      </p>
      <h1 className="sr-only">Gravity-flip runner</h1>

      <div className="mt-6">
        <Runner />
      </div>

      <p className="mt-4 font-mono text-xs text-muted-foreground">
        an infinite runner in binary — flip gravity, dodge the blocks, the world
        only gets faster. best score lives in this browser.
      </p>
    </main>
  )
}
