/**
 * Runner — the /run easter egg's canvas shell around the pure engine
 * (runner-core.ts). Full design doc: docs/game.md — read it first.
 *
 * Responsibilities here: glyph rendering, input, the fixed-timestep
 * loop, pause-on-blur, overlays, and the localStorage best score. The
 * world is drawn ENTIRELY from theme tokens read off the canvas
 * element (same pattern as MatrixRain), so the game is green in Matrix
 * mode for free. Glyph language (user pick): "@" player, binary-digit
 * obstacle blocks, "=" platform rails, canvas-drawn mono score.
 *
 * Loop: rAF accumulates real time into 1/120s fixed steps (physics
 * identical at any refresh rate); dt is clamped to 50ms so returning
 * to a background tab never kills the run; window blur pauses
 * outright. Score is drawn on canvas (60fps React re-renders would be
 * silly); only status changes touch React state — `showOverlay` keeps
 * a local mirror so the non-React listeners always read fresh status.
 *
 * a11y: the game is INTERACTIVE, user-started content — nothing moves
 * until the player presses a key on the static ready screen, so
 * reduced-motion users opt in by playing (documented stance,
 * docs/game.md). Canvas carries an aria-label; ready/pause/over
 * overlays are real DOM; game-over results land in a polite live
 * region. Keys: ↑/↓/Space flip, ←/→ move, R/Enter restart — taps and
 * clicks flip too, so touch can play.
 *
 * Persistence: localStorage "run-best-score" (integer as string).
 */
import { useEffect, useRef, useState } from "react"

import {
  createGame,
  obstacleDigit,
  stepGame,
  type GameState,
} from "@/features/game/runner-core"
import { useTheme } from "@/lib/theme"

const BEST_KEY = "run-best-score"
/** Physics tick — see docs/game.md before changing. */
const STEP = 1 / 120
/** Playfield rows between the platform rails (world height). */
const ROWS = 14
/** Cell size bounds; actual size derives from container width. */
const CELL_MIN = 12
const CELL_MAX = 20
const TARGET_COLS = 64

function readBest(): number {
  try {
    return Number(localStorage.getItem(BEST_KEY)) || 0
  } catch {
    return 0
  }
}

function writeBest(score: number) {
  try {
    localStorage.setItem(BEST_KEY, String(score))
  } catch {
    // Private mode — the run still counts, it just isn't remembered
  }
}

const pad = (n: number) => String(n).padStart(5, "0")

type OverlayStatus = "ready" | "playing" | "paused" | "over"

