/**
 * Home — the hub of the multi-domain site (docs/homepage-brief.md).
 *
 * Sections: identity hero (user-approved statement over niagaraFalls_8) →
 * gateway sections (Photography, Editing, Drawings — doors appear as wings ship) →
 * footer (site-wide). The recent-writing band (M8) and about teaser (M11)
 * appear when their wings are real.
 */
import { ArrowRight, Terminal } from "lucide-react"
import { Link } from "react-router"

// prettier-ignore
import heroShot from "@/assets/landscape/niagaraFalls/niagaraFalls_8.jpg?w=800;1200;2000;2560&format=avif;webp;jpeg&as=picture"
import heroLqip from "@/assets/landscape/niagaraFalls/niagaraFalls_8.jpg?w=24&format=webp&inline"
/* Portrait crop served on portrait screens (art direction — only the
   matching orientation is ever downloaded) */
// prettier-ignore
import heroShotPortrait from "@/assets/landscape/niagaraFalls/niagaraFalls_9.jpg?w=800;1200;1600&format=avif;webp;jpeg&as=picture"
/* Photography doors (user picks carried over from the panels, now
   full-bleed): Landscape = lakeLouise_1 / lakeLouise_6 vertical;
   Portrait = nature_5 / studio_1 vertical */
// prettier-ignore
import landscapeDoorShot from "@/assets/landscape/lakeLouise/lakeLouise_1.jpg?w=800;1200;2000;2560&format=avif;webp;jpeg&as=picture"
import landscapeDoorLqip from "@/assets/landscape/lakeLouise/lakeLouise_1.jpg?w=24&format=webp&inline"
// prettier-ignore
import landscapeDoorVertical from "@/assets/landscape/lakeLouise/lakeLouise_6.jpg?w=800;1200;1600&format=avif;webp;jpeg&as=picture"
// prettier-ignore
import portraitDoorShot from "@/assets/portrait/nature/nature_5.jpg?w=800;1200;2000&format=avif;webp;jpeg&as=picture"
import portraitDoorLqip from "@/assets/portrait/nature/nature_5.jpg?w=24&format=webp&inline"
// prettier-ignore
import portraitDoorVertical from "@/assets/portrait/studio/studio_1.jpg?w=800;1200;1600&format=avif;webp;jpeg&as=picture"
/* Drawing-section rotating backdrop (DRAFT picks pending review,
   content-draft §18): iceland_1 / winter_1 / lake_1 — dark-edged frames
   that survive the wide center-crop; portrait screens see them near-
   natively (the library is 4:5). 4:5 masters at 100vw sizes. */
// prettier-ignore
import drawingBackdrop1 from "@/assets/landscape/iceland/iceland_1.jpg?w=800;1200;2000&format=avif;webp;jpeg&as=picture"
import drawingBackdrop1Lqip from "@/assets/landscape/iceland/iceland_1.jpg?w=24&format=webp&inline"
// prettier-ignore
import drawingBackdrop2 from "@/assets/landscape/winter/winter_1.jpg?w=800;1200;2000&format=avif;webp;jpeg&as=picture"
// prettier-ignore
import drawingBackdrop3 from "@/assets/landscape/lake/lake_1.jpg?w=800;1200;2000&format=avif;webp;jpeg&as=picture"
/* Editing doors (user picks carried over from the panels, now
   full-bleed): Tutorials = niagaraFalls_14 / coast_1; Presets =
   goldenHour_7 / lake_3 */
// prettier-ignore
import tutorialsDoorShot from "@/assets/landscape/niagaraFalls/niagaraFalls_14.jpg?w=800;1200;2000;2560&format=avif;webp;jpeg&as=picture"
import tutorialsDoorLqip from "@/assets/landscape/niagaraFalls/niagaraFalls_14.jpg?w=24&format=webp&inline"
// prettier-ignore
import tutorialsDoorVertical from "@/assets/landscape/coast/coast_1.jpg?w=800;1200;1600&format=avif;webp;jpeg&as=picture"
// prettier-ignore
import presetsDoorShot from "@/assets/landscape/goldenHour/goldenHour_7.jpg?w=800;1200;2000&format=avif;webp;jpeg&as=picture"
import presetsDoorLqip from "@/assets/landscape/goldenHour/goldenHour_7.jpg?w=24&format=webp&inline"
// prettier-ignore
import presetsDoorVertical from "@/assets/landscape/lake/lake_3.jpg?w=800;1200;1600&format=avif;webp;jpeg&as=picture"
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
import { BinaryScene } from "@/features/home/binary-scene"
import { CategoryDoors } from "@/features/home/category-doors"
import { MatrixRain } from "@/features/home/matrix-rain"
import { ScrollHint } from "@/features/home/scroll-hint"
import { SocialRail } from "@/features/home/social-rail"
import { TypeOut } from "@/features/home/type-out"
import { RotatingBackdrop } from "@/features/presets/rotating-backdrop"
import { SectionNav, type HomeSection } from "@/features/home/section-nav"
import { useSectionPager } from "@/features/home/use-section-pager"
import { MEDIA } from "@/lib/media-queries"
import { toggleMatrixTheme, useMatrixTheme } from "@/lib/theme"
import { cn } from "@/lib/utils"

