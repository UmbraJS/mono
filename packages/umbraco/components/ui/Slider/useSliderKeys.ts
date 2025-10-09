import { ref, computed } from 'vue'
import type { Ref, ShallowRef } from 'vue'
import { onKeyStroke } from '@vueuse/core'
import { clamp, switchPoint } from './utils'

interface UseSliderKeys {
  activeTrackSize: Ref<number>
  snapPoints: Ref<number[]>
}

export function useSliderKeys(
  slider: Readonly<ShallowRef<HTMLDivElement | null>> | null,
  { activeTrackSize, snapPoints }: UseSliderKeys,
) {
  const modifier = ref(false)
  const hasSnapPoints = computed(() => snapPoints.value.length > 0)

  function setValue(percent: number, add = 0) {
    const adder = modifier.value ? add * 10 : add
    activeTrackSize.value = clamp(percent + adder, 0, 100)
  }

  function snapOrMove(value: number, add = 0) {
    if (hasSnapPoints.value) {
      setValue(switchPoint(value, snapPoints.value, add))
    } else {
      setValue(value, add)
    }
  }

  function shiftMod(e: KeyboardEvent) {
    e.preventDefault()
    modifier.value = !modifier.value
  }

  onKeyStroke('Shift', shiftMod, {
    eventName: 'keydown',
    target: slider,
  })

  onKeyStroke('Shift', shiftMod, {
    eventName: 'keyup',
    target: slider,
  })

  onKeyStroke('ArrowLeft', () => snapOrMove(activeTrackSize.value, -1), {
    eventName: 'keydown',
    target: slider,
  })

  onKeyStroke('ArrowRight', () => snapOrMove(activeTrackSize.value, 1), {
    eventName: 'keydown',
    target: slider,
  })

  return {
    modifier,
    setValue,
  }
}
