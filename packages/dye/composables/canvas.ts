import { defineStore } from 'pinia'
import { useMousePressed, useMouse } from '@vueuse/core'
import { computed, watch, ref, Ref, onMounted, onUnmounted } from 'vue'
import { rgbToHex, clamp } from './utils'

export interface OutputColor {
  name: string
  hex: string
}

export interface HexType {
  hex: string
  position: { x: number; y: number }
}

type RefCanvas = Ref<HTMLCanvasElement | undefined | null>
type posFunc = (pos?: HexType) => void

function getMousePos(canvas: HTMLCanvasElement, evt: MouseEvent) {
  const rect = canvas.getBoundingClientRect()
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  }
}

export function canvasPixelColor(evt: MouseEvent, canvas?: HTMLCanvasElement | null) {
  if (!canvas) return
  return pixelColor(getMousePos(canvas, evt), canvas)
}

export function pixelColor(
  position: { x: number; y: number },
  canvas?: HTMLCanvasElement | null
): HexType | undefined {
  if (!canvas) return
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (ctx === null) return
  const pixel = ctx.getImageData(position.x, position.y, 1, 1)
  const data = pixel.data
  const rgba = `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3]})`
  return { hex: rgbToHex(rgba), position }
}

export const useDyeStore = defineStore('dye', () => {
  const mousedown = ref(false)
  const activeCanvas = ref<EventTarget | null>(null)

  const { pressed } = useMousePressed()
  watch(pressed, (value: boolean) => {
    if (value) return
    activeCanvas.value = null
    mousedown.value = value
  })

  function offCanvas(e: MouseEvent, click: boolean) {
    const returnCondition = !mousedown.value && !click
    if (!mousedown.value) activeCanvas.value = e.target
    if (activeCanvas.value === null) activeCanvas.value = e.target
    return returnCondition
  }

  function setMouseDown(value: boolean) {
    mousedown.value = value
  }

  function isActiveCanvas(target?: EventTarget | HTMLCanvasElement | null) {
    return activeCanvas.value !== target
  }

  return { mousedown, setMouseDown, activeCanvas, isActiveCanvas, offCanvas }
})

interface OCP {
  canvas: RefCanvas
  updateCanvas: posFunc
}

export function outsideCanvas({ canvas, updateCanvas }: OCP) {
  const mouseOn = ref(false)
  const { mousedown, isActiveCanvas } = useDyeStore()

  function condition() {
    //activeOutside
    return !mouseOn.value && mousedown && !isActiveCanvas(canvas.value)
  }

  //Update color while dragging outside canvas
  const { x, y } = useMouse()
  const posPixel = computed(() => ({ x: x.value, y: y.value }))
  watch(posPixel, (pos) => {
    if (!condition() && canvas.value) return
    updateCanvas(clampedPos(pos))
  })

  //confines handle pos to inside the canvas element
  function clampedPos(pos: { x: number; y: number }) {
    const box = canvas.value?.getBoundingClientRect()
    if (!box) return
    return pixelColor(
      {
        x: clamp(pos.x - (box.left + window.scrollX), 0, box.width - 2),
        y: clamp(pos.y - (box.top + window.scrollY), 0, box.height - 2)
      },
      canvas.value
    )
  }

  return { mouseOn, clampedPos }
}

interface RCP {
  canvas: RefCanvas
  updateCanvas: () => void
}

function resizeObserver(callback: () => void) {
  if (!('ResizeObserver' in window)) return null
  const observer = new ResizeObserver(callback)
  return observer
}

export function responsiveCanvas({ canvas, updateCanvas }: RCP) {
  const size = 100
  const width = ref(size)
  const height = ref(size)

  const observer = resizeObserver(() => setCanvas())

  function setCanvas() {
    const box = canvas.value?.getBoundingClientRect()
    width.value = box?.width || size
    height.value = box?.height || size
    setTimeout(() => updateCanvas(), 0)
  }

  onMounted(() => {
    if (!canvas.value || !observer) return
    observer.observe(canvas.value)
    setCanvas()
  })

  onUnmounted(() => {
    if (!observer) return
    observer.disconnect()
  })

  return { width, height }
}

interface GPP {
  height: number
  width: number
  heightLimit: number
  widthLimit: number
}

//Handler for canvas dimentions
function getPercent({ height, width, heightLimit, widthLimit }: GPP) {
  const height100 = height / 100
  const h1 = (100 - Math.abs(heightLimit)) * height100
  const width100 = width / 100
  const w1 = (100 - Math.abs(widthLimit)) * width100
  return { h1, w1 }
}

export function getDimentions(canvas: HTMLCanvasElement, frame = { height: 100, width: 100 }) {
  const { height, width } = canvas.getBoundingClientRect()
  const { w1, h1 } = getPercent({
    height,
    width,
    heightLimit: frame.height,
    widthLimit: frame.width
  })

  const h = frame.height >= 0 ? 0 + h1 : 0 - h1
  const w = frame.width >= 0 ? 0 + w1 : 0 - w1

  return {
    height,
    width,
    dimentions: {
      left: w,
      top: h,
      right: width,
      bottom: height
    }
  }
}
