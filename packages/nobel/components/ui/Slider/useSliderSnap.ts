import { ref, watch } from 'vue'
import type { Ref } from 'vue'
import { gsap } from 'gsap'
import { nearestSnapPoint } from './utils'

interface UseSliderSnap {
  pressed: Ref<boolean>
  size: Ref<number>
}

export function useSliderSnap(points: number[], { pressed, size }: UseSliderSnap) {
  const snapPoints = ref(points)

  watch(pressed, (pressed) => {
    // when finished press gsap value to nearest snap point
    if (pressed) return
    gsap.to(size, {
      value: nearestSnapPoint(size.value, snapPoints.value),
      duration: 0.2,
      ease: 'power2.inOut'
    })
  })

  return { snapPoints }
}
