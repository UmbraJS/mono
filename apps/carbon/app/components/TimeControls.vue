<script setup lang="ts">
import { Button } from '@nobel/core'

defineProps<{
  timeline: gsap.core.Timeline
}>()

defineEmits(['onRestart'])
</script>

<template>
  <div class="controlPanel">
    <Button variant="base" size="small" color="default" @click="() => $emit('onRestart')">
      <Icon name="carbon:skip-back-filled" size="2rem" />
    </Button>
    <Button variant="base" size="small" color="default" @click="timeline.play()">
      <Icon name="carbon:play-filled-alt" size="2rem" />
    </Button>
    <Button variant="base" size="small" color="default" @click="timeline.pause()">
      <Icon name="carbon:pause-filled" size="2rem" />
    </Button>
  </div>
</template>

<style>
.controlPanel {
  display: flex;
  grid-column: 1 / -1;
  justify-content: center;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2);
  background-color: var(--base-30);
  border-radius: var(--radius);
}

.controlPanel > * {
  cursor: pointer;
  color: var(--base-50);
}
</style>
