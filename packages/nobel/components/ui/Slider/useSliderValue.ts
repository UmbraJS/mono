import { ref, computed, watch } from 'vue'
import type { ShallowRef } from 'vue'
import { useMouse, useMousePressed } from '@vueuse/core'
import { clamp, gsapTo } from './utils'
import { nearestSnapPoint } from './utils'
import { useSliderZoom } from './useSliderZoom'

interface UseSliderValue {
  slider: Readonly<ShallowRef<HTMLDivElement | null>>
  track: Readonly<ShallowRef<HTMLDivElement | null>>
}

export function useSliderValue({ slider, track }: UseSliderValue) {
  const leftHandleClicked = ref(false)

  const { x, y } = useMouse()
  const { pressed } = useMousePressed({ target: slider })

  const minSize = 10

  const value = ref(50)
  const size = ref(50)
  const left = ref(0)

  const zoom = useSliderZoom({ track, y, pressed })

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
      const newSize = updateSize2(leftValue)
      const newSizeClamped = clamp(newSize, minSize, 100)
      leftValue === 0 ? (size.value = newSize) : (size.value = newSizeClamped)
      const hasNotMovedLeftHandle = leftValue === 0
      if (!hasNotMovedLeftHandle && newSize === minSize) return
      left.value = leftValue
    } else {
      size.value = clamp(updateSize(percent), minSize, 100)
    }
  }

  const snapPoints = ref([])
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
    y,
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
