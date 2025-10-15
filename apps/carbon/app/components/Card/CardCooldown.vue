<script setup lang="ts">
import type { SimCard } from '../../../types/card'
import { useCooldown } from '../../composables/useCooldown'
import { gsap } from 'gsap'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { useSplinePath } from './useSpline'
import { useSplinesStore } from '@/stores/useSplinesStore'
import { useAnimationTimeline } from './composables/useAnimationTimeline'
import { useCooldownState } from './composables/useCooldownState'
import { useSplineRefs } from './composables/useSplineRefs'
import CardCooldownDebugPanel from './CardCooldownDebugPanel.vue'
import GsapTimelineInspector from '../GSAPInspector.vue'

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

// Template refs management
const splineRefs = useSplineRefs()
const { cardEl } = splineRefs

// Spline / dash setup (per-card) -----------------------------------------
const splinesStore = useSplinesStore()

// Determine opponent target element based on card ownership
const targetEl = computed(() => {
  const owner = card.owner.board
  return owner === 'player' ? splinesStore.tankCharacter.opponent : splinesStore.tankCharacter.player
})

const spline = useSplinePath({
  start: cardEl,
  end: targetEl,
  stroke: 4,
  angle: card.owner.board === 'player' ? 90 : -90
})

// Animation timeline management
const animationTimeline = useAnimationTimeline(splineRefs.refs.value)

// Integrate dash timeline at end of each cooldown segment
const cooldown = useCooldown(card.simulation.chunks, {
  onAttack: () => emit('cardAttack'),
  attackTimelineFactory: () => animationTimeline.buildDashTimeline()
})

// Cooldown state management
const cooldownStateManager = useCooldownState({
  frozen: cooldown.frozen,
  slow: cooldown.slow,
  haste: cooldown.haste
})

const { stateName: cooldownState, colorClass: cooldownStateColourClass } = cooldownStateManager

// Template ref handlers for CardSpline component
function handleSplinePathRef(el: SVGPathElement) {
  splineRefs.splinePath.value = el
}

function handleStartRef(el: HTMLElement) {
  splineRefs.startPulse.value = el
}

function handleEndRef(el: HTMLElement) {
  splineRefs.endPulse.value = el
}

// Debug data for the debug panel
const debugData = computed(() => ({
  cooldownDuration: cooldown.cooldownDuration.value,
  cooldownValue: cooldown.cooldownValue.value,
  slow: cooldown.slow.value,
  slowSource: cooldown.slowSource.value,
  haste: cooldown.haste.value,
  hasteSource: cooldown.hasteSource.value,
  frozen: cooldown.frozen.value,
  frozenSource: cooldown.frozenSource.value
}))
</script>

<template>
  <div id="CardCooldown" ref="cardEl" :class="cooldownState">
    <div v-if="cooldown.cooldownValue.value > 0" class="cooldown" :class="cooldownStateColourClass"
      :style="{ height: `${cooldown.cooldownValue.value}%` }" />

    <CardSpline v-if="spline && cardEl && targetEl" :owner="card.owner.board" :start-center="spline.getCenter(cardEl)"
      :end-center="spline.getCenter(targetEl)" :stroke-width="spline.stroke" :path="spline.d.value"
      @spline-path-ref="handleSplinePathRef" @end-ref="handleEndRef" @start-ref="handleStartRef" />

    <CardCooldownDebugPanel v-if="debug" :data="debugData" :current-state="cooldownState" />

    <GsapTimelineInspector v-if="cooldown.master" :root="cooldown.master" :nested="true" :bake-time-scale="false"
      :px-per-sec="140" />
  </div>
</template>

<style>
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
</style>
