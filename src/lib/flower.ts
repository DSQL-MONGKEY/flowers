export const PETAL = { width: 240, height: 360 } as const

export const FLOWER_BOX = { width: 620, height: 740 } as const

export const PETAL_ANGLES = [0, 60, 120, 180, 240, 300] as const

export const PETAL_COUNT = PETAL_ANGLES.length

export type PetalStatus = "idle" | "revealed" | "falling"
