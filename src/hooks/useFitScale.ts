import { useEffect, useRef, useState } from "react"

export function useFitScale(designWidth: number, designHeight: number, min = 0.42, max = 1.35) {
  const ref = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.6)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const update = () => {
      const rect = el.getBoundingClientRect()
      if (!rect.width || !rect.height) return
      const next = Math.min(rect.width / designWidth, rect.height / designHeight)
      setScale(Math.min(Math.max(next, min), max))
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [designWidth, designHeight, min, max])

  return { ref, scale }
}
