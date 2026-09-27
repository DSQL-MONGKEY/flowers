import { motion, useTransform, type MotionValue } from "motion/react"

import { FlowerHeart } from "@/components/lily/FlowerHeart"
import { PetalShape } from "@/components/lily/PetalShape"
import { FLOWER_CENTER, GROUND_Y, easeOutCubic, pivot, seg } from "@/lib/birth"
import { PETAL_ANGLES } from "@/lib/flower"

type Progress = MotionValue<number>

const PETAL_SCALE = 0.55
const HEART_SCALE = 0.35

function seeded(seed: number) {
  let state = seed
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296
    return state / 4294967296
  }
}

const SOIL_DASHES = (() => {
  const rand = seeded(7)
  const dashes: Array<{ x: number; y: number; len: number; slope: number; opacity: number }> = []
  for (let row = 0; row < 17; row += 1) {
    const baseY = GROUND_Y + 24 + row * 25
    for (let i = 0; i < 11; i += 1) {
      dashes.push({
        x: 30 + i * 80 + rand() * 48,
        y: baseY + rand() * 12,
        len: 9 + rand() * 11,
        slope: -5 - rand() * 4,
        opacity: 0.05 + rand() * 0.09,
      })
    }
  }
  return dashes
})()

const SOIL_PEBBLES = (() => {
  const rand = seeded(21)
  return Array.from({ length: 13 }, () => ({
    x: 60 + rand() * 770,
    y: GROUND_Y + 40 + rand() * 370,
    r: 2.5 + rand() * 4,
    opacity: 0.12 + rand() * 0.12,
  }))
})()

const ROOTS: Array<{ d: string; start: number }> = [
  { d: "M444 724 C 414 776 368 820 318 852", start: 0.141 },
  { d: "M448 728 C 424 800 424 876 442 946", start: 0.152 },
  { d: "M456 724 C 486 776 532 816 578 844", start: 0.163 },
  { d: "M446 720 C 390 756 332 766 274 756", start: 0.174 },
  { d: "M454 720 C 510 756 568 770 626 760", start: 0.185 },
  { d: "M450 730 C 440 820 420 900 386 962", start: 0.196 },
  { d: "M452 730 C 464 820 488 902 522 968", start: 0.207 },
  { d: "M448 726 C 440 764 418 794 386 816", start: 0.218 },
  { d: "M454 726 C 470 766 496 792 528 812", start: 0.229 },
]

const ROOT_BRANCHES: Array<{ d: string; start: number }> = [
  { d: "M368 820 C 342 842 330 874 328 902", start: 0.235 },
  { d: "M532 816 C 558 838 570 870 572 896", start: 0.244 },
  { d: "M424 872 C 402 894 392 926 392 954", start: 0.253 },
  { d: "M476 872 C 502 898 512 926 512 956", start: 0.262 },
  { d: "M318 852 C 294 870 278 894 274 922", start: 0.271 },
  { d: "M578 844 C 604 864 618 890 622 918", start: 0.28 },
]

const LEAVES: Array<{ blade: string; vein: string; base: { x: number; y: number }; fold: number; start: number }> = [
  {
    blade: "M447 549 C 372 530 292 482 218 400 C 296 452 386 512 452 553 Z",
    vein: "M446 550 C 376 514 296 462 228 406",
    base: { x: 447, y: 549 },
    fold: -34,
    start: 0.355,
  },
  {
    blade: "M453 556 C 528 538 608 494 682 428 C 606 482 520 528 448 560 Z",
    vein: "M454 557 C 524 522 604 478 674 434",
    base: { x: 453, y: 556 },
    fold: 34,
    start: 0.39,
  },
  {
    blade: "M451 530 C 398 500 344 438 298 330 C 378 414 430 478 456 535 Z",
    vein: "M452 531 C 402 490 354 434 306 342",
    base: { x: 451, y: 530 },
    fold: -22,
    start: 0.425,
  },
]

const DUST = [
  { x: 520, y: 210, delay: 0 },
  { x: 610, y: 300, delay: 0.02 },
  { x: 330, y: 300, delay: 0.035 },
  { x: 400, y: 170, delay: 0.05 },
  { x: 560, y: 420, delay: 0.065 },
  { x: 320, y: 430, delay: 0.08 },
  { x: 480, y: 130, delay: 0.095 },
  { x: 640, y: 500, delay: 0.11 },
]

