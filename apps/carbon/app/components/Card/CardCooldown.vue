<script setup lang="ts">
import type { Card } from '../../../types'
import { gsap } from 'gsap/gsap-core'

const props = defineProps<{
  card: Card
  timeline: gsap.core.Timeline
  delay: number
}>()

const emit = defineEmits<{
  (e: 'bash'): void
}>()

const cooldown = ref(100)
const opacity = computed(() => remapValue(cooldown.value))

function remapValue(value: number): number {
  const start = 98
  const fadein = start - 15
  if (value >= start) {
    return 0.0
  } else if (value >= fadein) {
    return (start - value) / 10
  } else {
    return 1.0
  }
}

const cardTimeline = gsap.timeline()

cardTimeline.to(cooldown, {
  value: 0,
  duration: props.card.bash.cooldown,
  delay: props.delay,
  repeat: -1,
  onRepeat: () => emit('bash'),
})

props.timeline.add(cardTimeline, 0)
</script>

<template>
  <div class="cooldown" v-if="cooldown > 0" :style="{ height: `${cooldown}%`, opacity }"></div>
</template>

<style>
.cooldown {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1;
  border-top: solid 2px var(--base-40);
  border-radius: var(--radius);
  pointer-events: none;
}
</style>
