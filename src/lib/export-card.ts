import { CARD_SIZE, CARD_THEMES, fontString, type CardLayout, type CardThemeId } from "@/lib/card"

export async function ensureCardFonts() {
  if (typeof document === "undefined" || !("fonts" in document)) return
  const loads = [
    '500 56px "Cormorant Garamond"',
    'italic 400 46px "Cormorant Garamond"',
    '500 25px "Inter Variable"',
  ]
  try {
    await Promise.all(loads.map((font) => document.fonts.load(font, "AaBbUlang")))
    await document.fonts.ready
  } catch {
    // continue with whatever fonts are available
  }
}

function serializeArtwork(node: SVGSVGElement) {
  const clone = node.cloneNode(true) as SVGSVGElement
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg")
  clone.setAttribute("width", String(CARD_SIZE.width))
  clone.setAttribute("height", String(CARD_SIZE.height))
  clone.removeAttribute("class")
  return new XMLSerializer().serializeToString(clone)
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error("ilustrasi gagal dimuat"))
    image.src = src
  })
}

export type RenderCardOptions = {
  theme: CardThemeId
  layout: CardLayout
  artwork: SVGSVGElement | null
}

export async function renderCardPng({ theme, layout, artwork }: RenderCardOptions) {
  await ensureCardFonts()

  const canvas = document.createElement("canvas")
  canvas.width = CARD_SIZE.width
  canvas.height = CARD_SIZE.height
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("canvas tidak tersedia")

  const tokens = CARD_THEMES[theme]
  ctx.fillStyle = tokens.background
  ctx.fillRect(0, 0, CARD_SIZE.width, CARD_SIZE.height)

  if (artwork) {
    const svgUrl = URL.createObjectURL(new Blob([serializeArtwork(artwork)], { type: "image/svg+xml;charset=utf-8" }))
    try {
      const image = await loadImage(svgUrl)
      ctx.drawImage(image, 0, 0, CARD_SIZE.width, CARD_SIZE.height)
    } finally {
      URL.revokeObjectURL(svgUrl)
    }
  }

  const trackedXsByLine = new Map(layout.tracked.map((entry) => [entry.line, entry.xs]))

  for (const line of layout.lines) {
    if (!line.text) continue
    ctx.font = fontString(line)
    ctx.textBaseline = "alphabetic"
    ctx.fillStyle = line.tone === "soft" ? tokens.soft : tokens.ink

    const xs = trackedXsByLine.get(line)
    if (xs) {
      ctx.textAlign = "left"
      Array.from(line.text).forEach((char, index) => ctx.fillText(char, xs[index] ?? CARD_SIZE.width / 2, line.y))
    } else {
      ctx.textAlign = "center"
      ctx.fillText(line.text, CARD_SIZE.width / 2, line.y)
    }
  }

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"))
  if (!blob) throw new Error("gagal membuat PNG")
  return blob
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 4000)
}

export async function shareOrDownloadCard(
  blob: Blob,
  filename: string,
  shareTitle: string,
  shareText: string,
): Promise<"shared" | "downloaded" | "cancelled"> {
  const file = new File([blob], filename, { type: "image/png" })
  const nav = navigator as Navigator & { canShare?: (data: ShareData) => boolean }

  if (typeof navigator.share === "function" && nav.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: shareTitle, text: shareText })
      return "shared"
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return "cancelled"
    }
  }

  downloadBlob(blob, filename)
  return "downloaded"
}
