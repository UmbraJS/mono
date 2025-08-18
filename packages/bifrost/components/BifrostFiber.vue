<script setup lang="ts">
import { defineProps, onMounted, defineExpose, inject, type Ref, watch, nextTick } from 'vue'
import { useResizeObserver } from '@vueuse/core'
import { useSpline } from '../composables/useSpline'
import type { CarbonState } from '../types'


const {
  fiberStart,
  fiberEnd,
  orientation,
  startState = [],
  endState = []
} = defineProps<{
  /** Starting element of the fiber */
  fiberStart?: HTMLDivElement
  /** Ending element of the fiber */
  fiberEnd?: HTMLDivElement
  /** Orientation of the fiber path (horizontal | vertical) */
  orientation?: 'horizontal' | 'vertical'
  startState?: CarbonState[]
  endState?: CarbonState[]
}>()

// Provided in BifrostBoard.vue as a ref<HTMLDivElement>()
const boardRef = inject<Ref<HTMLDivElement | undefined>>('BifrostBoard')

// Initialize with current value (may be undefined until mounted)
// New lightweight spline composable replaces legacy geometry system.
const spline = useSpline({
  start: fiberStart,
  end: fiberEnd,
  angle: orientation === 'horizontal' ? 0 : 90,
  stroke: 4,
})

// When the board ref becomes available later, trigger an update
if (boardRef) {
  watch(boardRef, (el) => el && nextTick(() => spline.update()))
}

defineExpose({ update: spline.update })

onMounted(() => {
  nextTick(() => spline.update())
  if (!boardRef) return
  useResizeObserver(boardRef, () => spline.update())
})
</script>

<template>
  <div id="BifrostFiber" :class="[...startState, ...endState]" />
</template>

<style scoped>
#BifrostFiber {
  position: absolute;
  z-index: 0;
  opacity: 1;
  transition: opacity .15s ease;
}

#BifrostFiber.born {
  opacity: 0;
}

#BifrostFiberDebug {
  position: absolute;
  z-index: 9999999;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--accent-10);
  padding: 10px;
  min-width: max-content
}

#BifrostFiber svg path {
  fill: transparent;
  stroke: var(--accent-100);
}
</style>
