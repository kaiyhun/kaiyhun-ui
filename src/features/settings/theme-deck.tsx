/**
 * ThemeDeck — /settings' theme picker: a fanned deck of photocards
 * (composition from the user's reference shot; copy drafts in
 * content-draft §22). The CENTERED card is the live theme — centering
 * a card applies + persists it INSTANTLY (user decision: the deck IS
 * the control, no confirm step), so the page re-themes around the deck
 * as you browse. Locked cards center for reading but never apply.
 *
 * Mechanics: every card sits in the same centered cell and animates
 * transform-only (x/y/rotate/scale springs) to its fan slot relative
 * to the focused index; a background-colored overlay fades in on
 * off-center cards (opacity — no filter animations). Navigate by
 * swiping the center card (Motion drag), clicking a side card, the
 * arrow buttons, or arrow keys.
 *
 * Palette truth: each face is wrapped in its theme's scope class
 * (THEME_CLASS — .theme-default / .theme-matrix), so swatches and the
 * live MatrixRain canvas resolve THAT theme's tokens no matter which
 * theme <html> carries (see the `:root, .theme-default` note in
 * index.css).
 *
 * a11y: radiogroup/radio — aria-checked marks the APPLIED theme, the
 * locked card is aria-disabled but still focusable/browsable, arrow
 * keys move the deck with roving tabindex, and a polite live region
 * announces the centered card. Reduced motion: MotionConfig strips the
 * spring travel — cards snap straight to their slots.
 */
import { ArrowLeft, ArrowRight, Check, Lock } from "lucide-react"
import { motion } from "motion/react"
import { useRef, useState } from "react"

import { ResponsiveImage } from "@/components/media/responsive-image"
import { THEME_CARDS, type ThemeCard } from "@/content/themes"
import { MatrixRain } from "@/features/home/matrix-rain"
import { applyTheme, getTheme, THEME_CLASS, useTheme } from "@/lib/theme"
import { cn } from "@/lib/utils"

/** Fan geometry per step away from the center (transform-only). */
const FAN_X = 84
const FAN_Y = 16
const FAN_ROTATE = 8
/** Horizontal drag distance that counts as a swipe. */
const SWIPE_PX = 60

const ARROW_BUTTON =
  "inline-flex size-9 cursor-pointer items-center justify-center rounded-full border border-border text-muted-foreground transition-colors duration-(--motion-duration-fast) outline-none hover:border-primary/40 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-40"

/** One card face: imagery/rain/lock + name + palette swatches. */
function CardFace({ card, applied }: { card: ThemeCard; applied: boolean }) {
  return (
    <span
      className={cn(
        "absolute inset-0 flex flex-col overflow-hidden bg-background",
        card.id !== null && THEME_CLASS[card.id],
      )}
    >
      {card.picture && (
        <ResponsiveImage
          picture={card.picture}
          placeholder={card.lqip}
          alt=""
          sizes="224px"
          className="absolute inset-0 h-full w-full"
        />
      )}
      {card.rain && <MatrixRain className="absolute inset-0 h-full w-full" />}
      {/* Legibility scrim over imagery */}
      <span
        aria-hidden
        className="absolute inset-0 bg-linear-to-t from-background/85 via-background/20 to-background/30"
      />
      {card.id === null && (
        <Lock
          aria-hidden
          className="absolute top-1/2 left-1/2 size-8 -translate-x-1/2 -translate-y-1/2 text-muted-foreground"
        />
      )}
      {applied && (
        <span
          aria-hidden
          className="absolute top-3 right-3 rounded-full bg-primary p-1 text-primary-foreground"
        >
          <Check className="size-3" />
        </span>
      )}
      {/* Name + swatches, pinned to the card's lower third */}
      <span className="relative mt-auto flex flex-col items-center gap-3 p-5 text-center">
        <span className="font-display text-xl font-bold tracking-tight text-foreground">
          {card.name}
        </span>
        {card.id !== null ? (
          <span aria-hidden className="flex items-center gap-1.5">
            <span className="size-3.5 rounded-full border border-border bg-background" />
            <span className="size-3.5 rounded-full border border-border bg-primary" />
            <span className="size-3.5 rounded-full border border-border bg-accent" />
            <span className="size-3.5 rounded-full border border-border bg-foreground" />
          </span>
        ) : (
          <span className="font-display text-[0.65rem] font-semibold tracking-[0.15em] text-muted-foreground uppercase">
            Coming soon
          </span>
        )}
      </span>
    </span>
  )
}

