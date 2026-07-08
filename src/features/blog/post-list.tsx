/**
 * PostList — the blog's quiet list (user pick, M8 kickoff): title, date,
 * topic tags, one-line description per row. No covers, no cards — a
 * chronological reading list that matches the site's restraint.
 */
import { Link } from "react-router"

import { Reveal, RevealGroup } from "@/components/motion/reveal"
import { formatPostDate, TOPIC_LABELS, type Post } from "@/content/posts"

interface PostListProps {
  posts: Post[]
}

export function PostList({ posts }: PostListProps) {
  return (
    <RevealGroup>
      <ol>
        {posts.map((post) => (
          <li key={post.slug} className="border-b border-border">
            <Reveal distance={16}>
              <Link
                to={`/blog/${post.slug}`}
                className="group block py-8 outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <h2 className="font-display text-xl font-semibold tracking-tight transition-colors duration-(--motion-duration-fast) group-hover:text-primary">
                    {post.title}
                  </h2>
                  <time
                    dateTime={post.date}
                    className="shrink-0 text-sm text-muted-foreground"
                  >
                    {formatPostDate(post.date)}
                  </time>
                </div>
                <p className="mt-1.5 font-display text-xs font-semibold tracking-[0.15em] text-primary uppercase">
                  {post.topics.map((topic) => TOPIC_LABELS[topic]).join(" · ")}
                </p>
                <p className="mt-2.5 max-w-prose text-sm leading-relaxed text-muted-foreground">
                  {post.description}
                </p>
              </Link>
            </Reveal>
          </li>
        ))}
      </ol>
    </RevealGroup>
  )
}
