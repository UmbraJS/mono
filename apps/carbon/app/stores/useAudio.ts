interface SoundPath {
  category: SoundCategories
  getPath: () => string
  segment?: () => {
    start: number
    duration: number
  }
}

export const useAudio = defineStore('audio', () => {
  const cardFlipSound = getFlipSound()
  const punchSound = getPunchSound()
  const coinSound = getCoinSound()

  const sound = soundFactory()

  return {
    speak: async (text: string) => {
      if (sound.muted.value) return
      const voices = await getAvailableVoices()
      const norwegian = voices.find(v => v.lang.startsWith('no'))
      sound.speak(text, { voice: norwegian, pitch: 1.1 })
    },
    speakElevenLabs: async (text: string, voice: ElevenLabsVoice) => {
      if (sound.muted.value) return
      const url = await fetchElevenLabsSpeech(text, voice)
      await sound.play({
        category: 'voice',
        getPath: () => url
      })
    },
    playCardFlip: async () => {
      await sound.play(cardFlipSound)
    },
    playPunchSound: async () => {
      await sound.play(punchSound)
    },
    playCoinSound: async () => {
      await sound.play(coinSound)
    },
    masterVolume: sound.masterVolume,
    volumes: sound.volumes,
    muted: sound.muted,
    toggleMute: sound.toggleMute,
    setMuted: sound.setMute,
  }
})

function getFlipSound(): SoundPath {
  const cardFlipPath = 'sounds/cardFlips.mp3'

  const segment1 = { start: 0.2, duration: 0.5 }
  const segment2 = { start: 0.7, duration: 0.5 }
  const segment3 = { start: 2.2, duration: 0.5 }
  const flipSegments = [segment1, segment2, segment3]


  return {
    category: 'ui',
    getPath: () => cardFlipPath,
    segment: () => {
      const randomIndex = Math.floor(Math.random() * flipSegments.length)
      return flipSegments[randomIndex] || segment1
    }
  }
}

function getPunchSound(): SoundPath {
  const punch1 = 'sounds/punch/punch1.mp3'
  const punch2 = 'sounds/punch/punch2.mp3'
  const punch3 = 'sounds/punch/punch3.mp3'
  const punch4 = 'sounds/punch/punch4.mp3'

  const punchSounds = [punch1, punch2, punch3, punch4]
  return {
    category: 'action',
    getPath: () => {
      const randomIndex = Math.floor(Math.random() * punchSounds.length)
      return punchSounds[randomIndex] || punch1
    }
  }
}

function getCoinSound(): SoundPath {
  const coin1 = 'sounds/coin/coin1.mp3'
  const coin2 = 'sounds/coin/coin2.mp3'
  const coin3 = 'sounds/coin/coin3.mp3'
  const coin4 = 'sounds/coin/coin4.mp3'

  const coinSounds = [coin1, coin2, coin3, coin4]
  return {
    category: 'action',
    getPath: () => {
      const randomIndex = Math.floor(Math.random() * coinSounds.length)
      return coinSounds[randomIndex] || coin1
    }
  }
}

type SoundCategories = 'ui' | 'action' | 'voice'

type Gains = {
  [key in SoundCategories]: GainNode
}

type Volumes = {
  [key in SoundCategories]: number
}

