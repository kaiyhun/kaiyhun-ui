/**
 * ViewMenu — the drawing page's sub-menu (Story / Gallery). Thin
 * wrapper over the shared UnderlineTabs primitive (migrated in the
 * M11 audit).
 */
import { UnderlineTabs } from "@/components/ui/underline-tabs"

/** Story = the journey timeline (default); Gallery = grouped grids. */
export type DrawingView = "story" | "gallery"

const TABS: { value: DrawingView; label: string }[] = [
  { value: "story", label: "Story" },
  { value: "gallery", label: "Gallery" },
]

interface ViewMenuProps {
  value: DrawingView
  onChange: (view: DrawingView) => void
}

export function ViewMenu({ value, onChange }: ViewMenuProps) {
  return (
    <UnderlineTabs
      tabs={TABS}
      value={value}
      onChange={onChange}
      label="Drawing page view"
    />
  )
}
