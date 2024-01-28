import { useMousePressed, useMouse } from '@vueuse/core'
import { computed, watch, ref, Ref, onMounted } from 'vue'
import { rgbToHex, clamp } from './utils'

export type hexType = {
  color: string,
  position: {x: number, y: number}
} | undefined

type RefCanvas = Ref<HTMLCanvasElement | undefined | null>
type posFunc = (pos: hexType) => void

function getMousePos(canvas: HTMLCanvasElement, evt: MouseEvent) {
  const rect = canvas.getBoundingClientRect()
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  }
}

export function canvasPixelColor(evt: MouseEvent, canvas?: HTMLCanvasElement | null) {
  if(!canvas) return
  return pixelColor(getMousePos(canvas, evt), canvas)
}

export function pixelColor(position: {x: number, y: number}, canvas?: HTMLCanvasElement | null): hexType {
  if(!canvas) return
  const ctx = canvas.getContext("2d", { willReadFrequently: true })
  if(ctx === null) return
  const pixel = ctx.getImageData(position.x, position.y, 1, 1)
  const data = pixel.data
  const rgba = `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3]})`
  return { color: rgbToHex(rgba), position }
}

export function offCanvas(e: MouseEvent, click: boolean) {
  const returnCondition = !mousedown.value && !click
  if(!mousedown.value) activeCanvas.value = e.target
  if(activeCanvas.value === null) activeCanvas.value = e.target
  return returnCondition
}

export function isActiveCanvas(target?: EventTarget | HTMLCanvasElement | null) {
  return activeCanvas.value !== target
}

export let mousedown = ref(false)
let activeCanvas = ref<EventTarget | null>(null)

const { pressed } = useMousePressed()
watch(pressed, (value: boolean) => {
  if(value) return
  activeCanvas.value = null
  mousedown.value = value
})

export function outsideCanvas(props: {canvas: RefCanvas, updateCanvas: posFunc}) {
  const { canvas, updateCanvas } = props
  const mouseOn = ref(false)

  function condition() {
    //activeOutside
    return !mouseOn.value 
    && mousedown.value 
    && !isActiveCanvas(canvas.value)
  }

  //Update color while dragging outside canvas
  const { x, y } = useMouse()
  const posPixel = computed(() => ({x: x.value, y: y.value}))
  watch(posPixel, (pos) => {
    if(!condition() && canvas.value) return
    updateCanvas(clampedPos(pos))
  })

  //confines handle pos to inside the canvas element
  function clampedPos(pos: {x: number, y: number}) {
    const box = canvas.value?.getBoundingClientRect()
    if(!box) return
    return pixelColor({
      x: clamp(pos.x - (box.left + window.scrollX), 0, box.width - 2),
      y: clamp(pos.y - (box.top + window.scrollY), 0, box.height - 2)
    }, canvas.value)
  }

  return { mouseOn, clampedPos }
}


function observeCanvas(el: RefCanvas, onResize: () => void) {
  if(!el.value) return
  if(!ResizeObserver) return
  const observer = new ResizeObserver(() => onResize())
  observer.observe(el.value)
}

export function responsiveCanvas(props: {canvas: RefCanvas, updateCanvas: () => void, updateDelay?: number}) {
  const { canvas, updateCanvas, updateDelay } = props
  const size = 100
  const width = ref(size)
  const height = ref(size)

  function setCanvas() {
    const box = canvas.value?.getBoundingClientRect()
    width.value = box?.width || size
    height.value = box?.height || size
    setTimeout(() => {
      updateCanvas()
    }, updateDelay)
  }

  onMounted(() => {
    if(!canvas.value) return
    observeCanvas(canvas, setCanvas)
    setCanvas()
  })

  return { width, height }
}

//Handler for canvas dimentions
function getPercent(props: {height: number, width: number, heightLimit: number, widthLimit: number}) {
  const {height, width, heightLimit, widthLimit} = props
  const height100 = height / 100
  const h1 = (100 - Math.abs(heightLimit)) * height100
  const width100 = width / 100
  const w1 = (100 - Math.abs(widthLimit)) * width100
  return {h1, w1}
}

export function getDimentions(canvas: HTMLCanvasElement, frame = {height: 100, width: 100}) {
  const {height, width} = canvas.getBoundingClientRect()
  const { w1, h1 } = getPercent({
    height, width, 
    heightLimit: frame.height, 
    widthLimit: frame.width
  })
  
  const h = frame.height >= 0 ? 0 + h1 : 0 - h1
  const w = frame.width >= 0 ? 0 + w1 : 0 - w1

  return { height, width, 
    dimentions: {
      left: w,
      top: h, 
      right: width, 
      bottom: height 
     }
  }
}

