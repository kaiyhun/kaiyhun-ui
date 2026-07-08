/**
 * MatrixRain — the homepage's easter-egg backdrop (theme toggle): the
 * classic digital waterfall. Each column is one glyph wide; a bright
 * head glyph falls with a fading tail of half-width katakana + digits.
 *
 * Canvas, not DOM (hundreds of glyphs at 24fps would wreck layout):
 * a translucent background fill each frame produces the tail fade.
 * Colors come from the theme tokens (--matrix-rain-head/-trail,
 * --background read via getComputedStyle) so index.css stays the single
 * source of truth. DPR capped at 1.5 — glyph soup doesn't need retina.
 *
 * Respect: prefers-reduced-motion renders ONE static scatter of glyphs
 * (no animation); the loop pauses entirely while the hero is
 * off-screen (IntersectionObserver) and rAF naturally pauses in hidden
 * tabs.
 */
import { useEffect, useRef } from "react"

/** Halfwidth katakana + digits — the canonical rain alphabet. */
const GLYPHS = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789"

const FONT_SIZE = 16
/** ~24fps — the chunky cadence is part of the look. */
const FRAME_MS = 42

const randomGlyph = () =>
  GLYPHS.charAt(Math.floor(Math.random() * GLYPHS.length))

export function MatrixRain({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext("2d")
    if (!context) return

    const styles = getComputedStyle(canvas)
    const headColor = styles.getPropertyValue("--matrix-rain-head").trim()
    const trailColor = styles.getPropertyValue("--matrix-rain-trail").trim()
    const backgroundColor = styles.getPropertyValue("--background").trim()

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)

    let drops: number[] = []
    let columns = 0
    let width = 0
    let height = 0

    const resize = () => {
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      context.font = `${FONT_SIZE}px monospace`
      columns = Math.ceil(width / FONT_SIZE)
      // Stagger the streams so the first frames aren't a solid line
      drops = Array.from({ length: columns }, () =>
        Math.floor(Math.random() * ((height / FONT_SIZE) * -1.5)),
      )
      // Fresh dark slate after any resize
      context.fillStyle = backgroundColor
      context.fillRect(0, 0, width, height)

      if (reducedMotion) {
        // Static scatter — the vibe without the motion
        context.fillStyle = trailColor
        for (let column = 0; column < columns; column++) {
          const glyphCount = 3 + Math.floor(Math.random() * 10)
          const start = Math.floor(Math.random() * (height / FONT_SIZE))
          for (let row = 0; row < glyphCount; row++) {
            context.globalAlpha = 0.15 + Math.random() * 0.5
            context.fillText(
              randomGlyph(),
              column * FONT_SIZE,
              (start + row) * FONT_SIZE,
            )
          }
        }
        context.globalAlpha = 1
      }
    }

    let raf = 0
    let last = 0
    let visible = true

    const frame = (time: number) => {
      raf = requestAnimationFrame(frame)
      if (!visible || time - last < FRAME_MS) return
      last = time

      // Translucent wash = the fading tails
      context.globalAlpha = 0.09
      context.fillStyle = backgroundColor
      context.fillRect(0, 0, width, height)
      context.globalAlpha = 1

      for (let column = 0; column < columns; column++) {
        const y = drops[column] * FONT_SIZE
        if (y > 0) {
          // Re-brighten the previous head as a trail glyph
          context.fillStyle = trailColor
          context.fillText(randomGlyph(), column * FONT_SIZE, y - FONT_SIZE)
          // The bright head
          context.fillStyle = headColor
          context.fillText(randomGlyph(), column * FONT_SIZE, y)
        }
        // Reset past the bottom, at random, so streams desynchronize
        if (y > height && Math.random() > 0.975) {
          drops[column] = Math.floor(Math.random() * -20)
        } else {
          drops[column] += 1
        }
      }
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
  }, [])

  return <canvas ref={canvasRef} aria-hidden className={className} />
}
