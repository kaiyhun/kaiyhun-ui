/**
 * Journey — the narrative spine of the drawing page.
 *
 * A thin vertical thread connects short first-person chapters. Each
 * chapter is a dot on the thread with quiet prose beside it; the
 * five-year gap renders as a tall, nearly-empty stretch where the thread
 * turns dashed — the silence is part of the record. The "now" chapter's
 * dot is primary blue: the thread is live again.
 *
 * Deliberately quieter than the rest of the site: no display-uppercase,
 * no big imagery — sincerity over spectacle (docs/drawing-page-context.md).
 */
import { Reveal } from "@/components/motion/reveal"
import { JOURNEY } from "@/content/drawings"
import { cn } from "@/lib/utils"

export function Journey() {
  return (
    <ol className="mt-16">
      {JOURNEY.map((chapter, index) => (
        <li
          key={index}
          className={cn(
            "relative border-l pb-14 pl-8 sm:pl-12",
            // The gap: a long silent stretch of dashed thread
            chapter.gap
              ? "border-dashed border-border/60 py-28 sm:py-40"
              : "border-border",
          )}
        >
          {/* Thread dot (the gap has none — nothing happened there) */}
          {!chapter.gap && (
            <span
              aria-hidden
              className={cn(
                "absolute top-1 -left-[5.5px] size-2.5 rounded-full",
                chapter.current ? "bg-primary" : "bg-border",
              )}
            />
          )}
          <Reveal distance={16}>
            {chapter.marker && (
              <p className="font-display text-xs font-semibold tracking-[0.15em] text-muted-foreground uppercase">
                {chapter.marker}
              </p>
            )}
            <div
              className={cn(
                "max-w-prose space-y-4",
                chapter.marker && "mt-3",
                chapter.gap
                  ? "text-sm text-muted-foreground/70 italic"
                  : "leading-relaxed text-foreground/85",
              )}
            >
              {chapter.paragraphs.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </Reveal>
        </li>
      ))}
    </ol>
  )
}
