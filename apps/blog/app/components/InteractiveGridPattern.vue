<template>
  <svg ref="svgRef" :width="gridWidth" :height="gridHeight" :class="['grid-svg', className]">
    <rect v-for="(_, index) in totalSquares" :key="index" :x="getX(index)" :y="getY(index)" :width="width"
      :height="height" :class="['grid-rect', hoveredSquare === index ? 'grid-rect--active' : '', squaresClassName]"
      @mouseenter="handleMouseEnter(index)" @mouseleave="handleMouseLeave" />
  </svg>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

interface Props {
  className?: string | Record<string, boolean> | Array<string | Record<string, boolean>>
  squaresClassName?: string | Record<string, boolean> | Array<string | Record<string, boolean>>
  width?: number
  height?: number
  squares?: [number, number]
  /** When true, compute rows/cols from the element's rendered size */
  useElementSize?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  width: 60,
  height: 60,
  squares: () => [24, 24],
  useElementSize: true,
})

const width = computed(() => props.width)
const height = computed(() => props.height)
// Track rendered size of the SVG (100% of container)
const svgRef = ref<SVGSVGElement | null>(null)
const elWidth = ref(0)
const elHeight = ref(0)
let ro: ResizeObserver | null = null

onMounted(() => {
  const el = svgRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  elWidth.value = rect.width
  elHeight.value = rect.height
  ro = new ResizeObserver((entries) => {
    const cr = entries[0]?.contentRect
    if (!cr) return
    elWidth.value = cr.width
    elHeight.value = cr.height
  })
  ro.observe(el)
})

onBeforeUnmount(() => {
  ro?.disconnect(); ro = null
})

const horizontal = computed(() =>
  props.useElementSize
    ? Math.max(1, Math.floor((elWidth.value || 0) / (width.value || 1)))
    : props.squares[0],
)
const vertical = computed(() =>
  props.useElementSize
    ? Math.max(1, Math.floor((elHeight.value || 0) / (height.value || 1)))
    : props.squares[1],
)
const totalSquares = computed(() => horizontal.value * vertical.value)
const hoveredSquare = ref<number | null>(null)
const gridWidth = computed(() => (props.useElementSize ? elWidth.value : width.value * horizontal.value))
const gridHeight = computed(() => (props.useElementSize ? elHeight.value : height.value * vertical.value))

function getX(index: number) {
  return (index % horizontal.value) * width.value
}
function getY(index: number) {
  return Math.floor(index / horizontal.value) * height.value
}
function handleMouseEnter(index: number) {
  hoveredSquare.value = index
}
function handleMouseLeave() {
  hoveredSquare.value = null
}

const className = computed(() => props.className)
const squaresClassName = computed(() => props.squaresClassName)
</script>

<style scoped>
.grid-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  /* sits above canvas, below overlay */
  z-index: 5;
  /* don't block UI interactions by default; toggle if you want hover interactivity */
  pointer-events: none;
  border: 1px solid color-mix(in srgb, var(--base-120, #909090) 30%, transparent);
}

.grid-rect {
  fill: transparent;
  stroke: color-mix(in srgb, var(--base-120, #909090) 30%, transparent);
  transition-property: fill, stroke;
  transition-duration: 1000ms;
  transition-timing-function: ease-in-out;
}

.grid-rect--active {
  fill: color-mix(in srgb, var(--base-120, #909090) 30%, transparent);
  transition-duration: 100ms;
}

/* Dark mode keeps colors anchored to design tokens */
:root.dark .grid-svg,
.dark .grid-svg,
[data-theme='dark'] .grid-svg {
  border-color: color-mix(in srgb, var(--base-120, #909090) 30%, transparent);
}
</style>
