import { umbra } from '@umbrajs/core'
import { ref, Ref, onMounted } from 'vue'
import { colorName } from './colorName'
import DyeWrapper from '../components/DyeWrapper.vue'

export function useDye(hex: string) {
  const wrapper = ref<InstanceType<typeof DyeWrapper> | null>(null)
  const color = ref({ name: colorName(hex).name, hex })

  function paintComponent(background: string) {
    if (!wrapper.value) return
    umbra({ background }).apply({ target: wrapper.value.$el })
  }

  onMounted(() => paintComponent(color.value.hex))

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
