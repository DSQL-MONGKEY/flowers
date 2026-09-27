export const VIEWBOX = { width: 900, height: 1000 } as const

export const GROUND_Y = 560

export const FLOWER_CENTER = { x: 450, y: 248 } as const

export const ZOOM_STAGE = {
  start: 0.72,
  end: 0.86,
  scale: 1.45,
  center: { x: 450, y: 460 },
} as const

export type BirthStageId =
  | "bumi"
  | "umbi"
  | "akar"
  | "tunas"
  | "kuncup"
  | "mekar"
  | "dipetik"
  | "anatomi"

export const BIRTH_STAGES: Array<{ id: BirthStageId; start: number; end: number }> = [
  { id: "bumi", start: 0, end: 0.1 },
  { id: "umbi", start: 0.1, end: 0.17 },
  { id: "akar", start: 0.17, end: 0.3 },
  { id: "tunas", start: 0.3, end: 0.45 },
  { id: "kuncup", start: 0.45, end: 0.6 },
  { id: "mekar", start: 0.6, end: 0.72 },
  { id: "dipetik", start: 0.72, end: 0.86 },
  { id: "anatomi", start: 0.86, end: 1 },
]

export type AnatomyId = "petal" | "stamen" | "pistil" | "sepal" | "receptacle" | "peduncle" | "ovule"

export type AnatomyPart = {
  id: AnatomyId
  index: number
  anchor: { x: number; y: number }
  chip: { x: number; y: number; side: "left" | "right" }
  elbow: { x: number; y: number }
  dot?: { dx: number; dy: number }
}

export const ANATOMY_PARTS: AnatomyPart[] = [
  { id: "pistil", index: 1, anchor: { x: 450, y: 222 }, chip: { x: 150, y: 285, side: "left" }, elbow: { x: 330, y: 285 }, dot: { dx: -4, dy: -24 } },
  { id: "stamen", index: 2, anchor: { x: 474, y: 228 }, chip: { x: 750, y: 325, side: "right" }, elbow: { x: 570, y: 325 }, dot: { dx: 24, dy: -14 } },
  { id: "sepal", index: 3, anchor: { x: 428, y: 292 }, chip: { x: 150, y: 470, side: "left" }, elbow: { x: 330, y: 470 }, dot: { dx: -26, dy: 4 } },
  { id: "receptacle", index: 4, anchor: { x: 468, y: 290 }, chip: { x: 750, y: 485, side: "right" }, elbow: { x: 570, y: 485 }, dot: { dx: 26, dy: -4 } },
  { id: "petal", index: 5, anchor: { x: 330, y: 352 }, chip: { x: 150, y: 655, side: "left" }, elbow: { x: 330, y: 655 } },
  { id: "ovule", index: 6, anchor: { x: 430, y: 300 }, chip: { x: 750, y: 645, side: "right" }, elbow: { x: 570, y: 645 }, dot: { dx: -6, dy: 26 } },
  { id: "peduncle", index: 7, anchor: { x: 462, y: 340 }, chip: { x: 750, y: 805, side: "right" }, elbow: { x: 570, y: 805 }, dot: { dx: 4, dy: 28 } },
]

export function clamp01(value: number) {
  return value < 0 ? 0 : value > 1 ? 1 : value
}

export function seg(progress: number, start: number, end: number) {
  return clamp01((progress - start) / (end - start))
}

export function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3
}

export function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2
}

export function pivot(x: number, y: number, rotate = 0, scale = 1) {
  return `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px) rotate(${rotate.toFixed(3)}deg) scale(${scale.toFixed(4)}) translate(${(-x).toFixed(2)}px, ${(-y).toFixed(2)}px)`
}

export function zoomedPoint(point: { x: number; y: number }, t: number) {
  const s = 1 + (ZOOM_STAGE.scale - 1) * t
  const offsetX = (ZOOM_STAGE.center.x - FLOWER_CENTER.x) * t
  const offsetY = (ZOOM_STAGE.center.y - FLOWER_CENTER.y) * t
  return {
    x: FLOWER_CENTER.x + (point.x - FLOWER_CENTER.x) * s + offsetX,
    y: FLOWER_CENTER.y + (point.y - FLOWER_CENTER.y) * s + offsetY,
  }
}

export function zoomTransform(t: number) {
  const s = 1 + (ZOOM_STAGE.scale - 1) * t
  const offsetY = (ZOOM_STAGE.center.y - FLOWER_CENTER.y) * t
  return `translate(0px, ${offsetY.toFixed(2)}px) scale(${s.toFixed(4)})`
}

export const ZOOM_ORIGIN = `${FLOWER_CENTER.x}px ${FLOWER_CENTER.y}px`
