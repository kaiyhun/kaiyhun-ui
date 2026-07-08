/**
 * TypeOut — terminal typewriter for Matrix mode: the text types itself
 * character by character behind a blinking block cursor. Reduced-motion
 * users get the full text instantly (cursor still blinks via CSS only
 * if motion is allowed — the `type-cursor` class handles both, see
 * index.css). Screen readers get the complete text immediately: the
 * animation is visual-only (aria-label carries the full string).
 */
import { useEffect, useState } from "react"

/** ms per character — quick enough to finish before the eye wanders. */
const TYPE_MS = 35

export function TypeOut({ text }: { text: string }) {
  const [length, setLength] = useState(0)

  useEffect(() => {
    setLength(0)
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setLength(text.length)
      return
    }
    const timer = setInterval(() => {
      setLength((current) => {
        if (current >= text.length) {
          clearInterval(timer)
          return current
        }
        return current + 1
      })
    }, TYPE_MS)
    return () => clearInterval(timer)
  }, [text])

  return (
    <span aria-label={text} role="text">
      <span aria-hidden>{text.slice(0, length)}</span>
      <span aria-hidden className="type-cursor">
        ▮
      </span>
    </span>
  )
}
