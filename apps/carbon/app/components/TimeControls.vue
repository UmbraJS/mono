<script setup lang="ts">
import { Button } from '@nobel/core'

const props = defineProps<{
  timeline: gsap.core.Timeline
}>()

defineEmits(['onRestart'])

const isPaused = ref(false)

function pausePlay(bool: boolean) {
  isPaused.value = bool
  bool ? props.timeline.pause() : props.timeline.play()
}

const timesSpeed = ref(1)

function setSpeed() {
  timesSpeed.value = timesSpeed.value + 1
  if (timesSpeed.value > 10) timesSpeed.value = 1
  props.timeline.timeScale(timesSpeed.value)
}
</script>

<template>
  <div class="controlPanel">
    <Button variant="base" size="small" color="default" @click="() => $emit('onRestart')">
      <Icon name="carbon:skip-back-filled" size="2rem" />
    </Button>
    <Button
      v-if="!isPaused"
      variant="base"
      size="small"
      color="default"
      @click="() => pausePlay(true)"
    >
      <Icon name="carbon:pause-filled" size="2rem" />
    </Button>
    <Button v-else variant="base" size="small" color="default" @click="() => pausePlay(false)">
      <Icon name="carbon:play-filled-alt" size="2rem" />
    </Button>

    <Button variant="base" size="small" color="default" @click="setSpeed">
      <p>Speed: {{ timesSpeed }}</p>
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
}
</style>
