import { ref, computed, watch } from 'vue'
import type { ShallowRef } from 'vue'
import { useMouse, useMousePressed } from '@vueuse/core'
import { clamp, gsapTo, nearestSnapPoint } from './utils'
import { useSliderZoom } from './useSliderZoom'

interface UseSliderValue {
  slider: Readonly<ShallowRef<HTMLDivElement | null>>
  track: Readonly<ShallowRef<HTMLDivElement | null>>
}

export function useSliderValue({ slider, track }: UseSliderValue) {
  const startHandleClicked = ref(false)

  const { x, y } = useMouse()
  const { pressed } = useMousePressed({ target: slider })

  const minSize = 10

  const endHandle = ref(50)
  const activeTrackSize = ref(50)
  const startHandle = ref(0)

  const zoom = useSliderZoom({ track, y, pressed })

  const cursor = computed(() => {
    // Cursor position as a percentage of the slider width
    const trackBox = track.value?.getBoundingClientRect()

    if (!trackBox) return 0
    const elWidth = zoom.value * trackBox.width
    const elStart = trackBox.left + (trackBox.width - elWidth) / 2
    const mouseXDistFromTrackLeft = (x.value - elStart) / elWidth
    return Math.round(mouseXDistFromTrackLeft * 100)
  })

  function updateSize(percent = cursor.value) {
    endHandle.value = percent
    return percent - startHandle.value
  }

  function clampLeft(percent = cursor.value) {
    // Clamp left handle between start and min proximity to right handle
    return clamp(percent, 0, endHandle.value - minSize)
  }

  function moveLeftHandle(percent = cursor.value) {
    // Bar size
    const leftValue = clampLeft(percent)
    const newSize = endHandle.value - leftValue
    activeTrackSize.value = clamp(newSize, minSize, 100)

    // Bar start
    const hasNotMovedLeftHandle = leftValue === 0
    if (!hasNotMovedLeftHandle && newSize === minSize) return
    startHandle.value = leftValue
  }

  function moveRightHandle(percent = cursor.value) {
    const newSize = updateSize(percent)
    const clampedSize = clamp(newSize, minSize, 100)
    activeTrackSize.value = startHandle.value > 1 ? clampedSize : newSize
  }

  function updateSlider(percent = cursor.value) {
    if (startHandleClicked.value) {
      moveLeftHandle(percent)
    } else {
      moveRightHandle(percent)
    }
  }

  const snapPoints = ref([0, 25, 50, 75, 100])
  const nearestStartSnap = computed(() => nearestSnapPoint(startHandle.value, snapPoints.value))
  const nearestEndSnap = computed(() => nearestSnapPoint(activeTrackSize.value + startHandle.value, snapPoints.value))

  function updateSlider2() {
    if (startHandleClicked.value) {
      const leftValue = clampLeft(nearestStartSnap.value)
      const sizeValue = endHandle.value - leftValue
      gsapTo({ value: startHandle, to: leftValue })
      gsapTo({ value: activeTrackSize, to: sizeValue })
    } else {
      const sizeValue = updateSize(nearestEndSnap.value)
      gsapTo({ value: activeTrackSize, to: sizeValue })
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
    activeTrackSize,
    startHandle,
    endHandle,
    zoom,
    cursor,
    pressed,
    startHandleClicked,
    updateSlider,
    snapPoints,
  }
}
