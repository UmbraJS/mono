<script setup lang="ts">
import { useCooldown } from '../../composables/useCooldown'
import type { SimCard } from '../../../types/card'
import { useTemplateRef } from 'vue';
import { BifrostFiber } from '@nobel/bifrost'

const {
  card,
  debug = false
} = defineProps<{
  card: SimCard;
  debug?: boolean;
}>()

const simulation = useSimulationInject()

const opacity = computed(() => {
  return simulation.time.value > 0 ? 1 : 0
})

const { cooldown, cooldownDuration, slow, haste, frozen, slowSource, hasteSource, frozenSource } = useCooldown(card.simulation.chunks)

/**
 * Returns a percentage value based on the provided min, max, and value.
 * @param min The minimum value.
 * @param max The maximum value.
 * @param value The current value.
 */
const getPercentage = (min: number, max: number, value: number) => {
  if (value <= min) return 100
  if (value >= max) return 0
  return ((value - min) / (max - min)) * 100
}

/**
 * Tracks a percentage of a value.
 * @param value The value to track.
 * @param percentage The percentage to apply.
 */
const trackPercentage = (value: number, percentage: number) => {
  return (value * percentage) / 100
}

const punchValue = computed(() => {
  const percentage = getPercentage(0, 10, cooldown.value)
  return {
    tracked: trackPercentage(20, percentage),
    percentage: percentage
  }
  // return cooldown.value < 5 ? 20 : 0
})

const cooldownRef = useTemplateRef('cooldownRef')

const fiberTarget = ref<HTMLElement | null>(null)

onMounted(() => {
  const tankCharacters = document.querySelectorAll('.TankCharacter')
  console.log('rex lol', tankCharacters)
  fiberTarget.value = tankCharacters[0] as HTMLElement
})
</script>

<template>
  <div :class="{ slow, haste, frozen }">
    <BifrostFiber v-if="cooldownRef && fiberTarget" :fiber-start="cooldownRef" :fiber-end="fiberTarget"
      orientation="vertical" />

    <div id="BoxingGlove" :class="card.owner.board">
      <h3>{{ punchValue.percentage }}</h3>
    </div>
    <div v-if="cooldown > 0" ref="cooldownRef" class="cooldown" :class="{
      'base-warning': slow, 'base-success': haste, 'base-info': frozen
    }" :style="{ height: `${cooldown}%` }" />
    <div v-if="debug" class="debugPanel">
      <div class="debug grid">
        <p>{{ cooldownDuration.toFixed(1) }}</p>
        <p>{{ Math.floor(cooldown) }}</p>
      </div>
      <div class="debug slowed">
        <p>{{ slow.toFixed(1) }}</p>
        <p>{{ slowSource }}</p>
      </div>
      <div class="debug hasted">
        <p>{{ haste.toFixed(1) }}</p>
        <p>{{ hasteSource }}</p>
      </div>
      <div class="debug freezed">
        <p>{{ frozen.toFixed(1) }}</p>
        <p>{{ frozenSource }}</p>
      </div>
    </div>
  </div>
</template>

<style>
#BoxingGlove {
  position: absolute;
  background-color: var(--base-80);
  width: 100%;
  height: 150px;
  border-radius: var(--radius);
  /* transition: .2s ease-in-out; */
}

#BoxingGlove.player {
  transform: translate(0%, calc(0% - v-bind("punchValue.tracked") * 1%));
}

#BoxingGlove.opponent {
  bottom: 0;
  transform: translate(0%, calc(0% + v-bind("punchValue.tracked") * 1%));
}

.debug {
  display: flex;
  justify-content: space-between;
  background-color: var(--base-40);
  padding: var(--space-quark);
}

.debug.grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  width: 100%;
}

.slow .slowed {
  background-color: var(--warning-40);
  color: var(--warning-120);
}

.haste .hasted {
  background-color: var(--success-40);
  color: var(--success-120);
}

.frozen .freezed {
  background-color: var(--info-40);
  color: var(--info-120);
}

.cooldown {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50%;
  z-index: 1;
  border-top: solid 2px var(--base-120);
  pointer-events: none;
  opacity: v-bind(opacity);
  transition: opacity var(--time);
}

.cooldown::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--base-80);
  opacity: 0.2;
}

.slow .cooldown::after,
.haste .cooldown::after,
.frozen .cooldown::after {
  opacity: 0.5;
}

.debugPanel {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1;
  opacity: 0.8;
}
</style>