function Seed({ progress, from, to, delay, rotate }: { progress: Progress; from: { x: number; y: number }; to: { x: number; y: number }; delay: number; rotate: number }) {
  const transform = useTransform(progress, (p) => {
    const t = easeOutCubic(seg(p, delay, delay + 0.055))
    const x = from.x + (to.x - from.x) * t
    const y = from.y + (to.y - from.y) * t
    return `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) rotate(${(rotate * t).toFixed(1)}deg)`
  })
  const opacity = useTransform(progress, [delay, delay + 0.018, delay + 0.048, delay + 0.062], [0, 1, 0.85, 0])

  return (
    <motion.g className="pivot-origin" style={{ transform, opacity }}>
      <g transform="scale(0.16) translate(-120 -360)">
        <PetalShape width={240} height={360} strokeWidth={11} veinOpacity={0.5} />
      </g>
    </motion.g>
  )
}

function Root({ progress, d, start }: { progress: Progress; d: string; start: number }) {
  const pathLength = useTransform(progress, [start, start + 0.1], [0, 1])
  const opacity = useTransform(progress, [start, start + 0.03], [0, 0.8])
  return <motion.path d={d} stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" fill="none" style={{ pathLength, opacity }} />
}

function Leaf({ progress, leaf }: { progress: Progress; leaf: (typeof LEAVES)[number] }) {
  const transform = useTransform(progress, (p) => {
    const t = easeOutCubic(seg(p, leaf.start, leaf.start + 0.11))
    return pivot(leaf.base.x, leaf.base.y, leaf.fold * (1 - t), 0.72 + 0.28 * t)
  })
  const opacity = useTransform(progress, [leaf.start, leaf.start + 0.04], [0, 1])
  return (
    <motion.g className="pivot-origin" style={{ transform, opacity }}>
      <path d={leaf.blade} stroke="currentColor" strokeWidth={1.9} strokeLinejoin="round" fill="none" />
      <path d={leaf.vein} stroke="currentColor" strokeWidth={1.1} strokeLinecap="round" fill="none" opacity={0.65} />
    </motion.g>
  )
}

function BloomPetal({ progress, angle, index }: { progress: Progress; angle: number; index: number }) {
  const transform = useTransform(progress, (p) => {
    const t = easeOutCubic(seg(p, 0.6 + index * 0.013, 0.705 + index * 0.013))
    const offsets = [-8, -5, -2, 2, 5, 8]
    const rotate = offsets[index] * (1 - t) + angle * t
    const scale = 0.4 + 0.6 * t
    return pivot(FLOWER_CENTER.x, FLOWER_CENTER.y, rotate, scale)
  })
  const opacity = useTransform(progress, [0.585 + index * 0.013, 0.615 + index * 0.013], [0, 1])

  return (
    <motion.g className="pivot-origin" style={{ transform, opacity }}>
      <g transform={`translate(${FLOWER_CENTER.x - 120 * PETAL_SCALE} ${FLOWER_CENTER.y - 360 * PETAL_SCALE}) scale(${PETAL_SCALE})`}>
        <PetalShape width={240} height={360} strokeWidth={3.2} veinOpacity={0.6} />
      </g>
    </motion.g>
  )
}

function Bud({ progress }: { progress: Progress }) {
  const transform = useTransform(progress, (p) => {
    const grow = easeOutCubic(seg(p, 0.46, 0.6))
    return pivot(FLOWER_CENTER.x, FLOWER_CENTER.y + 8, 0, 0.66 + 0.34 * grow)
  })
  const opacity = useTransform(progress, [0.45, 0.51, 0.64, 0.72], [0, 1, 1, 0])
  return (
    <motion.g className="pivot-origin" style={{ transform, opacity }}>
      <path
        d="M450 140 C 469 168 479 204 453 246 C 448 254 452 254 447 246 C 421 204 431 168 450 140 Z"
        stroke="currentColor"
        strokeWidth={2.1}
        strokeLinejoin="round"
        fill="none"
      />
      <g stroke="currentColor" strokeWidth={1.1} strokeLinecap="round" fill="none" opacity={0.6}>
        <path d="M443 162 C 438 192 442 222 449 242" />
        <path d="M457 162 C 462 192 458 222 451 242" />
        <path d="M450 150 C 447 184 448 214 450 241" />
      </g>
      <path d="M437 238 C 444 250 456 250 463 238" stroke="currentColor" strokeWidth={1.7} fill="none" strokeLinecap="round" />
    </motion.g>
  )
}

function Heart({ progress }: { progress: Progress }) {
  const transform = useTransform(progress, (p) => {
    const t = easeOutCubic(seg(p, 0.65, 0.73))
    return pivot(FLOWER_CENTER.x, FLOWER_CENTER.y, 0, 0.5 + 0.5 * t)
  })
  const opacity = useTransform(progress, [0.66, 0.73], [0, 1])
  return (
    <motion.g className="pivot-origin" style={{ transform, opacity }}>
      <g
        transform={`translate(${FLOWER_CENTER.x - 120 * HEART_SCALE} ${FLOWER_CENTER.y - 120 * HEART_SCALE}) scale(${HEART_SCALE})`}
      >
        <FlowerHeart width={240} height={240} />
      </g>
    </motion.g>
  )
}

