<script setup lang="ts">
import { useSplinePath } from '../composables/useSpline'
import type { CarbonState } from '../types'
import { computed } from 'vue'

const {
  fiberStart,
  fiberEnd,
  orientation,
  startState = [],
  endState = []
} = defineProps<{
  /** Starting element of the fiber */
  fiberStart?: HTMLDivElement | null
  /** Ending element of the fiber */
  fiberEnd?: HTMLDivElement | null
  /** Orientation of the fiber path (horizontal | vertical) */
  orientation?: 'horizontal' | 'vertical'
  startState?: CarbonState[]
  endState?: CarbonState[]
}>()

const state = computed(() => {
  return [...startState, ...endState].join(' ')
})

// Initialize with current value (may be undefined until mounted)
// New lightweight spline composable replaces legacy geometry system.
const spline = useSplinePath({
  start: fiberStart,
  end: fiberEnd,
  angle: orientation === 'horizontal' ? 0 : 90,
  // svgClass: state,
  stroke: 4,
  startTension: 15,
  endTension: 15
})

defineExpose({ update: spline.recalc })
</script>

<template>
  <div id="BifrostFiber" :class="state" />
</template>

<style>
#BifrostFiber {
  display: none;
}

.BifrostSpline {
  opacity: 1;
  transition: opacity .15s ease;
}

.BifrostSpline.born {
  opacity: 0;
}
</style>
