import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "motion/react"
import { useCallback, useEffect, useRef, useState } from "react"
import { Smartphone, X } from "lucide-react"

import { AnatomyLabels } from "@/components/lily/AnatomyLabels"
import { BirthBackdrop, BirthHead } from "@/components/lily/BirthIllustration"
import AnimatedContent from "@/components/reactbits/AnimatedContent"
import BlurText from "@/components/reactbits/BlurText"
import { content } from "@/content"
import { useDeviceTilt } from "@/hooks/useDeviceTilt"
import { useFitScale } from "@/hooks/useFitScale"
import { useIsNarrow } from "@/hooks/useIsNarrow"
import {
  ANATOMY_PARTS,
  BIRTH_STAGES,
  VIEWBOX,
  ZOOM_ORIGIN,
  ZOOM_STAGE,
  easeInOutCubic,
  seg,
  zoomTransform,
  type AnatomyId,
} from "@/lib/birth"
import { cn } from "@/lib/utils"

function StageCaption({ stage, progress }: { stage: (typeof BIRTH_STAGES)[number]; progress: MotionValue<number> }) {
  const range = [stage.start, stage.start + 0.02, stage.end - 0.025, stage.end]
  const opacity = useTransform(progress, range, [0, 1, 1, 0])
  const y = useTransform(progress, range, [10, 0, 0, -8])
  const text = content.birth.stages[stage.id]

  return (
    <motion.p
      style={{ opacity, y }}
      className="absolute inset-x-0 top-0 mx-auto max-w-lg text-center font-display text-[clamp(1rem,2vw,1.25rem)] italic leading-relaxed text-ink-soft"
    >
      <span className="mb-1 block text-[9px] not-italic uppercase tracking-[0.45em] text-ink-soft/60">
        {stage.id}
      </span>
      {text}
    </motion.p>
  )
}

function ProgressBar({ progress }: { progress: MotionValue<number> }) {
  const scaleX = useTransform(progress, (p) => p)
  const opacity = useTransform(progress, [0, 0.012, 0.94, 0.985], [0, 1, 1, 0])

  return (
    <motion.div
      aria-hidden="true"
      style={{ opacity }}
      className="pointer-events-none absolute inset-x-0 top-0 z-30"
    >
      <div className="relative h-[2px] w-full bg-line/10">
        <motion.div className="absolute inset-y-0 left-0 w-full origin-left bg-ink/60" style={{ scaleX }} />
        {BIRTH_STAGES.map((stage) => (
          <span
            key={stage.id}
            className="absolute top-1/2 h-[7px] w-px -translate-y-1/2 bg-line/35"
            style={{ left: `${stage.start * 100}%` }}
          />
        ))}
      </div>
    </motion.div>
  )
}