export function Runner() {
  const theme = useTheme()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [overlay, setOverlay] = useState<OverlayStatus>("ready")
  const [finalScore, setFinalScore] = useState(0)
  const [isNewBest, setIsNewBest] = useState(false)

  /* One effect owns the whole game: canvas metrics, loop, listeners.
     `theme` is a dependency so a theme switch re-reads the tokens
     (the run restarts to the ready screen — acceptable for an egg). */
  useEffect(() => {
    const wrapper = wrapperRef.current
    const canvas = canvasRef.current
    if (!wrapper || !canvas) return
    const context = canvas.getContext("2d")
    if (!context) return

    let best = readBest()
    let state: GameState
    const input = { left: false, right: false, flip: false }
    let raf = 0
    let last = 0
    let acc = 0

    /* React overlay state + a synchronous mirror for the listeners */
    let status: OverlayStatus = "ready"
    const showOverlay = (value: OverlayStatus) => {
      status = value
      setOverlay(value)
    }

    /* Theme tokens, read off the element (Matrix scope included). */
    const styles = getComputedStyle(canvas)
    const color = {
      player: styles.getPropertyValue("--primary").trim(),
      world: styles.getPropertyValue("--foreground").trim(),
      faint: styles.getPropertyValue("--muted-foreground").trim(),
      background: styles.getPropertyValue("--background").trim(),
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    let cell = 16
    let cols = TARGET_COLS

    /** Y of a playfield row in px (row 0 sits under the top rail). */
    const rowY = (row: number) => (row + 1) * cell

    const render = () => {
      const width = canvas.width / dpr
      const height = canvas.height / dpr
      context.fillStyle = color.background
      context.fillRect(0, 0, width, height)
      context.font = `${cell}px monospace`
      context.textBaseline = "top"

      /* Platform rails */
      context.fillStyle = color.faint
      for (let col = 0; col < cols; col++) {
        context.fillText("=", col * cell, 0)
        context.fillText("=", col * cell, rowY(ROWS))
      }

      /* Obstacles: solid blocks of stable binary digits */
      context.fillStyle = color.world
      for (const o of state.obstacles) {
        for (let dx = 0; dx < o.w; dx++) {
          const col = Math.round(o.x) + dx
          if (col < 0 || col >= cols) continue
          for (let dy = 0; dy < o.h; dy++) {
            context.fillText(
              obstacleDigit(o.seed, dx, dy),
              col * cell,
              rowY(o.y + dy),
            )
          }
        }
      }

      /* Player */
      context.fillStyle = color.player
      context.font = `bold ${cell}px monospace`
      context.fillText("@", state.playerX * cell, rowY(state.playerY))
      context.font = `${cell}px monospace`

      /* Score — canvas-drawn (no React churn at 60fps) */
      context.fillStyle = color.faint
      context.textAlign = "right"
      context.fillText(
        `SCORE ${pad(state.score)}  BEST ${pad(Math.max(best, state.score))}`,
        width - cell,
        rowY(0),
      )
      context.textAlign = "left"
    }

    const resize = () => {
      const width = wrapper.clientWidth
      cell = Math.min(
        Math.max(Math.floor(width / TARGET_COLS), CELL_MIN),
        CELL_MAX,
      )
      cols = Math.floor(width / cell)
      const height = cell * (ROWS + 2) // + platform rails
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.height = `${height}px`
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      state.cols = cols
      render()
    }

    const frame = (now: number) => {
      /* Clamp dt: a background-tab return must not fast-forward */
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      acc += dt
      while (acc >= STEP && state.status === "playing") {
        acc -= STEP
        stepGame(
          state,
          {
            move: ((input.right ? 1 : 0) - (input.left ? 1 : 0)) as -1 | 0 | 1,
            flip: input.flip,
          },
          STEP,
        )
        input.flip = false
      }
      render()
      if (state.status === "over") {
        const newBest = state.score > best
        if (newBest) {
          best = state.score
          writeBest(best)
        }
        setFinalScore(state.score)
        setIsNewBest(newBest)
        showOverlay("over")
        return
      }
      raf = requestAnimationFrame(frame)
    }

    const runLoop = () => {
      cancelAnimationFrame(raf)
      last = performance.now()
      acc = 0
      raf = requestAnimationFrame(frame)
    }

    const start = () => {
      state = createGame(cols, ROWS)
      state.status = "playing"
      input.left = input.right = false
      input.flip = false
      setIsNewBest(false)
      showOverlay("playing")
      runLoop()
    }

    /** Start / flip / resume — whatever the current status calls for. */
    const primaryAction = () => {
      if (status === "playing") input.flip = true
      else if (status === "paused") {
        showOverlay("playing")
        runLoop()
      } else start()
    }

    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key
      if (key === "ArrowLeft") {
        event.preventDefault()
        input.left = true
      } else if (key === "ArrowRight") {
        event.preventDefault()
        input.right = true
      } else if (key === " " || key === "ArrowUp" || key === "ArrowDown") {
        event.preventDefault()
        primaryAction()
      } else if (
        (key === "r" || key === "R" || key === "Enter") &&
        status === "over"
      ) {
        start()
      }
    }
    const onKeyUp = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") input.left = false
      if (event.key === "ArrowRight") input.right = false
    }
    const onBlur = () => {
      if (status === "playing") {
        cancelAnimationFrame(raf)
        showOverlay("paused")
      }
    }

    state = createGame(cols, ROWS)
    const observer = new ResizeObserver(resize)
    observer.observe(wrapper)
    resize()

    window.addEventListener("keydown", onKeyDown)
    window.addEventListener("keyup", onKeyUp)
    window.addEventListener("blur", onBlur)
    canvas.addEventListener("pointerdown", primaryAction)

    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
      window.removeEventListener("keydown", onKeyDown)
      window.removeEventListener("keyup", onKeyUp)
      window.removeEventListener("blur", onBlur)
      canvas.removeEventListener("pointerdown", primaryAction)
    }
  }, [theme])

  return (
    <div ref={wrapperRef} className="relative w-full">
      <canvas
        ref={canvasRef}
        aria-label="Gravity-flip runner game. Space, up or down arrow, or tap: flip gravity. Left and right arrows: move."
        className="w-full cursor-pointer rounded-xl border border-border"
      />
      {overlay !== "playing" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl bg-background/70 text-center font-mono backdrop-blur-[2px]">
          {overlay === "ready" && (
            <>
              <p className="text-2xl font-bold text-primary">run_</p>
              <p className="text-sm text-muted-foreground">
                ↑ / ↓ / space / tap — flip gravity · ← → — move
              </p>
              <p className="text-xs tracking-[0.15em] text-muted-foreground uppercase">
                Press any of those to start
              </p>
            </>
          )}
          {overlay === "paused" && (
            <p className="text-sm text-muted-foreground">
              paused — press space to resume
            </p>
          )}
          {overlay === "over" && (
            <>
              <p className="text-2xl font-bold text-primary">game over</p>
              <p className="text-sm text-foreground">
                score {pad(finalScore)}
                {isNewBest && <span className="text-accent"> — new best!</span>}
              </p>
              <p className="text-xs tracking-[0.15em] text-muted-foreground uppercase">
                R / enter / space — run it back
              </p>
            </>
          )}
        </div>
      )}
      {/* Results for screen readers (visual score lives on canvas) */}
      <p aria-live="polite" className="sr-only">
        {overlay === "over" &&
          `Game over. Score ${finalScore}.${isNewBest ? " New best score." : ""}`}
      </p>
    </div>
  )
}
