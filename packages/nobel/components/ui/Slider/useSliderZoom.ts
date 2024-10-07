import { ref, watch } from 'vue'
import type { Ref, ShallowRef } from 'vue'
import { clamp, remap, gsapTo } from './utils'

interface UseSliderZoom {
  track: Readonly<ShallowRef<HTMLDivElement | null>>
  y: Readonly<Ref<number>>
  pressed: Readonly<Ref<boolean>>
}

export function useSliderZoom({ track, y, pressed }: UseSliderZoom) {
  const maxPixelDist = 40 // max amount of pixels the cursor can be from the top of the track
  const maxScale = 6 // max scale the slider can zoom to
  const minScale = 1 // min scale the slider can zoom to
  const margin = 40 // deadzone before the slider starts zooming
  const slowDown = 4 // how much to slow down the zooming

  const zoom = ref(1)

  function calculateZoom(y: number, slowDown = 1) {
    const trackBoxTop = track.value?.getBoundingClientRect().top || minScale
    const yDist = (trackBoxTop - y - margin) / slowDown
    if (!pressed.value) return minScale
    if (yDist > margin) return remap(maxPixelDist, minScale, maxPixelDist, minScale, maxScale)
    const distFromTop = clamp(yDist, minScale, maxPixelDist)
    return remap(distFromTop, minScale, maxPixelDist, minScale, maxScale)
  }

  watch(y, (y) => {
    if (!pressed.value) return
    zoom.value = calculateZoom(y, slowDown)
  })

  watch(pressed, (pressed) => {
    if (pressed) return
    gsapTo({ value: zoom, to: 1 })
  })

  return zoom
}
