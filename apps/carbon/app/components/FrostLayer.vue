<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { gsap } from 'gsap'

const {
  reversed = false,
  health,
  maxHealth
} = defineProps<{
  reversed?: boolean
  health: number
  maxHealth: number
}>()

const strength = ref(0)
const mappedStrength = computed(() => {
  const maxStrength = 200
  const mapped = (strength.value / 100) * maxStrength
  const value = mapped > maxStrength ? maxStrength : mapped
  return reversed ? `${value}px` : `-${value}px`
})

const opacity = computed(() => {
  return strength.value > 0 ? 1 : 0
})

const healthValue = ref(health)

const baseSpeed = 20; // units per second (tweak this to your desired feel)
let currentTween: gsap.core.Timeline | null = null;
function tweenStrength(newValue: number) {
  const delta = Math.abs(strength.value - newValue);
  const duration = delta / baseSpeed;

  if (currentTween) currentTween.kill();
  currentTween = gsap.timeline();
  currentTween
    .to(strength, {
      value: newValue,
      duration: duration / 1.4,
      ease: 'power2.out'
    })
    .to(strength, {
      value: 0,
      duration: duration,
      ease: 'power2.in'
    });
}

watch(() => health, (newValue) => {
  // set strength as the difference between the old health and the newValue as a percentage of the maxHealth
  const diff = Math.abs(healthValue.value - newValue)
  const percentage = (diff / maxHealth) * 100
  tweenStrength(percentage > 100 ? 100 : percentage)
  healthValue.value = newValue
})

const amountOfLayers = 6
const exponential = Array.from({ length: amountOfLayers }, (_, i) => 2 ** i);
const exponentialLayers = exponential //  reversed ? exponential.reverse() : exponential;

const gradientStops: number[][] = [
  [0, 25, 37.5, 50],
  [25, 37.5, 50, 62.5],
  [37.5, 50, 62.5, 75],
  [50, 62.5, 75, 87.5],
  [62.5, 75, 87.5, 100],
  [75, 87.5, 100]
]

const rgba = (a: number): string => `rgba(0, 0, 0, ${a})`

// Style generator
const getLayerStyle = (index: number, entry: number) => {
  const direction: 'to top' | 'to bottom' = reversed ? 'to bottom' : 'to top'
  const originalStops = gradientStops[index]

  const stops =
    direction === 'to bottom'
      ? originalStops
      : originalStops?.map((p) => 100 - p).reverse()

  if (!stops) return

  const gradient = ((): string => {
    if (stops.length === 3) {
      return `
        ${rgba(0)} ${stops[0]}%,
        ${rgba(1)} ${stops[1]}%,
        ${rgba(1)} ${stops[2]}%`
    } else {
      return `
        ${rgba(0)} ${stops[0]}%,
        ${rgba(1)} ${stops[1]}%,
        ${rgba(1)} ${stops[2]}%,
        ${rgba(0)} ${stops[3]}%`
    }
  })()

  return {
    zIndex: 7 - index,
    backdropFilter: 'blur(var(--blurSize)) brightness(var(--blur-brightness)) contrast(var(--blur-contrast))',
    WebkitMaskImage: `linear-gradient(${direction},${gradient})`,
    maskImage: `linear-gradient(${direction},${gradient})`,
    '--blurSize': `${entry}px`,
  }
}
</script>

<template>
  <!-- <p class="debug">
    {{ mappedStrength }} -
  </p> -->
  <div class="frost-layers" :class="{ reversed }">
    <div v-for="(entry, i) in exponentialLayers" :key="entry" class="layer" :style="getLayerStyle(i - 1, entry)"/>
  </div>
</template>

<style lang="scss">
.debug {
  position: absolute;
  z-index: 100;
}

.layout:not(.dark) {
  --blur-contrast: 1.9;
  --blur-brightness: 0.81;
}

.layout.dark .frost-layers {
  --blur-contrast: 1.12;
  --blur-brightness: 1.2;
}

.layout.reveal .frost-layers {
  --blur-contrast: 1;
  --blur-brightness: 1;
}

.frost-layers {
  --blur-size: 150;
  --blur-max: 20;
  --blur-start: calc(var(--blur-size) * (1 / 6));
  --blur-add: calc(var(--blur-size) * (5 / 6));

  --blur-transition: 5%;

  position: relative;
  z-index: 10;

  height: calc(var(--blur-size) * 1px);
  width: 100%;
  pointer-events: none;
  box-shadow: inset 0px v-bind(mappedStrength) 130px -96px var(--warning-70);

  &>div {
    position: absolute;
    inset: 0;
    transition: var(--slower);
    opacity: v-bind(opacity);
  }
}
</style>
