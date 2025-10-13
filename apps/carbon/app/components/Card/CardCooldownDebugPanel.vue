<script setup lang="ts">
interface CooldownDebugData {
  cooldownDuration: number
  cooldownValue: number
  slow: number
  slowSource: string
  haste: number
  hasteSource: string
  frozen: number
  frozenSource: string
}

interface DebugPanelProps {
  data: CooldownDebugData
  currentState: string
}

const { data, currentState } = defineProps<DebugPanelProps>()
</script>

<template>
  <div class="debugPanel">
    <div class="debug grid">
      <p>{{ data.cooldownDuration.toFixed(1) }}</p>
      <p>{{ Math.floor(data.cooldownValue) }}</p>
    </div>

    <div class="debug slowed" :class="{ active: currentState === 'slow' }">
      <p>{{ data.slow.toFixed(1) }}</p>
      <p>{{ data.slowSource }}</p>
    </div>

    <div class="debug hasted" :class="{ active: currentState === 'haste' }">
      <p>{{ data.haste.toFixed(1) }}</p>
      <p>{{ data.hasteSource }}</p>
    </div>

    <div class="debug freezed" :class="{ active: currentState === 'frozen' }">
      <p>{{ data.frozen.toFixed(1) }}</p>
      <p>{{ data.frozenSource }}</p>
    </div>
  </div>
</template>

<style scoped>
.debug {
  display: flex;
  justify-content: space-between;
  background-color: var(--base-40);
  padding: var(--space-quark);
  transition: all 0.2s ease;
}

.debug.grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  width: 100%;
}

.debug.active {
  opacity: 1;
  font-weight: bold;
}

.debug:not(.active) {
  opacity: 0.6;
}

.slowed.active {
  background-color: var(--warning-40);
  color: var(--warning-120);
}

.hasted.active {
  background-color: var(--success-40);
  color: var(--success-120);
}

.freezed.active {
  background-color: var(--info-40);
  color: var(--info-120);
}

.debugPanel {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1;
  opacity: 0.8;
}
</style>
