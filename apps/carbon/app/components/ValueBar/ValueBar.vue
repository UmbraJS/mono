<script setup lang="ts">
import { gsap } from 'gsap'
import MeterLines from './MeterLines.vue'

const props = defineProps<{
  value: number
  maxValue: number
  barColor: string
  delayColor: string
  gridArea: 'health' | 'shield'
}>()

const percentage = computed(() => {
  return (Math.max(0, props.value) / props.maxValue) * 100
})

const percentageDelayed = ref(percentage.value)

watch(percentage, (newValue) => {
  gsap.to(percentageDelayed, {
    duration: 1,
    value: newValue,
  })
})
</script>

<template>
  <div
class="character-health" :style="{
    '--barColor': props.barColor,
    '--delayColor': props.delayColor,
    gridArea: props.gridArea,
  }">
    <MeterLines :value="props.maxValue" :meter="30" />
    <p class="digits">
      <slot />
    </p>
    <div
class="death bar" :style="{
      width: percentage === 0 ? '100%' : `calc(100% - ${percentageDelayed}% - var(--space-quark))`
    }"/>
    <div class="delayedLife bar"/>
    <div class="life bar"/>
  </div>
</template>

<style>
.character-health {
  display: flex;
  align-items: center;
  position: relative;
  background: var(--base);
  overflow: hidden;
  width: 100%;
  height: var(--paragraph);
  font-weight: 900;
  grid-area: health;
}

.character-health .digits {
  position: absolute;
  padding: 0 var(--space-1);
  font-variation-settings: var(--font-semibold);
  z-index: 1;
}

.character-health .bar {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: var(--radius);
  height: 100%;
}

.character-health .life {
  background-color: var(--barColor);
  width: calc(v-bind(percentage) * 1%);
  transition: 0.1s;
}

.character-health .delayedLife {
  background-color: var(--delayColor);
  width: calc(v-bind(percentageDelayed) * 1%);
}

.character-health .death {
  background-color: var(--base-20);
  width: calc(100% - v-bind(percentageDelayed) * 1% - var(--space-quark));
  right: 0;
}
</style>
