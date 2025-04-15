<script setup lang="ts">
import { gsap } from 'gsap'
import type { Character } from '~~/types'
import MeterLines from './MeterLines.vue'

const props = defineProps<{
  character: Character
  health: number
  maxHealth: number
}>()

const healthPercentage = computed(() => {
  return (Math.max(0, props.health) / props.maxHealth) * 100
})

const healthPercentageDelayed = ref(healthPercentage.value)

watch(healthPercentage, (newValue) => {
  console.log('healthPercentage', newValue)

  gsap.to(healthPercentageDelayed, {
    duration: 1,
    value: newValue,
  })
})
</script>

<template>
  <div class="character-health">
    <MeterLines :value="character.maxHealth" :meter="30" />
    <p class="digits"><slot /></p>
    <div class="death bar"></div>
    <div class="delayedLife bar"></div>
    <div class="life bar"></div>
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
  background-color: var(--success-50);
  width: calc(v-bind(healthPercentage) * 1%);
  transition: 0.1s;
}

.character-health .delayedLife {
  background-color: var(--warning-50);
  width: calc(v-bind(healthPercentageDelayed) * 1%);
}

.character-health .death {
  background-color: var(--base-20);
  width: calc(100% - v-bind(healthPercentageDelayed) * 1% - var(--space-quark));
  right: 0;
}
</style>
