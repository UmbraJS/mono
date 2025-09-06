<template>
  <svg :width="gridWidth" :height="gridHeight" :class="['grid-svg', className]">
    <rect v-for="(_, index) in totalSquares" :key="index" :x="getX(index)" :y="getY(index)" :width="width"
      :height="height" :class="['grid-rect', hoveredSquare === index ? 'grid-rect--active' : '', squaresClassName]"
      @mouseenter="handleMouseEnter(index)" @mouseleave="handleMouseLeave" />
  </svg>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'

interface Props {
  className?: string | Record<string, boolean> | Array<string | Record<string, boolean>>
  squaresClassName?: string | Record<string, boolean> | Array<string | Record<string, boolean>>
  width?: number
  height?: number
  squares?: [number, number]
}

const props = withDefaults(defineProps<Props>(), {
  width: 40,
  height: 40,
  squares: () => [24, 24],
})

const width = computed(() => props.width)
const height = computed(() => props.height)
const horizontal = computed(() => props.squares[0])
const vertical = computed(() => props.squares[1])
const totalSquares = computed(() => horizontal.value * vertical.value)
const hoveredSquare = ref<number | null>(null)
const gridWidth = computed(() => width.value * horizontal.value)
const gridHeight = computed(() => height.value * vertical.value)

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
