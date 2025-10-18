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

// Timeline slider progress (0-100%)
const timelineProgress = computed({
  get: () => {
    const duration = simulation.timeline.duration()
    if (duration === 0) return 0
    return (simulation.time.value / duration) * 100
  },
  set: (value: number) => {
    simulation.timeline.progress(value / 100)
  }
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
      <input id="TimelineSlider" v-model="timelineProgress" type="range" name="volume" min="0" max="100" step="0.01">

      <div class="ControlButtons">
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
  </div>
</template>

<style>
#TimelineSlider {
  width: 100%;
  min-width: 100%;
  height: 8px;
  border-radius: var(--radius);
  background: var(--accent-20);
  outline: none;
}


#ControlPanels {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-column: 1 / -1;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-1);
}

#ControlPanels .ControlPanel {
  display: grid;
  grid-template-columns: 1fr auto;
  justify-content: center;
  align-items: center;
  gap: var(--space-2);
}

#ControlPanels .ControlButtons {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--space-1);
}

#ControlPanels h3 {
  color: var(--accent-120);
}
</style>
