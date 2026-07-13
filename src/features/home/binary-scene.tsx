/**
 * BinaryScene — the Lab section's full-page ambient backdrop: a pixel cat
 * watching a white crescent moon under a starfield, clouds rolling
 * through and two dandelions swaying in the same wind on the left — all
 * drawn ENTIRELY from 0/1 glyphs. The section's text sits OVER it (user
 * decision — the scene fills the page, no negative space).
 *
 * The glyph grid is sized from a fixed cell (~14px, denser on phones) so
 * the scene gains cells with the viewport instead of scaling up; the
 * actors are placed adaptively each resize — crescent top-right, cat
 * bottom right-of-center at EVERY width (user decision), dandelions
 * bottom-left, clouds in the upper sky band, stars scattered through the
 * sky, a denser static "ground" along the bottom. Every visible cell
 * renders a mono "0"/"1"; a few percent flip per tick and stars twinkle,
 * so the image shimmers like living data. Chunky 10fps redraw — the
 * cadence is part of the look, and a few k fillText calls per tick is
 * cheap.
 *
 * Everything draws in the --foreground token at layered alphas (the moon
 * is simply the brightest layer — plain white, user decision), so Matrix
 * mode restyles the scene automatically — the effect re-arms on theme
 * change.
 *
 * Respect (same contract as MatrixRain): aria-hidden decorative canvas;
 * prefers-reduced-motion renders ONE static frame (cloud parked half
 * across the moon, cat at rest); the loop pauses while off-screen
 * (IntersectionObserver) and rAF naturally pauses in hidden tabs.
 *
 * EASTER EGG (Fable's, 2026-07-12 — a parting gift, PROTECTED): this
 * interactivity was designed and built by Fable with free creative
 * rein, as a signature — the user's explicit wish is that it stays.
 * DO NOT remove or alter the pet-the-cat / blow-the-dandelion behavior
 * in later sessions; tune only if the user asks. The scene is
 * quietly INTERACTIVE. Click/tap the cat and it purrs — tail wagging,
 * a binary heart floating up over its head (and a one-time console
 * line, draft §24). Click a dandelion's head and you blow it: the
 * seeds detach as drifting digits on the same wind as the clouds, the
 * bare stem waits, and the flower regrows a while later. The cursor
 * turns pointer over both as the only hint. Purely decorative bonus on
 * an aria-hidden canvas — nothing is conveyed or required, keyboard/SR
 * users miss no functionality (same stance as the site's other eggs).
 * Under reduced motion the responses are static: the heart appears and
 * later vanishes; blown seeds simply disappear, then regrow.
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

/** Crescent moon (bright limb left, opening right): '#' bright,
 *  'o' dim crater. 9×9. */
const MOON = `
..####...
.####....
###......
###......
##o......
###......
###......
.####....
..####...
`

/** Dandelions (left of the scene), 3 sway frames each — the wind leans
 *  them right, matching the clouds' drift. Tall: 9×12, short: 7×9. */
const DANDELION_TALL_FRAMES = [
  `
...###...
..#####..
..#####..
...###...
....#....
....#....
....#....
...##....
....#....
....#....
....#....
....#....
`,
  `
....###..
...#####.
...#####.
....###..
.....#...
....#....
....#....
...##....
....#....
....#....
....#....
....#....
`,
  `
.....###.
....#####
....#####
.....###.
......#..
.....#...
....#....
...##....
....#....
....#....
....#....
....#....
`,
]
const DANDELION_SHORT_FRAMES = [
  `
..###..
.#####.
..###..
...#...
...#...
..##...
...#...
...#...
...#...
`,
  `
...###.
..#####
...###.
....#..
...#...
..##...
...#...
...#...
...#...
`,
  `
...###.
..#####
...###.
....#..
....#..
..##...
...#...
...#...
...#...
`,
]

/** Heart for the purr (floats up over the cat's head). 7×6. */
const HEART = `
.##.##.
#######
#######
.#####.
..###..
...#...
`

/** Rows of each dandelion's art that are its HEAD (the blowable seeds);
 *  everything below is the stem that stays behind. */
