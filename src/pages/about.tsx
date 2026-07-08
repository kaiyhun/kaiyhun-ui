/**
 * About page — /about (M11, docs/about.md)
 *
 * Bio → goals timeline (forward-looking thread) → contact block →
 * colophon. ALL PROSE IS A PLACEHOLDER DRAFT awaiting the user's own
 * voice (src/content/about.ts, content-draft §16); contact points are
 * still the site-wide placeholders (pre-launch checklist).
 */
import { ArrowUpRight, Mail } from "lucide-react"

import { Reveal } from "@/components/motion/reveal"
import { Button } from "@/components/ui/button"
import { BIO, COLOPHON } from "@/content/about"
import { SITE } from "@/content/site"
import { GoalsTimeline } from "@/features/about/goals-timeline"

const EMAIL =
  SITE.socials.find((social) => social.label === "Email")?.href ??
  "mailto:hello@kaiyhun.example"

export default function About() {
  return (
    <main className="mx-auto max-w-3xl px-6 pt-32 pb-24">
      <title>{`About — ${SITE.name}`}</title>
      <meta
        name="description"
        content="Who Kaiyhun is, what this site is for, and where it's all headed."
      />

      <Reveal>
        <h1 className="text-display-sm">About</h1>
        <div className="mt-6 max-w-prose space-y-4 leading-relaxed text-foreground/85">
          {BIO.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </Reveal>

      {/* ============ Goals — the road ahead ============ */}
      <section aria-labelledby="goals-heading" className="mt-16">
        <Reveal>
          <h2
            id="goals-heading"
            className="font-display text-2xl font-bold tracking-tight"
          >
            The road ahead
          </h2>
        </Reveal>
        <GoalsTimeline />
      </section>

      {/* ============ Contact ============ */}
      <section
        aria-labelledby="contact-heading"
        className="mt-16 border-t border-border pt-12"
      >
        <Reveal>
          <h2
            id="contact-heading"
            className="font-display text-2xl font-bold tracking-tight"
          >
            Say hello
          </h2>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button asChild>
              <a href={EMAIL}>
                <Mail data-icon="inline-start" aria-hidden />
                Email me
              </a>
            </Button>
            {SITE.socials
              .filter((social) => social.label !== "Email")
              .map((social) => (
                <Button key={social.label} asChild variant="outline">
                  <a href={social.href} target="_blank" rel="noreferrer">
                    {social.label}
                    <ArrowUpRight data-icon="inline-end" aria-hidden />
                  </a>
                </Button>
              ))}
          </div>
        </Reveal>
      </section>

      {/* ============ Colophon ============ */}
      <section
        aria-labelledby="colophon-heading"
        className="mt-16 border-t border-border pt-12"
      >
        <Reveal>
          <h2
            id="colophon-heading"
            className="font-display text-2xl font-bold tracking-tight"
          >
            About this site
          </h2>
          <div className="mt-6 max-w-prose space-y-4 text-sm leading-relaxed text-muted-foreground">
            {COLOPHON.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </Reveal>
      </section>
    </main>
  )
}