function Dust({ progress, mote }: { progress: Progress; mote: (typeof DUST)[number] }) {
  const transform = useTransform(progress, (p) => {
    const t = easeOutCubic(seg(p, 0.7 + mote.delay, 0.94 + mote.delay))
    return `translate(${mote.x}px, ${(mote.y - 110 * t).toFixed(1)}px)`
  })
  const opacity = useTransform(progress, [0.69 + mote.delay, 0.78 + mote.delay, 0.92 + mote.delay], [0, 0.45, 0])
  return <motion.circle cx={0} cy={0} r={2.6} fill="currentColor" className="pivot-origin" style={{ transform, opacity }} />
}

type BirthLayerProps = {
  progress: Progress
  narrow?: boolean
  allowBlur?: boolean
}

export function BirthBackdrop({ progress, narrow = false, allowBlur = true }: BirthLayerProps) {
  const bulbTransform = useTransform(progress, (p) => pivot(450, 660, 0, 0.82 + 0.18 * easeOutCubic(seg(p, 0.09, 0.18))))
  const bulbOpacity = useTransform(progress, [0.09, 0.16], [0, 1])

  const stemLength = useTransform(progress, [0.3, 0.43], [0, 1])
  const stemOpacity = useTransform(progress, [0.3, 0.36, 0.74, 0.81], [0, 1, 1, 0])

  const surfaceOpacity = useTransform(progress, [0, 0.03], [0, 1])

  const bgFilter = useTransform(progress, (p) => `blur(${(allowBlur ? 10 * easeOutCubic(seg(p, 0.74, 0.86)) : 0).toFixed(2)}px)`)
  const bgOpacity = useTransform(progress, (p) => 1 - 0.74 * easeOutCubic(seg(p, 0.74, 0.86)))
  const bgY = useTransform(progress, (p) => 28 * easeOutCubic(seg(p, 0.74, 0.86)))

  const seedFade = useTransform(progress, [0, 0.02], [0, 1])

  const dashes = narrow ? SOIL_DASHES.filter((_, index) => index % 2 === 0) : SOIL_DASHES
  const pebbles = narrow ? SOIL_PEBBLES.slice(0, 8) : SOIL_PEBBLES
  const branches = narrow ? ROOT_BRANCHES.slice(0, 4) : ROOT_BRANCHES

  return (
    <svg viewBox={`0 0 ${900} 1000`} className="h-full w-full text-ink" fill="none" aria-hidden="true" focusable="false">
      <motion.g style={{ opacity: seedFade }}>
        <Seed progress={progress} from={{ x: 372, y: 250 }} to={{ x: 402, y: 566 }} delay={0.002} rotate={-42} />
        <Seed progress={progress} from={{ x: 470, y: 210 }} to={{ x: 448, y: 572 }} delay={0.016} rotate={36} />
        <Seed progress={progress} from={{ x: 540, y: 300 }} to={{ x: 506, y: 560 }} delay={0.03} rotate={64} />
      </motion.g>

      <motion.g style={{ filter: allowBlur ? bgFilter : undefined, opacity: bgOpacity, y: bgY }}>
        <g opacity={0.85}>
          {dashes.map((dash, index) => (
            <path
              key={index}
              d={`M${dash.x.toFixed(1)} ${dash.y.toFixed(1)} l ${dash.len.toFixed(1)} ${dash.slope.toFixed(1)}`}
              stroke="currentColor"
              strokeWidth={1}
              opacity={dash.opacity}
            />
          ))}
          {pebbles.map((pebble, index) => (
            <circle key={index} cx={pebble.x} cy={pebble.y} r={pebble.r} stroke="currentColor" strokeWidth={1} opacity={pebble.opacity} />
          ))}
          <path d="M0 660 C 150 652 300 668 450 660 C 600 652 750 668 900 660" stroke="currentColor" strokeWidth={1} opacity={0.05} />
          <path d="M0 800 C 150 792 300 808 450 800 C 600 792 750 808 900 800" stroke="currentColor" strokeWidth={1} opacity={0.04} />
        </g>

        <motion.g style={{ opacity: surfaceOpacity }}>
          <path
            d="M0 560 C 40 557 75 564 110 560 C 150 556 170 565 210 561 C 250 557 285 564 320 560 C 360 556 400 565 450 561 C 500 557 540 564 580 560 C 620 556 660 565 700 560 C 740 556 780 563 820 559 C 860 556 880 563 900 560"
            stroke="currentColor"
            strokeWidth={2.2}
            strokeLinecap="round"
          />
          <path
            d="M0 570 C 60 567 120 573 180 569 C 260 565 320 573 380 569 C 460 565 520 573 580 569 C 660 565 720 572 780 569 C 830 566 870 572 900 569"
            stroke="currentColor"
            strokeWidth={1}
            opacity={0.35}
          />
          <g stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" opacity={0.5}>
            <path d="M168 559 C 166 548 162 542 158 538" />
            <path d="M174 559 C 175 549 178 542 183 537" />
            <path d="M306 560 C 304 551 300 545 296 541" />
            <path d="M312 560 C 314 550 317 544 321 540" />
            <path d="M622 560 C 620 551 616 545 612 541" />
            <path d="M628 560 C 630 550 633 544 637 540" />
            <path d="M778 560 C 776 551 772 546 768 542" />
            <path d="M784 560 C 786 550 789 545 793 541" />
          </g>
        </motion.g>

        <motion.g className="pivot-origin" style={{ transform: bulbTransform, opacity: bulbOpacity }}>
          <path
            d="M450 586 C 428 594 412 612 406 640 C 398 676 408 712 434 728 C 442 733 458 733 466 728 C 492 712 502 676 494 640 C 488 612 472 594 450 586 Z"
            stroke="currentColor"
            strokeWidth={2.2}
            strokeLinejoin="round"
          />
          <g stroke="currentColor" strokeWidth={1} strokeLinecap="round" opacity={0.55}>
            <path d="M424 634 C 418 664 420 694 432 716" />
            <path d="M436 628 C 432 664 434 698 443 720" />
            <path d="M450 624 C 450 660 450 694 450 722" />
            <path d="M464 628 C 468 664 466 698 457 720" />
            <path d="M476 634 C 482 664 480 694 468 716" />
            <path d="M444 596 C 446 606 454 606 456 596" />
            <path d="M450 586 C 450 596 450 604 450 612" />
          </g>
        </motion.g>

        {ROOTS.map((root) => (
          <Root key={root.d} progress={progress} d={root.d} start={root.start} />
        ))}
        {branches.map((root) => (
          <Root key={root.d} progress={progress} d={root.d} start={root.start} />
        ))}

        <motion.path
          d="M450 588 C 447 500 453 420 450 318"
          stroke="currentColor"
          strokeWidth={2.6}
          strokeLinecap="round"
          style={{ pathLength: stemLength, opacity: stemOpacity }}
        />

        {LEAVES.map((leaf) => (
          <Leaf key={leaf.blade} progress={progress} leaf={leaf} />
        ))}
      </motion.g>

    </svg>
  )
}

