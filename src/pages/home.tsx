/**
 * Home — the hub of the multi-domain site (docs/homepage-brief.md).
 *
 * Sections: identity hero (user-approved statement over niagaraFalls_8) →
 * gateway sections (Photography, Editing, Drawings — doors appear as wings ship) →
 * footer (site-wide). The recent-writing band (M8) and about teaser (M11)
 * appear when their wings are real.
 */
import { ArrowRight, Terminal } from "lucide-react"
import { useState } from "react"
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
/* Portrait-panel images (user picks): horizontal nature_5 (golden
   meadow backlight), vertical studio_1 (red/blue gel studio) */
// prettier-ignore
import portraitPanelShot from "@/assets/portrait/nature/nature_5.jpg?w=400;800;1200&format=avif;webp;jpeg&as=picture"
import portraitPanelLqip from "@/assets/portrait/nature/nature_5.jpg?w=24&format=webp&inline"
// prettier-ignore
import portraitPanelVertical from "@/assets/portrait/studio/studio_1.jpg?w=400;800;1200&format=avif;webp;jpeg&as=picture"
/* Drawings-section panel (user picks): horizontal lake_4 is a TEMP
   placeholder until a suitable wide drawing exists; vertical
   fromReference_3 */
// prettier-ignore
import drawingPanelShot from "@/assets/landscape/lake/lake_4.jpg?w=400;800;1200&format=avif;webp;jpeg&as=picture"
import drawingPanelLqip from "@/assets/landscape/lake/lake_4.jpg?w=24&format=webp&inline"
// prettier-ignore
import drawingPanelVertical from "@/assets/drawing/fromReference/fromReference_3.jpg?w=400;800;1200&format=avif;webp;jpeg&as=picture"
/* Editing-section panels (user picks): Tutorials = niagaraFalls_14 /
   coast_1; Presets = goldenHour_7 / lake_3 */
// prettier-ignore
import tutorialsPanelShot from "@/assets/landscape/niagaraFalls/niagaraFalls_14.jpg?w=400;800;1200&format=avif;webp;jpeg&as=picture"
import tutorialsPanelLqip from "@/assets/landscape/niagaraFalls/niagaraFalls_14.jpg?w=24&format=webp&inline"
// prettier-ignore
import tutorialsPanelVertical from "@/assets/landscape/coast/coast_1.jpg?w=400;800;1200&format=avif;webp;jpeg&as=picture"
// prettier-ignore
import presetsPanelShot from "@/assets/landscape/goldenHour/goldenHour_7.jpg?w=400;800;1200&format=avif;webp;jpeg&as=picture"
import presetsPanelLqip from "@/assets/landscape/goldenHour/goldenHour_7.jpg?w=24&format=webp&inline"
// prettier-ignore
import presetsPanelVertical from "@/assets/landscape/lake/lake_3.jpg?w=400;800;1200&format=avif;webp;jpeg&as=picture"
import { Reveal, RevealGroup } from "@/components/motion/reveal"
import { Button } from "@/components/ui/button"
import {
  collectionsIn,
  photoCountIn,
  requireCollection,
} from "@/content/collections"
import { POSTS } from "@/content/posts"
import { SITE } from "@/content/site"
import { WritingBand } from "@/features/blog/writing-band"
import { ArtDirectedBackdrop } from "@/features/home/art-directed-backdrop"
import { GatewayPanel } from "@/features/home/gateway-panel"
import { MatrixRain } from "@/features/home/matrix-rain"
import { SectionNav, type HomeSection } from "@/features/home/section-nav"
import { MEDIA } from "@/lib/media-queries"
import { applyMatrixTheme, isMatrixTheme } from "@/lib/theme"
import { cn } from "@/lib/utils"

/** Hero photo metadata comes from the content model, not re-written here. */
const HERO_ALT =
  requireCollection("niagara-falls").photos.find(
    (photo) => photo.file === "niagaraFalls_8",
  )?.alt ?? ""

