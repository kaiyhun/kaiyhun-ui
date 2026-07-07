/**
 * TopicMenu — the blog index's sub-menu (All / topic tabs), the same
 * underline-tab treatment as the photography CategoryMenu and the
 * drawing ViewMenu so sub-navigation reads identically across wings.
 */
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { BLOG_TOPICS, TOPIC_LABELS, type BlogTopic } from "@/content/posts"

const TAB_CLASS =
  "rounded-none border-b-2 border-transparent bg-transparent px-1 pb-2 text-sm text-muted-foreground hover:bg-transparent hover:text-foreground data-[state=on]:border-primary data-[state=on]:bg-transparent data-[state=on]:text-foreground"

interface TopicMenuProps {
  /** Active topic, or null for "All". */
  value: BlogTopic | null
  onChange: (topic: BlogTopic | null) => void
}

export function TopicMenu({ value, onChange }: TopicMenuProps) {
  return (
    <ToggleGroup
      type="single"
      value={value ?? "all"}
      onValueChange={(next) =>
        onChange(!next || next === "all" ? null : (next as BlogTopic))
      }
      aria-label="Post topic"
      spacing={6}
    >
      <ToggleGroupItem value="all" className={TAB_CLASS}>
        All
      </ToggleGroupItem>
      {BLOG_TOPICS.map((topic) => (
        <ToggleGroupItem key={topic} value={topic} className={TAB_CLASS}>
          {TOPIC_LABELS[topic]}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
