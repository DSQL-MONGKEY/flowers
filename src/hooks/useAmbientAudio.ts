import { useCallback, useEffect, useRef, useState } from "react"

const SPARKLES = [523.25, 587.33, 659.25, 783.99, 880.0]
const REVEAL_NOTES = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5]
const FALL_NOTES = [392.0, 349.23, 329.63, 293.66, 261.63, 246.94]

type AudioEngine = {
  ctx: AudioContext
  master: GainNode
  padGain: GainNode
}

type NoteOptions = {
  duration?: number
  peak?: number
  type?: OscillatorType
  when?: number
}

export function useAmbientAudio() {
  const engineRef = useRef<AudioEngine | null>(null)
  const enabledRef = useRef(true)
  const sparkleTimer = useRef<number | null>(null)
  const [enabled, setEnabled] = useState(true)

  const playNote = useCallback((freq: number, { duration = 2.6, peak = 0.03, type = "sine", when = 0 }: NoteOptions = {}) => {
    const engine = engineRef.current
    if (!engine) return
    const { ctx, master } = engine
    const t0 = ctx.currentTime + when
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
    osc.frequency.value = freq
    gain.gain.setValueAtTime(0.0001, t0)
    gain.gain.exponentialRampToValueAtTime(peak, t0 + 0.05)
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration)
    osc.connect(gain)
    gain.connect(master)
    osc.start(t0)
    osc.stop(t0 + duration + 0.1)
  }, [])

  const scheduleSparkles = useCallback(() => {
    if (sparkleTimer.current) window.clearTimeout(sparkleTimer.current)
    const loop = () => {
      sparkleTimer.current = window.setTimeout(
        () => {
          if (enabledRef.current) {
            playNote(SPARKLES[Math.floor(Math.random() * SPARKLES.length)], {
              duration: 3.6,
              peak: 0.014,
              type: "sine",
            })
          }
          loop()
        },
        8000 + Math.random() * 9000,
      )
    }
    loop()
  }, [playNote])

  const start = useCallback(() => {
    const existing = engineRef.current
    if (existing) {
      void existing.ctx.resume()
      return
    }

    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctor) return

    const ctx = new Ctor()
    const master = ctx.createGain()
    master.gain.value = 0.0001
    master.connect(ctx.destination)

    const padGain = ctx.createGain()
    padGain.gain.value = 0.05
    const filter = ctx.createBiquadFilter()
    filter.type = "lowpass"
    filter.frequency.value = 820
    filter.Q.value = 0.6
    padGain.connect(filter)
    filter.connect(master)

    const voices = [
      { freq: 130.81, gain: 0.5, detune: 0, type: "sine" as OscillatorType },
      { freq: 196.0, gain: 0.34, detune: 4, type: "sine" as OscillatorType },
      { freq: 261.63, gain: 0.16, detune: -6, type: "triangle" as OscillatorType },
    ]
    for (const voice of voices) {
      const osc = ctx.createOscillator()
      osc.type = voice.type
      osc.frequency.value = voice.freq
      osc.detune.value = voice.detune
      const voiceGain = ctx.createGain()
      voiceGain.gain.value = voice.gain
      osc.connect(voiceGain)
      voiceGain.connect(padGain)
      osc.start()
    }

    const lfo = ctx.createOscillator()
    lfo.frequency.value = 0.05
    const lfoGain = ctx.createGain()
    lfoGain.gain.value = 0.016
    lfo.connect(lfoGain)
    lfoGain.connect(padGain.gain)
    lfo.start()

    engineRef.current = { ctx, master, padGain }
    void ctx.resume()

    const t = ctx.currentTime
    master.gain.setValueAtTime(0.0001, t)
    master.gain.linearRampToValueAtTime(enabledRef.current ? 1 : 0.0001, t + 3.5)

    scheduleSparkles()
  }, [scheduleSparkles])

  const applyEnabled = useCallback((next: boolean) => {
    enabledRef.current = next
    setEnabled(next)
    const engine = engineRef.current
    if (!engine) return
    const t = engine.ctx.currentTime
    engine.master.gain.cancelScheduledValues(t)
    engine.master.gain.setValueAtTime(Math.max(engine.master.gain.value, 0.0001), t)
    engine.master.gain.linearRampToValueAtTime(next ? 1 : 0.0001, t + 0.9)
  }, [])

  const toggle = useCallback(() => {
    const next = !enabledRef.current
    if (next) start()
    applyEnabled(next)
  }, [applyEnabled, start])

  const chimeReveal = useCallback(
    (index: number) => {
      if (!enabledRef.current || !engineRef.current) return
      const note = REVEAL_NOTES[index % REVEAL_NOTES.length]
      playNote(note, { duration: 2.4, peak: 0.04 })
      playNote(note * 2, { duration: 1.6, peak: 0.012, when: 0.08 })
    },
    [playNote],
  )

  const chimeFall = useCallback(
    (index: number) => {
      if (!enabledRef.current || !engineRef.current) return
      playNote(FALL_NOTES[index % FALL_NOTES.length], { duration: 2.0, peak: 0.028, type: "triangle" })
    },
    [playNote],
  )

  useEffect(() => {
    return () => {
      if (sparkleTimer.current) window.clearTimeout(sparkleTimer.current)
      void engineRef.current?.ctx.close()
      engineRef.current = null
    }
  }, [])

  return { enabled, toggle, start, chimeReveal, chimeFall }
}
