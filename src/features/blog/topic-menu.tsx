/**
 * TopicMenu — the blog index's sub-menu (All / topic tabs). Thin
 * wrapper over the shared UnderlineTabs primitive (migrated in the
 * M11 audit); "all" maps to null in the page's URL state.
 */
import { UnderlineTabs } from "@/components/ui/underline-tabs"
import { BLOG_TOPICS, TOPIC_LABELS, type BlogTopic } from "@/content/posts"

const TABS = [
  { value: "all", label: "All" },
  ...BLOG_TOPICS.map((topic) => ({
    value: topic as string,
    label: TOPIC_LABELS[topic],
  })),
]

interface TopicMenuProps {
  /** Active topic, or null for "All". */
  value: BlogTopic | null
  onChange: (topic: BlogTopic | null) => void
}

export function TopicMenu({ value, onChange }: TopicMenuProps) {
  return (
    <UnderlineTabs
      tabs={TABS}
      value={value ?? "all"}
      onChange={(next) => onChange(next === "all" ? null : (next as BlogTopic))}
      label="Post topic"
    />
  )
}
