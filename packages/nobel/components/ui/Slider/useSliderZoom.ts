import { ref, watch } from 'vue'
import type { Ref, ShallowRef } from 'vue'
import { clamp, remap, gsapTo } from './utils'

interface UseSliderZoom {
  track: Readonly<ShallowRef<HTMLDivElement | null>>
  y: Readonly<Ref<number>>
  pressed: Readonly<Ref<boolean>>
}

export function useSliderZoom({ track, y, pressed }: UseSliderZoom) {
  const maxPixelDist = 40
  const maxScale = 6
  const minScale = 1
  const margin = 40

  const zoom = ref(1)

  function getZoom(y: number) {
    const trackBoxTop = track.value?.getBoundingClientRect().top || minScale
    const yDist = trackBoxTop - y - margin
    if (!pressed.value) return minScale
    if (yDist > margin) return remap(maxPixelDist, minScale, maxPixelDist, minScale, maxScale)
    const distFromTop = clamp(yDist, minScale, maxPixelDist)
    return remap(distFromTop, minScale, maxPixelDist, minScale, maxScale)
  }

  let resetZoom = true
  watch(y, (y) => {
    if (pressed.value) {
      resetZoom = true
      zoom.value = getZoom(y)
    } else {
      if (resetZoom) gsapTo({ value: zoom, to: 1 })
      resetZoom = false
    }
  })

  return zoom
}
