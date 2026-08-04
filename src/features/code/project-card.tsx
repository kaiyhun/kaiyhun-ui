/**
 * ProjectCard — one /code project: name + status badge, description,
 * tech chips, then a footer of outbound links (GitHub / demo /
 * write-up) and the build-time GitHub stats when the project declares a
 * repo (stats may be absent — offline builds omit them by design,
 * docs/code.md).
 *
 * Cards link OUT (user decision) — there are no project detail pages;
 * deep write-ups are blog posts.
 */
import { ArrowUpRight, Star } from "lucide-react"
import { Link } from "react-router"
import { GITHUB_STATS } from "virtual:github-stats"

import { TECH_LABELS, type Project } from "@/content/code"
import { cn } from "@/lib/utils"

/** Badge tone per status — orange (rare accent) marks live experiments. */
const STATUS_CLASS: Record<Project["status"], string> = {
  active: "border-primary/40 text-primary",
  experiment: "border-accent/40 text-accent",
  archived: "border-border text-muted-foreground",
}

/** "May 2026" from an ISO timestamp. */
function formatPushed(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  })
}

/** 12345 → "12.3k" — GitHub-style compact stars. */
function formatStars(stars: number): string {
  return stars >= 1000 ? `${(stars / 1000).toFixed(1)}k` : String(stars)
}

const LINK_CLASS =
  "inline-flex items-center gap-1 font-display text-xs font-semibold tracking-[0.15em] text-primary uppercase transition-colors duration-(--motion-duration-fast) outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"

export function ProjectCard({ project }: { project: Project }) {
  const stats = project.repo ? GITHUB_STATS[project.repo] : undefined

  return (
    <article className="flex h-full flex-col rounded-xl border border-border bg-card p-6">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <h3 className="font-display text-lg font-semibold tracking-tight">
          {project.name}
        </h3>
        <span
          className={cn(
            "rounded-full border px-2.5 py-0.5 font-display text-[0.65rem] font-semibold tracking-[0.15em] uppercase",
            STATUS_CLASS[project.status],
          )}
        >
          {project.status}
        </span>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {project.description}
      </p>

      <ul className="mt-4 flex flex-wrap gap-1.5">
        {project.tech.map((tag) => (
          <li
            key={tag}
            className="rounded-md bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
          >
            {TECH_LABELS[tag]}
          </li>
        ))}
      </ul>

      {/* Footer pinned to the card bottom so grids align across rows */}
      <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-6">
        {project.links.github && (
          <a
            href={project.links.github}
            target="_blank"
            rel="noreferrer"
            className={LINK_CLASS}
          >
            GitHub
            <ArrowUpRight aria-hidden className="size-3.5" />
          </a>
        )}
        {project.links.demo && (
          <a
            href={project.links.demo}
            target="_blank"
            rel="noreferrer"
            className={LINK_CLASS}
          >
            Demo
            <ArrowUpRight aria-hidden className="size-3.5" />
          </a>
        )}
        {project.post && (
          <Link to={`/blog/${project.post}`} className={LINK_CLASS}>
            Write-up
          </Link>
        )}
        {stats && (
          <span className="ml-auto inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Star aria-hidden className="size-3.5" />
            {formatStars(stats.stars)}
            <span aria-hidden>·</span>
            {formatPushed(stats.pushedAt)}
          </span>
        )}
      </div>
    </article>
  )
}
