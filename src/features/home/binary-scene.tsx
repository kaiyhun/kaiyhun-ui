/**
 * BinaryScene — the Lab section's ambient scene: a pixel cat watching the
 * moon while clouds roll through, drawn ENTIRELY from 0/1 glyphs.
 *
 * A fixed virtual grid (40×22 cells) is composited per frame from layered
 * bitmaps — sparse background static, moon (with dim craters), drifting
 * clouds (which occlude the moon as they pass), and the cat (tail-swish
 * frames + an occasional ear twitch). Every visible cell renders a mono
 * "0" or "1"; a few percent flip each tick, so the whole image shimmers
 * like living data. The grid scales to its container (cells ≈14px at the
 * desktop column width — user pick) and redraws at a chunky 10fps: the
 * cadence is part of the look, and ~1k fillText calls per tick is cheap.
 *
 * Colors are theme tokens read from CSS (--primary for the moon,
 * --foreground for everything else at layered alphas), so Matrix mode
 * restyles the scene automatically — the effect re-arms on theme change.
 *
 * Respect (same contract as MatrixRain): aria-hidden decorative canvas;
 * prefers-reduced-motion renders ONE static frame (cloud parked half
 * across the moon, cat at rest); the loop pauses while off-screen
 * (IntersectionObserver) and rAF naturally pauses in hidden tabs.
 *
 * The art is plain string bitmaps below — tweak them freely ('#' paints,
 * '.' is empty, moon 'o' = dim crater cells).
 */
import { useEffect, useRef } from "react"

import { useMatrixTheme } from "@/lib/theme"

/* ------------------------------ the art ------------------------------ */

/** Cat body, facing the moon (ears up, sitting). 15×12. */
const CAT_BODY = `
...#.....#.....
...##...##.....
...#########...
..###########..
..###########..
...#########...
..##########...
.############..
.#############.
.#############.
.#############.
..###########..
`

/** Tail frames (stamped left of the haunch): rest → mid → up. 4×8. */
const TAIL_FRAMES = [
  `
....
....
....
....
....
.#..
.##.
..##
`,
  `
....
....
.#..
.#..
.##.
..#.
..##
....
`,
  `
#...
##..
.#..
.#..
..#.
..##
....
....
`,
]

/** Right ear tip cells (col,row in cat space) — hidden during a twitch. */
const EAR_TIP: Array<[number, number]> = [
  [9, 0],
  [9, 1],
]

/** Moon: '#' bright, 'o' dim crater. 9×7. */
const MOON = `
..#####..
.#######.
####o####
###oo####
#########
.###o###.
..#####..
`

/** Two cloud shapes at different sizes/speeds. */
const CLOUD_A = `
...######....
.##########..
#############
`
const CLOUD_B = `
......#####....
..###########..
###############
####..#########
`

/* --------------------------- scene constants ------------------------- */

const GRID_COLS = 40
const GRID_ROWS = 22
/** Chunky redraw cadence — the terminal feel (user pick: calm). */
const TICK_MS = 100
/** Per-tick chance a cell's digit flips. */
const SHIMMER_P = 0.02
/** Cloud step intervals (ms per one-cell drift). */
const CLOUD_A_MS = 500
const CLOUD_B_MS = 700
/** Tail swish: every ~3s (+ jitter), one frame per 260ms through the
 *  rest→mid→up→mid→rest sequence. */
const SWISH_EVERY_MS = 3200
const SWISH_JITTER_MS = 1400
const SWISH_FRAME_MS = 260
const SWISH_SEQUENCE = [0, 1, 2, 1, 0]
/** Ear twitch: rare and brief. */
const TWITCH_EVERY_MS = 6000
const TWITCH_JITTER_MS = 4000
const TWITCH_MS = 280
/** Fraction of background cells showing faint static. */
const BG_DENSITY = 0.12

/** Layer ids in paint order (higher stamps over lower). */
const L_EMPTY = 0
const L_BG = 1
const L_MOON_DIM = 2
const L_MOON = 3
const L_CLOUD = 4
const L_CAT = 5
/** Per-layer alpha (all layers use --foreground except the moon). */
const LAYER_ALPHA = [0, 0.14, 0.45, 1, 0.32, 0.55]

/** Fixed placements in the virtual grid. */
const MOON_X = 29
const MOON_Y = 2
const CAT_X = 5
const CAT_Y = GRID_ROWS - 12 - 1
const TAIL_X = CAT_X - 3
const TAIL_Y = CAT_Y + 4
const CLOUD_A_Y = 2
const CLOUD_B_Y = 6

const parseArt = (art: string) =>
  art
    .split("\n")
    .map((row) => row.trim())
    .filter(Boolean)