export function ThemeDeck() {
  const theme = useTheme()
  const [focus, setFocus] = useState(() =>
    Math.max(
      0,
      THEME_CARDS.findIndex((card) => card.id === getTheme()),
    ),
  )
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([])

  /** Center a card; real themes apply instantly, locked slots don't. */
  const goTo = (index: number, moveDomFocus = false) => {
    const next = Math.max(0, Math.min(THEME_CARDS.length - 1, index))
    setFocus(next)
    const card = THEME_CARDS[next]
    if (card.id !== null) applyTheme(card.id)
    if (moveDomFocus) buttonsRef.current[next]?.focus()
  }

  const onGroupKeyDown = (event: React.KeyboardEvent) => {
    const steps: Record<string, number> = {
      ArrowRight: focus + 1,
      ArrowDown: focus + 1,
      ArrowLeft: focus - 1,
      ArrowUp: focus - 1,
      Home: 0,
      End: THEME_CARDS.length - 1,
    }
    if (event.key in steps) {
      event.preventDefault()
      goTo(steps[event.key], true)
    }
  }

  const focused = THEME_CARDS[focus]

  return (
    <div className="relative flex w-full flex-col items-center">
      {/* The deck: all cards share this cell, fanned by transform */}
      <div
        role="radiogroup"
        aria-label="Site theme"
        onKeyDown={onGroupKeyDown}
        className="relative h-96 w-full sm:h-108"
      >
        {THEME_CARDS.map((card, index) => {
          const offset = index - focus
          const centered = offset === 0
          return (
            <div
              key={card.name}
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
              style={{ zIndex: THEME_CARDS.length - Math.abs(offset) }}
            >
              <motion.button
                ref={(el) => {
                  buttonsRef.current[index] = el
                }}
                type="button"
                role="radio"
                aria-checked={card.id !== null && card.id === theme}
                aria-disabled={card.id === null || undefined}
                aria-label={
                  card.id === null ? `${card.name} — coming soon` : card.name
                }
                tabIndex={centered ? 0 : -1}
                onClick={() => goTo(index)}
                drag={centered ? "x" : false}
                dragSnapToOrigin
                dragElastic={0.4}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -SWIPE_PX) goTo(focus + 1)
                  else if (info.offset.x > SWIPE_PX) goTo(focus - 1)
                }}
                animate={{
                  x: offset * FAN_X,
                  y: Math.abs(offset) * FAN_Y,
                  rotate: offset * FAN_ROTATE,
                  scale: centered ? 1 : 0.92,
                }}
                transition={{ type: "spring", stiffness: 260, damping: 26 }}
                className="pointer-events-auto relative aspect-5/7 w-48 cursor-pointer touch-none overflow-hidden rounded-xl border border-border shadow-xl outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:w-56"
              >
                <CardFace
                  card={card}
                  applied={card.id !== null && card.id === theme}
                />
                {/* Off-center cards sit back behind a fading veil */}
                <motion.span
                  aria-hidden
                  animate={{ opacity: Math.min(Math.abs(offset) * 0.35, 0.7) }}
                  className="pointer-events-none absolute inset-0 bg-background"
                />
              </motion.button>
            </div>
          )
        })}
      </div>

      {/* Arrows + live status for the centered card */}
      <div className="mt-2 flex items-center gap-3">
        <button
          type="button"
          aria-label="Previous theme"
          disabled={focus === 0}
          onClick={() => goTo(focus - 1)}
          className={ARROW_BUTTON}
        >
          <ArrowLeft aria-hidden className="size-4" />
        </button>
        <button
          type="button"
          aria-label="Next theme"
          disabled={focus === THEME_CARDS.length - 1}
          onClick={() => goTo(focus + 1)}
          className={ARROW_BUTTON}
        >
          <ArrowRight aria-hidden className="size-4" />
        </button>
      </div>
      <div aria-live="polite" className="mt-6 max-w-md text-center">
        <p className="font-display text-xs font-semibold tracking-[0.15em] text-primary uppercase">
          {focused.id === null
            ? "Coming soon"
            : focused.id === theme
              ? "Applied"
              : ""}
        </p>
        <p className="mt-2 leading-relaxed text-muted-foreground">
          {focused.blurb}
        </p>
      </div>
    </div>
  )
}
