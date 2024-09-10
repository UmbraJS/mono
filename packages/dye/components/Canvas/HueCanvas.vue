<script setup lang="ts">
import { colord } from 'colord'
import { ref, onMounted, watch } from 'vue'
import { getDimentions } from '../../composables/canvas'
import { outsideCanvas, canvasPixelColor, responsiveCanvas } from '../../composables/canvas'
import type { HexType, OutputColor } from '../../composables/canvas'
import { useDye, useDyeStore, useColorCanvas } from '../../composables/useDye'
import { colorName } from '../../composables/colorName'
import { fillColorCanvas } from '../../composables/gradient'
import { useDebounce } from '../../composables/utils'
import Handle from '../Handle.vue'

interface Hsl {
  h: number
  s: number
  l: number
}

const emit = defineEmits<{
  (e: 'change', props: OutputColor): void
}>()

interface Props {
  width?: number
  min: number
  max: number
}

const props = withDefaults(defineProps<Props>(), {
  width: 25,
  max: 100,
  min: 0
})

const hueCanvas = ref<HTMLCanvasElement | null>(null)
const position = ref({ x: 30, y: 70 })

const dye = useDye()
const store = useDyeStore()
const canvas = useColorCanvas()

const { inside } = outsideCanvas({
  canvas: hueCanvas,
  updateCanvas
})

function hueGradient(
  ctx: CanvasRenderingContext2D,
  height: number,
  hsl: Hsl = { h: 0, s: 1, l: 0.5 }
) {
  const gradient = ctx.createLinearGradient(0, 0, 0, height)
  for (let hue = 0; hue <= 360; hue++) {
    const hslColor = `hsl(${hue}, ${hsl.s}%, ${hsl.l}%)`
    gradient.addColorStop(hue / 360, hslColor)
  }
  return gradient
}

function fillHueCanvas(color: string = dye.color.hex) {
  if (!hueCanvas.value) return
  const ctx = hueCanvas.value?.getContext('2d', { willReadFrequently: true })
  if (ctx === null) return
  const { height, width } = getDimentions(hueCanvas.value)

  const hsl = colord(color).toHsl()
  ctx.fillStyle = hueGradient(ctx, height, hsl)
  ctx.fillRect(0, 0, width, height)
}

watch(
  () => dye.color.hex,
  (color) => {
    const isActive = store.isActiveCanvas(hueCanvas.value)
    if (!isActive) return
    fillHueCanvas(color)
  }
)

function hueChange(e: MouseEvent, click = false) {
  if (click) store.setHolding(true)
  if (store.offCanvas(e, click)) return
  if (store.isActiveCanvas(e.target)) return
  const hex = canvasPixelColor(e, hueCanvas.value)
  updateHandle(hex)
  updateCanvas(hex)
  inside.value = true
}

const change = useDebounce((dye: OutputColor) => {
  const color = { hue: dye.hex }
  fillColorCanvas({ color, options: props }, canvas.colorCanvas().value)
  emit('change', dye)
})

function updateHandle(color?: HexType) {
  if (!color) return
  position.value = {
    x: position.value.x,
    y: color.position.y
  }
}

function updateCanvas(color?: HexType) {
  change({
    name: colorName(color?.hex).name,
    ...color
  })
}

const { width: canvasWidth, height: canvasHeight } = responsiveCanvas({
  canvas: hueCanvas,
  updateCanvas: () => {
    fillHueCanvas()
    setCenterHandle(position.value.y)
  }
})

function setCenterHandle(y = 0) {
  const canvasWidth = hueCanvas.value?.width
  const canvasCenter = canvasWidth ? canvasWidth / 2 : 0
  position.value = {
    x: canvasCenter,
    y
  }
}

function huePercent(hue: number, height: number) {
  const percent = (hue / 360) * 100
  return (height / 100) * percent
}

function getHandlePosition() {
  const hue = colord(dye.color.hex).toHsl().h
  return {
    y: huePercent(hue, canvasHeight.value),
    x: 0
  }
}

onMounted(() => {
  fillHueCanvas()
  setCenterHandle()

  updateHandle({
    hex: dye.color.hex,
    position: getHandlePosition()
  })
})

watch(
  () => dye.handleUpdates,
  () => {
    updateHandle({
      hex: dye.color.hex,
      position: getHandlePosition()
    })
  }
)
</script>

<template>
  <div class="hue-canvas-wrapper">
    <Handle :position="position" :color="dye.color" />
    <canvas
      ref="hueCanvas"
      class="hue-canvas"
      :width="canvasWidth"
      :height="canvasHeight"
      @mousedown="(e) => hueChange(e, true)"
      @mousemove="(e) => hueChange(e)"
      @mouseleave="() => (inside = false)"
    />
  </div>
</template>

<style lang="scss" scoped>
.hue-canvas-wrapper {
  position: relative;
  user-select: none;
  width: 100%;
  height: 100%;
}

canvas.hue-canvas {
  width: calc(v-bind(width) * 1px);
  height: 100%;
  background-color: var(--base-20, rgb(64, 0, 0));
}
</style>
