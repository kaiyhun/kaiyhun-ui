/**
 * GoalsTimeline — the About page's forward-looking thread (user
 * request, M11): the same vertical-thread language as the drawing
 * journey, pointed at the future. Open goals wear hollow dots on a
 * dashed thread (not yet real); achieved goals get the filled primary
 * dot and a solid segment. Ends open — like the drawing record, it's
 * meant to keep growing.
 */
import { Reveal } from "@/components/motion/reveal"
import { GOALS } from "@/content/about"
import { cn } from "@/lib/utils"

export function GoalsTimeline() {
  return (
    <ol className="mt-8">
      {GOALS.map((goal, index) => (
        <li
          key={index}
          className={cn(
            "relative border-l pb-10 pl-8 sm:pl-12",
            goal.done ? "border-border" : "border-dashed border-border/60",
          )}
        >
          <span
            aria-hidden
            className={cn(
              "absolute top-1 -left-[5.5px] size-2.5 rounded-full",
              goal.done
                ? "bg-primary"
                : "border border-primary/60 bg-background",
            )}
          />
          <Reveal distance={16}>
            <p className="font-display text-xs font-semibold tracking-[0.15em] text-muted-foreground uppercase">
              {goal.marker}
            </p>
            <p className="mt-2 max-w-prose leading-relaxed text-foreground/85">
              {goal.text}
            </p>
          </Reveal>
        </li>
      ))}
    </ol>
  )
}
