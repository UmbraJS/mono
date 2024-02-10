<script setup lang="ts">
import { ref, watch } from 'vue'
import { colord } from 'colord'
import {
  HexType,
  OutputColor,
  canvasPixelColor,
  outsideCanvas,
  responsiveCanvas
} from '../../composables/canvas'
import { useDye, useDyeStore, useColorCanvas } from '../../composables/useDye'
import { colorName } from '../../composables/colorName'
import { fillColorCanvas } from '../../composables/gradient'
import { useDebounce } from '../../composables/utils'
import Handle from '../Handle.vue'

const emit = defineEmits<{
  (e: 'change', props: OutputColor): void
}>()

const canvas = useColorCanvas()
const dye = useDye()

let position = ref({ x: 0, y: 0 })
const change = useDebounce((dye) => emit('change', dye))

function updateCanvas(color?: HexType) {
  if (!color) return
  const { name } = colorName(color.hex)
  change({ ...color, name })
  position.value = color.position
}

const store = useDyeStore()

//Update color while dragging inside canvas
function colorChange(e: MouseEvent, click = false) {
  if (click) store.setHolding(true)
  if (store.offCanvas(e, click)) return
  if (store.isActiveCanvas(e.target)) return
  const hex = canvasPixelColor(e, canvas.colorCanvas().value)
  updateCanvas(hex)
  inside.value = true
}

//when outside canvas
const { inside } = outsideCanvas({
  canvas: canvas.colorCanvas(),
  updateCanvas
})

function getHue(color: string = dye.color.hex) {
  const hsv = colord(color).toHsv()
  return colord({ h: hsv.h, s: 100, v: 100 }).toHex()
}

function changeHue() {
  const hue = getHue()
  const color = { hue, saturation: 100, lightness: 100 }
  fillColorCanvas({ color }, canvas.colorCanvas().value)
}

const { width, height } = responsiveCanvas({
  canvas: canvas.colorCanvas(),
  updateCanvas: () => changeHue()
})

function getPercent(percent: number, height?: number) {
  if (!height) return 0
  return (height / 100) * percent
}

watch(width, () => {
  var color = colord(dye.color.hex)
  const hsl = color.toHsl()
  position.value = {
    x: getPercent(hsl.s * 100, width.value),
    y: height.value - getPercent(hsl.l * 100, height.value)
  }
})
</script>

<template>
  <div class="color-canvas-wrapper">
    <Handle :position="position" :color="dye.color" />
    <canvas
      :ref="(el) => canvas.setColorCanvas(el as HTMLCanvasElement)"
      class="color-canvas"
      :width="width"
      :height="height"
      @mousedown="(e) => colorChange(e, true)"
      @mousemove="(e) => colorChange(e)"
      @mouseleave="() => (inside = false)"
    >
    </canvas>
  </div>
</template>

<style lang="scss" scoped>
.color-canvas-wrapper {
  position: relative;
  user-select: none;
  overflow: hidden;
  width: 100%;
  height: 100%;
}

canvas.color-canvas {
  aspect-ratio: 1/1;
  width: 100%;
  height: 100%;
  background-color: var(--base-20, rgb(64, 0, 0));
}
</style>
