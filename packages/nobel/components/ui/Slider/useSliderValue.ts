import { ref, computed, watch } from 'vue'
import type { ShallowRef } from 'vue'
import { useMouse, useMousePressed } from '@vueuse/core'
import { clamp, gsapTo } from './utils'
import { nearestSnapPoint } from './utils'

interface UseSliderValue {
  slider: Readonly<ShallowRef<HTMLDivElement | null>>
  track: Readonly<ShallowRef<HTMLDivElement | null>>
}

export function useSliderValue({ slider, track }: UseSliderValue) {
  const leftHandleClicked = ref(false)

  const { x, y } = useMouse()
  const { pressed } = useMousePressed({ target: slider })

  const value = ref(50)
  const size = ref(50)
  const left = ref(0)

  const zoom = computed(() => {
    if (!pressed.value) return 1
    const trackBox = track.value?.getBoundingClientRect()
    if (!trackBox) return 1
    return clamp(1 + (y.value - trackBox.top) / trackBox.height, 0, 40)
  })

  const cursor = computed(() => {
    // Cursor position as a percentage of the slider width
    const trackBox = track.value?.getBoundingClientRect()
    return trackBox ? Math.round(((x.value - trackBox.left) / trackBox.width) * 100) : 0
  })

  function updateSize(percent = cursor.value) {
    value.value = percent
    return percent - left.value
  }

  function updateSize2(left: number) {
    return value.value - left
  }

  function updateLeft(percent = cursor.value) {
    return clamp(percent, 0, value.value)
  }

  function updateSlider(percent = cursor.value) {
    if (leftHandleClicked.value) {
      const leftValue = updateLeft(percent)
      left.value = leftValue
      size.value = updateSize2(leftValue)
    } else {
      size.value = updateSize(percent)
    }
  }

  const snapPoints = ref([0, 25, 50, 75, 100])
  const nearestStartSnap = computed(() => nearestSnapPoint(left.value, snapPoints.value))
  const nearestEndSnap = computed(() => nearestSnapPoint(size.value + left.value, snapPoints.value))

  function updateSlider2() {
    if (leftHandleClicked.value) {
      const leftValue = updateLeft(nearestStartSnap.value)
      const sizeValue = updateSize2(leftValue)
      gsapTo({ value: left, to: leftValue })
      gsapTo({ value: size, to: sizeValue })
    } else {
      const sizeValue = updateSize(nearestEndSnap.value)
      gsapTo({ value: size, to: sizeValue })
    }
  }

  // while moving cursor
  watch(cursor, (percent) => {
    if (!pressed.value) return
    updateSlider(percent)
  })

  // when finished press
  watch(pressed, (pressed) => {
    if (pressed) return
    updateSlider2()
  })

  return {
    size,
    left,
    zoom,
    cursor,
    pressed,
    leftHandleClicked,
    updateSlider,
    snapPoints
  }
}
