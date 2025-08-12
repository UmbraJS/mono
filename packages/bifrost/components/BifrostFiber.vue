<script setup lang="ts">
import { defineProps, onMounted, defineExpose, inject, type Ref, watch, nextTick } from 'vue'
import { useResizeObserver } from '@vueuse/core'
import { useBifrostFiber } from '../composables/useBifrostFiber'
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
const fiber = useBifrostFiber({
  board: boardRef?.value,
  fiberStart,
  fiberEnd,
  orientation,
})

// When the board ref becomes available later, trigger an update
if (boardRef) {
  watch(boardRef, (el) => el && nextTick(() => fiber.updateLayout()))
}

defineExpose({ update: fiber.updateLayout })

onMounted(() => {
  nextTick(() => fiber.updateLayout())
  if (!boardRef) return
  useResizeObserver(boardRef, () => fiber.updateLayout())
})
</script>

<template>
  <div :ref="(e: any) => e && e.tagName === 'DIV' && fiber.setElement(e)" id="BifrostFiber"
    :class="[...startState, ...endState]">
    <div v-if="false" id="BifrostFiberDebug">
      <p>orientation: {{ orientation }}</p>
      <p>flipped: {{ fiber.renderFlipped.value }}</p>
      <p>reversed: {{ fiber.path.value.reversed }}</p>
    </div>
    <svg :width="fiber.path.value.width" :height="fiber.path.value.height" xmlns="http://www.w3.org/2000/svg">
      <path :d="fiber.pathD.value" :stroke-width="fiber.path.value.stroke" stroke-linecap="round" />
    </svg>
  </div>
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
