/**
 * LabNav — the Lab's right-side page navigator (user request, M9): a
 * sticky "On this page" rail on xl+ screens jumping between the page's
 * sections, with the same scroll-spy treatment as the blog post ToC.
 * Sections are passed in (they're static, unlike a post's headings).
 */
import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"

export interface LabSection {
  id: string
  label: string
}

export function LabNav({ sections }: { sections: LabSection[] }) {
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    const elements = sections
      .map((section) => document.getElementById(section.id))
      .filter((el): el is HTMLElement => el !== null)

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        }
      },
      { rootMargin: "-15% 0px -70% 0px" },
    )
    for (const el of elements) observer.observe(el)
    return () => observer.disconnect()
  }, [sections])

  return (
    <nav aria-label="On this page" className="hidden xl:block">
      <div className="sticky top-28">
        <p className="font-display text-xs font-semibold tracking-[0.15em] text-muted-foreground uppercase">
          On this page
        </p>
        <ol className="mt-4 space-y-2.5 border-l border-border">
          {sections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className={cn(
                  "-ml-px block border-l pb-0.5 pl-4 text-sm transition-colors duration-(--motion-duration-fast) outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50",
                  activeId === section.id
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground",
                )}
              >
                {section.label}
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  )
}
