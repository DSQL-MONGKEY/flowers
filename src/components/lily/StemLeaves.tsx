import {
  STEM_LEAF_LEFT,
  STEM_LEAF_LEFT_VEIN,
  STEM_LEAF_RIGHT,
  STEM_LEAF_RIGHT_VEIN,
  STEM_PATH,
} from "@/lib/lily-paths"

export function StemLeaves({ className, opacity = 0.2 }: { className?: string; opacity?: number }) {
  return (
    <svg
      viewBox="0 0 260 460"
      fill="none"
      className={className}
      style={{ opacity }}
      aria-hidden="true"
      focusable="false"
    >
      <path d={STEM_PATH} stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" />

      <path d={STEM_LEAF_LEFT} stroke="currentColor" strokeWidth={1.8} strokeLinejoin="round" />
      <path d={STEM_LEAF_LEFT_VEIN} stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" />

      <path d={STEM_LEAF_RIGHT} stroke="currentColor" strokeWidth={1.8} strokeLinejoin="round" />
      <path d={STEM_LEAF_RIGHT_VEIN} stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" />
    </svg>
  )
}
