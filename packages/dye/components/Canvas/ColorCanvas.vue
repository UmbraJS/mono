<script setup lang="ts">
import { ref, Ref, watch } from 'vue'
import { colord } from 'colord'
import {
  hexType,
  offCanvas,
  canvasPixelColor,
  isActiveCanvas,
  mousedown,
  outsideCanvas,
  responsiveCanvas
} from '../../composables/canvas'
import { fillColorCanvas } from '../../composables/gradient'
import Handle from '../Handle.vue'

const emit = defineEmits<{
  (e: 'change', hex: hexType): void
}>()

const props = defineProps<{
  getRef: () => Ref<HTMLCanvasElement | null>
  setRef: (el: any) => void
  color: {
    value: string
    name: string
  }
}>()

let position = ref({ x: 0, y: 0 })

function updateCanvas(hex: hexType) {
  if (!hex) return
  emit('change', hex)
  position.value = hex.position
}

//Update color while dragging inside canvas
function colorChange(e: MouseEvent, click = false) {
  if (click) mousedown.value = true
  if (offCanvas(e, click)) return
  if (isActiveCanvas(e.target)) return
  const hex = canvasPixelColor(e, props.getRef().value)
  updateCanvas(hex)
  mouseOn.value = true
}

//when outside canvas
const { mouseOn } = outsideCanvas({
  canvas: props.getRef(),
  updateCanvas
})

function getHue(color: string = props.color.value) {
  const hsv = colord(color).toHsv()
  return colord({ h: hsv.h, s: 100, v: 100 }).toHex()
}

const { width, height } = responsiveCanvas({
  canvas: props.getRef(),
  updateCanvas: () => {
    const hue = getHue()
    const data = { hue, saturation: 100, lightness: 100 }
    fillColorCanvas(data, props.getRef().value)
  }
})

function getPercent(percent: number, height?: number) {
  if (!height) return 0
  return (height / 100) * percent
}

watch(width, () => {
  var color = colord(props.color.value)
  const hsl = color.toHsl()
  position.value = {
    x: getPercent(hsl.s * 100, width.value),
    y: height.value - getPercent(hsl.l * 100, height.value)
  }
})
</script>

<template>
  <div class="color-canvas-wrapper">
    <Handle :position="position" :color="color" />
    <canvas
      :ref="setRef"
      class="color-canvas"
      :width="width"
      :height="height"
      @mousedown="(e) => colorChange(e, true)"
      @mousemove="(e) => colorChange(e)"
      @mouseleave="() => (mouseOn = false)"
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
