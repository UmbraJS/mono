<script setup lang="ts">
import tinycolor from "tinycolor2"
import { ref, onMounted, Ref, watch } from 'vue'
import { getDimentions } from "../../composables/canvas"
import { 
  offCanvas, 
  canvasPixelColor, 
  isActiveCanvas,
  mousedown,
  outsideCanvas,
  hexType,
  responsiveCanvas
} from '../../composables/canvas'
import { fillColorCanvas } from '../../composables/gradient'
import Handle from '../Handle.vue'

interface Hsl {
  h: number;
  s: number;
  l: number;
}

const emit = defineEmits(['change'])
const props = defineProps<{
  width: number;
  colorCanvas: () => Ref<HTMLCanvasElement | null>;
  color: {
    value: string;
    name: string;
  };
}>()

const hueCanvas = ref<HTMLCanvasElement | null>(null)
const position = ref({x: 30, y: 70})

const { mouseOn } = outsideCanvas({ 
  canvas: hueCanvas, 
  updateCanvas
})

function hueGradient(ctx: CanvasRenderingContext2D, height: number, hsl: Hsl = {h: 0, s: 1, l: 0.5}) {
  const gradient = ctx.createLinearGradient(0, 0, 0, height)
  for (var hue = 0; hue <= 360; hue++) {
    var hslColor = `hsl(${hue}, ${hsl.s * 100}%, ${hsl.l * 100}%)`;
    gradient.addColorStop(hue / 360, hslColor);
  }
  return gradient
}

function fillHueCanvas(color: string = props.color.value) {
  if(!hueCanvas.value) return
  const ctx = hueCanvas.value?.getContext('2d')
  if(ctx === null) return
  const { height, width } = getDimentions(hueCanvas.value)

  const hsl = tinycolor(color).toHsl();
  ctx.fillStyle = hueGradient(ctx, height, hsl)
  ctx.fillRect(0, 0, width, height)
}

watch(() => props.color.value, (color) => {
  fillHueCanvas(color)
})

function hueChange(e: MouseEvent, click = false) {
  if(click) mousedown.value = true
  if(offCanvas(e, click)) return
  if(isActiveCanvas(e.target)) return
  const hex = canvasPixelColor(e, hueCanvas.value)
  updateCanvas(hex)
  mouseOn.value = true
}

function updateCanvas(hex: hexType) {
  if(!hex) return
  emit('change', hex)
  fillColorCanvas({hue: hex.color}, props.colorCanvas().value)
  position.value = {
    x: position.value.x,
    y: hex.position.y
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
    x:  canvasCenter,
    y
  }
}

function huePercent(hue: number, height?: number) {
  if(!height) return 0
  const percent = (hue / 360) * 100
  return height * (percent / 100)
}

onMounted(() => {
  fillHueCanvas()
  setCenterHandle()

  var color = tinycolor(props.color.value);
  const hsl = color.toHsl();

  updateCanvas({
    color: props.color.value,
    position: {
      x: 0,
      y: huePercent(hsl.h, canvasHeight.value)
    }
  })
})
</script>

<template>
  <div class="hue-canvas-wrapper">
    <slot :position="position">
      <Handle 
        :position="position" 
        :color="color"
      />
    </slot>
    <canvas
      ref="hueCanvas"
      class="hue-canvas"
      :width="canvasWidth"
      :height="canvasHeight"
      @mousedown="(e) => hueChange(e, true)"
      @mousemove="(e) => hueChange(e)"
      @mouseleave="() => mouseOn = false"
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
  background-color: var(--background-20, rgb(64, 0, 0));
}
</style>