export function BinaryScene({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  /* Matrix mode swaps the underlying tokens — re-read colors on toggle */
  const matrix = useMatrixTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext("2d")
    if (!context) return

    const styles = getComputedStyle(canvas)
    const moonColor = styles.getPropertyValue("--primary").trim()
    const inkColor = styles.getPropertyValue("--foreground").trim()

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)

    const catBody = parseArt(CAT_BODY)
    const tailFrames = TAIL_FRAMES.map(parseArt)
    const moon = parseArt(MOON)
    const cloudA = parseArt(CLOUD_A)
    const cloudB = parseArt(CLOUD_B)

    const cellCount = GRID_COLS * GRID_ROWS
    /** Which digit each cell shows (0/1) — flips make the shimmer. */
    const digits = new Uint8Array(cellCount)
    /** Which background cells carry faint static (fixed per mount). */
    const bgMask = new Uint8Array(cellCount)
    for (let i = 0; i < cellCount; i++) {
      digits[i] = Math.random() < 0.5 ? 0 : 1
      // Denser static on the last row reads as ground under the cat
      const density = i >= cellCount - GRID_COLS ? 0.55 : BG_DENSITY
      bgMask[i] = Math.random() < density ? 1 : 0
    }
    /** Rebuilt every draw: which layer owns each cell. */
    const layers = new Uint8Array(cellCount)

    /* Scene state */
    let cloudAX = 8 // parked half across the moon for the static frame
    let cloudBX = -16
    let tailFrame = 0
    let swishAt = performance.now() + SWISH_EVERY_MS
    let swishStep = -1 // -1 = not swishing
    let swishFrameAt = 0
    let twitchAt = performance.now() + TWITCH_EVERY_MS
    let twitchUntil = 0
    let lastCloudA = 0
    let lastCloudB = 0

    let cell = 0
    let offsetX = 0
    let offsetY = 0
    let width = 0
    let height = 0

    const stamp = (
      art: string[],
      atX: number,
      atY: number,
      layer: number,
      dimLayer = layer,
    ) => {
      for (let row = 0; row < art.length; row++) {
        const y = atY + row
        if (y < 0 || y >= GRID_ROWS) continue
        const line = art[row]
        for (let col = 0; col < line.length; col++) {
          const x = atX + col
          if (x < 0 || x >= GRID_COLS) continue
          const ch = line[col]
          if (ch === "#") layers[y * GRID_COLS + x] = layer
          else if (ch === "o") layers[y * GRID_COLS + x] = dimLayer
        }
      }
    }

    const draw = (now: number) => {
      /* ---- composite the layer grid (painter's order) ---- */
      for (let i = 0; i < cellCount; i++) layers[i] = bgMask[i] ? L_BG : L_EMPTY
      stamp(moon, MOON_X, MOON_Y, L_MOON, L_MOON_DIM)
      stamp(cloudA, Math.round(cloudAX), CLOUD_A_Y, L_CLOUD)
      stamp(cloudB, Math.round(cloudBX), CLOUD_B_Y, L_CLOUD)
      stamp(tailFrames[tailFrame], TAIL_X, TAIL_Y, L_CAT)
      stamp(catBody, CAT_X, CAT_Y, L_CAT)
      if (now < twitchUntil) {
        for (const [col, row] of EAR_TIP) {
          layers[(CAT_Y + row) * GRID_COLS + (CAT_X + col)] = L_EMPTY
        }
      }

      /* ---- paint ---- */
      context.clearRect(0, 0, width, height)
      context.font = `${Math.ceil(cell * 0.85)}px monospace`
      context.textAlign = "center"
      context.textBaseline = "middle"
      for (let i = 0; i < cellCount; i++) {
        const layer = layers[i]
        if (layer === L_EMPTY) continue
        const x = offsetX + (i % GRID_COLS) * cell + cell / 2
        const y = offsetY + Math.floor(i / GRID_COLS) * cell + cell / 2
        context.globalAlpha = LAYER_ALPHA[layer]
        context.fillStyle =
          layer === L_MOON || layer === L_MOON_DIM ? moonColor : inkColor
        context.fillText(digits[i] ? "1" : "0", x, y)
      }
      context.globalAlpha = 1
    }

    const resize = () => {
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      cell = Math.min(width / GRID_COLS, height / GRID_ROWS)
      offsetX = (width - cell * GRID_COLS) / 2
      offsetY = (height - cell * GRID_ROWS) / 2
      draw(performance.now())
    }

    let raf = 0
    let last = 0
    let visible = true

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      if (!visible || now - last < TICK_MS) return
      last = now

      /* shimmer: a few digits flip each tick */
      for (let i = 0; i < cellCount; i++) {
        if (Math.random() < SHIMMER_P) digits[i] ^= 1
      }
      /* clouds roll left → right, wrapping with a random pause */
      if (now - lastCloudA >= CLOUD_A_MS) {
        lastCloudA = now
        cloudAX += 1
        if (cloudAX > GRID_COLS) cloudAX = -13 - Math.random() * 22
      }
      if (now - lastCloudB >= CLOUD_B_MS) {
        lastCloudB = now
        cloudBX += 1
        if (cloudBX > GRID_COLS) cloudBX = -15 - Math.random() * 30
      }
      /* tail swish state machine */
      if (swishStep < 0 && now >= swishAt) {
        swishStep = 0
        swishFrameAt = now
      }
      if (swishStep >= 0 && now - swishFrameAt >= SWISH_FRAME_MS) {
        swishStep += 1
        swishFrameAt = now
        if (swishStep >= SWISH_SEQUENCE.length) {
          swishStep = -1
          swishAt = now + SWISH_EVERY_MS + Math.random() * SWISH_JITTER_MS
        }
      }
      tailFrame = swishStep >= 0 ? SWISH_SEQUENCE[swishStep] : 0
      /* occasional ear twitch */
      if (now >= twitchAt) {
        twitchUntil = now + TWITCH_MS
        twitchAt = now + TWITCH_EVERY_MS + Math.random() * TWITCH_JITTER_MS
      }

      draw(now)
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas)
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
    })
    intersectionObserver.observe(canvas)

    resize()
    if (!reducedMotion) raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
    }
  }, [matrix])

  return <canvas ref={canvasRef} aria-hidden className={className} />
}
