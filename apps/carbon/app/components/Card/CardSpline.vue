<script setup lang="ts">
import type { OwnerBoard } from '../../../types/card'
import { useSplinesStore } from '@/stores/useSplinesStore'

const emit = defineEmits<{
  (e: 'startRef' | 'endRef', el: HTMLElement): void
  (e: 'splinePathRef', el: SVGPathElement): void
}>()

const { owner, startCenter, endCenter, strokeWidth, path } = defineProps<{
  owner: OwnerBoard;
  startCenter: { x: number; y: number };
  endCenter: { x: number; y: number };
  strokeWidth: number;
  path: string;
}>()

const splinesStore = useSplinesStore()
const targetEl = computed(() => {
  return owner === 'player' ? splinesStore.tankCharacter.opponent : splinesStore.tankCharacter.player
})

function startRef(el: HTMLElement | null) {
  if (!el) return
  emit('startRef', el)
}

function endRef(el: HTMLElement | null) {
  if (!el) return
  emit('endRef', el)
}

function splinePathRef(el: SVGPathElement | null) {
  if (!el) return
  emit('splinePathRef', el)
}
</script>

<template>
  <Teleport to="body">
    <div id="SplineWrapper">
      <svg class="IntegratedSpline">
        <path :ref="(e) => splinePathRef(e as SVGPathElement)" :d="path" stroke="var(--accent-120)"
          :stroke-width="strokeWidth" fill="transparent" />
      </svg>
      <div :ref="(e) => startRef(e as HTMLElement)" class="SplinePulse"
        :style="{ top: `${(startCenter.y) || 0}px`, left: `${(startCenter.x) || 0}px` }" />
      <div v-if="targetEl" :ref="(e) => endRef(e as HTMLElement)" class="SplinePulse"
        :style="{ top: `${(endCenter.y) || 0}px`, left: `${(endCenter.x) || 0}px` }" />
    </div>
  </Teleport>
</template>

<style>
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
