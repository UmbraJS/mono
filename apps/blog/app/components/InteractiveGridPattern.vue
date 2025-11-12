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
  /** When using element size, where should the partial (cut-off) square appear? */
  align?: 'left' | 'right'
}

const props = withDefaults(defineProps<Props>(), {
  width: 60,
  height: 60,
  squares: () => [24, 24],
  useElementSize: true,
  align: 'left',
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

// Use ceil() so we always include a final square that may be partially visible (cut off by the edge)
const horizontal = computed(() =>
  props.useElementSize
    ? Math.max(1, Math.ceil((elWidth.value || 0) / (width.value || 1)))
    : props.squares[0],
)
const vertical = computed(() =>
  props.useElementSize
    ? Math.max(1, Math.ceil((elHeight.value || 0) / (height.value || 1)))
    : props.squares[1],
)
const totalSquares = computed(() => horizontal.value * vertical.value)
const hoveredSquare = ref<number | null>(null)
const gridWidth = computed(() => (props.useElementSize ? elWidth.value : width.value * horizontal.value))
const gridHeight = computed(() => (props.useElementSize ? elHeight.value : height.value * vertical.value))

// Compute horizontal offset so that, when overflowing, the partial square can be on the left or right
const offsetX = computed(() => {
  if (!props.useElementSize) return 0
  const virtualWidth = horizontal.value * width.value
  // If aligning right, align the right edge of the virtual grid with the visible width
  return props.align === 'right' ? (elWidth.value - virtualWidth) : 0
})

function getX(index: number) {
  return offsetX.value + (index % horizontal.value) * width.value
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

<template>
  <svg ref="svgRef" :width="gridWidth" :height="gridHeight" :class="['grid-svg', className]">
    <rect v-for="(_, index) in totalSquares" :key="index" :x="getX(index)" :y="getY(index)" :width="width"
      :height="height" :class="['grid-rect', hoveredSquare === index ? 'grid-rect--active' : '', squaresClassName]"
      @mouseenter="handleMouseEnter(index)" @mouseleave="handleMouseLeave" />
  </svg>
</template>

<style scoped>
.grid-svg {
  --gridColor: var(--base-40, #909090);

  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  /* sits above canvas, below overlay */
  z-index: 5;
  /* don't block UI interactions by default; toggle if you want hover interactivity */
  pointer-events: none;
  border: 1px solid color-mix(in srgb, var(--gridColor) 30%, transparent);
}

.grid-rect {
  fill: transparent;
  stroke: color-mix(in srgb, var(--gridColor) 30%, transparent);
  transition-property: fill, stroke;
  transition-duration: 1000ms;
  transition-timing-function: ease-in-out;
}

.grid-rect--active {
  fill: color-mix(in srgb, var(--gridColor) 30%, transparent);
  transition-duration: 100ms;
}

/* Dark mode keeps colors anchored to design tokens */
:root.dark .grid-svg,
.dark .grid-svg,
[data-theme='dark'] .grid-svg {
  border-color: color-mix(in srgb, var(--gridColor) 30%, transparent);
}
</style>
