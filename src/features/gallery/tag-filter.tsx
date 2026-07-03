/**
 * TagFilter — the curated subject-chip row on /photography.
 *
 * One slim line under the page header (user-approved placement): "All"
 * leads, then the curated TAG_CHIPS. Single-select (radio semantics via
 * Radix ToggleGroup — arrow keys rove, clicking the active chip clears).
 * On narrow screens the row scrolls horizontally instead of wrapping, so
 * it never stacks into a wall of chips.
 */
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { TAG_CHIPS } from "@/content/collections"

/** Chip-specific styling only — typography, transitions, and the primary
 *  on-state come from the restyled Toggle base (ui/toggle.tsx). */
const CHIP_CLASS =
  "h-8 shrink-0 rounded-full border border-input bg-transparent px-3.5 text-[0.65rem] text-muted-foreground hover:border-primary data-[state=on]:border-transparent"

interface TagFilterProps {
  /** Active tag, or null for "All". */
  value: string | null
  onChange: (tag: string | null) => void
}

export function TagFilter({ value, onChange }: TagFilterProps) {
  return (
    // Bleed to the page padding so the scroll area reaches the edges
    <div className="-mx-6 [scrollbar-width:none] overflow-x-auto px-6 [&::-webkit-scrollbar]:hidden">
      <ToggleGroup
        type="single"
        value={value ?? "all"}
        onValueChange={(next) =>
          onChange(!next || next === "all" ? null : next)
        }
        aria-label="Filter photos by subject"
        className="flex-nowrap"
      >
        <ToggleGroupItem value="all" className={CHIP_CLASS}>
          All
        </ToggleGroupItem>
        {TAG_CHIPS.map((tag) => (
          <ToggleGroupItem key={tag} value={tag} className={CHIP_CLASS}>
            {tag}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  )
}
