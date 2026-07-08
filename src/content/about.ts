/**
 * About page content (M11, docs/about.md).
 *
 * ⚠ BIO, GOALS, and COLOPHON are PLACEHOLDER DRAFTS assembled from what
 * the site already says (tagline, the drawing journey, the first blog
 * post) — the user rewrites all of it in their own voice
 * (content-draft §16). Goals especially are Claude's guesses at
 * intentions and MUST be replaced.
 */

/** DRAFT bio — rewrite in your own voice. */
export const BIO: string[] = [
  "I'm Kaiyhun. This site is the record of everything I chase: the photographs, the drawings, the projects, and the research.",
  "Too many thinigs I want to build, too many things I want to try.",
  "Getting there one step at a time.",
]

export interface Goal {
  /** Thread marker — a year or "someday". */
  marker: string
  /** The goal itself (DRAFT — user's real goals replace these). */
  text: string
  /** Achieved goals get a filled primary dot. */
  done?: boolean
}

/** DRAFT goals — Claude's guesses from the site's own story. Replace. */
export const GOALS: Goal[] = [
  {
    marker: "2026",
    text: "Finish this site — every wing live, every placeholder replaced with the real thing.",
  },
  {
    marker: "2026",
    text: "Draw consistently again — fill the drawing record with finished studies, not just doodles.",
  },
  {
    marker: "2026",
    text: "Finish Preset V2.0 — the fully customizable preset bundle that's been parked since 2023.",
  },
  {
    marker: "someday",
    text: "Publish research worth citing — make the Lab a real shelf, not a mock.",
  },
  {
    marker: "someday even later",
    text: "Master drawing from imagination — the goal that started the whole record.",
  },
]

/** DRAFT colophon — how the site is built. */
export const COLOPHON: string[] = [
  "This site is built with: React and TypeScript on Vite, Tailwind for styling.",
  "I plan to open-source this website in the future so others can use it as a template.",
]
