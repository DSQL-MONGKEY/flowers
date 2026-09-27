import { motion, useReducedMotion } from "motion/react"

import { PetalShape } from "@/components/lily/PetalShape"
import BlurText from "@/components/reactbits/BlurText"
import { Button } from "@/components/ui/button"
import { content } from "@/content"

type IntroProps = {
  onOpen: () => void
}

export function Intro({ onOpen }: IntroProps) {
  const reduced = useReducedMotion()

  return (
    <section
      id="intro"
      className="relative flex h-svh flex-col items-center justify-center overflow-hidden px-6 text-center"
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-[8%] w-[320px] text-ink opacity-[0.09] sm:w-[400px]"
        initial={false}
        animate={reduced ? undefined : { y: [0, -16, 0], rotate: [14, 18, 14] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        style={{ rotate: 14 }}
      >
        <PetalShape className="h-full w-full" />
      </motion.div>

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -left-28 bottom-[6%] w-[260px] text-ink opacity-[0.06] sm:w-[330px]"
        initial={false}
        animate={reduced ? undefined : { y: [0, 14, 0], rotate: [-24, -18, -24] }}
        transition={{ duration: 19, repeat: Infinity, ease: "easeInOut" }}
        style={{ rotate: -24 }}
      >
        <PetalShape className="h-full w-full" />
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="mb-8 text-[10px] uppercase tracking-[0.5em] text-ink-soft/70"
      >
        {content.intro.kicker}
      </motion.p>

      <BlurText
        text={content.intro.title}
        delay={150}
        stepDuration={0.45}
        className="max-w-[16ch] justify-center font-display text-[clamp(2.9rem,9vw,6.4rem)] font-medium leading-[1.04] tracking-[-0.01em] text-ink"
      />

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, delay: 0.9, ease: "easeOut" }}
        className="mt-7 font-display text-[clamp(1.5rem,4vw,2.4rem)] italic text-ink-soft"
      >
        {content.intro.forWhom} {content.recipient}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.6, ease: "easeOut" }}
        className="mt-12"
      >
        <Button
          variant="outline"
          onClick={onOpen}
          className="h-11 rounded-full border-line/25 bg-transparent px-8 text-[10px] font-medium uppercase tracking-[0.35em] text-ink transition-all duration-500 hover:border-ink hover:bg-ink hover:text-paper"
        >
          {content.intro.cta}
        </Button>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 2.4 }}
        className="mt-8 max-w-xs font-display text-sm italic leading-relaxed text-ink-soft/70"
      >
        {content.intro.hint}
      </motion.p>
    </section>
  )
}
