/**
 * CategoryMenu — the photography page's sub-menu (All / Landscape /
 * Portrait), sitting directly under the page title.
 *
 * Visually distinct from the tag chips one level below it: underline
 * tabs rather than pills, so the hierarchy reads as
 * category (structure) → tags (subject). Radix ToggleGroup supplies
 * radio semantics and roving arrow-key focus.
 */
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  CATEGORY_LABELS,
  PHOTO_CATEGORIES,
  type PhotoCategory,
} from "@/content/collections"

const TAB_CLASS =
  "rounded-none border-b-2 border-transparent bg-transparent px-1 pb-2 text-sm text-muted-foreground hover:bg-transparent hover:text-foreground data-[state=on]:border-primary data-[state=on]:bg-transparent data-[state=on]:text-foreground"

interface CategoryMenuProps {
  /** Active category, or null for "All" (both sections shown). */
  value: PhotoCategory | null
  onChange: (category: PhotoCategory | null) => void
}

export function CategoryMenu({ value, onChange }: CategoryMenuProps) {
  return (
    <ToggleGroup
      type="single"
      value={value ?? "all"}
      onValueChange={(next) =>
        onChange(!next || next === "all" ? null : (next as PhotoCategory))
      }
      aria-label="Photography category"
      spacing={6}
    >
      <ToggleGroupItem value="all" className={TAB_CLASS}>
        All
      </ToggleGroupItem>
      {PHOTO_CATEGORIES.map((category) => (
        <ToggleGroupItem key={category} value={category} className={TAB_CLASS}>
          {CATEGORY_LABELS[category]}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
