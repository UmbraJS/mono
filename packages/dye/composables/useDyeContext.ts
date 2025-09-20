import { ref, watch, provide, inject, type InjectionKey, reactive, type Ref } from 'vue'
import { useMousePressed } from '@vueuse/core'
import { umbra } from '@umbrajs/core'
import { colorName } from './colorName'
import type { OutputColor } from './canvas'

// Types for our context
interface DyeState {
  color: { name: string; hex: string }
  setColor: (value: OutputColor | string, updateHandle?: boolean) => void
  paintComponent: (background: string) => void
  wrapper: HTMLDivElement | null
  setWrapper: (el: HTMLDivElement) => void
  handleUpdates: number
}

interface ColorCanvasState {
  colorCanvas: Ref<HTMLCanvasElement | null>
  setColorCanvas: (el: HTMLCanvasElement) => void
}

interface DyeStoreState {
  holding: boolean
  setHolding: (value: boolean) => void
  activeCanvas: EventTarget | null
  isActiveCanvas: (target?: EventTarget | HTMLCanvasElement | null) => boolean
  offCanvas: (e: MouseEvent, click: boolean) => boolean
}

// Injection keys
const DyeContextKey: InjectionKey<DyeState> = Symbol('dye-context')
const ColorCanvasContextKey: InjectionKey<ColorCanvasState> = Symbol('color-canvas-context')
const DyeStoreContextKey: InjectionKey<DyeStoreState> = Symbol('dye-store-context')

// Provider function - call this in the root DyePicker component
export function provideDyeContext(initialColor = '#000000') {
  // Dye state
  const wrapper = ref<HTMLDivElement | null>(null)
  const color = ref({ name: colorName(initialColor).name, hex: initialColor })
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

  function paintComponent(background: string) {
    if (!wrapper.value) return
    umbra({ background }).apply({ target: wrapper.value })
  }

  function setWrapper(el: HTMLDivElement) {
    wrapper.value = el
  }

  // Create reactive state object
  const dyeState = reactive({
    get color() { return color.value },
    setColor,
    paintComponent,
    get wrapper() { return wrapper.value },
    setWrapper,
    get handleUpdates() { return handleUpdates.value }
  })

  provide(DyeContextKey, dyeState)

  // Color canvas state
  const colorCanvas = ref<HTMLCanvasElement | null>(null)

  const colorCanvasState: ColorCanvasState = {
    colorCanvas: colorCanvas,
    setColorCanvas: (el: HTMLCanvasElement) => {
      colorCanvas.value = el
    }
  }

  provide(ColorCanvasContextKey, colorCanvasState)

  // Dye store state
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

  // Create reactive store state object
  const dyeStoreState = reactive({
    get holding() { return holding.value },
    setHolding,
    get activeCanvas() { return activeCanvas.value },
    isActiveCanvas,
    offCanvas
  })

  provide(DyeStoreContextKey, dyeStoreState)

  // Initialize with the initial color
  paintComponent(initialColor)

  // Return the state objects for the provider component to use
  return {
    dye: dyeState,
    canvas: colorCanvasState,
    store: dyeStoreState
  }
}

// Consumer functions - use these in child components
export function useDyeContext(): DyeState {
  const context = inject(DyeContextKey)
  if (!context) {
    throw new Error('useDyeContext must be used within a DyePicker component that calls provideDyeContext')
  }
  return context
}

export function useColorCanvasContext(): ColorCanvasState {
  const context = inject(ColorCanvasContextKey)
  if (!context) {
    throw new Error('useColorCanvasContext must be used within a DyePicker component that calls provideDyeContext')
  }
  return context
}

export function useDyeStoreContext(): DyeStoreState {
  const context = inject(DyeStoreContextKey)
  if (!context) {
    throw new Error('useDyeStoreContext must be used within a DyePicker component that calls provideDyeContext')
  }
  return context
}
