import {
  HEART_CORE,
  HEART_DOT,
  PISTIL,
  PISTIL_LASH_LEFT,
  PISTIL_LASH_RIGHT,
  PISTIL_STIGMA,
  STAMEN_ANGLES,
  STAMEN_ANTHER,
  STAMEN_FILAMENT,
} from "@/lib/lily-paths"

export function FlowerHeart({ className, width, height }: { className?: string; width?: number | string; height?: number | string }) {
  return (
    <svg viewBox="0 0 240 240" fill="none" width={width} height={height} className={className} aria-hidden="true" focusable="false">
      {STAMEN_ANGLES.map((angle) => (
        <g key={angle} transform={`rotate(${angle} 120 120)`}>
          <path d={STAMEN_FILAMENT} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
          <ellipse
            cx={STAMEN_ANTHER.cx}
            cy={STAMEN_ANTHER.cy}
            rx={STAMEN_ANTHER.rx}
            ry={STAMEN_ANTHER.ry}
            stroke="currentColor"
            strokeWidth={1.4}
          />
        </g>
      ))}

      <path d={PISTIL} stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" />
      <path d={PISTIL_LASH_LEFT} stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" />
      <path d={PISTIL_LASH_RIGHT} stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" />
      <circle cx={PISTIL_STIGMA.cx} cy={PISTIL_STIGMA.cy} r={PISTIL_STIGMA.r} stroke="currentColor" strokeWidth={1.3} />

      <circle cx={HEART_CORE.cx} cy={HEART_CORE.cy} r={HEART_CORE.r} stroke="currentColor" strokeWidth={1.6} />
      <circle cx={HEART_DOT.cx} cy={HEART_DOT.cy} r={HEART_DOT.r} fill="currentColor" />
    </svg>
  )
}
