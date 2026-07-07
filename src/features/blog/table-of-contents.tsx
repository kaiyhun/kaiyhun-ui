/**
 * TableOfContents — floating heading nav for long posts.
 *
 * Reads the rendered article's h2/h3 (ids from rehype-slug) AFTER the
 * lazy MDX body commits — mount it as a sibling INSIDE the same
 * <Suspense> as the content so its effect runs post-commit. Renders
 * nothing under 3 headings (short posts don't need a map) and only
 * shows on xl+ screens, floated to the right of the reading column.
 * A scroll-spy (IntersectionObserver) highlights the current section.
 */
import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"

interface Heading {
  id: string
  text: string
  level: 2 | 3
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    const elements = [
      ...document.querySelectorAll<HTMLHeadingElement>(
        "article h2[id], article h3[id]",
      ),
    ]
    setHeadings(
      elements.map((el) => ({
        id: el.id,
        text: el.textContent ?? "",
        level: el.tagName === "H2" ? 2 : 3,
      })),
    )
    if (elements.length < 3) return

    /* Scroll-spy: the heading nearest the top quarter of the viewport
       wins; transform/opacity-free, passive by nature */
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        }
      },
      { rootMargin: "-20% 0px -70% 0px" },
    )
    for (const el of elements) observer.observe(el)
    return () => observer.disconnect()
  }, [])

  if (headings.length < 3) return null

  return (
    <nav
      aria-label="On this page"
      className="absolute top-0 left-full ml-12 hidden h-full w-52 xl:block"
    >
      <div className="sticky top-28">
        <p className="font-display text-xs font-semibold tracking-[0.15em] text-muted-foreground uppercase">
          On this page
        </p>
        <ol className="mt-4 space-y-2.5 border-l border-border">
          {headings.map((heading) => (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                className={cn(
                  "-ml-px block border-l pb-0.5 text-sm transition-colors duration-(--motion-duration-fast) outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50",
                  heading.level === 3 ? "pl-7" : "pl-4",
                  activeId === heading.id
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground",
                )}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  )
}
