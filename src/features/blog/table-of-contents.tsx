/**
 * TableOfContents — floating heading nav for long posts.
 *
 * Reads the rendered article's h2/h3 (ids from rehype-slug) AFTER the
 * lazy MDX body commits — mount it as a sibling INSIDE the same
 * <Suspense> as the content so its effect runs post-commit. Renders
 * nothing under 3 headings (short posts don't need a map) and only
 * shows on xl+ screens, floated to the right of the reading column.
 *
 * The rail itself (styling, scroll-spy highlight, jump-intent wiring) is
 * the shared PageNav — this component only supplies the discovered
 * headings (h3s indented) and the float positioning.
 */
import { useEffect, useState } from "react"

import { PageNav, type PageNavItem } from "@/components/layout/page-nav"

export function TableOfContents() {
  const [items, setItems] = useState<PageNavItem[]>([])

  useEffect(() => {
    const elements = [
      ...document.querySelectorAll<HTMLHeadingElement>(
        "article h2[id], article h3[id]",
      ),
    ]
    setItems(
      elements.map((el) => ({
        id: el.id,
        label: el.textContent ?? "",
        indent: el.tagName === "H3",
      })),
    )
  }, [])

  if (items.length < 3) return null

  return (
    <PageNav
      items={items}
      className="absolute top-0 left-full ml-12 hidden h-full w-52 xl:block"
    />
  )
}
