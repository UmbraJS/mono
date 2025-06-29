<script setup lang="ts">
import { useCooldown } from '../../composables/useCooldown'
import type { OutputChunk } from '../../../utils/time/types';

const {
  chunks,
  debug = false
} = defineProps<{
  chunks: OutputChunk[];
  debug?: boolean;
}>()

const { cooldown, cooldownDuration, slow, haste, frozen, slowSource, hasteSource, frozenSource } = useCooldown(chunks)
</script>

<template>
  <div :class="{ slow, haste, frozen }">
    <div v-if="cooldown > 0" class="cooldown" :style="{ height: `${cooldown}%` }" />
    <div v-if="debug" class="debugPanel">
      <div class="debug grid">
        <p>{{ cooldownDuration.toFixed(1) }}</p>
        <p>{{ Math.floor(cooldown) }}</p>
      </div>
      <div class="debug n2">
        <p>{{ slow.toFixed(1) }}</p>
        <p>{{ slowSource }}</p>
      </div>
      <div class="debug n3">
        <p>{{ haste.toFixed(1) }}</p>
        <p>{{ hasteSource }}</p>
      </div>
      <div class="debug n4">
        <p>{{ frozen.toFixed(1) }}</p>
        <p>{{ frozenSource }}</p>
      </div>
    </div>
  </div>
</template>

<style>
.debug {
  display: flex;
  justify-content: space-between;
  background-color: var(--base-40);
  padding: var(--space-quark);
}

.debug.grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  width: 100%;
}

.slow .n2 {
  background-color: var(--warning-40);
  color: var(--warning-120);
}

.haste .n3 {
  background-color: var(--success-40);
  color: var(--success-120);
}

.frozen .n4 {
  background-color: var(--info-40);
  color: var(--info-120);
}

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

.debugPanel {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1;
  opacity: 0.8;
}
</style>
