/**
 * SectionKicker — the homepage sections' numbered eyebrow:
 * "01 —— PHOTOGRAPHY" (+ an optional quiet intro line).
 *
 * The editorial recomposition (user decision): the section label is
 * demoted to this micro-kicker so each section has exactly ONE big type
 * moment — the category doors, or the statement line on door-less
 * sections. The h2 lives here: it remains the section's accessible name
 * (wire the section's aria-labelledby to `id`); the number and rule are
 * decorative (aria-hidden), so screen readers hear just the label.
 */
interface SectionKickerProps {
  /** Decorative order numeral ("01"…) — wayfinding rhythm, not content.
   *  Omit for a label-only kicker (rule + label). */
  number?: string
  /** h2 id — point the section's aria-labelledby here. */
  id: string
  label: string
  /** Optional supporting line (approved copy) under the eyebrow. */
  intro?: string
}

export function SectionKicker({
  number,
  id,
  label,
  intro,
}: SectionKickerProps) {
  return (
    <div>
      <h2
        id={id}
        className="flex items-center gap-3 font-display text-xs font-semibold tracking-[0.15em] text-muted-foreground uppercase"
      >
        {number && (
          <span aria-hidden className="text-primary">
            {number}
          </span>
        )}
        {/* border token is too faint over full-bleed imagery */}
        <span aria-hidden className="h-px w-10 bg-muted-foreground/40" />
        {label}
      </h2>
      {intro && (
        <p className="mt-3 max-w-md text-base leading-relaxed text-muted-foreground">
          {intro}
        </p>
      )}
    </div>
  )
}
