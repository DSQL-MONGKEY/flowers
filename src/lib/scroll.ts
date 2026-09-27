import Lenis from "lenis"

let lenis: Lenis | null = null

export function setLenis(instance: Lenis | null) {
  lenis = instance
}

export function getLenis() {
  return lenis
}

export function scrollToTarget(
  target: string | number,
  options: { duration?: number; immediate?: boolean } = {},
) {
  const { duration = 1.8, immediate = false } = options

  if (lenis) {
    lenis.scrollTo(target, { duration, immediate, lock: false })
    return
  }

  if (typeof target === "string") {
    document.querySelector(target)?.scrollIntoView({ behavior: immediate ? "auto" : "smooth" })
  } else {
    window.scrollTo({ top: target, behavior: immediate ? "auto" : "smooth" })
  }
}
