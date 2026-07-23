/**
 * Home — the hub of the multi-domain site (docs/homepage-brief.md).
 *
 * Sections: identity hero (user-approved statement over niagaraFalls_8) →
 * gateway sections (Photography, Editing, Drawing, Lab, Blog). No site
 * footer here (user decision — gated in app.tsx): the paged home is
 * full-viewport screens, and the floating SocialRail carries the links a
 * footer would.
 */
import { ArrowRight } from "lucide-react"
import { Link } from "react-router"

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
   natively (the library is 4:5). Capped at 1600w (audit 2026-07-10):
   these render under a 60%+ scrim, where 2000w was pure bytes — the
   snow frame alone was 777KB avif at 2000w, ~500KB at 1600w. */
// prettier-ignore
import drawingBackdrop1 from "@/assets/landscape/iceland/iceland_1.jpg?w=800;1200;1600&format=avif;webp;jpeg&as=picture"
import drawingBackdrop1Lqip from "@/assets/landscape/iceland/iceland_1.jpg?w=24&format=webp&inline"
// prettier-ignore
import drawingBackdrop2 from "@/assets/landscape/winter/winter_1.jpg?w=800;1200;1600&format=avif;webp;jpeg&as=picture"
// prettier-ignore
import drawingBackdrop3 from "@/assets/landscape/lake/lake_1.jpg?w=800;1200;1600&format=avif;webp;jpeg&as=picture"
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
import { Reveal } from "@/components/motion/reveal"
import { collectionsIn, photoCountIn } from "@/content/collections"
import { POSTS } from "@/content/posts"
import { WritingBand } from "@/features/blog/writing-band"
import { BinaryScene } from "@/features/home/binary-scene"
import { CategoryDoors } from "@/features/home/category-doors"
import { HomeHero } from "@/features/home/hero"
import { ScrollHint } from "@/features/home/scroll-hint"
import { SectionKicker } from "@/components/layout/section-kicker"
import { SocialRail } from "@/features/home/social-rail"
import { RotatingBackdrop } from "@/features/presets/rotating-backdrop"
import { SectionNav, type HomeSection } from "@/features/home/section-nav"
import { useSectionPager } from "@/features/home/use-section-pager"

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
    // data-page-snap opts the route into the touch snap CSS
    // (index.css) — coarse pointers scroll FREELY and only magnet-snap
    // when a gesture settles near a section top (y proximity); the
    // pointer-only wheel pager never runs there
    <main data-page-snap>
      {/* ============ Hero — "00", the identity statement ========= */}
      <section
        id="hero"
        data-page-section
        className="relative flex min-h-dvh overflow-hidden bg-background"
      >
        <HomeHero />
      </section>

      {/* ============ Photography — category doors ============ */}
      <section
        id="photography"
        data-page-section
        aria-labelledby="photography-heading"
        className="relative flex min-h-dvh flex-col justify-center overflow-hidden bg-background"
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
            <SectionKicker
              number="01"
              id="photography-heading"
              label="Photography"
              intro="Two bodies of work — more wings (drawings, the lab, the blog) open as they're built."
            />
          </Reveal>
        </CategoryDoors>
      </section>

      {/* ============ Editing — category doors ============ */}
      <section
        id="editing"
        data-page-section
        aria-labelledby="editing-heading"
        className="relative flex min-h-dvh flex-col justify-center overflow-hidden bg-background"
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
            <SectionKicker
              number="02"
              id="editing-heading"
              label="Editing"
              intro="Behind each of my photos is a mountain of editing."
            />
          </Reveal>
        </CategoryDoors>
      </section>

      {/* ============ Drawing — the cinematic door ============ */}
      <section
        id="drawing"
        data-page-section
        aria-labelledby="drawings-heading"
        className="relative flex min-h-dvh flex-col justify-center overflow-hidden bg-background"
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
          className="absolute inset-0 bg-linear-to-t from-background via-background/60 to-background/25"
        />
        <div className="relative mx-auto w-full max-w-6xl px-6 py-16 md:py-24">
          <Reveal>
            <SectionKicker number="03" id="drawings-heading" label="Drawing" />
            {/* The statement IS the hero here — the label is the kicker */}
            <p className="mt-8 max-w-3xl font-display text-display-md">
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
        className="relative flex min-h-dvh flex-col justify-center overflow-hidden bg-background"
      >
        {/* Full-page binary pixel scene — a 0/1 cat watching the moon;
            the text sits over it (actors keep to the right/top, away
            from the reading column) */}
        <BinaryScene className="absolute inset-0 h-full w-full" />
        <div className="relative mx-auto w-full max-w-6xl px-6 py-16 md:py-24">
          <Reveal>
            <SectionKicker number="04" id="lab-heading" label="Lab" />
            <p className="mt-8 max-w-3xl font-display text-display-md">
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
          className="relative flex min-h-dvh flex-col justify-center bg-background"
        >
          <div className="mx-auto w-full max-w-6xl px-6 py-16 md:py-24">
            <Reveal>
              <SectionKicker number="05" id="blog-heading" label="Blog" />
              <p className="mt-8 max-w-3xl font-display text-display-md">
                Some interesting things I thought I'd share.
              </p>
            </Reveal>
            <div className="mt-8 max-w-3xl">
              <WritingBand />
            </div>
          </div>
        </section>
      )}

      {/* Floating social icons (no footer on the paged home). Position
          is section- and breakpoint-aware: bottom-14 on lg non-hero
          sections, hidden on the lg hero (the hero's own vertical social
          string takes over), and up at the SectionNav's Y line, still
          centered, below lg. */}
      <SocialRail activeId={pager.activeId} />

      {/* Bobbing chevron (monitor only — hidden below lg): visible while
          more paged content sits below; clicking it turns to the next
          section. On lg it shares the bottom line with the hero's
          counts (chevron centered, counts right). */}
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
