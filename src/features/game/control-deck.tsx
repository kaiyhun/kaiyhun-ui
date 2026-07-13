/**
 * ControlDeck — the /run game's arcade control station (user request,
 * 2026-07-12): a mono keycap panel under the game screen with the
 * ← ↑ ↓ → cluster and the SPACE bar. Caps LIGHT UP while the matching
 * physical key is held (Runner mirrors its key handlers into `lit`)
 * and are themselves PLAYABLE — press-and-hold pointer input drives
 * the same actions through `onCap`, which finally gives TOUCH players
 * movement (only flip had a touch path before; docs/game.md backlog
 * item done).
 *
 * Caps are pointer-driven (pointerdown/up/leave/cancel) and
 * tabIndex={-1}: keyboard players already own these exact keys — a
 * focusable cap would double-fire Space (button activation + the
 * window key handler) — so the deck is a touch/mouse surface, with
 * aria-labels for completeness. Styling is token-only: lit = primary
 * border + soft glow + a pressed 1px sink, matching the site's
 * pressed-state grammar. Captions are DRAFTS (content-draft §23).
 */
import { cn } from "@/lib/utils"

export type CapId = "up" | "down" | "left" | "right" | "space"
export type DeckLit = Record<CapId, boolean>

interface ControlDeckProps {
  lit: DeckLit
  /** Press-state changes per cap — Runner lights + acts on them. */
  onCap: (id: CapId, pressed: boolean) => void
}

function KeyCap({
  id,
  glyph,
  label,
  lit,
  wide,
  onCap,
}: {
  id: CapId
  glyph: string
  label: string
  lit: boolean
  wide?: boolean
  onCap: ControlDeckProps["onCap"]
}) {
  return (
    <button
      type="button"
      tabIndex={-1}
      aria-label={label}
      onPointerDown={(event) => {
        event.preventDefault()
        onCap(id, true)
      }}
      onPointerUp={() => onCap(id, false)}
      onPointerLeave={() => onCap(id, false)}
      onPointerCancel={() => onCap(id, false)}
      onContextMenu={(event) => event.preventDefault()}
      className={cn(
        "flex h-11 cursor-pointer touch-none items-center justify-center rounded-md border font-mono text-sm transition-all duration-(--motion-duration-fast) select-none",
        wide ? "w-40 sm:w-52" : "w-11",
        lit
          ? "translate-y-px border-primary bg-primary/15 text-primary shadow-[0_0_12px_-4px_var(--primary)]"
          : "border-border bg-background text-muted-foreground hover:text-foreground",
      )}
    >
      {glyph}
    </button>
  )
}

const CAPTION =
  "font-mono text-[0.65rem] tracking-[0.15em] text-muted-foreground uppercase"

export function ControlDeck({ lit, onCap }: ControlDeckProps) {
  return (
    <div className="mt-4 flex flex-wrap items-end justify-center gap-x-10 gap-y-4 rounded-xl border border-border bg-card px-6 py-4">
      <div className="flex flex-col items-center gap-2">
        <KeyCap
          id="space"
          glyph="——— space ———"
          label="Flip gravity (Space)"
          lit={lit.space}
          wide
          onCap={onCap}
        />
        <span className={CAPTION}>flip gravity</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="grid grid-cols-3 gap-1.5">
          <span aria-hidden />
          <KeyCap
            id="up"
            glyph="↑"
            label="Flip gravity (Up arrow)"
            lit={lit.up}
            onCap={onCap}
          />
          <span aria-hidden />
          <KeyCap
            id="left"
            glyph="←"
            label="Move left (hold)"
            lit={lit.left}
            onCap={onCap}
          />
          <KeyCap
            id="down"
            glyph="↓"
            label="Flip gravity (Down arrow)"
            lit={lit.down}
            onCap={onCap}
          />
          <KeyCap
            id="right"
            glyph="→"
            label="Move right (hold)"
            lit={lit.right}
            onCap={onCap}
          />
        </div>
        <span className={CAPTION}>← → move · ↑ ↓ flip</span>
      </div>
    </div>
  )
}
