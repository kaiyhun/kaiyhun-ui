/**
 * TerminalPrompt — Matrix-mode chrome (easter egg): a fixed zsh prompt
 * in the bottom-left corner with a blinking cursor (reuses the
 * type-cursor animation from index.css). Purely decorative: aria-hidden
 * and pointer-events-none so it never blocks content or clicks; renders
 * nothing outside Matrix mode.
 */
import { useMatrixTheme } from "@/lib/theme"

export function TerminalPrompt() {
  const matrix = useMatrixTheme()
  if (!matrix) return null

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed bottom-4 left-4 z-30 font-mono text-sm text-primary"
    >
      <span className="text-accent">➜</span> zsh
      <span className="type-cursor">▮</span>
    </div>
  )
}
