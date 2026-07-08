/**
 * RelatedWriting — the lateral bridge from a wing to the blog
 * (docs/homepage-brief.md §cross-medium): the newest posts carrying the
 * wing's topic, as compact rows. Renders NOTHING when the topic has no
 * posts yet — zero-post wings stay untouched ("hidden until real").
 */
import { ArrowRight } from "lucide-react"
import { Link } from "react-router"

import { Reveal } from "@/components/motion/reveal"
import {
  formatPostDate,
  postsByTopic,
  TOPIC_LABELS,
  type BlogTopic,
} from "@/content/posts"

/** Rows shown before deferring to the full topic-filtered index. */
const MAX_ROWS = 3

interface RelatedWritingProps {
  topic: BlogTopic
}

export function RelatedWriting({ topic }: RelatedWritingProps) {
  const posts = postsByTopic(topic).slice(0, MAX_ROWS)
  if (posts.length === 0) return null

  return (
    <section
      aria-labelledby={`related-writing-${topic}`}
      className="mt-20 border-t border-border pt-12"
    >
      <Reveal distance={16}>
        <h2
          id={`related-writing-${topic}`}
          className="font-display text-lg font-semibold tracking-tight"
        >
          Related writing
        </h2>
      </Reveal>
      <ol className="mt-4">
        {posts.map((post) => (
          <li key={post.slug}>
            <Reveal distance={16}>
              <Link
                to={`/blog/${post.slug}`}
                className="group flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-border/60 py-4 outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <span className="font-medium transition-colors duration-(--motion-duration-fast) group-hover:text-primary">
                  {post.title}
                </span>
                <time
                  dateTime={post.date}
                  className="shrink-0 text-sm text-muted-foreground"
                >
                  {formatPostDate(post.date)}
                </time>
              </Link>
            </Reveal>
          </li>
        ))}
      </ol>
      <Reveal distance={16}>
        <Link
          to={`/blog?topic=${topic}`}
          className="group mt-5 inline-flex items-center gap-2 font-display text-xs font-semibold tracking-[0.15em] text-primary uppercase outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {`All ${TOPIC_LABELS[topic].toLowerCase()} posts`}
          <ArrowRight
            aria-hidden
            className="size-4 transition-transform duration-(--motion-duration-fast) ease-(--ease-out-expo) group-hover:translate-x-1"
          />
        </Link>
      </Reveal>
    </section>
  )
}
