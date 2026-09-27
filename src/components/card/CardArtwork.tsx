import type { Ref } from "react"

import { CARD, CARD_SIZE } from "@/lib/card"
import {
  HEART_CORE,
  HEART_DOT,
  PETAL_OUTLINE,
  PETAL_VEINS,
  PISTIL,
  PISTIL_LASH_LEFT,
  PISTIL_LASH_RIGHT,
  PISTIL_STIGMA,
  STAMEN_ANGLES,
  STAMEN_ANTHER,
  STAMEN_FILAMENT,
  STEM_LEAF_LEFT,
  STEM_LEAF_LEFT_VEIN,
  STEM_LEAF_RIGHT,
  STEM_LEAF_RIGHT_VEIN,
  STEM_PATH,
} from "@/lib/lily-paths"
import { PETAL_ANGLES } from "@/lib/flower"

type CardArtworkProps = {
  ink: string
  frameOpacity?: number
  className?: string
  ref?: Ref<SVGSVGElement>
}

const FLOWER = { cx: 540, cy: 676 }
const PETAL_SCALE = 1.06
const HEART_SCALE = 0.72
const STEM_SCALE = 1.35

const STEM_PLACEMENT = {
  x: FLOWER.cx - 130 * STEM_SCALE,
  y: 678,
}

function leafTransform(baseX: number, baseY: number, targetX: number, targetY: number, rotate: number, scale: number) {
  return `translate(${targetX} ${targetY}) rotate(${rotate}) scale(${scale}) translate(${-baseX} ${-baseY})`
}

const LEFT_LEAF = leafTransform(128, 168, 534, 985, -14, 1.75)
const RIGHT_LEAF = leafTransform(127, 296, 542, 1092, 14, 1.75)

export function CardArtwork({ ink, frameOpacity = 0.55, className, ref }: CardArtworkProps) {
  const inset = CARD.frameInset

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${CARD_SIZE.width} ${CARD_SIZE.height}`}
      className={className}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <rect
        x={inset}
        y={inset}
        width={CARD_SIZE.width - inset * 2}
        height={CARD_SIZE.height - inset * 2}
        stroke={ink}
        strokeOpacity={frameOpacity}
        strokeWidth={1.8}
      />
      <rect
        x={inset + 11}
        y={inset + 11}
        width={CARD_SIZE.width - (inset + 11) * 2}
        height={CARD_SIZE.height - (inset + 11) * 2}
        stroke={ink}
        strokeOpacity={frameOpacity * 0.55}
        strokeWidth={0.9}
      />

      <g transform={`translate(${STEM_PLACEMENT.x.toFixed(1)} ${STEM_PLACEMENT.y.toFixed(1)}) scale(${STEM_SCALE})`}>
        <path d={STEM_PATH} stroke={ink} strokeWidth={2.1} strokeLinecap="round" />
      </g>
      <g transform={LEFT_LEAF}>
        <path d={STEM_LEAF_LEFT} stroke={ink} strokeWidth={1.5} strokeLinejoin="round" />
        <path d={STEM_LEAF_LEFT_VEIN} stroke={ink} strokeWidth={1} strokeLinecap="round" strokeOpacity={0.6} />
      </g>
      <g transform={RIGHT_LEAF}>
        <path d={STEM_LEAF_RIGHT} stroke={ink} strokeWidth={1.5} strokeLinejoin="round" />
        <path d={STEM_LEAF_RIGHT_VEIN} stroke={ink} strokeWidth={1} strokeLinecap="round" strokeOpacity={0.6} />
      </g>

      {PETAL_ANGLES.map((angle) => (
        <g key={angle} transform={`rotate(${angle} ${FLOWER.cx} ${FLOWER.cy})`}>
          <g
            transform={`translate(${FLOWER.cx - 120 * PETAL_SCALE} ${FLOWER.cy - 360 * PETAL_SCALE}) scale(${PETAL_SCALE})`}
          >
            <path d={PETAL_OUTLINE} stroke={ink} strokeWidth={1.9} strokeLinejoin="round" strokeLinecap="round" />
            <g stroke={ink} strokeWidth={1.2} strokeLinecap="round" strokeOpacity={0.6}>
              {PETAL_VEINS.map((d) => (
                <path key={d} d={d} />
              ))}
            </g>
          </g>
        </g>
      ))}

      <g
        transform={`translate(${FLOWER.cx - 120 * HEART_SCALE} ${FLOWER.cy - 120 * HEART_SCALE}) scale(${HEART_SCALE})`}
      >
        {STAMEN_ANGLES.map((angle) => (
          <g key={angle} transform={`rotate(${angle} 120 120)`}>
            <path d={STAMEN_FILAMENT} stroke={ink} strokeWidth={1.9} strokeLinecap="round" />
            <ellipse
              cx={STAMEN_ANTHER.cx}
              cy={STAMEN_ANTHER.cy}
              rx={STAMEN_ANTHER.rx}
              ry={STAMEN_ANTHER.ry}
              stroke={ink}
              strokeWidth={1.7}
            />
          </g>
        ))}
        <path d={PISTIL} stroke={ink} strokeWidth={2.1} strokeLinecap="round" />
        <path d={PISTIL_LASH_LEFT} stroke={ink} strokeWidth={1.7} strokeLinecap="round" />
        <path d={PISTIL_LASH_RIGHT} stroke={ink} strokeWidth={1.7} strokeLinecap="round" />
        <circle cx={PISTIL_STIGMA.cx} cy={PISTIL_STIGMA.cy} r={PISTIL_STIGMA.r} stroke={ink} strokeWidth={1.6} />
        <circle cx={HEART_CORE.cx} cy={HEART_CORE.cy} r={HEART_CORE.r} stroke={ink} strokeWidth={1.9} />
        <circle cx={HEART_DOT.cx} cy={HEART_DOT.cy} r={HEART_DOT.r} fill={ink} />
      </g>

      <path
        d="M360 1292 C 420 1288 480 1295 540 1292 C 600 1289 660 1295 720 1292"
        stroke={ink}
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeOpacity={0.3}
      />
      <g fill={ink} fillOpacity={0.24}>
        <circle cx={432} cy={1295} r={2.6} />
        <circle cx={498} cy={1296} r={1.9} />
        <circle cx={592} cy={1296} r={2.2} />
        <circle cx={664} cy={1295} r={1.7} />
      </g>

      <g stroke={ink} strokeWidth={1.1} strokeOpacity={0.5}>
        <path d={`M380 ${CARD.divider.y} H 498`} strokeLinecap="round" />
        <path d={`M582 ${CARD.divider.y} H 700`} strokeLinecap="round" />
      </g>
      <path
        d={`M540 ${CARD.divider.y - 7} L 547 ${CARD.divider.y} L 540 ${CARD.divider.y + 7} L 533 ${CARD.divider.y} Z`}
        stroke={ink}
        strokeWidth={1.2}
        strokeLinejoin="round"
      />
    </svg>
  )
}
