√
<script setup lang="ts">
import { Button } from '@nobel/core'

const store = useStore()

function handleReset() {
  store.simulation.timeline.restart()
  // Reset the health and morale of both players
}

const isPaused = ref(store.simulation.timeline.paused())

function pausePlay(bool: boolean) {
  isPaused.value = bool
  if (bool) {
    store.simulation.timeline.pause()
  } else {
    store.simulation.timeline.play()
  }
}

const timesSpeed = ref(1)

function setSpeed() {
  timesSpeed.value = timesSpeed.value + 1
  if (timesSpeed.value > 10) timesSpeed.value = 1
  store.simulation.timeline.timeScale(timesSpeed.value)
}

const timeInMinutesAndSeconds = computed(() => {
  const minutes = Math.floor(store.simulation.time / 60)
  const seconds = Math.floor(store.simulation.time % 60)
  if (minutes === 0) return `${seconds < 10 ? '0' : ''}${seconds}s`
  return `${minutes}m ${seconds < 10 ? '0' : ''}${seconds}s`
})
</script>

<template>
  <div class="controlPanel">
    <h3>
      <Icon name="carbon:time" size="1.5rem" />
      {{ timeInMinutesAndSeconds }}
    </h3>
    <div class="controls">
      <h3>
        <Icon name="carbon:time" size="1.5rem" />
        {{ timeInMinutesAndSeconds }}
      </h3>
      <Button variant="base" size="small" color="default" @click="handleReset">
        <Icon name="carbon:restart" size="2rem" />
      </Button>
      <Button v-if="!isPaused" variant="base" size="small" color="default" @click="() => pausePlay(true)">
        <Icon name="carbon:pause-filled" size="2rem" />
      </Button>
      <Button v-else variant="base" size="small" color="default" @click="() => pausePlay(false)">
        <Icon name="carbon:play-filled-alt" size="2rem" />
      </Button>

      <Button variant="base" size="small" color="default" @click="setSpeed">
        <p>Speed: {{ timesSpeed }}</p>
      </Button>
    </div>
  </div>
</template>

<style>
.controlPanel {
  display: grid;
  grid-template-columns: auto auto;
  grid-column: 1 / -1;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1);
  background-color: var(--base-10);
  border-radius: var(--radius);
  width: 100%;
}

.controlPanel>* {
  cursor: pointer;
}

.controlPanel .controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--space-1);
}

.controlPanel h3 {
  display: flex;
  align-items: center;
  color: var(--accent-120);
  width: 190px;
}
</style>
