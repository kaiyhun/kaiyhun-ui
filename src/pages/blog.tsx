/**
 * Blog index — /blog
 *
 * The hallway of the site (docs/homepage-brief.md): writing across every
 * wing, newest first, as a quiet list. ?topic filters by the controlled
 * topic vocabulary — URL-driven like every other filter on the site.
 * Standfirst copy is a DRAFT (content-draft §12).
 */
import { AnimatePresence, motion } from "motion/react"
import { useSearchParams } from "react-router"

import { Reveal } from "@/components/motion/reveal"
import { Button } from "@/components/ui/button"
import {
  BLOG_TOPICS,
  postsByTopic,
  TOPIC_LABELS,
  type BlogTopic,
} from "@/content/posts"
import { SITE } from "@/content/site"
import { PostList } from "@/features/blog/post-list"
import { TopicMenu } from "@/features/blog/topic-menu"
import { MOTION } from "@/lib/motion-tokens"

export default function Blog() {
  const [searchParams, setSearchParams] = useSearchParams()

  const rawTopic = searchParams.get("topic")
  const topic = BLOG_TOPICS.includes(rawTopic as BlogTopic)
    ? (rawTopic as BlogTopic)
    : null

  const setTopic = (next: BlogTopic | null) => {
    setSearchParams((params) => {
      if (next) params.set("topic", next)
      else params.delete("topic")
      return params
    })
  }

  const posts = postsByTopic(topic)

  return (
    <main className="mx-auto max-w-3xl px-6 pt-32 pb-24">
      {/* React 19 hoists these into <head> */}
      <title>{`Blog — ${SITE.name}`}</title>
      <meta
        name="description"
        content="Writing across photography, drawing, editing, and code."
      />

      <Reveal>
        <h1 className="text-display-sm">Blog</h1>
        <p className="mt-4 max-w-prose leading-relaxed text-muted-foreground">
          Notes from every wing — the photography, the drawing practice, the
          editing craft, and the code underneath it all.
        </p>
        <div className="mt-8">
          <TopicMenu value={topic} onChange={setTopic} />
        </div>
      </Reveal>

      <AnimatePresence mode="wait">
        <motion.div
          key={topic ?? "all"}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: MOTION.duration.base,
            ease: MOTION.ease.outExpo,
          }}
          className="mt-6"
        >
          {posts.length > 0 ? (
            <PostList posts={posts} />
          ) : (
            <div className="py-16 text-center">
              <p className="text-muted-foreground">
                Nothing filed under “{topic ? TOPIC_LABELS[topic] : ""}” yet.
              </p>
              <Button
                variant="outline"
                className="mt-6"
                onClick={() => setTopic(null)}
              >
                Show all posts
              </Button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </main>
  )
}
