<script setup lang="ts">
import { colord } from 'colord'
import { ref, onMounted, watch } from 'vue'
import { getDimentions } from '../../composables/canvas'
import {
  HexType,
  OutputColor,
  outsideCanvas,
  canvasPixelColor,
  responsiveCanvas
} from '../../composables/canvas'
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
}

withDefaults(defineProps<Props>(), {
  width: 25
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
  for (var hue = 0; hue <= 360; hue++) {
    var hslColor = `hsl(${hue}, ${hsl.s}%, ${hsl.l}%)`
    gradient.addColorStop(hue / 360, hslColor)
  }
  return gradient
}

function fillHueCanvas(color: string = dye.color.hex) {
  if (!hueCanvas.value) return
  const ctx = hueCanvas.value?.getContext('2d')
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
  updateCanvas(hex)
  inside.value = true
}

const change = useDebounce((dye: OutputColor) => {
  const color = { hue: dye.hex }
  fillColorCanvas({ color }, canvas.colorCanvas().value)
  emit('change', dye)
})

function updateCanvas(color?: HexType, mounted = false) {
  if (!color || mounted) return
  change({
    name: colorName(color.hex).name,
    ...color
  })

  position.value = {
    x: position.value.x,
    y: color.position.y
  }
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

function huePercent(hue: number, height?: number) {
  if (!height) return 0
  const percent = (hue / 360) * 100
  return height * (percent / 100)
}

onMounted(() => {
  fillHueCanvas()
  setCenterHandle()

  const hsl = colord(dye.color.hex).toHsl()
  const color = {
    hex: dye.color.hex,
    position: {
      x: 0,
      y: huePercent(hsl.h, canvasHeight.value)
    }
  }

  updateCanvas(color, true)
})
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
    >
    </canvas>
  </div>
</template>

<style lang="scss" scoped>
.hue-canvas-wrapper {
  position: relative;
  user-select: none;
  //overflow: hidden;
  width: 100%;
  height: 100%;
}

canvas.hue-canvas {
  width: calc(v-bind(width) * 1px);
  height: 100%;
  //overflow: hidden;
  background-color: var(--base-20, rgb(64, 0, 0));
}
</style>
