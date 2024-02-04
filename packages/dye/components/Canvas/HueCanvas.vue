<script setup lang="ts">
import { colord } from 'colord'
import { ref, onMounted, Ref, watch } from 'vue'
import { getDimentions } from '../../composables/canvas'
import {
  offCanvas,
  canvasPixelColor,
  isActiveCanvas,
  mousedown,
  outsideCanvas,
  OutputColor,
  HexType,
  responsiveCanvas
} from '../../composables/canvas'
import { colorName } from '../../composables/colorName'
import { fillColorCanvas } from '../../composables/gradient'
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
  colorCanvas: () => Ref<HTMLCanvasElement | null>
  color: {
    hex: string
    name: string
  }
}

const props = withDefaults(defineProps<Props>(), {
  width: 25
})

const hueCanvas = ref<HTMLCanvasElement | null>(null)
const position = ref({ x: 30, y: 70 })

const { mouseOn } = outsideCanvas({
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

function fillHueCanvas(color: string = props.color.hex) {
  if (!hueCanvas.value) return
  const ctx = hueCanvas.value?.getContext('2d')
  if (ctx === null) return
  const { height, width } = getDimentions(hueCanvas.value)

  const hsl = colord(color).toHsl()
  ctx.fillStyle = hueGradient(ctx, height, hsl)
  ctx.fillRect(0, 0, width, height)
}

watch(
  () => props.color.hex,
  (color) => {
    fillHueCanvas(color)
  }
)

function hueChange(e: MouseEvent, click = false) {
  if (click) mousedown.value = true
  if (offCanvas(e, click)) return
  if (isActiveCanvas(e.target)) return
  const hex = canvasPixelColor(e, hueCanvas.value)
  updateCanvas(hex)
  mouseOn.value = true
}

function updateCanvas(color?: HexType, mounted = false) {
  if (!color || mounted) return
  fillColorCanvas({ hue: color.hex }, props.colorCanvas().value)
  position.value = {
    x: position.value.x,
    y: color.position.y
  }
  emit('change', {
    name: colorName(color.hex).name,
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

function huePercent(hue: number, height?: number) {
  if (!height) return 0
  const percent = (hue / 360) * 100
  return height * (percent / 100)
}

onMounted(() => {
  fillHueCanvas()
  setCenterHandle()

  const hsl = colord(props.color.hex).toHsl()
  const color = {
    hex: props.color.hex,
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
    <Handle :position="position" :color="color" />
    <canvas
      ref="hueCanvas"
      class="hue-canvas"
      :width="canvasWidth"
      :height="canvasHeight"
      @mousedown="(e) => hueChange(e, true)"
      @mousemove="(e) => hueChange(e)"
      @mouseleave="() => (mouseOn = false)"
    >
    </canvas>
  </div>
</template>

<style lang="scss" scoped>
.hue-canvas-wrapper {
  position: relative;
  user-select: none;
  overflow: hidden;
  width: 100%;
  height: 100%;
}

canvas.hue-canvas {
  width: calc(v-bind(width) * 1px);
  height: 100%;
  overflow: hidden;
  background-color: var(--base-20, rgb(64, 0, 0));
}
</style>
