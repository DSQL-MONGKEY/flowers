import type { Ref } from "react"

import { CardArtwork } from "@/components/card/CardArtwork"
import { CARD_SIZE, CARD_THEMES, DISPLAY_FAMILY, SANS_FAMILY, type CardLayout, type CardThemeId } from "@/lib/card"
import { cn } from "@/lib/utils"

type CardPreviewProps = {
  theme: CardThemeId
  layout: CardLayout
  artworkRef?: Ref<SVGSVGElement>
  className?: string
}

export function CardPreview({ theme, layout, artworkRef, className }: CardPreviewProps) {
  const tokens = CARD_THEMES[theme]

  return (
    <div
      role="img"
      aria-label="Pratinjau kartu ucapan"
      className={cn(
        "relative aspect-[9/16] w-full overflow-hidden rounded-[3px] border border-line/15 shadow-[0_36px_90px_-60px_rgba(20,20,22,0.65)]",
        className,
      )}
      style={{ backgroundColor: tokens.background }}
    >
      <CardArtwork
        ref={artworkRef}
        ink={tokens.ink}
        frameOpacity={tokens.frameOpacity}
        className="absolute inset-0 h-full w-full"
      />

      <svg viewBox={`0 0 ${CARD_SIZE.width} ${CARD_SIZE.height}`} className="absolute inset-0 h-full w-full" aria-hidden="true">
        {layout.lines.map((line, index) => {
          if (!line.text) return null
          const color = line.tone === "soft" ? tokens.soft : tokens.ink
          const family = line.font === "display" ? DISPLAY_FAMILY : SANS_FAMILY
          const tracked = layout.tracked.find((entry) => entry.line === line)

          if (tracked) {
            return (
              <g key={index}>
                {Array.from(line.text).map((char, charIndex) => (
                  <text
                    key={charIndex}
                    x={tracked.xs[charIndex]}
                    y={line.y}
                    fill={color}
                    fontFamily={family}
                    fontSize={line.size}
                    fontWeight={line.weight}
                    fontStyle={line.italic ? "italic" : undefined}
                  >
                    {char}
                  </text>
                ))}
              </g>
            )
          }

          return (
            <text
              key={index}
              x={CARD_SIZE.width / 2}
              y={line.y}
              fill={color}
              fontFamily={family}
              fontSize={line.size}
              fontWeight={line.weight}
              fontStyle={line.italic ? "italic" : undefined}
              textAnchor="middle"
            >
              {line.text}
            </text>
          )
        })}
      </svg>
    </div>
  )
}
