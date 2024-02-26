import { ref, Ref, watch } from 'vue'
import { useMousePressed } from '@vueuse/core'
import { defineStore } from 'pinia'
import { umbra } from '@umbrajs/core'
import { colorName } from './colorName'
import { OutputColor } from '../composables/canvas'

interface UCC {
  colorCanvas: () => Ref<HTMLCanvasElement | null>
  setColorCanvas: (el: HTMLCanvasElement) => void
}

export const useColorCanvas = defineStore('color-canvas', () => {
  const colorCanvas = ref<HTMLCanvasElement | null>(null)

  function getColorCanvas() {
    return colorCanvas
  }

  function setColorCanvas(el: HTMLCanvasElement) {
    colorCanvas.value = el
  }

  const cr: UCC = {
    colorCanvas: getColorCanvas,
    setColorCanvas
  }

  return cr
})

export const useDye = defineStore('dye', () => {
  const hex = '#000'
  const wrapper = ref<HTMLDivElement | null>(null)
  const color = ref({ name: colorName(hex).name, hex })
  const handleUpdates = ref(0)

  function setColor(value: OutputColor | string, updateHandle = false) {
    const isString = typeof value === 'string'

    const hex = isString ? value : value.hex

    if (isString) {
      const name = colorName(value).name
      color.value = { name, hex }
    } else {
      color.value = value
    }

    paintComponent(hex)
    if (updateHandle) handleUpdates.value++
  }

  paintComponent(color.value.hex)
  function paintComponent(background: string) {
    if (!wrapper.value) return
    umbra({ background }).apply({ target: wrapper.value })
  }

  function getWrapper() {
    return wrapper
  }

  function setWrapper(el: HTMLDivElement) {
    wrapper.value = el
  }

  const cr: {
    color: Ref<OutputColor>
    setColor: (value: OutputColor | string, updateHandle?: boolean) => void
    paintComponent: (background: string) => void
    wrapper: Ref<HTMLDivElement | null>
    getWrapper: () => Ref<HTMLDivElement | null>
    setWrapper: (el: HTMLDivElement) => void
    handleUpdates: Ref<number>
  } = {
    color,
    setColor,
    paintComponent,
    wrapper,
    getWrapper,
    setWrapper,
    handleUpdates
  }

  return cr
})

export const useDyeStore = defineStore('dye-store', () => {
  const holding = ref(false)
  const activeCanvas = ref<EventTarget | null>(null)

  const { pressed } = useMousePressed()
  watch(pressed, (value: boolean) => {
    if (value) return
    activeCanvas.value = null
    holding.value = value
  })

  function offCanvas(e: MouseEvent, click: boolean) {
    const returnCondition = !holding.value && !click
    if (!holding.value) activeCanvas.value = e.target
    if (activeCanvas.value === null) activeCanvas.value = e.target
    return returnCondition
  }

  function setHolding(value: boolean) {
    holding.value = value
  }

  function isActiveCanvas(target?: EventTarget | HTMLCanvasElement | null) {
    return activeCanvas.value !== target
  }

  return {
    holding,
    setHolding,
    activeCanvas,
    isActiveCanvas,
    offCanvas
  }
})
