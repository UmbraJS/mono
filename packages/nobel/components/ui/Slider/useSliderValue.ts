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

  function clampLeft(percent = cursor.value) {
    // Clamp left handle between start and right handle
    return clamp(percent, 0, value.value - minSize)
  }

  function moveLeftHandle(percent = cursor.value) {
    // Bar size
    const leftValue = clampLeft(percent)
    const newSize = value.value - leftValue
    size.value = clamp(newSize, minSize, 100)

    // Bar start
    const hasNotMovedLeftHandle = leftValue === 0
    if (!hasNotMovedLeftHandle && newSize === minSize) return
    left.value = leftValue
  }

  function moveRightHandle(percent = cursor.value) {
    const newSize = updateSize(percent)
    const clampedSize = clamp(newSize, minSize, 100)
    size.value = left.value > 1 ? clampedSize : newSize
  }

  function updateSlider(percent = cursor.value) {
    if (leftHandleClicked.value) {
      moveLeftHandle(percent)
    } else {
      moveRightHandle(percent)
    }
  }

  const snapPoints = ref([])
  const nearestStartSnap = computed(() => nearestSnapPoint(left.value, snapPoints.value))
  const nearestEndSnap = computed(() => nearestSnapPoint(size.value + left.value, snapPoints.value))

  function updateSlider2() {
    if (leftHandleClicked.value) {
      const leftValue = clampLeft(nearestStartSnap.value)
      const sizeValue = value.value - leftValue
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
