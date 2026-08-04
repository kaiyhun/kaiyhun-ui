/**
 * Code — /code, the code & projects pillar (M9, docs/code.md).
 *
 * Stacked sections — Projects (card grid) → Related writing (code-topic
 * posts) — with a sticky right-side page navigator on xl+ (user
 * request). Cards link out; deep write-ups are blog posts. ALL CONTENT
 * IS MOCK until the user swaps in real repos (src/content/code.ts).
 * Intro copy is a DRAFT (content-draft §13).
 *
 * PARKED (user decision 2026-08-02): the Papers section is commented
 * out, not deleted — there's nothing real to cite yet. Restoring it =
 * uncomment the three blocks below; the shelf component
 * (features/code/papers-shelf.tsx) and the PAPERS data are untouched.
 * The wing was renamed Lab → Code in the same pass.
 */
import { PageNav, type PageNavItem } from "@/components/layout/page-nav"
import { Reveal, RevealGroup } from "@/components/motion/reveal"
import { PROJECTS } from "@/content/code"
import { SITE } from "@/content/site"
import { RelatedWriting } from "@/features/blog/related-writing"
// PARKED: import { PapersShelf } from "@/features/code/papers-shelf"
import { ProjectCard } from "@/features/code/project-card"

const SECTIONS: PageNavItem[] = [
  { id: "projects", label: "Projects" },
  // PARKED: { id: "papers", label: "Papers" },
  { id: "code-writing", label: "Writing" },
]

export default function Code() {
  return (
    <main className="mx-auto max-w-6xl px-6 pt-32 pb-24">
      <title>{`Code — ${SITE.name}`}</title>
      <meta
        name="description"
        content="Projects, experiments, and the code behind them."
      />

      <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_12rem] xl:gap-16">
        <div>
          <Reveal>
            <h1 className="text-display-lg">Code</h1>
            <p className="mt-4 max-w-prose leading-relaxed text-muted-foreground">
              Projects, experiments, and the code behind them.
            </p>
          </Reveal>

          {/* ============ Projects ============ */}
          <section
            id="projects"
            aria-labelledby="projects-heading"
            className="mt-16 scroll-mt-24"
          >
            <Reveal>
              <h2
                id="projects-heading"
                className="font-display text-3xl font-bold tracking-tight"
              >
                Projects
              </h2>
            </Reveal>
            <RevealGroup className="mt-8 grid gap-4 sm:grid-cols-2">
              {PROJECTS.map((project) => (
                <Reveal key={project.slug} distance={24}>
                  <ProjectCard project={project} />
                </Reveal>
              ))}
            </RevealGroup>
          </section>

          {/* ============ Papers — PARKED (see docstring) ============
          <section
            id="papers"
            aria-labelledby="papers-heading"
            className="mt-20 scroll-mt-24 border-t border-border pt-16"
          >
            <Reveal>
              <h2
                id="papers-heading"
                className="font-display text-3xl font-bold tracking-tight"
              >
                Papers
              </h2>
            </Reveal>
            <div className="mt-4">
              <PapersShelf />
            </div>
          </section>
          ======================================================== */}

          {/* ============ Writing (code-topic posts) ============ */}
          <div id="code-writing" className="scroll-mt-24">
            <RelatedWriting topic="code" />
          </div>
        </div>

        <PageNav items={SECTIONS} className="hidden xl:block" />
      </div>
    </main>
  )
}
