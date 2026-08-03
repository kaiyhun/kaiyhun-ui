/**
 * postbuild-blog — static HTML shells + sitemap for the blog.
 *
 * The SPA sets per-post <title>/<meta> at runtime (React 19 hoisting),
 * but social scrapers and search crawlers don't run JS. This script
 * reads dist/posts-manifest.json (emitted by config/blog-posts-plugin)
 * and writes dist/blog/<slug>/index.html — a copy of the app shell with
 * the post's real title, description, canonical URL, and OpenGraph tags
 * injected — so shared links unfurl correctly on GitHub Pages (which
 * serves those paths directly, no 404 fallback needed).
 *
 * Also emits dist/sitemap.xml covering the static routes + every post.
 * og:image is intentionally absent until the user picks one
 * (content-draft §12).
 */
import fs from "node:fs"
import path from "node:path"

const ORIGIN = "https://kaiyhun.github.io"
const BASE = "/kaiyhun-ui/"
const DIST = path.resolve(process.cwd(), "dist")

const escapeHtml = (text) =>
  text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")

const shell = fs.readFileSync(path.join(DIST, "index.html"), "utf8")
const posts = JSON.parse(
  fs.readFileSync(path.join(DIST, "posts-manifest.json"), "utf8"),
)

/* ---- Per-post shells with real meta ---- */
for (const post of posts) {
  const url = `${ORIGIN}${BASE}blog/${post.slug}`
  const title = escapeHtml(`${post.title} — Kaiyhun`)
  const description = escapeHtml(post.description)

  const html = shell
    .replace(/<title>.*?<\/title>/s, `<title>${title}</title>`)
    .replace(
      /<meta\s+name="description"[\s\S]*?\/>/,
      `<meta name="description" content="${description}" />`,
    )
    .replace(
      "</head>",
      [
        `    <link rel="canonical" href="${url}" />`,
        `    <meta property="og:type" content="article" />`,
        `    <meta property="og:title" content="${title}" />`,
        `    <meta property="og:description" content="${description}" />`,
        `    <meta property="og:url" content="${url}" />`,
        `    <meta property="article:published_time" content="${post.date}" />`,
        `  </head>`,
      ].join("\n"),
    )

  const dir = path.join(DIST, "blog", post.slug)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, "index.html"), html)
}

/* ---- Sitemap: static routes + posts ---- */
const STATIC_ROUTES = [
  "",
  "photography",
  "drawing",
  "code",
  "about",
  "blog",
  "tutorial",
  "preset",
  "preset/2020",
  "settings",
]
const urls = [
  ...STATIC_ROUTES.map((route) => ({ loc: `${ORIGIN}${BASE}${route}` })),
  ...posts.map((post) => ({
    loc: `${ORIGIN}${BASE}blog/${post.slug}`,
    lastmod: post.date,
  })),
]

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...urls.map(
    (entry) =>
      `  <url><loc>${entry.loc}</loc>${
        entry.lastmod ? `<lastmod>${entry.lastmod}</lastmod>` : ""
      }</url>`,
  ),
  "</urlset>",
  "",
].join("\n")
fs.writeFileSync(path.join(DIST, "sitemap.xml"), sitemap)

console.log(
  `postbuild-blog: ${posts.length} post shell(s), sitemap with ${urls.length} URLs`,
)
