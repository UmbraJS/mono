<script setup lang="ts">
import { useSplinePath } from '@nobel/bifrost'
import type { OwnerBoard } from '~/../types/index'
import { gsap } from 'gsap'
import { storeToRefs } from 'pinia'

import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'

gsap.registerPlugin(DrawSVGPlugin);

const { start, end, angle, owner } = defineProps<{
  start: {
    element: HTMLElement
    id: string
  }
  end: HTMLElement
  angle: number
  owner: OwnerBoard
}>()

const splinesStore = useSplinesStore()
const { attackCounter } = storeToRefs(splinesStore)

const spline = useSplinePath({ start: start.element, end, stroke: 4, angle })

const startCenter = spline.getCenter(start.element) || { x: 0, y: 0 }
const endCenter = spline.getCenter(end) || { x: 0, y: 0 }

const StartPulse = ref<HTMLElement | null>(null)
const EndPulse = ref<HTMLElement | null>(null)
const SplinePath = ref<HTMLElement | null>(null)

function sendDash() {
  if (!SplinePath.value) return

  const totalDuration = 0.4; // Total duration of the animation cycle in seconds
  const pulseSize = 4;

  const growthDuration = (10 / 100) * totalDuration; // 0.5s
  const travelDuration = (80 / 100) * totalDuration; // 4s
  const shrinkDuration = (10 / 100) * totalDuration; // 0.5s

  // 2) Build the timeline with linear easing
  const tl = gsap.timeline({ defaults: { ease: 'none' } });

  tl.fromTo(
    StartPulse.value,
    { scale: pulseSize, autoAlpha: 0, transformOrigin: '50% 50%' },
    { scale: 1, autoAlpha: 1, duration: growthDuration },
  );

  // --- GROW (dash + start pulse in parallel)
  tl.addLabel('grow'); // starts at t=0 by default

  tl.fromTo(
    StartPulse.value,
    { scale: 1, autoAlpha: 1, transformOrigin: '50% 50%' },
    { scale: 0, autoAlpha: 1, duration: growthDuration * 4 },
    'grow'
  );

  // Dash head grows 0% -> 10%
  tl.fromTo(
    SplinePath.value,
    { drawSVG: '0% 0%' },
    { duration: growthDuration, drawSVG: '0% 10%' },
    'grow'
  );

  // Start pulse runs during the grow and ends at the same time

  // --- TRAVEL
  tl.addLabel('travel');

  tl.fromTo(
    SplinePath.value,
    { drawSVG: '0% 10%' },
    { duration: travelDuration, drawSVG: '90% 100%' },
    'travel'
  );

  // --- SHRINK (dash + end pulse in parallel)
  tl.addLabel('shrink');
  tl.fromTo(
    SplinePath.value,
    { drawSVG: '90% 100%' },
    { duration: shrinkDuration, drawSVG: '100% 100%' },
    'shrink'
  );

  // End pulse runs during the shrink and ends at the same time
  tl.fromTo(
    EndPulse.value,
    { scale: 0, autoAlpha: 1, transformOrigin: '50% 50%' },
    { scale: pulseSize, autoAlpha: 0, duration: shrinkDuration * 4 },
    'shrink'
  );
}

watch(attackCounter, (newVal) => {
  const correctArray = newVal[owner]
  const latestEntry = correctArray[correctArray.length - 1];
  if (latestEntry === start.id) sendDash()
}, {
  deep: true
})

onMounted(() => sendDash())
</script>

<template>
  <svg id="BifrostSpline">
    <path id="spline" ref="SplinePath" :d="spline.d.value" stroke="var(--accent-120)" :stroke-width="spline.stroke"
      fill="transparent" />
  </svg>
  <div ref="StartPulse" class="SplinePulse" :style="{ top: `${startCenter.y}px`, left: `${startCenter.x}px` }" />
  <div ref="EndPulse" class="SplinePulse" :style="{ top: `${endCenter.y}px`, left: `${endCenter.x}px` }" />
</template>

<style>
.SplinePulse {
  position: absolute;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--accent-120);
  pointer-events: none;
  transform: translate(-50%, -50%);
}

#BifrostSpline {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  width: 100%;
  height: 100%;
}
</style>
