import { Volume2, VolumeX } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

type AudioToggleProps = {
  enabled: boolean
  onToggle: () => void
}

export function AudioToggle({ enabled, onToggle }: AudioToggleProps) {
  return (
    <div className="fixed right-4 top-4 z-50 sm:right-6 sm:top-6">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            aria-label={enabled ? "Matikan musik" : "Nyalakan musik"}
            className="size-9 rounded-full border border-line/15 bg-paper text-ink transition-colors duration-500 hover:border-ink hover:bg-ink hover:text-paper"
          >
            {enabled ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent
          side="left"
          sideOffset={10}
          className="rounded-full px-3 py-1 text-[9px] uppercase tracking-[0.3em]"
        >
          {enabled ? "musik aktif" : "musik mati"}
        </TooltipContent>
      </Tooltip>
    </div>
  )
}
