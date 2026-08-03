/**
 * PageNav — the shared "On this page" rail (xl+ page chrome).
 *
 * One sticky column of section links with a position-based scroll-spy
 * highlight and jump-intent wiring: clicked entries hold their highlight
 * through bottom-clamped landings (the full rationale lives in
 * lib/use-scroll-spy.ts — this rail exists so that logic and the styling
 * are maintained ONCE).
 *
 * Purely presentational beyond the spy. Callers own where entries come
 * from and where the rail sits: the /code page passes its static sections
 * and lets its grid place the rail; the blog TableOfContents discovers a
 * post's headings, gates on 3+, indents h3s, and floats the rail beside
 * the reading column via className.
 */
import { useScrollSpy } from "@/lib/use-scroll-spy"
import { cn } from "@/lib/utils"

export interface PageNavItem {
  /** DOM id of the target element. Items must be in DOCUMENT ORDER
   *  (the scroll-spy's early-exit scan relies on it). */
  id: string
  label: string
  /** Nested entry (e.g. an h3 under an h2) — indented one step. */
  indent?: boolean
}

interface PageNavProps {
  items: PageNavItem[]
  /** Outer wrapper classes — positioning/visibility are the caller's. */
  className?: string
}

export function PageNav({ items, className }: PageNavProps) {
  const { activeId, notifyJump } = useScrollSpy(items.map((item) => item.id))

  return (
    <nav aria-label="On this page" className={className}>
      <div className="sticky top-28">
        <p className="font-display text-xs font-semibold tracking-[0.15em] text-muted-foreground uppercase">
          On this page
        </p>
        <ol className="mt-4 space-y-2.5 border-l border-border">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                // The jump carries intent: a bottom-clamped landing would
                // otherwise mis-highlight (see use-scroll-spy.ts)
                onClick={() => notifyJump(item.id)}
                className={cn(
                  "-ml-px block border-l pb-0.5 text-sm transition-colors duration-(--motion-duration-fast) outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50",
                  item.indent ? "pl-7" : "pl-4",
                  activeId === item.id
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground",
                )}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  )
}
