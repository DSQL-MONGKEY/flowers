import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Download, Loader2, RotateCcw, Share2 } from "lucide-react"

import { CardPreview } from "@/components/card/CardPreview"
import AnimatedContent from "@/components/reactbits/AnimatedContent"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { content } from "@/content"
import { CARD_THEMES, buildCardLayout, type CardThemeId } from "@/lib/card"
import { downloadBlob, ensureCardFonts, renderCardPng, shareOrDownloadCard } from "@/lib/export-card"
import { cn } from "@/lib/utils"

const MAX_MESSAGE = 300

type Status = "idle" | "generating" | "shared" | "downloaded" | "cancelled" | "error"

function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
  return slug || "kartu"
}

export function CardStudio({ onReplay }: { onReplay: () => void }) {
  const [theme, setTheme] = useState<CardThemeId>("paper")
  const [to, setTo] = useState<string>(content.recipient)
  const [message, setMessage] = useState<string>(content.card.defaultMessage)
  const [from, setFrom] = useState<string>(content.card.defaultFrom)
  const [status, setStatus] = useState<Status>("idle")
  const [, setFontsReady] = useState(false)
  const artworkRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    let alive = true
    void ensureCardFonts().then(() => {
      if (alive) setFontsReady(true)
    })
    return () => {
      alive = false
    }
  }, [])

  const layout = useMemo(
    () =>
      buildCardLayout({
        kicker: content.card.kickerTop,
        toLine: `${content.card.toPrefix} ${to.trim() || content.recipient}`,
        message: message.trim() || content.card.defaultMessage,
        sender: `${content.card.fromPrefix} ${from.trim() || content.card.defaultFrom}`,
      }),
    [to, message, from],
  )

  const busy = status === "generating"

  const handleReset = useCallback(() => {
    setTo(content.recipient)
    setMessage(content.card.defaultMessage)
    setFrom(content.card.defaultFrom)
    setStatus("idle")
  }, [])

  const handleDownload = useCallback(async () => {
    setStatus("generating")
    try {
      const blob = await renderCardPng({ theme, layout, artwork: artworkRef.current })
      downloadBlob(blob, `ucapan-untuk-${slugify(to)}.png`)
      setStatus("downloaded")
    } catch {
      setStatus("error")
    }
  }, [theme, layout, to])

  const handleShare = useCallback(async () => {
    setStatus("generating")
    try {
      const blob = await renderCardPng({ theme, layout, artwork: artworkRef.current })
      const summary = (message.trim() || content.card.defaultMessage).slice(0, 220)
      const result = await shareOrDownloadCard(
        blob,
        `ucapan-untuk-${slugify(to)}.png`,
        content.card.shareTitle,
        summary,
      )
      setStatus(result)
    } catch {
      setStatus("error")
    }
  }, [theme, layout, to, message])

  const statusText =
    status === "generating"
      ? content.card.generating
      : status === "shared"
        ? content.card.shared
        : status === "downloaded"
          ? content.card.downloaded
          : status === "cancelled"
            ? content.card.cancelled
            : status === "error"
              ? content.card.error
              : ""

  return (
    <section id="card" aria-label="Studio kartu ucapan" className="relative px-6 pb-[12svh] pt-[14svh]">
      <div className="mx-auto w-full max-w-5xl">
        <div className="text-center">
          <AnimatedContent distance={28} duration={1} threshold={0.15}>
            <p className="text-[10px] uppercase tracking-[0.5em] text-ink-soft/70">{content.card.kicker}</p>
          </AnimatedContent>
          <AnimatedContent distance={32} duration={1.1} threshold={0.15} delay={0.05}>
            <h2 className="mt-5 font-display text-[clamp(1.9rem,4.6vw,3.2rem)] font-medium leading-tight text-ink">
              {content.card.title}
            </h2>
          </AnimatedContent>
          <AnimatedContent distance={24} duration={1} threshold={0.15} delay={0.1}>
            <p className="mx-auto mt-4 max-w-xl font-display text-base italic leading-relaxed text-ink-soft">
              {content.card.subtitle}
            </p>
          </AnimatedContent>
        </div>

        <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start lg:gap-16">
          <AnimatedContent
            distance={40}
            duration={1.1}
            threshold={0.1}
            className="mx-auto w-full max-w-[330px] lg:max-w-[380px]"
          >
            <CardPreview theme={theme} layout={layout} artworkRef={artworkRef} />
            <p className="mt-4 text-center text-[9px] uppercase tracking-[0.3em] text-ink-soft/60">
              {content.card.hint}
            </p>
          </AnimatedContent>

          <AnimatedContent distance={30} duration={1.1} threshold={0.1} delay={0.1} className="space-y-7">
            <div role="group" aria-label="Tema kartu" className="inline-flex rounded-full border border-line/20 p-1">
              {(Object.keys(CARD_THEMES) as CardThemeId[]).map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTheme(id)}
                  aria-pressed={theme === id}
                  className={cn(
                    "rounded-full px-5 py-2 text-[10px] uppercase tracking-[0.28em] transition-colors duration-300",
                    theme === id ? "bg-ink text-paper" : "text-ink-soft hover:text-ink",
                  )}
                >
                  {content.card.themes[id]}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="card-to" className="text-[10px] uppercase tracking-[0.3em] text-ink-soft/80">
                {content.card.toLabel}
              </Label>
              <Input
                id="card-to"
                value={to}
                maxLength={28}
                onChange={(event) => setTo(event.target.value)}
                className="h-11 rounded-xl border-line/20 bg-transparent"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <Label htmlFor="card-message" className="text-[10px] uppercase tracking-[0.3em] text-ink-soft/80">
                  {content.card.messageLabel}
                </Label>
                <span className="text-[10px] tabular-nums text-ink-soft/50">
                  {message.length}/{MAX_MESSAGE}
                </span>
              </div>
              <Textarea
                id="card-message"
                value={message}
                maxLength={MAX_MESSAGE}
                rows={5}
                placeholder={content.card.messagePlaceholder}
                onChange={(event) => setMessage(event.target.value)}
                className="rounded-xl border-line/20 bg-transparent font-display text-base leading-relaxed"
              />
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.25em] text-ink-soft/70 transition-colors hover:text-ink"
              >
                <RotateCcw className="size-3" />
                {content.card.reset}
              </button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="card-from" className="text-[10px] uppercase tracking-[0.3em] text-ink-soft/80">
                {content.card.fromLabel}
              </Label>
              <Input
                id="card-from"
                value={from}
                maxLength={28}
                placeholder={content.card.fromPlaceholder}
                onChange={(event) => setFrom(event.target.value)}
                className="h-11 rounded-xl border-line/20 bg-transparent"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Button
                onClick={handleShare}
                disabled={busy}
                className="h-11 rounded-full bg-ink px-7 text-[10px] font-medium uppercase tracking-[0.3em] text-paper hover:bg-ink/85"
              >
                {busy ? <Loader2 className="size-3.5 animate-spin" /> : <Share2 className="size-3.5" />}
                {busy ? content.card.generating : content.card.share}
              </Button>
              <Button
                variant="outline"
                onClick={handleDownload}
                disabled={busy}
                className="h-11 rounded-full border-line/25 bg-transparent px-7 text-[10px] font-medium uppercase tracking-[0.3em] text-ink hover:border-ink hover:bg-ink hover:text-paper"
              >
                <Download className="size-3.5" />
                {content.card.download}
              </Button>
            </div>

            <p aria-live="polite" className="min-h-5 font-display text-sm italic text-ink-soft/80">
              {statusText}
            </p>
          </AnimatedContent>
        </div>

        <div className="mt-24 flex justify-center">
          <Button
            variant="outline"
            onClick={onReplay}
            className="h-11 rounded-full border-line/25 bg-transparent px-8 text-[10px] font-medium uppercase tracking-[0.35em] text-ink transition-all duration-500 hover:border-ink hover:bg-ink hover:text-paper"
          >
            {content.birth.closing.replay}
          </Button>
        </div>
      </div>
    </section>
  )
}
