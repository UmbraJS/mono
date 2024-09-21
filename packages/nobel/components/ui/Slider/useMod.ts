import { ref } from 'vue'
import type { Ref, ShallowRef } from 'vue'
import { onKeyStroke } from '@vueuse/core'

export function useMod({
  track,
  value
}: {
  track: Readonly<ShallowRef<HTMLDivElement | null>> | null
  value: Ref<number>
}) {
  const modifier = ref(false)

  function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max)
  }

  function setValue(percent: number, add = 0) {
    const adder = modifier.value ? add * 10 : add
    value.value = clamp(percent + adder, 0, 100)
  }

  function shiftMod(e: KeyboardEvent) {
    e.preventDefault()
    modifier.value = !modifier.value
  }

  onKeyStroke('Shift', shiftMod, {
    eventName: 'keydown',
    target: track
  })

  onKeyStroke('Shift', shiftMod, {
    eventName: 'keyup',
    target: track
  })

  onKeyStroke('ArrowLeft', () => setValue(value.value, -1), {
    eventName: 'keydown',
    target: track
  })

  onKeyStroke('ArrowRight', () => setValue(value.value, 1), {
    eventName: 'keydown',
    target: track
  })

  return {
    modifier,
    setValue
  }
}
