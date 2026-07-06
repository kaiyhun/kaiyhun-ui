/**
 * ViewMenu — the drawing page's sub-menu (Story / Gallery), sitting
 * directly under the page title. Mirrors the photography CategoryMenu's
 * underline-tab treatment so sub-navigation reads the same across wings.
 * Radix ToggleGroup supplies radio semantics and roving arrow-key focus.
 */
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

/** Story = the journey timeline (default); Gallery = grouped grids. */
export type DrawingView = "story" | "gallery"

const VIEWS: { value: DrawingView; label: string }[] = [
  { value: "story", label: "Story" },
  { value: "gallery", label: "Gallery" },
]

const TAB_CLASS =
  "rounded-none border-b-2 border-transparent bg-transparent px-1 pb-2 text-sm text-muted-foreground hover:bg-transparent hover:text-foreground data-[state=on]:border-primary data-[state=on]:bg-transparent data-[state=on]:text-foreground"

interface ViewMenuProps {
  value: DrawingView
  onChange: (view: DrawingView) => void
}

export function ViewMenu({ value, onChange }: ViewMenuProps) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(next) => {
        // Radix emits "" when the active tab is clicked again — keep it on
        if (next) onChange(next as DrawingView)
      }}
      aria-label="Drawing page view"
      spacing={6}
    >
      {VIEWS.map((view) => (
        <ToggleGroupItem
          key={view.value}
          value={view.value}
          className={TAB_CLASS}
        >
          {view.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
