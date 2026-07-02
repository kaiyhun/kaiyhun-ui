# Code conventions

> **Status: APPROVED (2026-07-01).**

The rules that keep the codebase consistent as it grows. Tooling enforces
what it can; the rest is convention documented here.

## Exports (the standards you asked about)

- **Named exports everywhere.** `export function Button(…)`, never
  `export default` — names survive refactors, auto-import correctly, and
  rename refactoring works across the codebase.
  - **One exception:** route pages (`src/pages/*.tsx`) use
    `export default` because `React.lazy(() => import('./pages/home'))`
    consumes the default export directly. Pages are leaves — nothing else
    imports them — so the downsides don't apply.
- **No barrel files** (`index.ts` that re-exports a folder). They defeat
  code-splitting/tree-shaking and slow HMR. Import from the real module:
  `import { Reveal } from '@/components/motion/reveal'`.
- **Components-only exports from component files** (fast-refresh rule,
  lint-enforced): helpers live in `lib/`. Exception: `src/components/ui/**`
  follows shadcn's pattern of exporting cva variants alongside the
  component — the lint rule is disabled for that folder only
  (`.oxlintrc.json` override).
- **Absolute imports via `@/`** for anything outside the current folder;
  relative `./` only within a module.
- **Types:** `import type { Foo }` for type-only imports (the compiler's
  `verbatimModuleSyntax` enforces this — it's an error otherwise).

## Interfaces & types

- Props are an `interface` named `<Component>Props`, declared above the
  component. `interface` for object shapes (extendable, better error
  messages); `type` for unions/intersections/mapped types.
- Export a props interface **only when consumers need it** (e.g. a wrapper
  extends it). Unexported = free to change.
- Extend native/library element props instead of redeclaring:
  `interface RevealProps extends ComponentProps<typeof motion.div>`.
- No `any`. For genuinely unknown data use `unknown` and narrow.
- Document every exported prop with a JSDoc line (`/** … */`) — editors
  surface these on hover.

## Components

- Function declarations (`function Button(…) {}`), not arrow-function
  constants — hoisting, clearer stack traces, matches shadcn source.
- One exported component per file. Small private helper components may live
  in the same file below the export.
- Derive state during render where possible; `useEffect` is a last resort
  for real external synchronization.
- Composition over configuration: children/slots over ever-growing props.

## Naming

| Thing            | Convention                         | Example                           |
| ---------------- | ---------------------------------- | --------------------------------- |
| Files & folders  | `kebab-case`                       | `responsive-image.tsx`            |
| Components       | `PascalCase`                       | `ResponsiveImage`                 |
| Hooks            | `use` + camelCase, file `use-*.ts` | `useLightbox` / `use-lightbox.ts` |
| Functions/vars   | `camelCase`                        | `offsetFor`                       |
| Module constants | `SCREAMING_SNAKE`                  | `MOTION`, `SWATCHES`              |
| Types/interfaces | `PascalCase`, no `I`/`T` prefixes  | `RevealProps`                     |

## Comments & documentation

- File-header docstring on every component/module: what it is, notable
  decisions/deviations, accessibility behavior.
- Inline comments for larger or non-obvious blocks — explain _why_, not
  _what_ the next line does.
- Features and system decisions get a markdown doc in `docs/`, updated as
  the thing changes.

## Styling

- Design tokens in `src/index.css` are the single source of truth — see
  `docs/design-system.md`. Never hard-code a color/font/duration/curve.
- Tailwind utilities in JSX; `cn()` for conditional classes; cva for
  variant-driven components (as in `button.tsx`).

## Tooling (enforced)

| Command                           | What                                                             |
| --------------------------------- | ---------------------------------------------------------------- |
| `npm run lint`                    | oxlint (ships with the Vite template)                            |
| `npm run format` / `format:check` | Prettier + `prettier-plugin-tailwindcss` (canonical class order) |
| `npm run typecheck`               | `tsc -b` without emitting                                        |
| `npm run check`                   | typecheck + lint + format:check — run before handing off work    |

CI (`.github/workflows/ci.yml`) runs `npm run check` + build on every push
and PR; the Pages deploy workflow stays separate. `.editorconfig` keeps
non-JS editors consistent (2-space indent, LF, final newline).

## Git hygiene

- Claude never commits or pushes — work stays in the tree for user review.
- Changes arrive in small, milestone-scoped units (see
  `docs/implementation-plan.md`) so each review is tractable.
