export const CARD_SIZE = { width: 1080, height: 1920 } as const

export const CARD = {
  frameInset: 54,
  kicker: { y: 178, size: 25, tracking: 11, weight: 500 },
  toLine: { y: 254, size: 46 },
  divider: { y: 1352 },
  message: { top: 1424, bottom: 1700, maxWidth: 860, minSize: 30, maxSize: 56, lineHeight: 1.45 },
  sender: { y: 1774, size: 32 },
} as const

export type CardThemeId = "paper" | "ink"

export type CardTheme = {
  background: string
  ink: string
  soft: string
  frameOpacity: number
}

export const CARD_THEMES: Record<CardThemeId, CardTheme> = {
  paper: {
    background: "#f4f3ef",
    ink: "#191a1d",
    soft: "rgba(25, 26, 29, 0.62)",
    frameOpacity: 0.55,
  },
  ink: {
    background: "#191a1d",
    ink: "#f4f3ef",
    soft: "rgba(244, 243, 239, 0.66)",
    frameOpacity: 0.6,
  },
}

export const DISPLAY_FAMILY = '"Cormorant Garamond", Georgia, serif'
export const SANS_FAMILY = '"Inter Variable", ui-sans-serif, system-ui, sans-serif'

export type CardTextLine = {
  text: string
  font: "display" | "sans"
  size: number
  italic?: boolean
  weight?: number
  tracking?: number
  tone?: "ink" | "soft"
  y: number
}

export type Measure = (text: string, font: string) => number

export function fontString(line: Pick<CardTextLine, "font" | "size" | "italic" | "weight">) {
  const family = line.font === "display" ? DISPLAY_FAMILY : SANS_FAMILY
  return `${line.italic ? "italic " : ""}${line.weight ?? 400} ${line.size}px ${family}`
}

let measurer: CanvasRenderingContext2D | null = null

export function measureText(text: string, font: string) {
  if (!measurer) {
    measurer = document.createElement("canvas").getContext("2d")
  }
  if (!measurer) return text.length * 0.5 * (Number.parseInt(font.match(/(\d+)px/)?.[1] ?? "16", 10) || 16)
  measurer.font = font
  return measurer.measureText(text).width
}

function wrapParagraph(text: string, maxWidth: number, font: string, measure: Measure): string[] {
  const words = text.split(/\s+/).filter(Boolean)
  if (words.length === 0) return []
  const lines: string[] = []
  let current = words[0]
  for (let i = 1; i < words.length; i += 1) {
    const candidate = `${current} ${words[i]}`
    if (measure(candidate, font) <= maxWidth) {
      current = candidate
    } else {
      lines.push(current)
      current = words[i]
    }
  }
  lines.push(current)
  return lines
}

export type CardLayout = {
  lines: CardTextLine[]
  messageSize: number
  tracked: Array<{ line: CardTextLine; xs: number[] }>
}

export function trackedXs(text: string, font: string, tracking: number, centerX: number, measure: Measure) {
  const widths = Array.from(text).map((char) => measure(char, font))
  const total = widths.reduce((sum, width) => sum + width, 0) + tracking * Math.max(0, text.length - 1)
  let x = centerX - total / 2
  return widths.map((width) => {
    const current = x
    x += width + tracking
    return current
  })
}

type BuildOptions = {
  kicker: string
  toLine: string
  message: string
  sender: string
  centerX?: number
  measure?: Measure
}

export function buildCardLayout({ kicker, toLine, message, sender, centerX = CARD_SIZE.width / 2, measure = measureText }: BuildOptions): CardLayout {
  const center = centerX
  const lines: CardTextLine[] = []
  const tracked: CardLayout["tracked"] = []

  const kickerLine: CardTextLine = {
    text: kicker.toUpperCase(),
    font: "sans",
    size: CARD.kicker.size,
    weight: CARD.kicker.weight,
    tracking: CARD.kicker.tracking,
    tone: "ink",
    y: CARD.kicker.y,
  }
  lines.push(kickerLine)
  tracked.push({
    line: kickerLine,
    xs: trackedXs(kickerLine.text, fontString(kickerLine), kickerLine.tracking ?? 0, center, measure),
  })

  lines.push({ text: toLine, font: "display", size: CARD.toLine.size, italic: true, weight: 400, tone: "soft", y: CARD.toLine.y })

  const paragraphs = message
    .split("\n")
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0)

  let messageSize: number = CARD.message.minSize
  let messageLines: string[] = []

  for (let size = CARD.message.maxSize; size >= CARD.message.minSize; size -= 2) {
    const font = fontString({ font: "display", size, weight: 500 })
    const wrapped: string[] = []
    paragraphs.forEach((paragraph, index) => {
      if (index > 0) wrapped.push("")
      wrapped.push(...wrapParagraph(paragraph, CARD.message.maxWidth, font, measure))
    })
    const lineHeight = size * CARD.message.lineHeight
    const height = size + (wrapped.length - 1) * lineHeight
    messageSize = size
    messageLines = wrapped
    if (CARD.message.top + height <= CARD.message.bottom) break
  }

  const lineHeight = messageSize * CARD.message.lineHeight

  messageLines.forEach((text, index) => {
    lines.push({
      text,
      font: "display",
      size: messageSize,
      weight: 500,
      tone: "ink",
      y: CARD.message.top + messageSize + index * lineHeight,
    })
  })

  lines.push({ text: sender, font: "display", size: CARD.sender.size, italic: true, weight: 400, tone: "soft", y: CARD.sender.y })

  return { lines, messageSize, tracked }
}
