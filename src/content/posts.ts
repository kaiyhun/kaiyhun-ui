/**
 * Blog content model (docs/blog.md) — the post registry.
 *
 * Metadata comes from `virtual:blog-posts` (config/blog-posts-plugin.ts
 * parses frontmatter + computes reading time at build; newest first).
 * Post BODIES stay out of this module: they're lazily imported per slug
 * so each post is its own chunk.
 *
 * Topics are a controlled vocabulary — the blog is the cross-cutting
 * "hallway" (docs/homepage-brief.md): a post's topics decide which wing
 * shows it as related writing. Validation throws loudly at module init
 * so a typo in frontmatter fails the build, not the reader.
 */
import type { ComponentType, ReactNode } from "react"
import { POSTS_META } from "virtual:blog-posts"

/** Topic slugs (labels below are DRAFTS — content-draft §12). */
export const BLOG_TOPICS = [
  "photography",
  "drawing",
  "editing",
  "code",
] as const
export type BlogTopic = (typeof BLOG_TOPICS)[number]

export const TOPIC_LABELS: Record<BlogTopic, string> = {
  photography: "Photography",
  drawing: "Drawing",
  editing: "Editing",
  code: "Code & Research",
}

export interface Post {
  slug: string
  title: string
  description: string
  /** ISO date (YYYY-MM-DD). */
  date: string
  topics: BlogTopic[]
  /** Whole minutes, computed at build. */
  readingTime: number
}

function assertTopics(slug: string, topics: string[]): BlogTopic[] {
  for (const topic of topics) {
    if (!BLOG_TOPICS.includes(topic as BlogTopic)) {
      throw new Error(
        `Post "${slug}" has unknown topic "${topic}" — vocabulary: ${BLOG_TOPICS.join(", ")}`,
      )
    }
  }
  return topics as BlogTopic[]
}

/** All posts, newest first (sorted by the build plugin). */
export const POSTS: Post[] = POSTS_META.map((meta) => ({
  ...meta,
  topics: assertTopics(meta.slug, meta.topics),
}))

export function getPost(slug: string): Post | undefined {
  return POSTS.find((post) => post.slug === slug)
}

export function postsByTopic(topic: BlogTopic | null): Post[] {
  return topic ? POSTS.filter((post) => post.topics.includes(topic)) : POSTS
}

/** Chronological neighbors for the post pager (prev = older). */
export function adjacentPosts(slug: string): {
  prev: Post | undefined
  next: Post | undefined
} {
  const index = POSTS.findIndex((post) => post.slug === slug)
  if (index === -1) return { prev: undefined, next: undefined }
  return { prev: POSTS[index + 1], next: POSTS[index - 1] }
}

/** "June 12, 2026" — one formatter so every surface reads the same. */
export function formatPostDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

type MdxModule = {
  default: ComponentType<{
    components?: Record<string, ComponentType<{ children?: ReactNode }>>
  }>
}

/* Lazy-only glob: each post compiles to its own chunk, downloaded when
   its page is visited (never eagerly — see blog-posts-plugin docstring) */
const POST_MODULES = import.meta.glob<MdxModule>("/src/content/posts/*.mdx")

/** Loader for a post's body, or undefined for unknown slugs (→ 404). */
export function getPostLoader(
  slug: string,
): (() => Promise<MdxModule>) | undefined {
  return POST_MODULES[`/src/content/posts/${slug}.mdx`]
}
