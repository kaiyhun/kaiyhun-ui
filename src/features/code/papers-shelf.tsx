/**
 * PapersShelf — the publications list: citation-style rows (user pick)
 * with title, venue · year, optional authors, and outbound PDF / arXiv
 * / DOI links. Formal on purpose — papers shouldn't card like repos.
 *
 * ⚠ PARKED (user decision 2026-08-02), NOT dead code: /code renders no
 * Papers section for now, so nothing imports this. Kept intact so the
 * shelf comes back by uncommenting three blocks in src/pages/code.tsx.
 */
import { ArrowUpRight } from "lucide-react"

import { Reveal } from "@/components/motion/reveal"
import { PAPERS } from "@/content/code"

const LINK_CLASS =
  "inline-flex items-center gap-1 font-display text-xs font-semibold tracking-[0.15em] text-primary uppercase transition-colors duration-(--motion-duration-fast) outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"

export function PapersShelf() {
  return (
    <ol>
      {PAPERS.map((paper) => (
        <li key={paper.title} className="border-b border-border py-6">
          <Reveal distance={16}>
            <h3 className="max-w-prose font-medium">{paper.title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {paper.venue} · {paper.year}
              {paper.authors && <span aria-hidden> · </span>}
              {paper.authors}
            </p>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
              {paper.links.pdf && (
                <a
                  href={paper.links.pdf}
                  target="_blank"
                  rel="noreferrer"
                  className={LINK_CLASS}
                >
                  PDF
                  <ArrowUpRight aria-hidden className="size-3.5" />
                </a>
              )}
              {paper.links.arxiv && (
                <a
                  href={paper.links.arxiv}
                  target="_blank"
                  rel="noreferrer"
                  className={LINK_CLASS}
                >
                  arXiv
                  <ArrowUpRight aria-hidden className="size-3.5" />
                </a>
              )}
              {paper.links.doi && (
                <a
                  href={paper.links.doi}
                  target="_blank"
                  rel="noreferrer"
                  className={LINK_CLASS}
                >
                  DOI
                  <ArrowUpRight aria-hidden className="size-3.5" />
                </a>
              )}
            </div>
          </Reveal>
        </li>
      ))}
    </ol>
  )
}
