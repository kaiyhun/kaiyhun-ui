/**
 * Generic utilities (shadcn contract) — currently just `cn`.
 */
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merges class values (strings, conditionals, arrays) and resolves
 * conflicting Tailwind utilities — later classes win, so callers can
 * override component defaults via `className`.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
