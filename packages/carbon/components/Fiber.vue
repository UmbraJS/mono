<script setup lang="ts">
import { computed, defineProps, onMounted, defineExpose } from 'vue'
import { useResizeObserver } from '@vueuse/core'
import { useFiber } from '../composables/useFiber'

interface FiberProps {
  bounds?: HTMLDivElement
  output?: HTMLDivElement
  input?: HTMLDivElement
}

const { output, input, bounds } = defineProps<FiberProps>()

const fiber = useFiber({
  board: bounds,
  output: output,
  input: input
})

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
  useResizeObserver(bounds, () => {
    fiber.update()
  })
})
</script>

<template>
  <div :ref="(e) => fiber.set(e as HTMLDivElement)" id="rome" class="ancor">
    <svg
      :width="fiber.path.value.width"
      :height="fiber.path.value.height"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path :d="data" :stroke-width="fiber.path.value.stroke" stroke-linecap="round" />
    </svg>
  </div>
</template>

<style scoped>
#rome {
  position: absolute;
  z-index: 0;
}

#rome svg path {
  fill: transparent;
  stroke: var(--accent);
}
</style>
../composables/useFiber
