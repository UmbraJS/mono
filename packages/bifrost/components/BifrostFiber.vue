<script setup lang="ts">
import { computed, defineProps, onMounted, defineExpose, inject, type Ref, watch } from 'vue'
import { useResizeObserver } from '@vueuse/core'
import { useBifrostFiber } from '../composables/useBifrostFiber'

interface FiberProps {
  /** Starting element of the fiber (replaces deprecated 'output') */
  fiberStart?: HTMLDivElement
  /** Ending element of the fiber (replaces deprecated 'input') */
  fiberEnd?: HTMLDivElement
  /** @deprecated Use fiberStart instead */
  output?: HTMLDivElement
  /** @deprecated Use fiberEnd instead */
  input?: HTMLDivElement
}

const props = defineProps<FiberProps>()

// Backward compatibility: allow old prop names while encouraging new ones
const fiberStart = props.fiberStart ?? props.output
const fiberEnd = props.fiberEnd ?? props.input

if (!props.fiberStart && props.output) {
  console.warn('[BifrostFiber] Prop "output" is deprecated. Use "fiberStart" instead.')
}
if (!props.fiberEnd && props.input) {
  console.warn('[BifrostFiber] Prop "input" is deprecated. Use "fiberEnd" instead.')
}

// Provided in BifrostBoard.vue as a ref<HTMLDivElement>()
const boardRef = inject<Ref<HTMLDivElement | undefined>>('BifrostBoard')

// Initialize with current value (may be undefined until mounted)
const fiber = useBifrostFiber({
  board: boardRef?.value,
  fiberStart,
  fiberEnd
})

// When the board ref becomes available later, trigger an update
if (boardRef) {
  watch(boardRef, (el) => {
    if (el) {
      // Re-run update once the actual element exists
      setTimeout(() => fiber.update(), 0)
    }
  })
}

defineExpose({ update: fiber.update })

const data = computed(() => {
  const path = fiber.path.value
  const flipped = path.reversed ? !path.flipped : path.flipped
  return createPathData(flipped)
})

function createPathData(flipped: boolean) {
  const path = fiber.path.value
  const width = path.width - path.padding
  const height = path.height
  const curve = width * path.curve
  const strokeOffset = path.stroke / 2
  const top = strokeOffset + path.padding
  const bottom = height - strokeOffset - path.padding

  const start = flipped ? top : bottom
  const end = `${width}, ${flipped ? bottom : top}`
  const startCurve = `${curve}, ${flipped ? top : bottom}`
  const endCurve = `${width - curve}, ${flipped ? bottom : top}`

  return `M${path.padding}, ${start} C${startCurve}, ${endCurve}, ${end}`
}

onMounted(() => {
  setTimeout(() => fiber.update(), 0)
  if (!boardRef) return
  useResizeObserver(boardRef, () => {
    fiber.update()
  })
})
</script>

<template>
  <div :ref="(e: any) => e && e.tagName === 'DIV' && fiber.set(e)" id="BifrostFiber">
    <svg :width="fiber.path.value.width" :height="fiber.path.value.height" xmlns="http://www.w3.org/2000/svg">
      <path :d="data" :stroke-width="fiber.path.value.stroke" stroke-linecap="round" />
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
