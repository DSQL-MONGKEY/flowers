import { motion, useReducedMotion } from "motion/react"

import { PetalShape } from "@/components/lily/PetalShape"
import { PETAL, type PetalStatus } from "@/lib/flower"
import { cn } from "@/lib/utils"

type PetalProps = {
  index: number
  angle: number
  numeral: string
  text: string
  status: PetalStatus
  bloomed: boolean
  hovered: boolean
  onActivate: (index: number) => void
}

export function Petal({ index, angle, numeral, text, status, bloomed, hovered, onActivate }: PetalProps) {
  const reduced = useReducedMotion()
  const isFalling = status === "falling"
  const isOpen = status !== "idle"
  const isFlipped = angle > 90 && angle < 270

  const fall = isFalling
    ? reduced
      ? { opacity: 0, transition: { duration: 0.9, ease: "easeOut" as const } }
      : {
          x: [0, 30, -24, 70],
          y: [0, 110, 300, 640],
          opacity: [1, 1, 0.9, 0],
          transition: { duration: 2.5, times: [0, 0.22, 0.58, 1], ease: "easeIn" as const },
        }
    : { x: 0, y: 0, opacity: 1, transition: { duration: 0.7, ease: "easeOut" as const } }

  const spin =
    isFalling && !reduced
      ? {
          rotate: [0, 4, -6, 16],
          transition: { duration: 2.5, times: [0, 0.24, 0.6, 1], ease: "easeInOut" as const },
        }
      : { rotate: 0 }

  return (
    <motion.div
      className="absolute left-1/2 top-1/2"
      style={{ zIndex: isFalling ? 40 : 20 }}
      initial={false}
      animate={fall}
    >
      <div
        className="absolute"
        style={{
          left: -PETAL.width / 2,
          top: -PETAL.height,
          width: PETAL.width,
          height: PETAL.height,
          transform: `rotate(${angle}deg)`,
          transformOrigin: "50% 100%",
        }}
      >
        <motion.div
          className="absolute inset-0"
          style={{ transformOrigin: "50% 66%" }}
          initial={false}
          animate={spin}
        >
          <motion.button
            type="button"
            disabled={isFalling}
            onClick={() => onActivate(index)}
            initial={false}
            animate={{
              opacity: bloomed ? 1 : 0,
              scale: bloomed ? (hovered && !isFalling ? 1.03 : 1) : reduced ? 1 : 0.82,
            }}
            transition={{ duration: hovered ? 0.45 : 1, delay: bloomed ? 0.1 + index * 0.09 : 0, ease: [0.22, 1, 0.36, 1] }}
            aria-label={
              status === "idle"
                ? `Buka pesan pada kelopak ${numeral}`
                : `Gugurkan kelopak ${numeral}`
            }
            className="pointer-events-none absolute inset-0 block text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40"
          >
            <PetalShape className="h-full w-full" filled={isOpen || hovered} />
          </motion.button>

          <div
            className={cn(
              "petal-text pointer-events-none absolute left-1/2 top-[53%] w-[57%] -translate-x-1/2 -translate-y-1/2 text-center",
              isFlipped && "rotate-180",
            )}
          >
            <motion.div
              initial={false}
              animate={{
                opacity: isOpen ? 1 : 0,
                filter: isOpen ? "blur(0px)" : "blur(7px)",
                y: isOpen ? 0 : 8,
              }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="mb-1 block text-[9px] font-medium uppercase tracking-[0.42em] text-ink-soft/80">
                {numeral}
              </span>
              <p
                className="font-display text-[17px] leading-[1.4] text-ink/90"
                style={{ textShadow: "0 0 10px var(--color-paper), 0 0 20px var(--color-paper), 0 0 30px var(--color-paper)" }}
              >
                {text}
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
