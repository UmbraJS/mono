<script setup lang="ts">
import { computed, ref, defineProps } from 'vue'

const orients = ref(false)

const props = defineProps<{
  curve: number
  stroke: number
  width: number
  height: number
  flipped: boolean
}>()

function horizontal() {
  const width = props.width
  const height = props.height
  const curve = width * props.curve
  const strokeOffset = props.stroke / 2
  const top = strokeOffset
  const bottom = height - strokeOffset
  const start = props.flipped ? top : bottom
  const end = `${width}, ${props.flipped ? bottom : top}`
  const startCurve = `${curve}, ${props.flipped ? top : bottom}`
  const endCurve = `${width - curve}, ${props.flipped ? bottom : top}`
  return `M0, ${start} C${startCurve}, ${endCurve}, ${end}`
}

function vertical() {
  const height = props.height
  const curveStrength = height * props.curve
  const strokeOffset = props.stroke / 2
  const top = strokeOffset
  const bottom = height - strokeOffset
  const start = props.flipped ? top : bottom
  const end = `${props.flipped ? bottom : top}, ${height}`
  const startCurve = `${props.flipped ? top : bottom}, ${curveStrength}`
  const endCurve = `${props.flipped ? bottom : top}, ${height - curveStrength}`
  return `M${start} 0 C${startCurve}, ${endCurve}, ${end}`
}

const data = computed(() => (orients.value ? vertical() : horizontal()))
</script>

<template>
  <div id="rome" class="ancor">
    <svg :width="width" :height="height" xmlns="http://www.w3.org/2000/svg">
      <path :d="data" :stroke-width="props.stroke" />
    </svg>
  </div>
</template>

<style scoped>
#rome {
  background-color: var(--base);
  position: absolute;
  z-index: 0;
}

#rome svg path {
  fill: transparent;
  stroke: var(--accent);
}
</style>
