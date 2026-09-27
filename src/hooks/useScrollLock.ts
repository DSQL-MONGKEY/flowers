import { useEffect, useRef } from "react"
import type { RefObject } from "react"

import { getLenis } from "@/lib/scroll"

export function useScrollLock(
  active: boolean,
  boundaryRef: RefObject<HTMLElement | null>,
  onBlocked?: () => void,
) {
  const callbackRef = useRef(onBlocked)

  useEffect(() => {
    callbackRef.current = onBlocked
  }, [onBlocked])

  useEffect(() => {
    if (!active) return

    const clamp = () => {
      const el = boundaryRef.current
      if (!el) return
      const limit = el.getBoundingClientRect().top + window.scrollY
      if (window.scrollY <= limit + 1) return

      const lenis = getLenis()
      if (lenis) {
        lenis.scrollTo(limit, { immediate: true, force: true })
      } else {
        window.scrollTo(0, limit)
      }
      callbackRef.current?.()
    }

    const lenis = getLenis()
    if (lenis) {
      const onScroll = () => clamp()
      lenis.on("scroll", onScroll)
      clamp()
      return () => {
        lenis.off("scroll", onScroll)
      }
    }

    window.addEventListener("scroll", clamp, { passive: true })
    clamp()
    return () => window.removeEventListener("scroll", clamp)
  }, [active, boundaryRef])
}