export function BirthHead({ progress, narrow = false }: BirthLayerProps) {
  const stubOpacity = useTransform(progress, [0.3, 0.37], [0, 1])
  const headY = useTransform(progress, (p) => -36 * easeOutCubic(seg(p, 0.72, 0.8)))
  const cutLength = useTransform(progress, [0.72, 0.765], [0, 1])
  const cutOpacity = useTransform(progress, [0.72, 0.735, 0.79, 0.83], [0, 1, 1, 0])
  const pedicelLength = useTransform(progress, (p) => 1 - 0.3 * easeOutCubic(seg(p, 0.72, 0.78)))
  const sepalOpacity = useTransform(progress, [0.58, 0.66, 0.72, 0.8], [0, 1, 1, 0.85])
  const motes = narrow ? DUST.slice(0, 4) : DUST

  return (
    <svg viewBox={`0 0 ${900} 1000`} className="h-full w-full text-ink" fill="none" aria-hidden="true" focusable="false">
      <motion.g style={{ y: headY }}>
        <motion.path
          d="M450 318 L450 252"
          stroke="currentColor"
          strokeWidth={2.6}
          strokeLinecap="round"
          style={{ pathLength: pedicelLength, opacity: stubOpacity }}
        />
        <motion.path
          d="M436 312 L464 312"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeDasharray="4 5"
          style={{ pathLength: cutLength, opacity: cutOpacity }}
        />

        {PETAL_ANGLES.map((angle, index) => (
          <BloomPetal key={angle} progress={progress} angle={angle} index={index} />
        ))}

        <Bud progress={progress} />

        <motion.g style={{ opacity: sepalOpacity }}>
          <path d="M419 262 C 433 286 442 298 450 305" stroke="currentColor" strokeWidth={1.7} fill="none" strokeLinecap="round" />
          <path d="M481 262 C 467 286 458 298 450 305" stroke="currentColor" strokeWidth={1.7} fill="none" strokeLinecap="round" />
          <path d="M450 256 C 448 278 449 294 450 305" stroke="currentColor" strokeWidth={1.7} fill="none" strokeLinecap="round" />
        </motion.g>

        <Heart progress={progress} />
      </motion.g>

      <g className="text-ink">
        {motes.map((mote) => (
          <Dust key={`${mote.x}-${mote.y}`} progress={progress} mote={mote} />
        ))}
      </g>
    </svg>
  )
}
