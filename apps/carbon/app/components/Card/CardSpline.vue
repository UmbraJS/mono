<script setup lang="ts">
import type { OwnerBoard } from '../../../types/card'
import { gsap } from 'gsap'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { useSplinesStore } from '@/stores/useSplinesStore'

gsap.registerPlugin(DrawSVGPlugin);

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

const StartPulse = ref<HTMLElement | null>(null)
const EndPulse = ref<HTMLElement | null>(null)
</script>

<template>
  <Teleport to="body">
    <div id="SplineWrapper">
      <svg class="IntegratedSpline">
        <path :d="path" stroke="var(--accent-120)" :stroke-width="strokeWidth" fill="transparent" />
      </svg>
      <div ref="StartPulse" class="SplinePulse"
        :style="{ top: `${(startCenter.y) || 0}px`, left: `${(startCenter.x) || 0}px` }" />
      <div v-if="targetEl" ref="EndPulse" class="SplinePulse"
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
