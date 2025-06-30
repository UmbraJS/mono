export function useAudioCue() {
  if (!import.meta.client) return
  const playCardFlip = cardFlipSounds()

  return {
    playCardFlip,
  }
}

function cardFlipSounds() {
  const audioContext = new AudioContext()
  let audioBuffer: AudioBuffer

  fetch('sounds/cardFlips.mp3')
    .then((response) => response.arrayBuffer())
    .then((data) => audioContext.decodeAudioData(data))
    .then((buffer) => {
      audioBuffer = buffer
    })

  const flipSegments = [
    { start: 0.2, duration: 0.5 },
    { start: 0.7, duration: 0.5 },
    { start: 2.2, duration: 0.5 },
  ]

  function playCardFlip() {
    const randomIndex = Math.floor(Math.random() * flipSegments.length)
    const segment = flipSegments[randomIndex]

    if (!segment) return

    const { start, duration } = segment

    const source = audioContext.createBufferSource()
    source.buffer = audioBuffer
    source.connect(audioContext.destination)
    source.start(0, start, duration)
  }

  return playCardFlip
}
