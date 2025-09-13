<script setup lang="ts">
import { useCooldown } from '../../composables/useCooldown'
import type { SimCard } from '../../../types/card'
import { gsap } from 'gsap'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'

gsap.registerPlugin(DrawSVGPlugin);

const emit = defineEmits<{
  (e: 'functionRef', el: HTMLElement): void
  (e: 'cardAttack'): void
}>()

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

const { cooldown, cooldownDuration, slow, haste, frozen, slowSource, hasteSource, frozenSource } = useCooldown(card.simulation.chunks, () => {
  emit('cardAttack')
})

function functionRef(el: HTMLElement | null) {
  if (!el) return
  emit('functionRef', el)
}
</script>

<template>s
  <div id="CardCooldown" :class="{ slow, haste, frozen }">
    <div v-if="cooldown > 0" :ref="(el) => functionRef(el as HTMLElement)" class="cooldown" :class="{
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
html body #BifrostFiber {
  z-index: 99 !important;
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
