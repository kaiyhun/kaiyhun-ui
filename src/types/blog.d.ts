/**
 * Ambient types for the blog engine (docs/blog.md):
 * - `virtual:blog-posts` is served by config/blog-posts-plugin.ts
 * - `*.mdx` modules are compiled posts (component only; metadata comes
 *   from the virtual module so post chunks stay lazily code-split)
 */

declare module "virtual:blog-posts" {
  /** Mirrors PostMeta in config/blog-posts-plugin.ts. */
  export const POSTS_META: {
    slug: string
    title: string
    description: string
    date: string
    topics: string[]
    readingTime: number
  }[]
}

declare module "*.mdx" {
  import type { ComponentType, ReactNode } from "react"

  const MDXContent: ComponentType<{
    components?: Record<string, ComponentType<{ children?: ReactNode }>>
  }>
  export default MDXContent
}
