<script setup lang="ts">
import type { OwnerBoard } from '../../../types/card'
import { useSplinesStore } from '@/stores/useSplinesStore'

const emit = defineEmits<{
  (e: 'startRef' | 'endRef', el: HTMLElement): void
  (e: 'splinePathRef', el: SVGPathElement): void
  (e: 'maskElementRef', el: SVGRectElement): void
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

function maskElementRef(el: SVGRectElement | null) {
  if (!el) return
  emit('maskElementRef', el)
}
</script>

<template>
  <Teleport to="body">
    <div id="SplineWrapper">
      <svg class="IntegratedSpline">
        <defs>
          <!-- Comet-style gradient for the mask -->
          <linearGradient id="cometGradient" x1="0%" y1="50%" x2="100%" y2="50%" gradientUnits="objectBoundingBox">
            <stop offset="0%" stop-color="white" stop-opacity="0" />
            <stop offset="70%" stop-color="white" stop-opacity="1" />
            <stop offset="100%" stop-color="white" stop-opacity="1" />
          </linearGradient>
          
          <!-- Mask definition -->
          <mask id="splineMask" maskUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%" mask-type="alpha">
            <rect :ref="(e) => maskElementRef(e as SVGRectElement)" 
                  id="maskFollower"
                  x="-30" y="-15" 
                  width="60" height="30" 
                  rx="15" ry="15" 
                  fill="url(#cometGradient)" />
          </mask>
        </defs>
        
        <!-- The path with mask applied -->
        <path :ref="(e) => splinePathRef(e as SVGPathElement)" 
              :d="path" 
              stroke="var(--accent-120)"
              :stroke-width="strokeWidth" 
              fill="transparent"
              mask="url(#splineMask)" />
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