/** Landscape door backdrop; cover = lakeLouise_1 (user pick). */
const GATEWAY_COVER = requireCollection("lake-louise")

/** Count line for a category door. */
function countLine(category: "landscape" | "portrait") {
  const collections = collectionsIn(category).length
  return `${collections} collections · ${photoCountIn(category)} photographs`
}

/** Sections the floating nav can jump to — grows as wings ship
 *  (lab…). Writing appears only once posts exist ("hidden until real"). */
const HOME_SECTIONS: HomeSection[] = [
  { id: "photography", label: "Photography" },
  { id: "editing", label: "Editing" },
  { id: "drawing", label: "Drawing" },
  { id: "lab", label: "Lab" },
  ...(POSTS.length > 0 ? [{ id: "blog", label: "Blog" }] : []),
]

export default function Home() {
  /* Matrix mode — SITE-WIDE easter-egg theme (lib/theme.ts applies
     .theme-matrix on <html>); this state just drives the hero UI */
  const [matrix, setMatrix] = useState(isMatrixTheme)
  const toggleMatrix = () => {
    setMatrix((current) => {
      applyMatrixTheme(!current)
      return !current
    })
  }

  return (
    <main>
      {/* ============ Hero — identity statement ============ */}
      <section className="relative flex min-h-svh items-center overflow-hidden">
        {matrix ? (
          <MatrixRain className="absolute inset-0 h-full w-full" />
        ) : (
          <ArtDirectedBackdrop
            picture={heroShot}
            variant={{ media: MEDIA.portrait, picture: heroShotPortrait }}
            placeholder={heroLqip}
            alt={HERO_ALT}
            className="absolute inset-0"
          />
        )}
        {/* Legibility scrim: slightly stronger through the middle since the
            centered text sits over the brightest part of the falls */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-background/25"
        />
        <RevealGroup className="relative mx-auto flex w-full max-w-6xl flex-col items-center px-6 py-32 text-center">
          <Reveal>
            <h1 className={cn("text-display", matrix && "font-mono")}>
              {SITE.name}
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p
              className={cn(
                "mt-4 max-w-xl text-lg text-foreground/85 sm:text-xl",
                matrix && "font-mono text-base sm:text-lg",
              )}
            >
              {SITE.tagline}
            </p>
          </Reveal>
          <Reveal
            delay={0.2}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <Button asChild size="lg">
              <Link to="/photography">
                View the photography
                <ArrowRight data-icon="inline-end" aria-hidden />
              </Link>
            </Button>
            {/* The rabbit hole (labels: content-draft §17) */}
            <Button
              size="lg"
              variant="outline"
              onClick={toggleMatrix}
              aria-pressed={matrix}
            >
              <Terminal data-icon="inline-start" aria-hidden />
              {matrix ? "Wake up" : "Enter the Matrix"}
            </Button>
          </Reveal>
        </RevealGroup>
      </section>

      {/* ============ Gateway — doors to live wings ============ */}
      <section
        id="photography"
        aria-labelledby="explore"
        // scroll-mt keeps the heading clear of the fixed header when the
        // floating section nav jumps here; pb only (no pt) so both
        // homepage sections share consistent spacing
        className="mx-auto max-w-6xl scroll-mt-20 px-6 pb-32"
      >
        <Reveal>
          <h2 id="explore" className="text-display-sm">
            Photography
          </h2>
          <p className="mt-4 max-w-prose text-muted-foreground">
            Two bodies of work — more wings (drawings, the lab, the blog) open
            as they're built.
          </p>
        </Reveal>
        <div className="mt-12 flex flex-col gap-6">
          <Reveal>
            <GatewayPanel
              to="/photography?category=landscape"
              title="Landscape"
              subtitle={countLine("landscape")}
              picture={GATEWAY_COVER.cover.picture}
              portraitPicture={gatewayPortrait}
              placeholder={GATEWAY_COVER.cover.lqip}
            />
          </Reveal>
          <Reveal>
            <GatewayPanel
              to="/photography?category=portrait"
              title="Portrait"
              subtitle={countLine("portrait")}
              picture={portraitPanelShot}
              portraitPicture={portraitPanelVertical}
              placeholder={portraitPanelLqip}
            />
          </Reveal>
        </div>
      </section>

      {/* ============ Editing — tutorials & presets ============ */}
      <section
        id="editing"
        aria-labelledby="editing-heading"
        className="mx-auto max-w-6xl scroll-mt-20 px-6 pb-32"
      >
        <Reveal>
          <h2 id="editing-heading" className="text-right text-display-sm">
            Editing
          </h2>
          <p className="mt-4 ml-auto max-w-prose text-right text-muted-foreground">
            Behind each of my photos is a mountain of editing.
          </p>
        </Reveal>
        <div className="mt-12 flex flex-col gap-6">
          <Reveal>
            <GatewayPanel
              to="/tutorial"
              title="Tutorials"
              subtitle="Editing walkthroughs, in video"
              picture={tutorialsPanelShot}
              portraitPicture={tutorialsPanelVertical}
              placeholder={tutorialsPanelLqip}
              align="right"
            />
          </Reveal>
          <Reveal>
            <GatewayPanel
              to="/preset"
              title="Presets"
              subtitle="Free Lightroom presets (.xmp)"
              picture={presetsPanelShot}
              portraitPicture={presetsPanelVertical}
              placeholder={presetsPanelLqip}
              align="right"
            />
          </Reveal>
        </div>
      </section>

      {/* ============ Drawings — the progress record ============ */}
      <section
        id="drawing"
        aria-labelledby="drawings-heading"
        className="mx-auto max-w-6xl scroll-mt-20 px-6 pb-32"
      >
        <Reveal>
          <h2 id="drawings-heading" className="text-display-sm">
            Drawing
          </h2>
          <p className="mt-4 max-w-prose text-muted-foreground">
            Not a showcase — an honest record of learning to draw, and failing
            at it.
          </p>
        </Reveal>
        <div className="mt-12">
          <Reveal>
            <GatewayPanel
              to="/drawing"
              title="The Story"
              subtitle="Twenty years of picking it up, putting it down, and starting again."
              picture={drawingPanelShot}
              portraitPicture={drawingPanelVertical}
              placeholder={drawingPanelLqip}
            />
          </Reveal>
        </div>
      </section>

      {/* ============ Lab — research & code (text-only door) ======= */}
      <section
        id="lab"
        aria-labelledby="lab-heading"
        className="mx-auto max-w-6xl scroll-mt-20 px-6 pb-32"
      >
        <Reveal>
          <h2 id="lab-heading" className="text-display-sm">
            Lab
          </h2>
          <p className="mt-4 max-w-prose text-muted-foreground">
            Research, projects, and the code behind them.
          </p>
          <Link
            to="/lab"
            className="group mt-6 inline-flex items-center gap-2 font-display text-xs font-semibold tracking-[0.15em] text-primary uppercase outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            Enter the lab
            <ArrowRight
              aria-hidden
              className="size-4 transition-transform duration-(--motion-duration-fast) ease-(--ease-out-expo) group-hover:translate-x-1"
            />
          </Link>
        </Reveal>
      </section>

      {/* ============ Blog — the hallway (hidden until real) ==== */}
      {POSTS.length > 0 && (
        <section
          id="blog"
          aria-labelledby="blog-heading"
          className="mx-auto max-w-6xl scroll-mt-20 px-6 pb-32"
        >
          <Reveal>
            <h2 id="blog-heading" className="text-display-sm">
              Blog
            </h2>
            <p className="mt-4 max-w-prose text-muted-foreground">
              Some interesting things I thought I'd share.
            </p>
          </Reveal>
          <div className="mt-8 max-w-3xl">
            <WritingBand />
          </div>
        </section>
      )}

      {/* Floating section menu — appears once the visitor scrolls */}
      <SectionNav sections={HOME_SECTIONS} />
    </main>
  )
}