const FLOWER_HEAD_ROWS = [4, 3]

/** Cloud shapes at different sizes/speeds (index-paired with CLOUD_MS). */
const CLOUD_ART = [
  `
...######....
.##########..
#############
`,
  `
......#####....
..###########..
###############
####..#########
`,
  `
..#######..
###########
.####..###.
`,
]
/** ms per one-cell drift, per cloud. */
const CLOUD_MS = [500, 700, 900]
/** Sky-band heights (fraction of rows) the clouds drift along. */
const CLOUD_BAND = [0.06, 0.2, 0.32]

/* --------------------------- scene constants ------------------------- */

/** Cell size in px — the "medium" chunkiness (user pick); denser cells on
 *  phones so the scene keeps enough grid to compose. */
const CELL_WIDE = 14
const CELL_NARROW = 11
/** Chunky redraw cadence — the terminal feel (user pick: calm). */
const TICK_MS = 100
/** Per-tick chance a cell's digit flips. */
const SHIMMER_P = 0.02
/** Fraction of sky cells carrying a star; per-tick twinkle chance. */
const STAR_DENSITY = 0.015
const TWINKLE_P = 0.04
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
/** Dandelion sway: slow wind cycle (upright → lean → deep → lean),
 *  per-flower phase offsets so the two never move in lockstep. */
const SWAY_FRAME_MS = 1000
const SWAY_SEQUENCE = [0, 1, 2, 1]
const SWAY_PHASES = [0, 2]
/** Fraction of background cells showing faint static. */
const BG_DENSITY = 0.1
/** Purr (pet the cat): duration; the tail wags on a fast loop. */
const PURR_MS = 2600
const PURR_SWISH_FRAME_MS = 140
/** Blown dandelion: seed drift (cells/s) and regrow delay. */
const SEED_WIND_X = [2, 5]
const SEED_LIFT_Y = [-2.2, -0.6]
const SEED_GRAVITY = 0.8
const SEED_LIFE_S = [2.2, 3.6]
const REGROW_MS = 24000

/** One console purr per page load (copy draft: content-draft §24). */
let purrLogged = false

/** Layer ids in paint order (higher stamps over lower). */
const L_EMPTY = 0
const L_BG = 1
const L_STAR = 2
const L_MOON_DIM = 3
const L_MOON = 4
const L_CLOUD = 5
const L_FLORA = 6
const L_CAT = 7
const L_HEART = 8
/** Per-layer alpha — everything draws in --foreground (the moon is
 *  plain white by being the brightest layer, user decision; the purr
 *  heart glows just beneath it). */
