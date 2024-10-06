import { ref, watch } from 'vue'
import type { Ref, ShallowRef } from 'vue'
import { clamp, remap, gsapTo } from './utils'

interface UseSliderZoom {
  track: Readonly<ShallowRef<HTMLDivElement | null>>
  y: Readonly<Ref<number>>
  pressed: Readonly<Ref<boolean>>
}

export function useSliderZoom({ track, y, pressed }: UseSliderZoom) {
  const zoom = ref(1)

  function getZoom(y: number) {
    const max = 40
    const min = 1
    const margin = 40
    const trackBoxTop = track.value?.getBoundingClientRect().top || min
    const yDist = trackBoxTop - y - margin
    if (!pressed.value) return min
    if (yDist > margin) return remap(max, min, max, min, 2)
    const distFromTop = clamp(yDist, min, max)
    return remap(distFromTop, min, max, min, 2)
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
