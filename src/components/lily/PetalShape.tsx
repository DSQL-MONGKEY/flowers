import { PETAL_OUTLINE, PETAL_VEINS } from "@/lib/lily-paths"

type PetalShapeProps = {
  className?: string
  strokeWidth?: number
  veinOpacity?: number
  filled?: boolean
  width?: number | string
  height?: number | string
}

export function PetalShape({ className, strokeWidth = 2.1, veinOpacity = 0.7, filled = false, width, height }: PetalShapeProps) {
  return (
    <svg viewBox="0 0 240 360" fill="none" width={width} height={height} className={className} aria-hidden="true" focusable="false">
      <path
        d={PETAL_OUTLINE}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        strokeLinecap="round"
        fill={filled ? "var(--color-paper)" : "none"}
        style={{ transition: "fill 500ms ease" }}
      />
      <g stroke="currentColor" strokeWidth={strokeWidth * 0.68} strokeLinecap="round" strokeOpacity={veinOpacity}>
        {PETAL_VEINS.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
    </svg>
  )
}
