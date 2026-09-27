import { motion, useScroll, useTransform, type MotionValue } from "motion/react"
import { useRef } from "react"

import { PetalShape } from "@/components/lily/PetalShape"
import AnimatedContent from "@/components/reactbits/AnimatedContent"
import BlurText from "@/components/reactbits/BlurText"
import ScrollReveal from "@/components/reactbits/ScrollReveal"
import { content } from "@/content"
import { useIsNarrow } from "@/hooks/useIsNarrow"

type DriftPetalProps = {
  progress: MotionValue<number>
  from: number
  to: number
  className: string
}

function DriftPetal({ progress, from, to, className }: DriftPetalProps) {
  const y = useTransform(progress, [0, 1], [from, to])
  return (
    <motion.div aria-hidden="true" style={{ y }} className={`absolute text-ink ${className}`}>
      <PetalShape className="h-full w-full" strokeWidth={1.6} veinOpacity={0.5} />
    </motion.div>
  )
}

export function LetterScene() {
  const sectionRef = useRef<HTMLElement>(null)
  const narrow = useIsNarrow()
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const petals: Array<Omit<DriftPetalProps, "progress">> = [
    { from: 160, to: -240, className: "left-[3%] top-[6%] w-[280px] opacity-[0.08] rotate-[-16deg] sm:w-[360px]" },
    { from: 260, to: -160, className: "right-[2%] top-[18%] w-[220px] opacity-[0.10] rotate-[22deg] sm:w-[300px]" },
    { from: 120, to: -300, className: "left-[8%] top-[42%] w-[200px] opacity-[0.07] rotate-[8deg] sm:w-[260px]" },
    { from: 300, to: -120, className: "right-[6%] top-[58%] w-[300px] opacity-[0.06] rotate-[-28deg] sm:w-[400px]" },
    { from: 180, to: -220, className: "left-[14%] top-[78%] w-[240px] opacity-[0.09] rotate-[34deg] sm:w-[320px]" },
  ]

  return (
    <section id="letter" ref={sectionRef} className="relative overflow-hidden pb-[26svh] pt-[16svh]">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {petals.map((petal, index) => (
          <DriftPetal key={index} progress={scrollYProgress} {...petal} />
        ))}
      </div>

      <div className="relative z-10 mx-auto w-full max-w-4xl px-6">
        <div className="flex min-h-[52svh] flex-col items-center justify-center text-center">
          <AnimatedContent distance={36} duration={1.1} threshold={0.15}>
            <p className="text-[10px] uppercase tracking-[0.5em] text-ink-soft/70">
              {content.letter.kicker}
            </p>
          </AnimatedContent>
        </div>

        {content.letter.sentences.map((sentence, index) => (
          <div key={index} className="flex min-h-[78svh] flex-col items-center justify-center">
            <ScrollReveal
              baseRotation={1.6}
              enableBlur={!narrow}
              blurStrength={narrow ? 0 : 4}
              baseOpacity={0.08}
              containerClassName="w-full text-center"
              textClassName="font-display text-[clamp(1.55rem,3.6vw,2.85rem)] font-normal leading-[1.45] tracking-[-0.005em] text-ink/90"
            >
              {sentence}
            </ScrollReveal>

            {index < content.letter.sentences.length - 1 && (
              <AnimatedContent distance={20} duration={0.9} threshold={0.25} className="mt-14">
                <span className="flex items-center gap-3 text-[9px] tracking-[0.4em] text-ink-soft/60">
                  <span className="h-px w-8 bg-line/25" />
                  <span className="font-display text-base italic tracking-normal">✦</span>
                  <span className="h-px w-8 bg-line/25" />
                </span>
              </AnimatedContent>
            )}
          </div>
        ))}

        <div className="flex min-h-[86svh] flex-col items-center justify-center gap-9 text-center">
          <BlurText
            text={content.letter.closingTitle}
            stepDuration={0.4}
            className="max-w-[18ch] justify-center font-display text-[clamp(2.1rem,5.4vw,3.9rem)] font-medium leading-[1.1] text-ink"
          />

          <AnimatedContent distance={28} duration={1} threshold={0.12}>
            <p className="mx-auto max-w-md font-display text-lg italic leading-relaxed text-ink-soft">
              {content.letter.closingBody}
            </p>
          </AnimatedContent>

          <AnimatedContent distance={22} duration={1} threshold={0.12} delay={0.15}>
            <p className="text-[10px] uppercase tracking-[0.4em] text-ink-soft/60">{content.sender}</p>
          </AnimatedContent>
        </div>
      </div>
    </section>
  )
}
