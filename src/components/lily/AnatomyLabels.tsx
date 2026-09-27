import { motion, useTransform, type MotionValue } from "motion/react"

import { content } from "@/content"
import { ANATOMY_PARTS, VIEWBOX, zoomedPoint, type AnatomyId, type AnatomyPart } from "@/lib/birth"
import { cn } from "@/lib/utils"

type Progress = MotionValue<number>

type AnatomyLabelsProps = {
  progress: Progress
  active: AnatomyId | null
  onSelect: (id: AnatomyId | null) => void
}

function LeaderLine({ part, progress }: { part: AnatomyPart; progress: Progress }) {
  const pathLength = useTransform(
    progress,
    [0.858 + part.index * 0.01, 0.926 + part.index * 0.01],
    [0, 1],
  )
  const opacity = useTransform(progress, [0.855 + part.index * 0.01, 0.89 + part.index * 0.01, 0.99, 1], [0, 1, 1, 0.9])
  const anchor = zoomedPoint(part.anchor, 1)
  const direction = part.chip.side === "left" ? 1 : -1
  const d = `M ${part.chip.x + direction * 6} ${part.chip.y} L ${part.elbow.x} ${part.elbow.y} L ${anchor.x.toFixed(1)} ${anchor.y.toFixed(1)}`

  return (
    <motion.path
      d={d}
      stroke="currentColor"
      strokeWidth={1.1}
      strokeLinejoin="round"
      fill="none"
      style={{ pathLength, opacity }}
    />
  )
}

function Anchor({ part, progress, active, onSelect }: { part: AnatomyPart; progress: Progress; active: AnatomyId | null; onSelect: (id: AnatomyId | null) => void }) {
  const anchor = zoomedPoint(part.anchor, 1)
  const opacity = useTransform(progress, [0.87 + part.index * 0.01, 0.9 + part.index * 0.01], [0, 1])
  const isActive = active === part.id

  return (
    <g>
      <motion.circle
        cx={anchor.x}
        cy={anchor.y}
        r={isActive ? 4.6 : 3.4}
        fill="currentColor"
        style={{ opacity }}
        className="hidden transition-all duration-300 sm:block"
      />
      {isActive && (
        <motion.circle
          cx={anchor.x}
          cy={anchor.y}
          r={19}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.2}
          strokeDasharray="3 5"
          style={{ transformOrigin: `${anchor.x}px ${anchor.y}px` }}
          animate={{ rotate: 360, opacity: [0.35, 0.85, 0.35] }}
          transition={{
            rotate: { repeat: Infinity, duration: 16, ease: "linear" },
            opacity: { repeat: Infinity, duration: 3.2, ease: "easeInOut" },
          }}
        />
      )}
      <motion.circle
        cx={anchor.x}
        cy={anchor.y}
        r={20}
        fill="transparent"
        className="cursor-pointer"
        pointerEvents="all"
        style={{ opacity }}
        onClick={() => onSelect(isActive ? null : part.id)}
      />
    </g>
  )
}

function Chip({ part, progress, active, onSelect }: { part: AnatomyPart; progress: Progress; active: AnatomyId | null; onSelect: (id: AnatomyId | null) => void }) {
  const start = 0.872 + part.index * 0.01
  const opacity = useTransform(progress, [start, start + 0.04, 0.99, 1], [0, 1, 1, 0.92])
  const drift = useTransform(progress, [start, start + 0.04], [10, 0])
  const isActive = active === part.id
  const isLeft = part.chip.side === "left"
  const meta = content.birth.anatomy.parts[part.id]

  return (
    <div
      className="absolute"
      style={{
        left: `${(part.chip.x / VIEWBOX.width) * 100}%`,
        top: `${(part.chip.y / VIEWBOX.height) * 100}%`,
        transform: `translate(${isLeft ? "-100%" : "0"}, -50%)`,
      }}
    >
      <motion.button
        type="button"
        onClick={() => onSelect(isActive ? null : part.id)}
        aria-pressed={isActive}
        style={{ opacity, y: drift }}
        className={cn(
          "flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-left transition-colors duration-300",
          isLeft ? "flex-row-reverse" : "flex-row",
          isActive
            ? "border-ink bg-ink text-paper"
            : "border-line/20 bg-paper text-ink hover:border-ink/50",
        )}
      >
        <span className={cn("text-[11px] tabular-nums", isActive ? "text-paper/70" : "text-ink-soft/70")}>
          {String(part.index).padStart(2, "0")}
        </span>
        <span className="font-display text-[15px] leading-none">{meta.name}</span>
      </motion.button>
    </div>
  )
}

function MobileDot({ part, progress, active, onSelect }: { part: AnatomyPart; progress: Progress; active: AnatomyId | null; onSelect: (id: AnatomyId | null) => void }) {
  const anchor = zoomedPoint(part.anchor, 1)
  const x = anchor.x + (part.dot?.dx ?? 0)
  const y = anchor.y + (part.dot?.dy ?? 0)
  const opacity = useTransform(progress, [0.868 + part.index * 0.006, 0.892 + part.index * 0.006], [0, 1])
  const isActive = active === part.id

  return (
    <div
      className="absolute sm:hidden"
      style={{
        left: `${(x / VIEWBOX.width) * 100}%`,
        top: `${(y / VIEWBOX.height) * 100}%`,
        transform: "translate(-50%, -50%)",
      }}
    >
      <motion.button
        type="button"
        onClick={() => onSelect(isActive ? null : part.id)}
        aria-label={content.birth.anatomy.parts[part.id].name}
        aria-pressed={isActive}
        style={{ opacity }}
        className={cn(
          "flex size-8 items-center justify-center rounded-full border text-[11px] tabular-nums transition-colors duration-300",
          isActive ? "border-ink bg-ink text-paper" : "border-line/25 bg-paper/90 text-ink",
        )}
      >
        {part.index}
      </motion.button>
    </div>
  )
}

export function AnatomyLabels({ progress, active, onSelect }: AnatomyLabelsProps) {
  const hintOpacity = useTransform(progress, [0.885, 0.925, 0.975, 1], [0, 1, 1, 0])

  return (
    <div className="pointer-events-none absolute inset-0">
      <svg viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`} className="absolute inset-0 h-full w-full text-ink" fill="none" aria-hidden="true">
        <g className="hidden sm:block">
          {ANATOMY_PARTS.map((part) => (
            <LeaderLine key={`line-${part.id}`} part={part} progress={progress} />
          ))}
        </g>
        {ANATOMY_PARTS.map((part) => (
          <Anchor key={part.id} part={part} progress={progress} active={active} onSelect={onSelect} />
        ))}
      </svg>

      <div className="hidden sm:block">
        {ANATOMY_PARTS.map((part) => (
          <Chip key={part.id} part={part} progress={progress} active={active} onSelect={onSelect} />
        ))}
      </div>

      {ANATOMY_PARTS.map((part) => (
        <MobileDot key={`dot-${part.id}`} part={part} progress={progress} active={active} onSelect={onSelect} />
      ))}

      <motion.p
        aria-hidden="true"
        style={{ opacity: hintOpacity }}
        className="pointer-events-none absolute inset-x-0 top-[9.5svh] hidden text-center text-[10px] uppercase tracking-[0.35em] text-ink-soft/70 sm:block"
      >
        {content.birth.anatomy.hint}
      </motion.p>
    </div>
  )
}
