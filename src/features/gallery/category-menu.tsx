/**
 * CategoryMenu — the photography page's sub-menu (All / Landscape /
 * Portrait), sitting directly under the page title. Thin wrapper over
 * the shared UnderlineTabs primitive (migrated in the M11 audit);
 * "all" maps to null in the page's URL state.
 */
import { UnderlineTabs } from "@/components/ui/underline-tabs"
import {
  CATEGORY_LABELS,
  PHOTO_CATEGORIES,
  type PhotoCategory,
} from "@/content/collections"

const TABS = [
  { value: "all", label: "All" },
  ...PHOTO_CATEGORIES.map((category) => ({
    value: category as string,
    label: CATEGORY_LABELS[category],
  })),
]

interface CategoryMenuProps {
  /** Active category, or null for "All" (both sections shown). */
  value: PhotoCategory | null
  onChange: (category: PhotoCategory | null) => void
}

export function CategoryMenu({ value, onChange }: CategoryMenuProps) {
  return (
    <UnderlineTabs
      tabs={TABS}
      value={value ?? "all"}
      onChange={(next) =>
        onChange(next === "all" ? null : (next as PhotoCategory))
      }
      label="Photography category"
    />
  )
}
