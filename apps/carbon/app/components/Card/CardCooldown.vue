<script setup lang="ts">
import type { SimCard } from '../../../types/card'
import { useCooldown } from '../../composables/useCooldown'

import { useSplinePath } from './useSpline'
import { useSplinesStore } from '@/stores/useSplinesStore'
import { useMotionPathTimeline } from './composables/useMotionPathTimeline'
import { useCooldownState } from './composables/useCooldownState'
import { useSplineRefs } from './composables/useSplineRefs'
import CardCooldownDebugPanel from './CardCooldownDebugPanel.vue'

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
const animationTimeline = useMotionPathTimeline(splineRefs.refs.value)

// Integrate dash timeline at end of each cooldown segment
const cooldown = useCooldown(card.simulation.chunks, {
  onAttack: () => emit('cardAttack'),
  attackTimelineFactory: (segmentDuration) => animationTimeline.buildMotionPathTimeline(segmentDuration)
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

function handleMaskElementRef(el: SVGRectElement) {
  splineRefs.maskElement.value = el
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

    <!-- TODO: Im pretty sure that currently this castTime is not effected by haste or slow. Which means that the cast end might not allign with the cooldown end. We should fix this. -->
    <div v-if="cooldown.castStart.value > 0" class="castTime" :class="cooldownStateColourClass"
      :style="{ height: `${100 - cooldown.castStart.value}%` }" />

    <CardSpline v-if="spline && cardEl && targetEl" :owner="card.owner.board" :start-center="spline.getCenter(cardEl)"
      :end-center="spline.getCenter(targetEl)" :stroke-width="spline.stroke" :path="spline.d.value"
      @spline-path-ref="handleSplinePathRef" @end-ref="handleEndRef" @start-ref="handleStartRef"
      @mask-element-ref="handleMaskElementRef" />

    <CardCooldownDebugPanel v-if="debug" :data="debugData" :current-state="cooldownState" />

    <!-- <Teleport to="body">
      <GsapTimelineInspector v-if="cooldown.master" :root="cooldown.master" :nested="true" :bake-time-scale="false"
        :px-per-sec="140" />
    </Teleport> -->
  </div>
</template>

<style>
.cooldown,
.castTime {
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

.castTime {
  border-top: dashed 2px var(--base-80);

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
