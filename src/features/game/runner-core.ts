/**
 * Runner core — PURE game logic for the /run easter egg (no DOM, no
 * canvas, no storage): create → step → read state. Rendering, input,
 * and persistence live in runner.tsx. docs/game.md is the full design
 * document — units, physics, tuning rationale, extension guide — READ
 * IT before touching numbers here.
 *
 * The game: an infinite gravity-flip runner ("Jetpack Joyride × the
 * Chrome T-rex"). Two platforms (ceiling + floor); the player runs on
 * one, flips gravity to arc across to the other — VERTICAL VELOCITY IS
 * KEPT through a flip (user-specified: flips must "take account their
 * velocity"), and flips are allowed mid-air, so late flips can save
 * you and panic flips can hover you into a mid-field bar. Obstacles
 * scroll in from the right; world speed ramps forever; score is
 * distance travelled.
 *
 * Units: CELLS (one monospace glyph square) and SECONDS. X grows
 * rightward, Y grows DOWNWARD (canvas convention); gravity +1 pulls
 * toward the floor, -1 toward the ceiling. The playfield is `rows`
 * cells tall BETWEEN the two platform rows; the player is a 1×1 cell
 * whose `y` ranges 0 (touching ceiling) … rows-1 (touching floor).
 *
 * step() mutates the state in place — deliberate: it runs up to 120
 * times a second inside a fixed-timestep loop and must not allocate.
 */

/** All gameplay numbers in one place (rationale: docs/game.md). */
export const TUNING = {
  /** World scroll speed, cells/s: start → ramp/s → cap. */
  baseSpeed: 12,
  speedRamp: 0.22,
  maxSpeed: 34,
  /** Gravity strength (cells/s²) and terminal vertical speed. */
  gravity: 90,
  maxFallSpeed: 34,
  /** Horizontal nudge speed (arrow keys), cells/s, and X bounds. */
  moveSpeed: 11,
  minPlayerX: 2,
  /** Player may roam the left half only — reaction room stays fair. */
  maxPlayerXFraction: 0.5,
  /** Travel distance between spawns (cells), shrinking with time. */
  spawnGapMin: 20,
  spawnGapMax: 36,
  /** Gap shrink per second of play (floors at spawnGapMin spread). */
  gapShrinkPerSecond: 0.12,
  /** Platform column obstacles: height range (cells). */
  columnHeight: { min: 3, max: 7 },
  /** Mid-field bars: width range × thickness (cells). */
  barWidth: { min: 5, max: 12 },
  barThickness: 1,
  /** Collision inset (cells) — hits must LOOK like hits. */
  forgiveness: 0.22,
} as const

export interface Obstacle {
  /** Left edge in screen cells (decremented as the world scrolls). */
  x: number
  w: number
  /** Top edge in playfield cells (0 = touching the ceiling row). */
  y: number
  h: number
  /** Stable per-obstacle seed so its digit pattern doesn't reshuffle. */
  seed: number
}

/** Per-step input sample. `flip` is edge-triggered — the caller queues
 *  a keypress and clears it after the step that consumed it. */
export interface GameInput {
  move: -1 | 0 | 1
  flip: boolean
}

export interface GameState {
  status: "ready" | "playing" | "over"
  /** Playfield size in cells (cols may change on resize — safe: only
   *  spawn positions read it, live obstacles keep scrolling). */
  cols: number
  rows: number
  time: number
  speed: number
  distance: number
  /** floor(distance) — the displayed/persisted score. */
  score: number
  playerX: number
  playerY: number
  vy: number
  gravity: 1 | -1
  obstacles: Obstacle[]
  /** Cells of travel remaining until the next spawn. */
  untilNextSpawn: number
}

export function createGame(cols: number, rows: number): GameState {
  return {
    status: "ready",
    cols,
    rows,
    time: 0,
    speed: TUNING.baseSpeed,
    distance: 0,
    score: 0,
    playerX: Math.max(TUNING.minPlayerX, Math.round(cols * 0.16)),
    playerY: rows - 1,
    vy: 0,
    gravity: 1,
    obstacles: [],
    untilNextSpawn: TUNING.spawnGapMax,
  }
}

