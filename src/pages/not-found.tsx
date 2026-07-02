/**
 * NotFound — the catch-all 404 route. Thin wrapper over the shared view
 * (also used when content lookups miss, e.g. unknown collection slugs).
 */
import { NotFoundView } from "@/components/layout/not-found-view"

export default function NotFound() {
  return <NotFoundView />
}
