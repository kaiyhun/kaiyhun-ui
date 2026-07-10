/**
 * Post page — /blog/:slug
 *
 * The reading page: topic tags + title + date/reading-time/copy-link,
 * then the lazily-loaded MDX body rendered through MDX_COMPONENTS, a
 * floating table of contents on xl (inside the same Suspense so it can
 * read the committed headings), and a chronological prev/next pager.
 * Unknown slugs render the 404 view. React 19 hoists the per-post
 * <title>/<meta> tags; crawlers get the same values from the static
 * shells that scripts/postbuild-blog.mjs writes.
 */
import { Check, Link2 } from "lucide-react"
import { lazy, Suspense, useMemo, useState } from "react"
import { Link, useParams } from "react-router"

import { NotFoundView } from "@/components/layout/not-found-view"
import { Reveal } from "@/components/motion/reveal"
import {
  adjacentPosts,
  formatPostDate,
  getPost,
  getPostLoader,
  TOPIC_LABELS,
  type Post,
} from "@/content/posts"
import { SITE } from "@/content/site"
import { MDX_COMPONENTS } from "@/features/blog/mdx-components"
import { TableOfContents } from "@/features/blog/table-of-contents"

/** One pager side — mirrors the collection pager's quiet link style. */
function PagerLink({
  post,
  label,
  align,
}: {
  post: Post | undefined
  label: string
  align: "left" | "right"
}) {
  if (!post) return <span aria-hidden />
  return (
    <Link
      to={`/blog/${post.slug}`}
      className={`group block outline-none focus-visible:ring-3 focus-visible:ring-ring/50 ${
        align === "right" ? "text-right" : ""
      }`}
    >
      <span className="font-display text-xs font-semibold tracking-[0.15em] text-muted-foreground uppercase">
        {label}
      </span>
      <span className="mt-1 block font-display font-semibold tracking-tight transition-colors duration-(--motion-duration-fast) group-hover:text-primary">
        {post.title}
      </span>
    </Link>
  )
}

export default function PostPage() {
  const { slug } = useParams()
  const post = slug ? getPost(slug) : undefined
  const loader = slug ? getPostLoader(slug) : undefined
  const [copied, setCopied] = useState(false)

  /* Each slug gets its own lazy component so the body stays a separate
     chunk; useMemo keeps it stable across re-renders */
  const Content = useMemo(
    () => (loader ? lazy(loader) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- loader is keyed by slug
    [slug],
  )

  if (!post || !Content) return <NotFoundView />

  const { prev, next } = adjacentPosts(post.slug)

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Clipboard unavailable (permissions/insecure context) — do nothing
    }
  }

  return (
    <main className="relative mx-auto max-w-3xl px-6 pt-32 pb-24">
      <title>{`${post.title} — ${SITE.name}`}</title>
      <meta name="description" content={post.description} />

      <Reveal>
        <header>
          <p className="font-display text-xs font-semibold tracking-[0.15em] text-primary uppercase">
            {post.topics.map((topic) => TOPIC_LABELS[topic]).join(" · ")}
          </p>
          <h1 className="mt-3 text-display-lg">{post.title}</h1>
          <div className="mt-4 flex items-center gap-3 text-sm text-muted-foreground">
            <time dateTime={post.date}>{formatPostDate(post.date)}</time>
            <span aria-hidden>·</span>
            <span>{post.readingTime} min read</span>
            <button
              type="button"
              onClick={copyLink}
              aria-label={copied ? "Link copied" : "Copy link to this post"}
              className="rounded-md p-1.5 transition-colors duration-(--motion-duration-fast) outline-none hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {copied ? (
                <Check aria-hidden className="size-4 text-primary" />
              ) : (
                <Link2 aria-hidden className="size-4" />
              )}
            </button>
          </div>
        </header>
      </Reveal>

      <article className="mt-10">
        {/* Fallback reserves height so the pager/footer don't jump when
            the lazy body mounts (CLS) */}
        <Suspense fallback={<div className="min-h-[60svh]" aria-hidden />}>
          <Content components={MDX_COMPONENTS} />
          {/* Sibling inside the Suspense: mounts once the body commits,
              so it can read the rendered headings */}
          <TableOfContents />
        </Suspense>
      </article>

      {(prev || next) && (
        <nav
          aria-label="More posts"
          className="mt-16 grid grid-cols-2 gap-6 border-t border-border pt-8"
        >
          <PagerLink post={prev} label="Older" align="left" />
          <PagerLink post={next} label="Newer" align="right" />
        </nav>
      )}
    </main>
  )
}
