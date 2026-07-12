/**
 * TerminalPrompt — Matrix-mode chrome, now a WORKING shell (the final
 * easter egg): click the bottom-left prompt and type. `cd photography`
 * really navigates; `ls` lists the wings; `exit` wakes you up. Unknown
 * input gets an honest zsh error. Renders nothing outside Matrix mode.
 *
 * a11y: a real labelled <input> (no aria-hidden theater) — keyboard
 * users tab to it, screen readers hear "Terminal: type a command…".
 * Output is ephemeral flavor, one line above the prompt.
 */
import { useRef, useState, type FormEvent } from "react"
import { useNavigate } from "react-router"

import { applyMatrixTheme, useMatrixTheme } from "@/lib/theme"

/** Wing directory — what `cd` understands (aliases included). */
const DESTINATIONS: Record<string, string> = {
  "~": "/",
  "..": "/",
  home: "/",
  photography: "/photography",
  drawing: "/drawing",
  drawings: "/drawing",
  lab: "/lab",
  blog: "/blog",
  about: "/about",
  tutorial: "/tutorial",
  tutorials: "/tutorial",
  preset: "/preset",
  presets: "/preset",
}

export function TerminalPrompt() {
  const matrix = useMatrixTheme()
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const [value, setValue] = useState("")
  const [output, setOutput] = useState<string | null>(null)

  if (!matrix) return null

  const run = (event: FormEvent) => {
    event.preventDefault()
    const line = value.trim()
    setValue("")
    if (!line) return
    const [command, arg = ""] = line.split(/\s+/)
    switch (command.toLowerCase()) {
      case "cd": {
        const path = DESTINATIONS[arg.replace(/\/+$/, "").toLowerCase()]
        if (path) {
          setOutput(null)
          navigate(path)
        } else {
          setOutput(`cd: no such directory: ${arg || "~"}`)
        }
        break
      }
      case "ls":
        setOutput("photography  drawing  lab  blog  about  tutorial  preset")
        break
      case "run":
        // The hidden game (docs/game.md) — `run` runs the runner
        setOutput(null)
        navigate("/run")
        break
      case "help":
        setOutput("commands: cd <page> · ls · clear · exit · run")
        break
      case "clear":
        setOutput(null)
        break
      case "exit":
      case "wake":
        applyMatrixTheme(false)
        break
      default:
        setOutput(`zsh: command not found: ${command}`)
    }
  }

  return (
    <form
      onSubmit={run}
      onClick={() => inputRef.current?.focus()}
      className="fixed bottom-4 left-4 z-30 font-mono text-sm text-primary"
    >
      {output && (
        <p className="mb-1 max-w-xs text-muted-foreground">{output}</p>
      )}
      <label className="flex cursor-text items-center gap-2">
        <span aria-hidden className="text-accent">
          ➜
        </span>
        <span className="sr-only">
          Terminal: type a command, e.g. “cd photography” — “help” lists
          commands
        </span>
        <input
          ref={inputRef}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="zsh"
          spellCheck={false}
          autoComplete="off"
          className="w-48 rounded-sm bg-transparent [caret-color:var(--primary)] outline-none placeholder:text-primary/60 focus-visible:ring-2 focus-visible:ring-ring/50"
        />
      </label>
    </form>
  )
}
