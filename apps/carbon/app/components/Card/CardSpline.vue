<script setup lang="ts">
import type { OwnerBoard } from '../../../types/card'
import type { ComponentPublicInstance } from 'vue'
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

// Generate unique IDs only for SVG definitions (gradients and masks still need IDs)
const instanceId = `spline-${Math.random().toString(36).substr(2, 9)}`
const gradientId = `cometGradient-${instanceId}`
const maskId = `splineMask-${instanceId}`

// Template refs for direct element access
const maskElementRef = ref<SVGRectElement | null>(null)
const splinePathRef = ref<SVGPathElement | null>(null)

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

// Handle template refs and emit to parent
function handleSplinePathRef(el: Element | ComponentPublicInstance | null) {
  const pathEl = el as SVGPathElement | null
  splinePathRef.value = pathEl
  if (pathEl) emit('splinePathRef', pathEl)
}

function handleMaskElementRef(el: Element | ComponentPublicInstance | null) {
  const rectEl = el as SVGRectElement | null
  maskElementRef.value = rectEl
  if (rectEl) emit('maskElementRef', rectEl)
}
</script>

<template>
  <Teleport to="body">
    <div id="SplineWrapper">
      <svg class="IntegratedSpline">
        <defs>
          <!-- Comet-style gradient for the mask -->
          <linearGradient :id="gradientId" x1="0%" y1="50%" x2="100%" y2="50%" gradientUnits="objectBoundingBox">
            <stop offset="0%" stop-color="white" stop-opacity="0" />
            <stop offset="70%" stop-color="white" stop-opacity="1" />
            <stop offset="100%" stop-color="white" stop-opacity="1" />
          </linearGradient>

          <!-- Mask definition -->
          <mask :id="maskId" maskUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%" mask-type="alpha">
            <rect :ref="handleMaskElementRef" x="-30" y="-15" width="60" height="30" rx="15" ry="15"
              :fill="`url(#${gradientId})`" />
          </mask>
        </defs>

        <!-- The path with mask applied -->
        <path :ref="handleSplinePathRef" :d="path" stroke="var(--accent-120)" :stroke-width="strokeWidth"
          fill="transparent" :mask="`url(#${maskId})`" />
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
