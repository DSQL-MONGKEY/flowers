import { useCallback, useState } from "react"

import { AudioToggle } from "@/components/AudioToggle"
import { BirthScene } from "@/components/BirthScene"
import { CardStudio } from "@/components/CardStudio"
import { GrainOverlay } from "@/components/GrainOverlay"
import { Intro } from "@/components/Intro"
import { LetterScene } from "@/components/LetterScene"
import { PetalFlower } from "@/components/PetalFlower"
import { TooltipProvider } from "@/components/ui/tooltip"
import { useAmbientAudio } from "@/hooks/useAmbientAudio"
import { useSmoothScroll } from "@/hooks/useSmoothScroll"
import { scrollToTarget } from "@/lib/scroll"

export default function App() {
  const audio = useAmbientAudio()
  const [runId, setRunId] = useState(0)

  useSmoothScroll()

  const handleOpen = useCallback(() => {
    audio.start()
    scrollToTarget("#bloom", { duration: 2.1 })
  }, [audio])

  const handleAllFallen = useCallback(() => {
    scrollToTarget("#letter", { duration: 2.4 })
  }, [])

  const handleReplay = useCallback(() => {
    setRunId((id) => id + 1)
    scrollToTarget("#intro", { duration: 1.7 })
  }, [])

  return (
    <TooltipProvider>
      <div className="relative bg-paper font-sans text-ink">
        <GrainOverlay />
        <AudioToggle enabled={audio.enabled} onToggle={audio.toggle} />
        <main>
          <Intro onOpen={handleOpen} />
          <PetalFlower
            key={`bloom-${runId}`}
            onAllFallen={handleAllFallen}
            onReveal={audio.chimeReveal}
            onFall={audio.chimeFall}
          />
          <LetterScene key={`letter-${runId}`} />
          <BirthScene key={`birth-${runId}`} />
          <CardStudio key={`card-${runId}`} onReplay={handleReplay} />
        </main>
      </div>
    </TooltipProvider>
  )
}
