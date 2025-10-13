<script setup lang="ts">
import { useTemplateRef } from 'vue'
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

const SplinePath = ref<SVGPathElement | null>(null)
const StartPulse = ref<HTMLElement | null>(null)
const EndPulse = ref<HTMLElement | null>(null)

// We can only build a spline path when both refs exist (card root provided via functionRef)
const cardEl = useTemplateRef<HTMLElement | null>('cardEl')

const spline = useSplinePath({
  start: cardEl,
  end: targetEl,
  stroke: 4,
  angle: card.owner.board === 'player' ? 90 : -90
})

function buildDashTimeline() {
  if (!SplinePath.value || !StartPulse.value || !EndPulse.value) return undefined
  const totalDuration = 2
  const pulseSize = 4
  const pulsePercent = 30
  // Growth duration is pulsePercent% of total duration (time to grow and fade out)
  const growthDuration = (totalDuration * pulsePercent) / 100
  const travelDuration = ((100 - pulsePercent * 2) / 100) * totalDuration
  const shrinkDuration = growthDuration // Same as growth for symmetry
  const tl = gsap.timeline({ defaults: { ease: 'none' } })

  // Phase 1: Initial growth (0% to 30% of total time)
  tl.fromTo(
    StartPulse.value,
    { scale: pulseSize, autoAlpha: 0, transformOrigin: '50% 50%' },
    { scale: 0, autoAlpha: 1, duration: growthDuration },
    0 // Start immediately
  )
  tl.fromTo(
    SplinePath.value,
    { drawSVG: '0% 0%' },
    { duration: growthDuration, drawSVG: '0% 10%' },
    0 // Start immediately
  )

  // Phase 2: Travel (30% to 70% of total time)
  tl.fromTo(
    SplinePath.value,
    { drawSVG: '0% 10%' },
    { duration: travelDuration, drawSVG: '90% 100%' },
    growthDuration // Start after growth phase
  )

  // Phase 3: Final shrink (70% to 100% of total time)
  tl.fromTo(
    SplinePath.value,
    { drawSVG: '90% 100%' },
    { duration: shrinkDuration, drawSVG: '100% 100%' },
    growthDuration + travelDuration // Start after travel phase
  )
  tl.fromTo(
    EndPulse.value,
    { scale: 0, autoAlpha: 1, transformOrigin: '50% 50%' },
    { scale: pulseSize, autoAlpha: 0, duration: shrinkDuration },
    growthDuration + travelDuration // Start after travel phase
  )

  return {
    timeline: tl,
    totalDuration: totalDuration - shrinkDuration
  }
}

// Integrate dash timeline at end of each cooldown segment
const cooldown = useCooldown(card.simulation.chunks, {
  onAttack: () => emit('cardAttack'),
  attackTimelineFactory: () => buildDashTimeline()
})

function onSplinePathRef(path: SVGPathElement) {
  SplinePath.value = path
}

function onStartRef(el: HTMLElement) {
  StartPulse.value = el
}

function onEndRef(el: HTMLElement) {
  EndPulse.value = el
}

const cooldownState = computed(() => {
  if (cooldown.frozen.value > 0) return 'frozen'
  if (cooldown.slow.value > 0) return 'slow'
  if (cooldown.haste.value > 0) return 'haste'
  return 'normal'
})

const cooldownStateColourClass = computed(() => {
  if (cooldown.frozen.value > 0) return 'base-info'
  if (cooldown.slow.value > 0) return 'base-warning'
  if (cooldown.haste.value > 0) return 'base-success'
  return 'base-120'
})
</script>

<template>
  <div id="CardCooldown" ref="cardEl" :class="cooldownState">
    <div v-if="cooldown.cooldownValue.value > 0" class="cooldown" :class="cooldownStateColourClass"
      :style="{ height: `${cooldown.cooldownValue.value}%` }" />

    <CardSpline v-if="spline && cardEl && targetEl" :owner="card.owner.board" :start-center="spline.getCenter(cardEl)"
      :end-center="spline.getCenter(targetEl)" :stroke-width="spline.stroke" :path="spline.d.value"
      @spline-path-ref="onSplinePathRef" @end-ref="onEndRef" @start-ref="onStartRef" />

    <div v-if="debug" class="debugPanel">
      <div class="debug grid">
        <p>{{ cooldown.cooldownDuration.value.toFixed(1) }}</p>
        <p>{{ Math.floor(cooldown.cooldownValue.value) }}</p>
      </div>
      <div class="debug slowed">
        <p>{{ cooldown.slow.value.toFixed(1) }}</p>
        <p>{{ cooldown.slowSource.value }}</p>
      </div>
      <div class="debug hasted">
        <p>{{ cooldown.haste.value.toFixed(1) }}</p>
        <p>{{ cooldown.hasteSource.value }}</p>
      </div>
      <div class="debug freezed">
        <p>{{ cooldown.frozen.value.toFixed(1) }}</p>
        <p>{{ cooldown.frozenSource.value }}</p>
      </div>
    </div>
  </div>
</template>

<style>
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
