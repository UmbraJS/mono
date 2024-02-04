import { umbra } from '@umbrajs/core'
import { ref, Ref, onMounted, computed } from 'vue'
import { colorName } from './colorName'
import DyeWrapper from '../components/DyeWrapper.vue'
import { OutputColor } from '../composables/canvas'

export function useDye(hex: string) {
  const wrapper = ref<InstanceType<typeof DyeWrapper> | null>(null)
  const colour = ref({ name: colorName(hex).name, hex })
  const color = computed({
    get: () => colour.value,
    set(value: OutputColor) {
      colour.value = value
      paintComponent(value.hex)
    }
  })

  onMounted(() => paintComponent(colour.value.hex))
  function paintComponent(background: string) {
    if (!wrapper.value) return
    umbra({ background }).apply({ target: wrapper.value.$el })
  }

  const [colorCanvas, setColorCanvas] = useColorCanvas()
  return {
    color,
    colorCanvas,
    setColorCanvas,
    paintComponent,
    wrapper
  }
}

type UCCP = [() => Ref<HTMLCanvasElement | null>, (el: HTMLCanvasElement) => void]
export function useColorCanvas(): UCCP {
  const colorCanvas = ref<HTMLCanvasElement | null>(null)
  return [() => colorCanvas, (el: HTMLCanvasElement) => (colorCanvas.value = el)]
}