function AnatomyCard({ active, onClose }: { active: AnatomyId | null; onClose: () => void }) {
  const meta = active ? ANATOMY_PARTS.find((part) => part.id === active) : null
  const copy = active ? content.birth.anatomy.parts[active] : null

  return (
    <AnimatePresence>
      {meta && copy && (
        <motion.div
          key={meta.id}
          initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: 10, filter: "blur(4px)" }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-auto absolute inset-x-4 bottom-24 z-30 sm:inset-x-auto sm:bottom-8 sm:right-8 sm:left-auto sm:top-auto sm:w-[290px]"
        >
          <div className="rounded-2xl border border-line/15 bg-paper p-5 shadow-[0_26px_70px_-42px_rgba(20,20,22,0.6)]">
            <header className="mb-3 flex items-start justify-between gap-3">
              <div>
                <p className="mb-1 text-[9px] uppercase tracking-[0.35em] text-ink-soft/70">
                  {String(meta.index).padStart(2, "0")} · {copy.latin}
                </p>
                <h3 className="font-display text-2xl leading-tight text-ink">{copy.name}</h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label={content.birth.anatomy.close}
                className="flex size-7 shrink-0 items-center justify-center rounded-full border border-line/20 text-ink-soft transition-colors hover:border-ink hover:bg-ink hover:text-paper"
              >
                <X className="size-3.5" />
              </button>
            </header>
            <p className="text-[13px] leading-relaxed text-ink-soft">{copy.meaning}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function BirthScene() {
  const sectionRef = useRef<HTMLElement>(null)
  const narrow = useIsNarrow()
  const [active, setActive] = useState<AnatomyId | null>(null)
  const [inAnatomy, setInAnatomy] = useState(false)
  const [inZoom, setInZoom] = useState(false)
  const [sectionInView, setSectionInView] = useState(false)
  const anatomyRef = useRef(false)
  const zoomRef = useRef(false)
  const tilt = useDeviceTilt(sectionInView)

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] })
  const { ref: fitRef, scale } = useFitScale(narrow ? 640 : VIEWBOX.width, VIEWBOX.height, 0.3, 1.3)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setSectionInView(entry.isIntersecting),
      { rootMargin: "20% 0px 20% 0px" },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const nextAnatomy = value > 0.865
    if (nextAnatomy !== anatomyRef.current) {
      anatomyRef.current = nextAnatomy
      setInAnatomy(nextAnatomy)
      if (!nextAnatomy) setActive(null)
    }
    const nextZoom = value > 0.68 && value < 0.92
    if (nextZoom !== zoomRef.current) {
      zoomRef.current = nextZoom
      setInZoom(nextZoom)
    }
  })

  const zoomT = useTransform(scrollYProgress, (p) => easeInOutCubic(seg(p, ZOOM_STAGE.start, ZOOM_STAGE.end)))
  const zoomStyle = useTransform(zoomT, (t) => zoomTransform(t))

  const tiltLayerX = useTransform(tilt.x, [-1, 1], [7, -7])
  const tiltLayerY = useTransform(tilt.y, [-1, 1], [7, -7])

  const kickerOpacity = useTransform(scrollYProgress, [0, 0.02, 0.07, 0.1], [0, 1, 1, 0])
  const gyroOpacity = useTransform(scrollYProgress, [0.86, 0.9], [0, 1])
  const exitFade = useTransform(scrollYProgress, [0.945, 0.99], [1, 0.08])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActive(null)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  const handleSelect = useCallback((id: AnatomyId | null) => setActive(id), [])

  return (
    <>
      <section id="birth" ref={sectionRef} aria-label="Kelahiran bunga" className="relative h-[720vh]">
        <div className="sticky top-0 h-svh overflow-hidden">
          <ProgressBar progress={scrollYProgress} />

          <motion.p
            style={{ opacity: kickerOpacity }}
            className="absolute inset-x-0 top-[4.5svh] text-center text-[10px] uppercase tracking-[0.5em] text-ink-soft/70"
          >
            {content.birth.kicker}
          </motion.p>

          <div ref={fitRef} className="absolute inset-x-0 top-[9svh] bottom-[11svh] sm:bottom-[8svh]">
            <div
              className="absolute left-1/2 top-1/2"
              style={{
                width: VIEWBOX.width,
                height: VIEWBOX.height,
                transform: `translate(-50%, -50%) scale(${scale})`,
              }}
            >
              <motion.div
                style={{ x: tiltLayerX, y: tiltLayerY, opacity: exitFade }}
                className="absolute inset-0"
              >
                <div className="absolute inset-0">
                  <BirthBackdrop progress={scrollYProgress} narrow={narrow} allowBlur={!narrow} />
                </div>

                <motion.div
                  className={cn("absolute inset-0", inZoom && "will-change-transform")}
                  style={{ transform: zoomStyle, transformOrigin: ZOOM_ORIGIN }}
                >
                  <BirthHead progress={scrollYProgress} narrow={narrow} />
                </motion.div>

                <AnatomyLabels progress={scrollYProgress} active={active} onSelect={handleSelect} />
              </motion.div>
            </div>
          </div>

          <motion.div
            style={{ opacity: exitFade }}
            className={cn(
              "pointer-events-none absolute inset-x-0 flex justify-center px-6 transition-[bottom] duration-500",
              inAnatomy ? "bottom-[13svh] sm:bottom-[4svh]" : "bottom-[3svh]",
            )}
          >
            <div className="relative h-24 w-full max-w-xl">
              {BIRTH_STAGES.map((stage) => (
                <StageCaption key={stage.id} stage={stage} progress={scrollYProgress} />
              ))}
            </div>
          </motion.div>

          <motion.div
            style={{ opacity: exitFade }}
            className="absolute inset-x-0 top-[12svh] flex justify-center sm:hidden"
          >
            <motion.div style={{ opacity: gyroOpacity }}>
              {tilt.permission === "prompt" && !tilt.gyroActive && (
                <button
                  type="button"
                  onClick={tilt.request}
                  className="flex items-center gap-2 rounded-full border border-line/20 bg-paper px-4 py-2 text-[9px] uppercase tracking-[0.3em] text-ink-soft transition-colors hover:border-ink hover:text-ink"
                >
                  <Smartphone className="size-3.5" />
                  {content.birth.motion.ask}
                </button>
              )}
            </motion.div>
          </motion.div>

          {inAnatomy && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 sm:hidden">
              <AnimatePresence>
                {active === null && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="pointer-events-auto flex gap-2 overflow-x-auto px-4 pb-5 pt-3"
                  >
                    {ANATOMY_PARTS.map((part) => (
                      <button
                        key={part.id}
                        type="button"
                        onClick={() => handleSelect(part.id)}
                        className="flex shrink-0 items-center gap-2 rounded-full border border-line/20 bg-paper px-4 py-2 text-[11px] text-ink transition-colors hover:border-ink"
                      >
                        <span className="tabular-nums text-ink-soft/70">{part.index}</span>
                        {content.birth.anatomy.parts[part.id].name}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          <AnatomyCard active={active} onClose={() => setActive(null)} />
        </div>
      </section>

      <section className="relative flex min-h-[84svh] flex-col items-center justify-center gap-8 px-6 pb-[12svh] pt-[10svh] text-center">
        <BlurText
          text={content.birth.closing.title}
          stepDuration={0.4}
          className="max-w-[20ch] justify-center font-display text-[clamp(2.1rem,5.4vw,3.9rem)] font-medium leading-[1.1] text-ink"
        />

        <AnimatedContent distance={28} duration={1} threshold={0.12}>
          <p className="mx-auto max-w-xl font-display text-lg italic leading-relaxed text-ink-soft">
            {content.birth.closing.body}
          </p>
        </AnimatedContent>

        <AnimatedContent distance={22} duration={1} threshold={0.12} delay={0.15}>
          <p className="text-[10px] uppercase tracking-[0.4em] text-ink-soft/60">{content.sender}</p>
        </AnimatedContent>
      </section>
    </>
  )
}
