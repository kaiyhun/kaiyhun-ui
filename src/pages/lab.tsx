/**
 * Lab — /lab, the research & code pillar (M9, docs/lab.md).
 *
 * Stacked sections — Projects (card grid), Papers (citation shelf),
 * Related writing (code-topic posts) — with a sticky right-side page
 * navigator on xl+ (user request). Cards link out; deep write-ups are
 * blog posts. ALL CONTENT IS MOCK until the user swaps in real repos
 * and papers (src/content/lab.ts). Intro copy is a DRAFT
 * (content-draft §13).
 */
import { PageNav, type PageNavItem } from "@/components/layout/page-nav"
import { Reveal, RevealGroup } from "@/components/motion/reveal"
import { PROJECTS } from "@/content/lab"
import { SITE } from "@/content/site"
import { RelatedWriting } from "@/features/blog/related-writing"
import { PapersShelf } from "@/features/lab/papers-shelf"
import { ProjectCard } from "@/features/lab/project-card"

const SECTIONS: PageNavItem[] = [
  { id: "projects", label: "Projects" },
  { id: "papers", label: "Papers" },
  { id: "lab-writing", label: "Writing" },
]

export default function Lab() {
  return (
    <main className="mx-auto max-w-6xl px-6 pt-32 pb-24">
      <title>{`Lab — ${SITE.name}`}</title>
      <meta
        name="description"
        content="Research, projects, and the code behind them."
      />

      <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_12rem] xl:gap-16">
        <div>
          <Reveal>
            <h1 className="text-display-lg">Lab</h1>
            <p className="mt-4 max-w-prose leading-relaxed text-muted-foreground">
              Research, projects, and the code behind them.
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

          {/* ============ Papers ============ */}
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

          {/* ============ Writing (code-topic posts) ============ */}
          <div id="lab-writing" className="scroll-mt-24">
            <RelatedWriting topic="code" />
          </div>
        </div>

        <PageNav items={SECTIONS} className="hidden xl:block" />
      </div>
    </main>
  )
}
