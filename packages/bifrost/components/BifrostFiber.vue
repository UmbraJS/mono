<script setup lang="ts">
import { defineProps, onMounted, defineExpose, inject, type Ref, watch, nextTick } from 'vue'
import { useResizeObserver } from '@vueuse/core'
import { useBifrostFiber } from '../composables/useBifrostFiber'

interface FiberProps {
  /** Starting element of the fiber */
  fiberStart?: HTMLDivElement
  /** Ending element of the fiber */
  fiberEnd?: HTMLDivElement
  /** Orientation of the fiber path (horizontal | vertical) */
  orientation?: 'horizontal' | 'vertical'
}

const props = defineProps<FiberProps>()
// Provided in BifrostBoard.vue as a ref<HTMLDivElement>()
const boardRef = inject<Ref<HTMLDivElement | undefined>>('BifrostBoard')

// Initialize with current value (may be undefined until mounted)
const fiber = useBifrostFiber({
  board: boardRef?.value,
  fiberStart: props.fiberStart,
  fiberEnd: props.fiberEnd,
  orientation: props.orientation
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
  <div :ref="(e: any) => e && e.tagName === 'DIV' && fiber.setElement(e)" id="BifrostFiber">
    <svg :width="fiber.path.value.width" :height="fiber.path.value.height" xmlns="http://www.w3.org/2000/svg">
      <path :d="fiber.pathD.value" :stroke-width="fiber.path.value.stroke" stroke-linecap="round" />
    </svg>
  </div>
</template>

<style scoped>
#BifrostFiber {
  position: absolute;
  z-index: 0;
}

#BifrostFiber svg path {
  fill: transparent;
  stroke: var(--accent-100);
}
</style>
