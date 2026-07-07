/**
 * MDX_COMPONENTS — the styled element map every post renders through.
 *
 * Posts are plain markdown elements at heart; this map dresses them in
 * the design system (display font for headings, token colors, spacing
 * rhythm) so no post ever ships browser-default styling. Code blocks
 * arrive pre-highlighted from build-time Shiki as `--shiki-*` CSS
 * variables (defined in index.css with the other tokens).
 *
 * Headings start at h2 — the post title owns h1.
 */
import type { ComponentPropsWithoutRef } from "react"

export const MDX_COMPONENTS = {
  h2: (props: ComponentPropsWithoutRef<"h2">) => (
    <h2
      className="mt-12 mb-4 scroll-mt-24 font-display text-2xl font-bold tracking-tight"
      {...props}
    />
  ),
  h3: (props: ComponentPropsWithoutRef<"h3">) => (
    <h3
      className="mt-8 mb-3 scroll-mt-24 font-display text-xl font-semibold tracking-tight"
      {...props}
    />
  ),
  p: (props: ComponentPropsWithoutRef<"p">) => (
    <p className="my-4 leading-relaxed text-foreground/85" {...props} />
  ),
  a: (props: ComponentPropsWithoutRef<"a">) => (
    <a
      className="text-primary underline decoration-primary/40 underline-offset-4 transition-colors duration-(--motion-duration-fast) hover:decoration-primary"
      target={props.href?.startsWith("http") ? "_blank" : undefined}
      rel={props.href?.startsWith("http") ? "noreferrer" : undefined}
      {...props}
    />
  ),
  ul: (props: ComponentPropsWithoutRef<"ul">) => (
    <ul
      className="my-4 list-disc space-y-2 pl-6 leading-relaxed text-foreground/85 marker:text-muted-foreground"
      {...props}
    />
  ),
  ol: (props: ComponentPropsWithoutRef<"ol">) => (
    <ol
      className="my-4 list-decimal space-y-2 pl-6 leading-relaxed text-foreground/85 marker:text-muted-foreground"
      {...props}
    />
  ),
  blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote
      className="my-6 border-l-2 border-primary/60 pl-5 text-foreground/70 italic"
      {...props}
    />
  ),
  /* Shiki emits <pre class="shiki" style="background:var(--shiki-…)">;
     the frame (radius, border, padding, scroll) is ours */
  pre: (props: ComponentPropsWithoutRef<"pre">) => (
    <pre
      className="my-6 overflow-x-auto rounded-xl border border-border p-4 text-sm leading-relaxed"
      {...props}
    />
  ),
  code: (props: ComponentPropsWithoutRef<"code">) => (
    // Inline code only — block code lives inside <pre> and keeps Shiki's
    // spans untouched (the rounded chip look would break line layout)
    <code
      className="rounded-md bg-secondary px-1.5 py-0.5 font-mono text-[0.85em] in-[pre]:rounded-none in-[pre]:bg-transparent in-[pre]:p-0"
      {...props}
    />
  ),
  table: (props: ComponentPropsWithoutRef<"table">) => (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse text-sm" {...props} />
    </div>
  ),
  th: (props: ComponentPropsWithoutRef<"th">) => (
    <th
      className="border-b border-border px-3 py-2 text-left font-display text-xs font-semibold tracking-[0.15em] text-muted-foreground uppercase"
      {...props}
    />
  ),
  td: (props: ComponentPropsWithoutRef<"td">) => (
    <td
      className="border-b border-border/50 px-3 py-2 text-foreground/85"
      {...props}
    />
  ),
  hr: (props: ComponentPropsWithoutRef<"hr">) => (
    <hr className="my-10 border-border" {...props} />
  ),
  img: (props: ComponentPropsWithoutRef<"img">) => (
    // Plain markdown images; posts should prefer ResponsiveImage (see
    // the placeholder post for the pattern)
    <img className="my-2 w-full rounded-xl" loading="lazy" {...props} />
  ),
}
