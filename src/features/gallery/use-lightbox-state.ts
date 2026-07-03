/**
 * useLightboxState — the lightbox's open photo lives in the URL
 * (?photo=<file-stem>), making every view shareable and back-button
 * friendly:
 *
 * - open  → pushes a history entry (back returns to the closed grid)
 * - goTo  → replaces it (back doesn't crawl through every photo)
 * - close → pushes the param removal (back reopens the last photo)
 */
import { useSearchParams } from "react-router"

export function useLightboxState() {
  const [searchParams, setSearchParams] = useSearchParams()

  const file = searchParams.get("photo")

  const open = (nextFile: string) => {
    setSearchParams((params) => {
      params.set("photo", nextFile)
      return params
    })
  }

  const goTo = (nextFile: string) => {
    setSearchParams(
      (params) => {
        params.set("photo", nextFile)
        return params
      },
      { replace: true },
    )
  }

  const close = () => {
    setSearchParams((params) => {
      params.delete("photo")
      return params
    })
  }

  return { file, open, goTo, close }
}
