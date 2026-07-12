/**
 * Settings — /settings: site preferences. One setting so far: the
 * THEME, picked from a fanned deck of photocards floating over a giant
 * display word (composition from the user's reference; copy drafts in
 * content-draft §22). The page never previews anything in miniature —
 * centering a card re-themes the ENTIRE site instantly, so the page
 * itself is the preview. Reached via the header gear + footer link.
 */
import { Reveal } from "@/components/motion/reveal"
import { SITE } from "@/content/site"
import { ThemeDeck } from "@/features/settings/theme-deck"

export default function Settings() {
  return (
    <main className="relative flex min-h-dvh flex-col overflow-hidden px-6 pt-32 pb-16">
      <title>{`Settings — ${SITE.name}`}</title>
      <meta
        name="description"
        content="Pick a look for the site — the theme applies everywhere, instantly."
      />

      <div className="mx-auto w-full max-w-6xl">
        <Reveal>
          <h1 className="text-display-lg">Settings</h1>
          {/* DRAFT copy (content-draft §22) */}
          <p className="mt-4 max-w-prose leading-relaxed text-muted-foreground">
            One setting so far — the site&apos;s look. Whatever card sits in the
            middle of the deck is live everywhere, instantly.
          </p>
        </Reveal>
      </div>

      <div className="relative mx-auto mt-4 flex w-full max-w-6xl flex-1 items-center justify-center">
        {/* The giant word behind the deck (decorative, DRAFT) */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center font-display text-display-2xl font-bold text-foreground/10 uppercase select-none"
        >
          Themes
        </span>
        <Reveal distance={16} className="relative w-full">
          <ThemeDeck />
        </Reveal>
      </div>
    </main>
  )
}
