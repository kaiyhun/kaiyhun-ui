/**
 * Home — the hub of the multi-domain site (docs/homepage-brief.md).
 *
 * Sections: identity hero (user-approved statement over niagaraFalls_8) →
 * gateway (pillar doors — only live wings render, currently Photography) →
 * footer (site-wide). The recent-writing band (M8) and about teaser (M11)
 * appear when their wings are real.
 */
import { ArrowRight } from "lucide-react"
import { Link } from "react-router"

// prettier-ignore
import heroShot from "@/assets/landscape/niagaraFalls/niagaraFalls_8.jpg?w=800;1200;2000;2560&format=avif;webp;jpeg&as=picture"
import heroLqip from "@/assets/landscape/niagaraFalls/niagaraFalls_8.jpg?w=24&format=webp&inline"
/* Portrait crop served on portrait screens (art direction — only the
   matching orientation is ever downloaded) */
// prettier-ignore
import heroShotPortrait from "@/assets/landscape/niagaraFalls/niagaraFalls_9.jpg?w=800;1200;1600&format=avif;webp;jpeg&as=picture"
/* Vertical gateway crop for small screens (user pick: lakeLouise_6) */
// prettier-ignore
import gatewayPortrait from "@/assets/landscape/lakeLouise/lakeLouise_6.jpg?w=400;800;1200&format=avif;webp;jpeg&as=picture"
import { Parallax } from "@/components/motion/parallax"
import { Reveal, RevealGroup } from "@/components/motion/reveal"
import { Button } from "@/components/ui/button"
import {
  COLLECTIONS,
  PHOTO_COUNT,
  requireCollection,
} from "@/content/collections"
import { SITE } from "@/content/site"
import { ArtDirectedBackdrop } from "@/features/home/art-directed-backdrop"
import { MEDIA } from "@/lib/media-queries"

/** Hero photo metadata comes from the content model, not re-written here. */
const HERO_ALT =
  requireCollection("niagara-falls").photos.find(
    (photo) => photo.file === "niagaraFalls_8",
  )?.alt ?? ""

/** Gateway door for the photography wing; cover = lakeLouise_1 (user
 *  pick), pulled from the content model. */
const GATEWAY_COVER = requireCollection("lake-louise")

export default function Home() {
  return (
    <main>
      {/* ============ Hero — identity statement ============ */}
      <section className="relative flex min-h-svh items-center overflow-hidden">
        <ArtDirectedBackdrop
          picture={heroShot}
          variant={{ media: MEDIA.portrait, picture: heroShotPortrait }}
          placeholder={heroLqip}
          alt={HERO_ALT}
          className="absolute inset-0"
        />
        {/* Legibility scrim: slightly stronger through the middle since the
            centered text sits over the brightest part of the falls */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-background/25"
        />
        <RevealGroup className="relative mx-auto flex w-full max-w-6xl flex-col items-center px-6 py-32 text-center">
          <Reveal>
            <h1 className="text-display">{SITE.name}</h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-4 max-w-xl text-lg text-foreground/85 sm:text-xl">
              {SITE.tagline}
            </p>
          </Reveal>
          <Reveal delay={0.2} className="mt-8">
            <Button asChild size="lg">
              <Link to="/photography">
                View the photography
                <ArrowRight data-icon="inline-end" aria-hidden />
              </Link>
            </Button>
          </Reveal>
        </RevealGroup>
      </section>

      {/* ============ Gateway — doors to live wings ============ */}
      <section
        aria-labelledby="explore"
        className="mx-auto max-w-6xl px-6 py-32"
      >
        <Reveal>
          <h2 id="explore" className="text-display-sm">
            Explore
          </h2>
          <p className="mt-4 max-w-prose text-muted-foreground">
            More wings — drawings, the lab, the blog — open as they're built.
            First up:
          </p>
        </Reveal>
        <Reveal className="mt-12">
          <Link
            to="/photography"
            className="group relative block overflow-hidden rounded-2xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <Parallax speed={0.08} aria-hidden className="absolute inset-0">
              {/* Slight overscan so the parallax drift never exposes edges;
                  swaps to the vertical crop below `sm` — the same line
                  where the frame flips to aspect-[4/5] */}
              <ArtDirectedBackdrop
                picture={GATEWAY_COVER.cover.picture}
                variant={{ media: MEDIA.belowSm, picture: gatewayPortrait }}
                placeholder={GATEWAY_COVER.cover.lqip}
                alt=""
                sizes="(min-width: 72rem) 72rem, 100vw"
                prefetchSizes="40rem"
                className="h-[120%] w-full scale-105 transition-transform duration-(--motion-duration-slower) ease-(--ease-cinematic) group-hover:scale-110"
              />
            </Parallax>
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent"
            />
            <div className="relative flex aspect-[4/5] flex-col justify-end p-8 sm:aspect-[21/10] sm:p-12">
              <h3 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
                Photography
              </h3>
              <p className="mt-2 max-w-md text-muted-foreground">
                {COLLECTIONS.length} collections · {PHOTO_COUNT} photographs
              </p>
              <span className="mt-6 inline-flex items-center gap-2 font-display text-xs font-semibold tracking-[0.15em] text-primary uppercase">
                Enter
                <ArrowRight
                  aria-hidden
                  className="size-4 transition-transform duration-(--motion-duration-fast) ease-(--ease-out-expo) group-hover:translate-x-1"
                />
              </span>
            </div>
          </Link>
        </Reveal>
      </section>
    </main>
  )
}
