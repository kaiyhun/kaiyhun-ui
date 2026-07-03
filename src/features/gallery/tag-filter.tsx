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
import { cn } from "@/lib/utils"

const CHIP_CLASS =
  "h-8 shrink-0 rounded-full border border-input bg-transparent px-3.5 font-display text-[0.65rem] font-semibold tracking-[0.15em] uppercase text-muted-foreground transition-colors duration-(--motion-duration-fast) hover:border-primary hover:text-foreground data-[state=on]:border-transparent data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"

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
        <ToggleGroupItem value="all" className={cn(CHIP_CLASS)}>
          All
        </ToggleGroupItem>
        {TAG_CHIPS.map((tag) => (
          <ToggleGroupItem key={tag} value={tag} className={cn(CHIP_CLASS)}>
            {tag}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  )
}