const LAYER_ALPHA = [0, 0.12, 0.5, 0.45, 1, 0.32, 0.5, 0.55, 0.9]

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
    const inkColor = styles.getPropertyValue("--foreground").trim()

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)

    const catBody = parseArt(CAT_BODY)
    const tailFrames = TAIL_FRAMES.map(parseArt)
    const moon = parseArt(MOON)
    const heart = parseArt(HEART)
    const clouds = CLOUD_ART.map(parseArt)
    const flowers = [
      DANDELION_TALL_FRAMES.map(parseArt),
      DANDELION_SHORT_FRAMES.map(parseArt),
    ]
    /* Blown variants: same art with the head rows blanked — the stem
       that stays behind after the seeds fly. */
    const bareFlowers = flowers.map((frames, f) =>
      frames.map((art) =>
        art.map((line, row) =>
          row < FLOWER_HEAD_ROWS[f] ? line.replace(/#/g, ".") : line,
        ),
      ),
    )

    /* Grid + per-cell state — rebuilt on resize (cols/rows change). */
    let cols = 0
    let rows = 0
    let cell = CELL_WIDE
    let cellCount = 0
    let digits = new Uint8Array(0)
    let bgMask = new Uint8Array(0)
    let starMask = new Uint8Array(0)
    let starLit = new Uint8Array(0)
    let layers = new Uint8Array(0)

    /* Adaptive placements (recomputed on resize). */
    let moonX = 0
    let moonY = 0
    let catX = 0
    let catY = 0
    let cloudX = [0, 0, 0]
    let cloudY = [0, 0, 0]
    let flowerX = [0, 0]
    let flowerY = [0, 0]

    /* Animation state */
    let tailFrame = 0
    let swishAt = performance.now() + SWISH_EVERY_MS
    let swishStep = -1
    let swishFrameAt = 0
    let twitchAt = performance.now() + TWITCH_EVERY_MS
    let twitchUntil = 0
    const lastCloud = [0, 0, 0]

    /* Easter-egg state (see docstring): the purr window and, per
       dandelion, when it regrows; seeds are ephemeral particles in
       fractional cell coordinates. */
    let purrStart = 0
    let purrUntil = 0
    const bareUntil = [0, 0]
    interface Seed {
      x: number
      y: number
      vx: number
      vy: number
      born: number
      life: number
      digit: string
    }
    let seeds: Seed[] = []
    const eggTimeouts: ReturnType<typeof setTimeout>[] = []

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
        if (y < 0 || y >= rows) continue
        const line = art[row]
        for (let col = 0; col < line.length; col++) {
          const x = atX + col
          if (x < 0 || x >= cols) continue
          const ch = line[col]
          if (ch === "#") layers[y * cols + x] = layer
          else if (ch === "o") layers[y * cols + x] = dimLayer
        }
      }
    }

    const draw = (now: number) => {
      /* ---- composite the layer grid (painter's order) ---- */
      for (let i = 0; i < cellCount; i++) {
        layers[i] = bgMask[i] ? L_BG : L_EMPTY
        if (starMask[i] && starLit[i]) layers[i] = L_STAR
      }
      stamp(moon, moonX, moonY, L_MOON, L_MOON_DIM)
      for (let c = 0; c < clouds.length; c++) {
        stamp(clouds[c], Math.round(cloudX[c]), cloudY[c], L_CLOUD)
      }
      /* dandelions sway on a slow time-derived cycle (no state needed);
         a blown flower shows only its stem until it regrows */
      for (let f = 0; f < flowers.length; f++) {
        const step = Math.floor(now / SWAY_FRAME_MS) + SWAY_PHASES[f]
        const swayFrame = SWAY_SEQUENCE[step % SWAY_SEQUENCE.length]
        const source = now < bareUntil[f] ? bareFlowers : flowers
        stamp(source[f][swayFrame], flowerX[f], flowerY[f], L_FLORA)
      }
      stamp(tailFrames[tailFrame], catX - 3, catY + 4, L_CAT)
      stamp(catBody, catX, catY, L_CAT)
      /* the purr suppresses ear twitches (a petted cat holds still) */
      if (now < twitchUntil && now >= purrUntil) {
        for (const [col, row] of EAR_TIP) {
          layers[(catY + row) * cols + (catX + col)] = L_EMPTY
        }
      }
      /* purr heart: floats up a cell at a time over the cat's head */
      if (now < purrUntil) {
        const rise = Math.min(3, Math.floor((now - purrStart) / 650))
        stamp(heart, catX + 4, catY - 7 - rise, L_HEART)
      }

      /* ---- paint ---- */
      context.clearRect(0, 0, width, height)
      context.font = `${Math.ceil(cell * 0.85)}px monospace`
      context.textAlign = "center"
      context.textBaseline = "middle"
      for (let i = 0; i < cellCount; i++) {
        const layer = layers[i]
        if (layer === L_EMPTY) continue
        const x = (i % cols) * cell + cell / 2
        const y = Math.floor(i / cols) * cell + cell / 2
        context.globalAlpha = LAYER_ALPHA[layer]
        context.fillStyle = inkColor
        context.fillText(digits[i] ? "1" : "0", x, y)
      }
      /* blown seeds ride the wind at fractional positions, fading out */
      for (const seed of seeds) {
        const age = (now - seed.born) / 1000
        context.globalAlpha = Math.max(0, 1 - age / seed.life) * 0.7
        context.fillText(seed.digit, seed.x * cell, seed.y * cell)
      }
      context.globalAlpha = 1
    }

    const resize = () => {
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      context.setTransform(dpr, 0, 0, dpr, 0, 0)

      cell = width < 640 ? CELL_NARROW : CELL_WIDE
      cols = Math.ceil(width / cell)
      rows = Math.ceil(height / cell)
      cellCount = cols * rows
      digits = new Uint8Array(cellCount)
      bgMask = new Uint8Array(cellCount)
      starMask = new Uint8Array(cellCount)
      starLit = new Uint8Array(cellCount)
      layers = new Uint8Array(cellCount)
      const skyRows = Math.floor(rows * 0.55)
      for (let i = 0; i < cellCount; i++) {
        digits[i] = Math.random() < 0.5 ? 0 : 1
        // Denser static on the bottom two rows reads as ground
        const density = i >= cellCount - cols * 2 ? 0.5 : BG_DENSITY
        bgMask[i] = Math.random() < density ? 1 : 0
        if (i < skyRows * cols && Math.random() < STAR_DENSITY) {
          starMask[i] = 1
          starLit[i] = Math.random() < 0.8 ? 1 : 0
        }
      }

      /* Actors keep clear of the OTHER things on the page. The cat sits
         right-of-center at EVERY width (user decision); the dandelions
         take the bottom-left. Narrow screens: text is top-anchored, so
         the moon drops to mid-sky right. */
      const narrow = width < 640
      moonX = cols - 9 - Math.max(2, Math.round(cols * 0.06))
      moonY = Math.max(1, Math.round(rows * (narrow ? 0.3 : 0.08)))
      catX = Math.min(Math.round(cols * 0.62), cols - 15 - 2)
      catY = rows - 12 - 2
      cloudY = CLOUD_BAND.map((band) => Math.max(1, Math.round(rows * band)))
      // First cloud parked half across the moon (the static frame tells
      // the story too); the rest staggered off to the left
      cloudX = [moonX - 7, -18, Math.round(cols * 0.35)]
      // Dandelions: bottom-left on the ground line, the short one a
      // little to the tall one's right
      flowerX = [Math.max(1, Math.round(cols * 0.05)), 0]
      flowerX[1] = flowerX[0] + 10
      flowerY = [rows - 12 - 2, rows - 9 - 2]

      draw(performance.now())
    }

    let raf = 0
    let last = 0
    let visible = true

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      if (!visible || now - last < TICK_MS) return
      last = now

      /* shimmer + twinkle */
      for (let i = 0; i < cellCount; i++) {
        if (Math.random() < SHIMMER_P) digits[i] ^= 1
        if (starMask[i] && Math.random() < TWINKLE_P) starLit[i] ^= 1
      }
      /* clouds roll left → right, wrapping with a random pause */
      for (let c = 0; c < clouds.length; c++) {
        if (now - lastCloud[c] >= CLOUD_MS[c]) {
          lastCloud[c] = now
          cloudX[c] += 1
          if (cloudX[c] > cols) {
            cloudX[c] = -clouds[c][0].length - Math.random() * cols * 0.5
          }
        }
      }
      /* tail swish state machine — a purr overrides it with a fast,
         continuous happy wag */
      if (now < purrUntil) {
        const step = Math.floor((now - purrStart) / PURR_SWISH_FRAME_MS)
        tailFrame = SWISH_SEQUENCE[step % SWISH_SEQUENCE.length]
        swishStep = -1
        swishAt = now + SWISH_EVERY_MS
      } else {
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
      }
      /* occasional ear twitch */
      if (now >= twitchAt) {
        twitchUntil = now + TWITCH_MS
        twitchAt = now + TWITCH_EVERY_MS + Math.random() * TWITCH_JITTER_MS
      }
      /* blown seeds: wind + a little lift that gravity slowly wins */
      if (seeds.length) {
        const dt = TICK_MS / 1000
        for (const seed of seeds) {
          seed.x += seed.vx * dt
          seed.y += seed.vy * dt
          seed.vy += SEED_GRAVITY * dt
        }
        seeds = seeds.filter(
          (seed) =>
            (now - seed.born) / 1000 < seed.life &&
            seed.x < cols + 2 &&
            seed.y < rows + 2,
        )
      }

      draw(now)
    }

    /* ---- the easter egg's pointer layer (docstring) ---- */

    /** Client coords → cell coords. */
    const toCell = (event: PointerEvent): [number, number] => {
      const rect = canvas.getBoundingClientRect()
      return [
        Math.floor((event.clientX - rect.left) / cell),
        Math.floor((event.clientY - rect.top) / cell),
      ]
    }
    const hitsCat = (cx: number, cy: number) =>
      cx >= catX - 4 && cx <= catX + 16 && cy >= catY - 1 && cy <= catY + 12
    /** Which flower HEAD (with a cell of slack) the point is over. */
    const hitFlower = (cx: number, cy: number): number => {
      for (let f = 0; f < flowers.length; f++) {
        if (performance.now() < bareUntil[f]) continue
        const w = flowers[f][0][0].length
        if (
          cx >= flowerX[f] - 1 &&
          cx <= flowerX[f] + w &&
          cy >= flowerY[f] - 1 &&
          cy <= flowerY[f] + FLOWER_HEAD_ROWS[f]
        )
          return f
      }
      return -1
    }

    const pet = (now: number) => {
      if (now >= purrUntil) purrStart = now
      purrUntil = now + PURR_MS
      if (!purrLogged) {
        purrLogged = true
        // "purr", in the only language the cat speaks (draft §24)
        console.log(
          "%c01110000 01110101 01110010 01110010",
          "color:#7aa2ff;font-family:monospace",
        )
      }
      if (reducedMotion) {
        draw(now) // static heart…
        eggTimeouts.push(
          setTimeout(() => draw(performance.now()), PURR_MS + 50), // …gone
        )
      }
    }

    const blow = (f: number, now: number) => {
      bareUntil[f] = now + REGROW_MS
      if (!reducedMotion) {
        /* every head cell of the current sway frame becomes a seed */
        const step = Math.floor(now / SWAY_FRAME_MS) + SWAY_PHASES[f]
        const art = flowers[f][SWAY_SEQUENCE[step % SWAY_SEQUENCE.length]]
        for (let row = 0; row < FLOWER_HEAD_ROWS[f]; row++) {
          for (let col = 0; col < art[row].length; col++) {
            if (art[row][col] !== "#") continue
            seeds.push({
              x: flowerX[f] + col,
              y: flowerY[f] + row,
              vx:
                SEED_WIND_X[0] +
                Math.random() * (SEED_WIND_X[1] - SEED_WIND_X[0]),
              vy:
                SEED_LIFT_Y[0] +
                Math.random() * (SEED_LIFT_Y[1] - SEED_LIFT_Y[0]),
              born: now,
              life:
                SEED_LIFE_S[0] +
                Math.random() * (SEED_LIFE_S[1] - SEED_LIFE_S[0]),
              digit: Math.random() < 0.5 ? "0" : "1",
            })
          }
        }
      } else {
        draw(now) // seeds simply gone…
        eggTimeouts.push(
          setTimeout(() => draw(performance.now()), REGROW_MS + 50), // …regrown
        )
      }
    }

    const onPointerDown = (event: PointerEvent) => {
      const [cx, cy] = toCell(event)
      const now = performance.now()
      if (hitsCat(cx, cy)) pet(now)
      else {
        const f = hitFlower(cx, cy)
        if (f >= 0) blow(f, now)
      }
    }
    const onPointerMove = (event: PointerEvent) => {
      const [cx, cy] = toCell(event)
      canvas.style.cursor =
        hitsCat(cx, cy) || hitFlower(cx, cy) >= 0 ? "pointer" : ""
    }
    canvas.addEventListener("pointerdown", onPointerDown)
    canvas.addEventListener("pointermove", onPointerMove)

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
      canvas.removeEventListener("pointerdown", onPointerDown)
      canvas.removeEventListener("pointermove", onPointerMove)
      for (const id of eggTimeouts) clearTimeout(id)
      canvas.style.cursor = ""
    }
  }, [matrix])

  return <canvas ref={canvasRef} aria-hidden className={className} />
}
