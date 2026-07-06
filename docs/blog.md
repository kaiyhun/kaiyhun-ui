# Blog engine — /blog (M8)

The site's cross-cutting "hallway" (docs/homepage-brief.md): posts are
tagged by topic and surface on the index, the homepage Writing band, and
each wing's "Related writing" module.

## Pipeline (all build-time, zero runtime markdown)

- Posts are **MDX** files in `src/content/posts/*.mdx` — filename =
  slug. `@mdx-js/rollup` (pre-enforced, before the React plugin in
  vite.config.ts) compiles each into its OWN lazy chunk.
- remark: `remark-frontmatter` (strips the YAML block from render),
  `remark-gfm` (tables, strikethrough). rehype: `rehype-slug` (heading
  ids for the ToC), `@shikijs/rehype` with a **CSS-variables theme** —
  code colors are `--shiki-*` tokens in `src/index.css`, on the site
  palette like every other token.
- **Metadata never touches the post chunks**: `config/blog-posts-plugin.ts`
  parses frontmatter + computes reading time (220 wpm) and serves it as
  `virtual:blog-posts` (typed in `src/types/blog.d.ts`). Eager-globbing
  the MDX modules instead would merge every post into the main bundle —
  don't.
- The plugin also emits `dist/posts-manifest.json`, consumed by
  `scripts/postbuild-blog.mjs` (chained in npm postbuild) which writes
  `dist/blog/<slug>/index.html` shells with real `<title>`/description/
  OpenGraph/canonical tags (crawlers don't run JS; GitHub Pages serves
  these paths directly) plus `dist/sitemap.xml`.

## Authoring a post

1. Create `src/content/posts/<slug>.mdx` with frontmatter:
   `title`, `description`, `date` (YYYY-MM-DD), `topics` (array from the
   vocabulary below). Reading time is computed — never hand-written.
2. Body is markdown; the element map `features/blog/mdx-components.tsx`
   styles everything. Posts may import site components — embed photos
   via `ResponsiveImage` + an imagetools directive (see the placeholder
   post for the exact pattern), not plain `![]()`.
3. Malformed frontmatter or an unknown topic FAILS THE BUILD (loud by
   design: plugin + `assertTopics` in `src/content/posts.ts`).
4. No draft mechanism (user decision): only commit finished posts.

## Topics (controlled vocabulary — src/content/posts.ts)

`photography` · `drawing` · `editing` · `code` (label "Code & Research").
A topic decides which wing lists the post as related writing. Adding a
topic = extend `BLOG_TOPICS` + `TOPIC_LABELS` (+ wire a RelatedWriting
on the new wing when it exists).

## Pages & components

- `/blog` (`pages/blog.tsx`) — quiet list (`features/blog/post-list`),
  `?topic` filter via underline tabs (`topic-menu`), crossfade, empty
  state.
- `/blog/:slug` (`pages/post.tsx`) — topics + title + date/reading-time/
  copy-link header; lazy MDX body through `MDX_COMPONENTS`;
  `TableOfContents` mounts INSIDE the same Suspense (it reads committed
  headings; renders only with 3+ h2/h3, xl screens, scroll-spy via
  IntersectionObserver); chronological prev/next pager; unknown slug →
  NotFoundView. React 19 hoists the per-post `<title>`/`<meta>`.
- Surfaces: `writing-band` (homepage, newest 3, hidden while no posts),
  `related-writing` (wings; renders nothing when its topic has no posts).

## Invariants

- Post metadata comes ONLY from `virtual:blog-posts`; components come
  ONLY from the lazy glob in `posts.ts`.
- If the deploy origin/base ever changes, update ORIGIN/BASE in
  `scripts/postbuild-blog.mjs`.
- og:image is intentionally absent — awaiting the user's pick
  (content-draft §12).
