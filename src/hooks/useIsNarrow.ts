import { useEffect, useState } from "react"

export function useIsNarrow(maxWidth = 640) {
  const [narrow, setNarrow] = useState(() =>
    typeof window === "undefined" ? false : window.matchMedia(`(max-width: ${maxWidth - 1}px)`).matches,
  )

  useEffect(() => {
    const query = window.matchMedia(`(max-width: ${maxWidth - 1}px)`)
    const update = () => setNarrow(query.matches)
    query.addEventListener("change", update)
    return () => query.removeEventListener("change", update)
  }, [maxWidth])

  return narrow
}