const rand = (min: number, max: number) => min + Math.random() * (max - min)

/** Spawns one obstacle just past the right edge. Types: floor column /
 *  ceiling column (40% each) force a flip or a well-timed arc; mid
 *  bars (20%) punish hovering and never touch the platforms, so a
 *  grounded player is always safe from them. */
function spawnObstacle(state: GameState): Obstacle {
  const roll = Math.random()
  const seed = Math.floor(Math.random() * 0xffff)
  const x = state.cols + 2
  if (roll < 0.8) {
    const h = Math.round(rand(TUNING.columnHeight.min, TUNING.columnHeight.max))
    const onFloor = roll < 0.4
    return {
      x,
      w: 2,
      y: onFloor ? state.rows - h : 0,
      h,
      seed,
    }
  }
  const w = Math.round(rand(TUNING.barWidth.min, TUNING.barWidth.max))
  return {
    x,
    w,
    y: Math.round(rand(3, state.rows - 3 - TUNING.barThickness)),
    h: TUNING.barThickness,
    seed,
  }
}

/** Advances the world by `dt` seconds (call with a FIXED timestep). */
export function stepGame(state: GameState, input: GameInput, dt: number) {
  if (state.status !== "playing") return

  /* Difficulty curve: speed ramps linearly to a cap; spawn gaps close
     slowly so reaction windows tighten on both axes. */
  state.time += dt
  state.speed = Math.min(
    TUNING.baseSpeed + TUNING.speedRamp * state.time,
    TUNING.maxSpeed,
  )
  state.distance += state.speed * dt
  state.score = Math.floor(state.distance)

  /* Gravity flip — vy is deliberately KEPT (see module docstring). */
  if (input.flip) state.gravity = state.gravity === 1 ? -1 : 1

  /* Horizontal nudge within the left half. */
  const maxX = state.cols * TUNING.maxPlayerXFraction
  state.playerX = Math.min(
    Math.max(
      state.playerX + input.move * TUNING.moveSpeed * dt,
      TUNING.minPlayerX,
    ),
    maxX,
  )

  /* Vertical physics + platform landing (only kill velocity INTO the
     platform, so a flip while resting lifts off cleanly next step). */
  state.vy = Math.min(
    Math.max(
      state.vy + state.gravity * TUNING.gravity * dt,
      -TUNING.maxFallSpeed,
    ),
    TUNING.maxFallSpeed,
  )
  state.playerY += state.vy * dt
  if (state.playerY >= state.rows - 1) {
    state.playerY = state.rows - 1
    if (state.vy > 0) state.vy = 0
  } else if (state.playerY <= 0) {
    state.playerY = 0
    if (state.vy < 0) state.vy = 0
  }

  /* Scroll + cull + spawn. */
  const travel = state.speed * dt
  for (const obstacle of state.obstacles) obstacle.x -= travel
  if (
    state.obstacles.length &&
    state.obstacles[0].x + state.obstacles[0].w < -2
  ) {
    state.obstacles.shift()
  }
  state.untilNextSpawn -= travel
  if (state.untilNextSpawn <= 0) {
    state.obstacles.push(spawnObstacle(state))
    const shrink = Math.min(
      TUNING.gapShrinkPerSecond * state.time,
      TUNING.spawnGapMax - TUNING.spawnGapMin,
    )
    state.untilNextSpawn = rand(TUNING.spawnGapMin, TUNING.spawnGapMax - shrink)
  }

  /* Collision: player 1×1 AABB, inset by the forgiveness margin. */
  const inset = TUNING.forgiveness
  const px1 = state.playerX + inset
  const px2 = state.playerX + 1 - inset
  const py1 = state.playerY + inset
  const py2 = state.playerY + 1 - inset
  for (const o of state.obstacles) {
    if (px1 < o.x + o.w && px2 > o.x && py1 < o.y + o.h && py2 > o.y) {
      state.status = "over"
      return
    }
  }
}

/** Stable binary digit for an obstacle cell — same (col,row) always
 *  renders the same 0/1, so blocks read as solid objects, not static. */
export function obstacleDigit(seed: number, col: number, row: number): string {
  return ((seed + col * 31 + row * 17) & 1).toString()
}
