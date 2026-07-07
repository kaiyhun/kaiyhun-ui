/**
 * WritingBand — the homepage's recent-writing section: the 2–3 newest
 * posts as quiet rows with topic tags, closing with an "All posts" link.
 * The blog is the hallway (docs/homepage-brief.md) — this band is how
 * the homepage routes into it. Renders nothing while no posts exist
 * ("hidden until real").
 */
import { ArrowRight } from "lucide-react"
import { Link } from "react-router"

import { Reveal } from "@/components/motion/reveal"
import { formatPostDate, POSTS, TOPIC_LABELS } from "@/content/posts"

/** Newest posts shown on the homepage. */
const BAND_SIZE = 3

export function WritingBand() {
  const posts = POSTS.slice(0, BAND_SIZE)
  if (posts.length === 0) return null

  return (
    <div>
      <ol>
        {posts.map((post) => (
          <Reveal key={post.slug} distance={16}>
            <li className="border-b border-border">
              <Link
                to={`/blog/${post.slug}`}
                className="group block py-6 outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <h3 className="font-display text-lg font-semibold tracking-tight transition-colors duration-(--motion-duration-fast) group-hover:text-primary">
                  {post.title}
                </h3>
                {/* Meta always below the title — mixed row/wrap layouts
                    made short and long titles read differently */}
                <p className="mt-1.5 text-sm text-muted-foreground">
                  <time dateTime={post.date}>{formatPostDate(post.date)}</time>
                  <span aria-hidden> · </span>
                  <span className="font-display text-xs font-semibold tracking-[0.15em] text-primary/80 uppercase">
                    {post.topics
                      .map((topic) => TOPIC_LABELS[topic])
                      .join(" · ")}
                  </span>
                </p>
              </Link>
            </li>
          </Reveal>
        ))}
      </ol>
      <Reveal distance={16}>
        <Link
          to="/blog"
          className="group mt-6 inline-flex items-center gap-2 font-display text-xs font-semibold tracking-[0.15em] text-primary uppercase outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          All posts
          <ArrowRight
            aria-hidden
            className="size-4 transition-transform duration-(--motion-duration-fast) ease-(--ease-out-expo) group-hover:translate-x-1"
          />
        </Link>
      </Reveal>
    </div>
  )
}
