/**
 * UnderlineTabs — the site's sub-menu primitive: underline tabs on a
 * Radix ToggleGroup (radio semantics, roving arrow-key focus).
 *
 * Promoted to components/ui because this is the FOURTH page needing the
 * pattern (photography CategoryMenu, drawing ViewMenu, blog TopicMenu
 * all hand-roll the same classes — migrating them here is queued for
 * the M11 audit; new consumers start here).
 */
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const TAB_CLASS =
  "rounded-none border-b-2 border-transparent bg-transparent px-1 pb-2 text-sm text-muted-foreground hover:bg-transparent hover:text-foreground data-[state=on]:border-primary data-[state=on]:bg-transparent data-[state=on]:text-foreground"

export interface UnderlineTab<T extends string> {
  value: T
  label: string
}

interface UnderlineTabsProps<T extends string> {
  tabs: UnderlineTab<T>[]
  value: T
  onChange: (value: T) => void
  /** Accessible group name, e.g. "Tutorials view". */
  label: string
}

export function UnderlineTabs<T extends string>({
  tabs,
  value,
  onChange,
  label,
}: UnderlineTabsProps<T>) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(next) => {
        // Radix emits "" when the active tab is re-clicked — stay put
        if (next) onChange(next as T)
      }}
      aria-label={label}
      spacing={6}
    >
      {tabs.map((tab) => (
        <ToggleGroupItem
          key={tab.value}
          value={tab.value}
          className={TAB_CLASS}
        >
          {tab.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