function soundFactory() {
  if (!import.meta.client) {
    return {
      play: async () => { },
      preLoad: async () => { },
      speak: () => { },
      volumes: {},
      masterVolume: ref(0.1),
      muted: ref(true),
      toggleMute: () => { },
      setMute: () => { }
    }
  }

  const audioContext = new AudioContext()

  const masterGain = audioContext.createGain()
  masterGain.connect(audioContext.destination)

  const categoryGains: Gains = {
    ui: getGain(),
    action: getGain(),
    voice: getGain(),
  }

  const volumes = reactive<Volumes>({
    ui: 1,
    action: 1,
    voice: 1
  })

  const masterVolume = ref(1)
  const muted = ref(true)

  const clamp = (value: number) => Math.max(0, Math.min(value, 1))

  const applyMasterGain = () => {
    masterGain.gain.value = muted.value ? 0 : clamp(masterVolume.value)
  }

  watch(masterVolume, applyMasterGain)
  watch(muted, applyMasterGain)

  // Set initial master volume respecting mute state
  applyMasterGain()

  watch(volumes, (newVal) => {
    for (const category in newVal) {
      if (!(category in categoryGains)) return
      const gain = categoryGains[category as SoundCategories]
      gain.gain.value = clamp(newVal[category as SoundCategories])
    }
  })

  // Set initial volumes for category gains
  for (const category in volumes) {
    if (!(category in categoryGains)) continue
    const gain = categoryGains[category as SoundCategories]
    gain.gain.value = clamp(volumes[category as SoundCategories])
  }

  function getGain() {
    const gain = audioContext.createGain()
    gain.connect(masterGain)
    return gain
  }


  function speak(text: string, options?: {
    voice?: SpeechSynthesisVoice
    pitch?: number
    rate?: number
    volume?: number
  }) {
    if (muted.value) return

    if (!('speechSynthesis' in window)) {
      console.warn('[soundFactory] SpeechSynthesis not supported')
      return
    }

    const utterance = new SpeechSynthesisUtterance(text)

    const effectiveVolume = options?.volume ?? volumes.voice
    utterance.volume = Math.max(0, Math.min(effectiveVolume, 1))
    utterance.pitch = options?.pitch ?? 1
    utterance.rate = options?.rate ?? 1

    if (options?.voice) {
      utterance.voice = options.voice
    }

    speechSynthesis.speak(utterance)
  }

  const bufferCache = new Map<string, AudioBuffer>()

  async function resumeAudioContext() {
    if (audioContext.state !== 'suspended') return
    await audioContext.resume()
  }

  async function loadSound(path: string) {
    let buffer = bufferCache.get(path)
    if (!buffer) {
      const response = await fetch(path)
      const data = await response.arrayBuffer()
      buffer = await audioContext.decodeAudioData(data)
      bufferCache.set(path, buffer)
    }
    return buffer
  }

  async function play(sound: SoundPath) {
    if (muted.value) return
    if (!(sound.category in categoryGains)) {
      console.warn(`[soundFactory] Unknown category "${sound.category}"`)
      return
    }

    await resumeAudioContext()
    const buffer = await loadSound(sound.getPath())
    const source = audioContext.createBufferSource()
    source.buffer = buffer
    source.connect(categoryGains[sound.category as SoundCategories])

    if (sound.segment) {
      const { start, duration } = sound.segment()
      source.start(0, start, Math.min(duration, buffer.duration - start))
    } else {
      source.start(0)
    }
  }

  function setMute(value: boolean) {
    muted.value = value
  }

  function toggleMute() {
    muted.value = !muted.value
  }

  return {
    play,
    speak,
    preLoad: loadSound,
    volumes,
    masterVolume,
    muted,
    toggleMute,
    setMute
  }
}

export function getAvailableVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    const voices = speechSynthesis.getVoices()
    if (voices.length) {
      resolve(voices)
    } else {
      speechSynthesis.onvoiceschanged = () => {
        resolve(speechSynthesis.getVoices())
      }
    }
  })
}

const ElevenLabs = {
  rusticCowboy: 'YXpFCvM1S3JbWEJhoskW',
  germanSage: 'A9evEp8yGjv4c3WsIKuY',
  grandpa: 'zQzvQBubVkDWYuqJYMFn',
} as const

type ElevenLabsVoice = keyof typeof ElevenLabs

async function fetchElevenLabsSpeech(text: string, voice: ElevenLabsVoice): Promise<string> {
  const voiceId = ElevenLabs[voice]

  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': import.meta.env.VITE_ELEVEN_API_KEY // use env var!
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.6,
        similarity_boost: 0.8
      }
    })
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch ElevenLabs TTS: ${res.status}`)
  }

  const blob = await res.blob()
  return URL.createObjectURL(blob)
}
