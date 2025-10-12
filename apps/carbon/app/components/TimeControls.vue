<script setup lang="ts">
import { Button } from 'umbraco'
import { useSimulationInject } from '~/composables/useSimulationProvider'

const simulation = useSimulationInject()

function handleReset() {
  simulation.timeline.restart()
  // Reset the health and morale of both players
}

const isPaused = ref(simulation.timeline.paused())

function pausePlay(bool: boolean) {
  isPaused.value = bool
  if (bool) {
    simulation.timeline.pause()
  } else {
    simulation.timeline.play()
  }
}

const timesSpeed = ref(1)

function setSpeed() {
  timesSpeed.value = timesSpeed.value + 1
  if (timesSpeed.value > 10) timesSpeed.value = 1
  simulation.timeline.timeScale(timesSpeed.value)
}

function lowerSpeed() {
  timesSpeed.value = timesSpeed.value - 0.1
  if (timesSpeed.value < 0) timesSpeed.value = 1
  simulation.timeline.timeScale(timesSpeed.value)
}

const timeInMinutesAndSeconds = computed(() => {
  const minutes = Math.floor(simulation.time.value / 60)
  const seconds = Math.floor(simulation.time.value % 60)
  if (minutes === 0) return `${seconds < 10 ? '0' : ''}${seconds}s`
  return `${minutes}m ${seconds < 10 ? '0' : ''}${seconds}s`
})

function floorTo1Decimal(value: number) {
  return Math.floor(value * 10) / 10
}
</script>

<template>
  <div id="ControlPanels">
    <div class="ControlPanel">
      <h3>
        {{ timeInMinutesAndSeconds }}
      </h3>
    </div>

    <slot />

    <div class="ControlPanel">
      <input v-model="simulation.time.value" type="text" style="width: 3rem; text-align: center;">
      <input id="volume" type="range" name="volume" min="0" max="11">

      <Button @click="handleReset">
        <Icon name="carbon:restart" size="2rem" />
      </Button>
      <Button v-if="!isPaused" @click="() => pausePlay(true)">
        <Icon name="carbon:pause-filled" size="2rem" />
      </Button>
      <Button v-else @click="() => pausePlay(false)">
        <Icon name="carbon:play-filled-alt" size="2rem" />
      </Button>

      <Button @click="setSpeed">
        <p>x {{ floorTo1Decimal(timesSpeed) }}</p>
      </Button>

      <Button @click="lowerSpeed">
        <p>x {{ floorTo1Decimal(Math.abs(timesSpeed)) }}</p>
      </Button>
    </div>
  </div>
</template>

<style>
#ControlPanels {
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-column: 1 / -1;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-1);
}

#ControlPanels .ControlPanel {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--space-1);
}

#ControlPanels h3 {
  color: var(--accent-120);
}
</style>
