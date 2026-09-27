import { useMotionValue, type MotionValue } from "motion/react"
import { useCallback, useEffect, useRef, useState } from "react"

type PermissionState = "unsupported" | "prompt" | "granted" | "denied"

type OrientationEventCtor = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<"granted" | "denied">
}

export type DeviceTilt = {
  x: MotionValue<number>
  y: MotionValue<number>
  permission: PermissionState
  request: () => void
  gyroActive: boolean
}

export function useDeviceTilt(enabled = true): DeviceTilt {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const target = useRef({ x: 0, y: 0 })
  const frame = useRef(0)
  const betaOffset = useRef<number | null>(null)
  const gyroActive = useRef(false)
  const [permission, setPermission] = useState<PermissionState>(() => {
    if (typeof window === "undefined" || !("DeviceOrientationEvent" in window)) return "unsupported"
    const ctor = window.DeviceOrientationEvent as OrientationEventCtor
    return typeof ctor.requestPermission === "function" ? "prompt" : "granted"
  })
  const [gyroFlag, setGyroFlag] = useState(false)

  const request = useCallback(() => {
    const ctor = window.DeviceOrientationEvent as OrientationEventCtor | undefined
    if (!ctor) {
      setPermission("unsupported")
      return
    }
    if (typeof ctor.requestPermission !== "function") {
      setPermission("granted")
      return
    }
    void ctor
      .requestPermission()
      .then((result) => setPermission(result === "granted" ? "granted" : "denied"))
      .catch(() => setPermission("denied"))
  }, [])

  useEffect(() => {
    if (!enabled) return
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced) return

    const loop = () => {
      const currentX = x.get()
      const currentY = y.get()
      const dx = target.current.x - currentX
      const dy = target.current.y - currentY

      if (Math.abs(dx) < 0.0015 && Math.abs(dy) < 0.0015) {
        x.set(target.current.x)
        y.set(target.current.y)
        frame.current = 0
        return
      }

      x.set(currentX + dx * 0.08)
      y.set(currentY + dy * 0.08)
      frame.current = requestAnimationFrame(loop)
    }

    const kick = () => {
      if (!frame.current) frame.current = requestAnimationFrame(loop)
    }

    const onOrientation = (event: DeviceOrientationEvent) => {
      if (event.gamma === null || event.beta === null) return
      if (betaOffset.current === null) betaOffset.current = event.beta
      gyroActive.current = true
      setGyroFlag(true)
      target.current = {
        x: Math.max(-1, Math.min(1, event.gamma / 26)),
        y: Math.max(-1, Math.min(1, (event.beta - betaOffset.current) / 26)),
      }
      kick()
    }

    const onPointer = (event: PointerEvent) => {
      if (gyroActive.current) return
      target.current = {
        x: (event.clientX / window.innerWidth - 0.5) * 2,
        y: (event.clientY / window.innerHeight - 0.5) * 2,
      }
      kick()
    }

    if (permission === "granted") {
      window.addEventListener("deviceorientation", onOrientation)
    }
    window.addEventListener("pointermove", onPointer, { passive: true })

    return () => {
      window.removeEventListener("deviceorientation", onOrientation)
      window.removeEventListener("pointermove", onPointer)
      if (frame.current) cancelAnimationFrame(frame.current)
      frame.current = 0
      target.current = { x: 0, y: 0 }
      x.set(0)
      y.set(0)
      gyroActive.current = false
      setGyroFlag(false)
    }
  }, [enabled, permission, x, y])

  return { x, y, permission, request, gyroActive: gyroFlag }
}
