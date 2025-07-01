interface SoundPath {
  category: SoundCategories
  path: string
  segment?: {
    start: number
    duration: number
  }
}

export const useAudio = defineStore('audio', () => {
  const cardFlipSound = getFlipSound()
  const punchSound = getPunchSound()

  const sound = soundFactory()

  return {
    playCardFlip: async () => {
      await sound.play(cardFlipSound)
    },
    playPunchSound: async () => {
      await sound.play(punchSound)
    },
    preLoadSounds: async () => {
      await sound.preLoad(cardFlipSound.path)
      await sound.preLoad(punchSound.path)
    },
  }
})

function getFlipSound(): SoundPath {
  const cardFlipPath = 'sounds/cardFlips.mp3'

  const segment1 = { start: 0.2, duration: 0.5 }
  const segment2 = { start: 0.7, duration: 0.5 }
  const segment3 = { start: 2.2, duration: 0.5 }
  const flipSegments = [segment1, segment2, segment3]

  const randomIndex = Math.floor(Math.random() * flipSegments.length)
  const segment = flipSegments[randomIndex] || segment1

  return {
    category: 'ui',
    path: cardFlipPath,
    segment: segment
  }
}

function getPunchSound(): SoundPath {
  const punch1 = 'sounds/punch/punch1.mp3'
  const punch2 = 'sounds/punch/punch2.mp3'
  const punch3 = 'sounds/punch/punch3.mp3'
  const punch4 = 'sounds/punch/punch4.mp3'

  const punchSounds = [punch1, punch2, punch3, punch4]
  const randomIndex = Math.floor(Math.random() * punchSounds.length)
  return {
    category: 'action',
    path: punchSounds[randomIndex] || punch1
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
      volumes: {}
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
  watch(masterVolume, (v) => {
    masterGain.gain.value = Math.max(0, Math.min(v, 1))
  })

  watch(volumes, (newVal) => {
    for (const category in newVal) {
      if (!(category in categoryGains)) return
      const gain = categoryGains[category as SoundCategories]
      gain.gain.value = Math.max(0, Math.min(newVal[category as SoundCategories], 1))
    }
  })

  function getGain() {
    const gain = audioContext.createGain()
    gain.connect(masterGain)
    return gain
  }

  const bufferCache = new Map<string, AudioBuffer>()

  async function resumeAudioContext() {
    if (audioContext.state === 'suspended') {
      await audioContext.resume()
    }
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
    if (!(sound.category in categoryGains)) {
      console.warn(`[soundFactory] Unknown category "${sound.category}"`)
      return
    }

    await resumeAudioContext()
    const buffer = await loadSound(sound.path)
    const source = audioContext.createBufferSource()
    source.buffer = buffer
    source.connect(categoryGains[sound.category as SoundCategories])

    if (sound.segment) {
      const { start, duration } = sound.segment
      source.start(0, start, Math.min(duration, buffer.duration - start))
    } else {
      source.start(0)
    }
  }

  return {
    play,
    preLoad: loadSound,
    volumes
  }
}
