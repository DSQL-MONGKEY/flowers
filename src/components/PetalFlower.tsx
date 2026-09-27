import { AnimatePresence, motion } from "motion/react"
import { useCallback, useEffect, useRef, useState, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent } from "react"

import { Petal } from "@/components/Petal"
import { FlowerHeart } from "@/components/lily/FlowerHeart"
import { StemLeaves } from "@/components/lily/StemLeaves"
import { content } from "@/content"
import { useFitScale } from "@/hooks/useFitScale"
import { useScrollLock } from "@/hooks/useScrollLock"
import { FLOWER_BOX, PETAL_ANGLES, PETAL_COUNT, type PetalStatus } from "@/lib/flower"
import { cn } from "@/lib/utils"

type PetalFlowerProps = {
  onAllFallen: () => void
  onReveal?: (index: number) => void
  onFall?: (index: number) => void
}

const HIT_RADIUS = FLOWER_BOX.height / 2 + 70

export function PetalFlower({ onAllFallen, onReveal, onFall }: PetalFlowerProps) {
  const { ref: fitRef, scale } = useFitScale(FLOWER_BOX.width, FLOWER_BOX.height)
  const sectionRef = useRef<HTMLElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)
  const [statuses, setStatuses] = useState<PetalStatus[]>(() =>
    Array.from({ length: PETAL_COUNT }, () => "idle" as PetalStatus),
  )
  const [bloomed, setBloomed] = useState(false)
  const [activeNote, setActiveNote] = useState<number | null>(null)
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)
  const [blocked, setBlocked] = useState(false)
  const statusesRef = useRef(statuses)
  const timers = useRef<number[]>([])
  const finished = useRef(false)

  useEffect(() => {
    const el = fitRef.current
    if (!el || bloomed) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setBloomed(true)
          observer.disconnect()
        }
      },
      { threshold: 0.45 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [fitRef, bloomed])

  useEffect(
    () => () => {
      timers.current.forEach((timer) => window.clearTimeout(timer))
    },
    [],
  )

  const commit = useCallback((index: number, status: PetalStatus) => {
    statusesRef.current = statusesRef.current.map((current, i) => (i === index ? status : current))
    setStatuses(statusesRef.current)
  }, [])

  const drop = useCallback(
    (index: number) => {
      window.clearTimeout(timers.current[index])
      if (statusesRef.current[index] === "falling") return
      commit(index, "falling")
      setActiveNote((current) => (current === index ? null : current))
      onFall?.(index)
    },
    [commit, onFall],
  )

  const activate = useCallback(
    (index: number) => {
      const current = statusesRef.current[index]
      if (current === "idle") {
        statusesRef.current = statusesRef.current.map((status, i) => (i === index ? "revealed" : status))
        setStatuses(statusesRef.current)
        setActiveNote(index)
        onReveal?.(index)
        timers.current[index] = window.setTimeout(() => drop(index), 3600)
      } else if (current === "revealed") {
        drop(index)
      }
    },
    [drop, onReveal],
  )

  const hitTest = useCallback((clientX: number, clientY: number) => {
    const el = boxRef.current
    if (!el) return null
    const rect = el.getBoundingClientRect()
    if (rect.width <= 0) return null
    const currentScale = rect.width / FLOWER_BOX.width
    const dx = (clientX - rect.left) / currentScale - FLOWER_BOX.width / 2
    const dy = (clientY - rect.top) / currentScale - FLOWER_BOX.height / 2
    if (Math.hypot(dx, dy) > HIT_RADIUS) return null
    const angle = (Math.atan2(dx, -dy) * 180) / Math.PI
    const index = ((Math.round(angle / 60) % PETAL_COUNT) + PETAL_COUNT) % PETAL_COUNT
    return index
  }, [])

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent) => {
      const index = hitTest(event.clientX, event.clientY)
      setHoverIndex(index)
    },
    [hitTest],
  )

  const handlePointerLeave = useCallback(() => setHoverIndex(null), [])

  const handleClick = useCallback(
    (event: ReactMouseEvent) => {
      if (event.detail === 0) return
      const index = hitTest(event.clientX, event.clientY)
      if (index !== null) activate(index)
    },
    [activate, hitTest],
  )

  const handleBlocked = useCallback(() => {
    setBlocked(true)
    const timer = window.setTimeout(() => setBlocked(false), 1800)
    timers.current.push(timer)
  }, [])

  const lockActive = statuses.some((status) => status !== "falling")
  useScrollLock(lockActive && bloomed, sectionRef, handleBlocked)

  useEffect(() => {
    if (finished.current) return
    if (statuses.every((status) => status === "falling")) {
      finished.current = true
      timers.current.push(window.setTimeout(onAllFallen, 3200))
    }
  }, [statuses, onAllFallen])

  const remaining = statuses.filter((status) => status !== "falling").length
  const fallen = PETAL_COUNT - remaining
  const anyRevealed = statuses.some((status) => status === "revealed")
  const done = remaining === 0
  const active = activeNote === null ? null : content.petals[activeNote]
  const hintKey = done ? "done" : blocked ? "locked" : anyRevealed ? "again" : "hint"
  const hintText = done
    ? content.flower.done
    : blocked
      ? content.flower.locked
      : anyRevealed
        ? content.flower.hintAgain
        : content.flower.hint
  const clickable = hoverIndex !== null && statuses[hoverIndex] !== "falling"

  return (
    <section
      id="bloom"
      ref={sectionRef}
      aria-label="Bunga lily dengan enam pesan"
      className="relative flex h-svh flex-col overflow-hidden"
    >
      <div className="pt-[max(1.1rem,4.5vh)] text-center">
        <p className="text-[10px] uppercase tracking-[0.45em] text-ink-soft/70">
          untuk {content.recipient}
        </p>
      </div>

      <div ref={fitRef} className="relative min-h-0 flex-1">
        <div
          ref={boxRef}
          role="group"
          aria-label="Area kelopak"
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          onClick={handleClick}
          className={cn("absolute left-1/2 top-1/2 touch-manipulation", clickable && "cursor-pointer")}
          style={{
            width: FLOWER_BOX.width,
            height: FLOWER_BOX.height,
            transform: `translate(-50%, -50%) scale(${scale})`,
          }}
        >
          <div className="absolute left-1/2 top-1/2 z-[5] -translate-x-1/2 text-ink">
            <StemLeaves
              className="h-[460px] w-[260px]"
              opacity={0.14 + 0.72 * (fallen / PETAL_COUNT)}
            />
          </div>

          {content.petals.map((note, index) => (
            <Petal
              key={note.numeral}
              index={index}
              angle={PETAL_ANGLES[index]}
              numeral={note.numeral}
              text={note.text}
              status={statuses[index]}
              bloomed={bloomed}
              hovered={hoverIndex === index}
              onActivate={activate}
            />
          ))}

          <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 h-[240px] w-[240px] -translate-x-1/2 -translate-y-1/2 text-ink">
            <FlowerHeart className="h-full w-full" />
          </div>
        </div>
      </div>

      <footer className="flex flex-col items-center gap-2.5 pb-[max(1.1rem,4vh)] pt-2 text-center">
        <div className="flex h-5 items-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={hintKey}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0, x: blocked ? [0, -4, 4, -2, 0] : 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-[10px] uppercase tracking-[0.35em] text-ink-soft/80"
            >
              {hintText}
            </motion.p>
          </AnimatePresence>
        </div>

        {!done && (
          <p className="font-display text-sm italic text-ink-soft/90">
            {content.flower.remaining(remaining)}
          </p>
        )}

        <div className="flex items-center gap-2" aria-hidden="true">
          {statuses.map((status, index) => (
            <motion.span
              key={index}
              className="block h-1.5 w-1.5 rounded-full border border-ink/30"
              initial={false}
              animate={{ backgroundColor: status === "falling" ? "rgba(25,26,29,0.08)" : "rgba(25,26,29,0.85)" }}
              transition={{ duration: 0.6 }}
            />
          ))}
        </div>
      </footer>

      <AnimatePresence>
        {active && (
          <motion.div
            key={active.numeral}
            className="pointer-events-none fixed inset-x-5 bottom-24 z-40 sm:hidden"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="rounded-2xl border border-line/15 bg-paper px-6 py-5 text-center shadow-[0_18px_60px_-30px_rgba(20,20,22,0.5)]">
              <span className="mb-1 block text-[9px] uppercase tracking-[0.4em] text-ink-soft/80">
                kelopak {active.numeral}
              </span>
              <p className="font-display text-lg leading-snug text-ink">{active.text}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
