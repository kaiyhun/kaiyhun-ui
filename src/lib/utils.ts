/**
 * Generic utilities (shadcn contract) — currently just `cn`.
 */
import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

/**
 * tailwind-merge doesn't know our CUSTOM `text-*` theme utilities, so by
 * default it lumps the font-size ones (`text-display`, `text-display-sm`)
 * and the color ones (`text-wordmark`) into one `text-*` conflict group
 * and drops all but the last — e.g. `cn("text-display", "text-wordmark")`
 * would silently lose `text-display`. Registering them in their real
 * groups keeps a size and a color coexisting.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["display", "display-sm"] }],
      "text-color": [{ text: ["wordmark"] }],
    },
  },
})

/**
 * Merges class values (strings, conditionals, arrays) and resolves
 * conflicting Tailwind utilities — later classes win, so callers can
 * override component defaults via `className`.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
