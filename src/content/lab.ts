/**
 * Lab content model (docs/lab.md) — projects + papers for /lab.
 *
 * ⚠ EVERYTHING BELOW IS MOCK DATA (user decision, M9 kickoff): real
 * repos and papers land only when the whole UI is done. Every title is
 * prefixed [MOCK]; the `repo` fields point at well-known public repos
 * purely so the GitHub-stats enrichment renders with real numbers.
 * Replace wholesale — do not ship.
 *
 * `repo` opts a project into build-time enrichment (stars, last push)
 * via virtual:github-stats — config/github-stats-plugin.ts extracts the
 * repo list from THIS file, so keep the `repo: "owner/name"` literal
 * form.
 */

/** Controlled tech vocabulary — chips on project cards. */
export const TECH_LABELS = {
  python: "Python",
  typescript: "TypeScript",
  react: "React",
  pytorch: "PyTorch",
  vite: "Vite",
  diffusion: "Diffusion",
} as const
export type TechTag = keyof typeof TECH_LABELS

/** Honest maintenance states (badge on each card). */
export const PROJECT_STATUSES = ["active", "experiment", "archived"] as const
export type ProjectStatus = (typeof PROJECT_STATUSES)[number]

export interface Project {
  slug: string
  name: string
  description: string
  tech: TechTag[]
  status: ProjectStatus
  links: { github?: string; demo?: string }
  /** Slug of a related blog post ("write-up" link on the card). */
  post?: string
  /** "owner/name" — opts into build-time GitHub stats. */
  repo?: string
}

export interface Paper {
  title: string
  venue: string
  year: number
  authors?: string
  links: { pdf?: string; arxiv?: string; doi?: string }
}

/** MOCK projects — varied on purpose so every card variant renders. */
export const PROJECTS: Project[] = [
  {
    slug: "latent-toolkit",
    name: "[MOCK] latent-toolkit",
    description:
      "MOCK - Utilities for probing diffusion latents — attention maps, seed walks, and prompt interpolation as composable pipelines.",
    tech: ["python", "pytorch", "diffusion"],
    status: "active",
    links: {
      github: "https://github.com/kaiyhun",
      demo: "https://example.com",
    },
    post: "why-i-started-coding",
    repo: "facebook/react",
  },
  {
    slug: "kaiyhun-ui",
    name: "[MOCK] kaiyhun-ui",
    description:
      "MOCK - This site — a static personal universe with a build-time image pipeline, MDX blog engine, and zero-runtime styling tokens.",
    tech: ["typescript", "react", "vite"],
    status: "active",
    links: { github: "https://github.com/kaiyhun" },
    repo: "vitejs/vite",
  },
  {
    slug: "dream-diffuser",
    name: "[MOCK] dream-diffuser",
    description:
      "MOCK - An experiment in steering image generation with hand-drawn composition sketches instead of prompts.",
    tech: ["python", "diffusion"],
    status: "experiment",
    links: { demo: "https://example.com" },
  },
  {
    slug: "shutter-scripts",
    name: "[MOCK] image-scripts",
    description:
      "MOCK - Batch tooling from the photography — automated image organization by metadata.",
    tech: ["python"],
    status: "archived",
    links: { github: "https://github.com/kaiyhun" },
  },
]

/** MOCK papers — citation-style shelf rows. */
export const PAPERS: Paper[] = [
  {
    title:
      "[MOCK] Attention Drift in Few-Step Diffusion Sampling: A Measurement Study",
    venue: "Preprint",
    year: 2026,
    authors: "K. Hun",
    links: { arxiv: "https://arxiv.org", pdf: "https://example.com" },
  },
  {
    title:
      "[MOCK] Sketch-Guided Composition Priors for Text-to-Image Generation",
    venue: "Workshop paper",
    year: 2025,
    authors: "K. Hun, A. Collaborator",
    links: { pdf: "https://example.com", doi: "https://doi.org" },
  },
  {
    title: "[MOCK] Something something Photography",
    venue: "Self-published",
    year: 2025,
    links: { pdf: "https://example.com" },
  },
]
