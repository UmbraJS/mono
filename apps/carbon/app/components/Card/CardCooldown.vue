<script setup lang="ts">
import { onMounted } from 'vue'
import type { SimCard } from '../../../types/card'
import { useCooldown } from '../../composables/useCooldown'
import { gsap } from 'gsap'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { useSplinePath } from './useSpline'
import { useSplinesStore } from '@/stores/useSplinesStore'

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

// Spline / dash setup (per-card) -----------------------------------------
const splinesStore = useSplinesStore()
// Determine opponent target element based on card ownership
const targetEl = computed(() => {
  const owner = card.owner.board
  return owner === 'player' ? splinesStore.tankCharacter.opponent : splinesStore.tankCharacter.player
})

const SplinePath = ref<HTMLElement | null>(null)
const StartPulse = ref<HTMLElement | null>(null)
const EndPulse = ref<HTMLElement | null>(null)

// We can only build a spline path when both refs exist (card root provided via functionRef)
const cardEl = ref<HTMLElement | null>(null)

const spline = computed(() => {
  if (!cardEl.value || !targetEl.value) return null
  return useSplinePath({ start: cardEl.value, end: targetEl.value, stroke: 4, angle: card.owner.board === 'player' ? 90 : -90 })
})

function buildDashTimeline() {
  if (!SplinePath.value || !StartPulse.value || !EndPulse.value) return undefined
  if (!spline.value) return undefined
  const totalDuration = 0.4
  const pulseSize = 4
  const growthDuration = (10 / 100) * totalDuration
  const travelDuration = (80 / 100) * totalDuration
  const shrinkDuration = (10 / 100) * totalDuration
  const tl = gsap.timeline({ defaults: { ease: 'none' } })
  tl.fromTo(
    StartPulse.value,
    { scale: pulseSize, autoAlpha: 0, transformOrigin: '50% 50%' },
    { scale: 1, autoAlpha: 1, duration: growthDuration },
  )
  tl.addLabel('grow')
  tl.fromTo(
    StartPulse.value,
    { scale: 1, autoAlpha: 1, transformOrigin: '50% 50%' },
    { scale: 0, autoAlpha: 1, duration: growthDuration * 4 },
    'grow'
  )
  tl.fromTo(
    SplinePath.value,
    { drawSVG: '0% 0%' },
    { duration: growthDuration, drawSVG: '0% 10%' },
    'grow'
  )
  tl.addLabel('travel')
  tl.fromTo(
    SplinePath.value,
    { drawSVG: '0% 10%' },
    { duration: travelDuration, drawSVG: '90% 100%' },
    'travel'
  )
  tl.addLabel('shrink')
  tl.fromTo(
    SplinePath.value,
    { drawSVG: '90% 100%' },
    { duration: shrinkDuration, drawSVG: '100% 100%' },
    'shrink'
  )
  tl.fromTo(
    EndPulse.value,
    { scale: 0, autoAlpha: 1, transformOrigin: '50% 50%' },
    { scale: pulseSize, autoAlpha: 0, duration: shrinkDuration * 4 },
    'shrink'
  )
  return tl
}

// Integrate dash timeline at end of each cooldown segment
const { cooldown, cooldownDuration, slow, haste, frozen, slowSource, hasteSource, frozenSource } = useCooldown(card.simulation.chunks, {
  onAttack: () => emit('cardAttack'),
  // attackTimelineFactory: () => buildDashTimeline()
})

function functionRef(el: HTMLElement | null) {
  if (!el) return
  cardEl.value = el
  emit('functionRef', el)
}

// onMounted(() => {
//   if (spline.value && cardEl.value && targetEl.value) {
//     console.log('REX: CardCooldown mounted for', {
//       d: spline.value.d.value
//     })
//   }
// })
</script>

<template>
  <div id="CardCooldown" :class="{ slow, haste, frozen }">
    <div v-if="cooldown > 0" :ref="(el) => functionRef(el as HTMLElement)" class="cooldown" :class="{
      'base-warning': slow, 'base-success': haste, 'base-info': frozen
    }" :style="{ height: `${cooldown}%` }" />

    <CardSpline v-if="spline && cardEl && targetEl" :owner="card.owner.board" :start-center="spline.getCenter(cardEl)"
      :end-center="spline.getCenter(targetEl)" :stroke-width="spline.stroke" :path="spline.d.value" />

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

/* Spline integration */
.IntegratedSpline {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
}

.SplinePulse {
  position: absolute;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--accent-120);
  pointer-events: none;
  transform: translate(-50%, -50%);
  z-index: 3;
}
</style>