/** Hero photo metadata comes from the content model, not re-written here. */
const HERO_ALT =
  requireCollection("niagara-falls").photos.find(
    (photo) => photo.file === "niagaraFalls_8",
  )?.alt ?? ""

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
  /* Matrix mode — SITE-WIDE easter-egg theme; the hook stays in sync
     with every trigger (hero button here, Konami code in app.tsx) */
  const matrix = useMatrixTheme()

  /* Boundary page-turn: each [data-page-section] is a full-viewport
     "page"; scrolling past a section's edge fades the page out, jumps
     under the cover of the background, and fades the next page in.
     Sections are FULL-BLEED with an opaque bg (the page IS the screen)
     and land flush at the viewport top; their inner column padding
     clears the fixed header. (Pointer + motion only — a11y escape
     hatch in the hook.) */
  const pager = useSectionPager()

  /* Chevron click: turn to the section after the current one (same
     page-turn as the Scroll-to menu) */
  const advance = () => {
    const ids = ["hero", ...HOME_SECTIONS.map((section) => section.id)]
    const index = ids.indexOf(pager.activeId ?? "hero")
    const next = ids[index + 1]
    if (next) pager.goTo(next)
  }

  return (
    // data-page-snap opts the route into the touch page-snap CSS
    // (index.css) — coarse pointers page via native scroll snap, the
    // pointer-only wheel pager never runs there
    <main data-page-snap>
      {/* ============ Hero — identity statement (page 1) ========= */}
      <section
        id="hero"
        data-page-section
        className="relative flex min-h-svh items-center overflow-hidden bg-background"
      >
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
            <h1
              className={cn(
                "text-display-xl text-wordmark",
                matrix && "font-mono",
              )}
            >
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
              {matrix ? <TypeOut text={SITE.tagline} /> : SITE.tagline}
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
              onClick={toggleMatrixTheme}
              aria-pressed={matrix}
            >
              <Terminal data-icon="inline-start" aria-hidden />
              {matrix ? "Wake up" : "Enter the Matrix"}
            </Button>
          </Reveal>
        </RevealGroup>
      </section>

      {/* ============ Photography — category doors ============ */}
      <section
        id="photography"
        data-page-section
        aria-labelledby="explore"
        className="relative flex min-h-svh flex-col justify-center overflow-hidden bg-background"
      >
        <CategoryDoors
          doors={[
            {
              to: "/photography?category=landscape",
              label: "Landscape",
              sublabel: countLine("landscape"),
              picture: landscapeDoorShot,
              portraitPicture: landscapeDoorVertical,
              placeholder: landscapeDoorLqip,
            },
            {
              to: "/photography?category=portrait",
              label: "Portrait",
              sublabel: countLine("portrait"),
              picture: portraitDoorShot,
              portraitPicture: portraitDoorVertical,
              placeholder: portraitDoorLqip,
            },
          ]}
        >
          <Reveal>
            <h2 id="photography" className="text-display-lg">
              Photography
            </h2>
            <p className="mt-4 max-w-prose text-display-sm text-muted-foreground">
              Two bodies of work — more wings (drawings, the lab, the blog) open
              as they're built.
            </p>
          </Reveal>
        </CategoryDoors>
      </section>

      {/* ============ Editing — category doors ============ */}
      <section
        id="editing"
        data-page-section
        aria-labelledby="editing-heading"
        className="relative flex min-h-svh flex-col justify-center overflow-hidden bg-background"
      >
        <CategoryDoors
          doors={[
            {
              to: "/tutorial",
              label: "Tutorials",
              sublabel: "Editing walkthroughs, in video",
              picture: tutorialsDoorShot,
              portraitPicture: tutorialsDoorVertical,
              placeholder: tutorialsDoorLqip,
            },
            {
              to: "/preset",
              label: "Presets",
              sublabel: "Free Lightroom presets (.xmp)",
              picture: presetsDoorShot,
              portraitPicture: presetsDoorVertical,
              placeholder: presetsDoorLqip,
            },
          ]}
        >
          <Reveal>
            <h2 id="editing-heading" className="text-display-lg">
              Editing
            </h2>
            <p className="mt-4 max-w-prose text-display-sm text-muted-foreground">
              Behind each of my photos is a mountain of editing.
            </p>
          </Reveal>
        </CategoryDoors>
      </section>

      {/* ============ Drawing — the cinematic door ============ */}
      <section
        id="drawing"
        data-page-section
        aria-labelledby="drawings-heading"
        className="relative flex min-h-svh flex-col justify-center overflow-hidden bg-background"
      >
        {/* Slow-rotating full-bleed backdrop (crossfades every few
            seconds on screen; reduced motion holds the first frame) */}
        <RotatingBackdrop
          pictures={[drawingBackdrop1, drawingBackdrop2, drawingBackdrop3]}
          placeholder={drawingBackdrop1Lqip}
          sizes="100vw"
          className="absolute inset-0"
        />
        {/* Legibility scrim — heavier at the bottom where the text sits */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/25"
        />
        <div className="relative mx-auto w-full max-w-6xl px-6 py-16 md:py-24">
          <Reveal>
            <h2 id="drawings-heading" className="text-display-lg">
              Drawing
            </h2>
            <p className="mt-4 max-w-prose text-display-sm text-muted-foreground">
              Not a showcase — an honest record of learning to draw, and failing
              at it.
            </p>
            {/* Door link (label draft: content-draft §18) */}
            <Link
              to="/drawing"
              className="group mt-6 inline-flex items-center gap-2 font-display text-xs font-semibold tracking-[0.15em] text-primary uppercase outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              Enter the story
              <ArrowRight
                aria-hidden
                className="size-4 transition-transform duration-(--motion-duration-fast) ease-(--ease-out-expo) group-hover:translate-x-1"
              />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ============ Lab — research & code ======= */}
      <section
        id="lab"
        data-page-section
        aria-labelledby="lab-heading"
        className="relative flex min-h-svh flex-col justify-center overflow-hidden bg-background"
      >
        {/* Full-page binary pixel scene — a 0/1 cat watching the moon;
            the text sits over it (actors keep to the right/top, away
            from the reading column) */}
        <BinaryScene className="absolute inset-0 h-full w-full" />
        <div className="relative mx-auto w-full max-w-6xl px-6 py-16 md:py-24">
          <Reveal>
            <h2 id="lab-heading" className="text-display-lg">
              Lab
            </h2>
            <p className="mt-4 max-w-prose text-display-sm text-muted-foreground">
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
        </div>
      </section>

      {/* ============ Blog — the hallway (hidden until real) ==== */}
      {POSTS.length > 0 && (
        <section
          id="blog"
          data-page-section
          aria-labelledby="blog-heading"
          className="relative flex min-h-svh flex-col justify-center bg-background"
        >
          <div className="mx-auto w-full max-w-6xl px-6 py-16 md:py-24">
            <Reveal>
              <h2 id="blog-heading" className="text-display-lg">
                Blog
              </h2>
              <p className="mt-4 max-w-prose text-display-sm text-muted-foreground">
                Some interesting things I thought I'd share.
              </p>
            </Reveal>
            <div className="mt-8 max-w-3xl">
              <WritingBand />
            </div>
          </div>
        </section>
      )}

      {/* Floating social icons — the paged homepage rarely reaches the
          real footer, so its links surface here (bottom-left corner) */}
      <SocialRail />

      {/* Bobbing chevron — visible while more paged content sits below;
          clicking it turns to the next section */}
      <ScrollHint show={pager.moreBelow} onAdvance={advance} />

      {/* Floating section menu — appears once the visitor scrolls; its
          entries drive the same page-turn and highlight the active page */}
      <SectionNav
        sections={HOME_SECTIONS}
        activeId={pager.activeId}
        onNavigate={pager.goTo}
      />
    </main>
  )
}
