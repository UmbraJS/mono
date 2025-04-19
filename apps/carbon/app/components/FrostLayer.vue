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

const strength = ref(30)
const mappedStrength = computed(() => {
  const maxStrength = 300
  const mapped = (strength.value / 100) * maxStrength
  const value = mapped > maxStrength ? maxStrength : mapped
  return reversed ? `-${value}px` : `${value}px`
})

const opacity = computed(() => {
  return strength.value > 0 ? 1 : 0
})

const healthValue = ref(health)

const baseSpeed = 200; // units per second (tweak this to your desired feel)
let currentTween: gsap.core.Timeline | null = null;
function tweenStrength(newValue: number) {
  const delta = Math.abs(strength.value - newValue);
  const duration = delta / baseSpeed;

  if (currentTween) currentTween.kill();
  currentTween = gsap.timeline();
  currentTween
    .to(strength, {
      value: newValue,
      duration: duration / 2,
      ease: "power2.out"
    })
    .to(strength, {
      value: 0,
      duration: duration,
      ease: "power2.in"
    });
}

watch(() => health, (newValue) => {
  // set strength as the difference between the old health and the newValue as a percentage of the maxHealth
  const diff = Math.abs(healthValue.value - newValue)
  const maxDiff = Math.abs(maxHealth - healthValue.value)
  const percentage = (diff / maxDiff) * 100
  tweenStrength(percentage > 100 ? 100 : percentage)
  healthValue.value = newValue
})

const amountOfLayers = 6
const exponential = Array.from({ length: amountOfLayers }, (_, i) => 2 ** i);
const exponentialLayers = exponential //  reversed ? exponential.reverse() : exponential;

</script>

<template>
  <p class="debug">
    {{ mappedStrength }} -
  </p>
  <div class="frost-layers" :class="{ reversed }">
    <div class="layer" v-for="entry in exponentialLayers" :key="entry" :style="{
      '--blurSize': `${entry}px`,
    }"></div>
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
  box-shadow: inset 0px v-bind(mappedStrength) 130px -96px var(--warning-100);

  &>div {
    position: absolute;
    inset: 0;
    transition: var(--slower);
    opacity: v-bind(opacity);
  }

  &>div:nth-of-type(1) {
    z-index: 2;
    backdrop-filter: blur(var(--blurSize)) brightness(var(--blur-brightness)) contrast(var(--blur-contrast));
    mask: linear-gradient(to bottom,
        rgba(0, 0, 0, 0) 0%,
        rgba(0, 0, 0, 1) 25%,
        rgba(0, 0, 0, 1) 37.5%,
        rgba(0, 0, 0, 0) 50%);
  }

  &>div:nth-of-type(2) {
    z-index: 3;
    backdrop-filter: blur(2px) brightness(var(--blur-brightness)) contrast(var(--blur-contrast));
    mask: linear-gradient(to bottom,
        rgba(0, 0, 0, 0) 25%,
        rgba(0, 0, 0, 1) 37.5%,
        rgba(0, 0, 0, 1) 50%,
        rgba(0, 0, 0, 0) 62.5%);
  }

  &>div:nth-of-type(3) {
    z-index: 4;
    backdrop-filter: blur(var(--blurSize)) brightness(var(--blur-brightness)) contrast(var(--blur-contrast));
    mask: linear-gradient(to bottom,
        rgba(0, 0, 0, 0) 37.5%,
        rgba(0, 0, 0, 1) 50%,
        rgba(0, 0, 0, 1) 62.5%,
        rgba(0, 0, 0, 0) 75%);
  }

  &>div:nth-of-type(4) {
    z-index: 5;
    backdrop-filter: blur(var(--blurSize)) brightness(var(--blur-brightness)) contrast(var(--blur-contrast));
    mask: linear-gradient(to bottom,
        rgba(0, 0, 0, 0) 50%,
        rgba(0, 0, 0, 1) 62.5%,
        rgba(0, 0, 0, 1) 75%,
        rgba(0, 0, 0, 0) 87.5%);
  }

  &>div:nth-of-type(5) {
    z-index: 6;
    backdrop-filter: blur(var(--blurSize)) brightness(var(--blur-brightness)) contrast(var(--blur-contrast));
    mask: linear-gradient(to bottom,
        rgba(0, 0, 0, 0) 62.5%,
        rgba(0, 0, 0, 1) 75%,
        rgba(0, 0, 0, 1) 87.5%,
        rgba(0, 0, 0, 0) 100%);
  }

  &>div:nth-of-type(6) {
    z-index: 7;
    backdrop-filter: blur(var(--blurSize)) brightness(var(--blur-brightness)) contrast(var(--blur-contrast));
    mask: linear-gradient(to bottom,
        rgba(0, 0, 0, 0) 75%,
        rgba(0, 0, 0, 1) 87.5%,
        rgba(0, 0, 0, 1) 100%);
  }
}
</style>
