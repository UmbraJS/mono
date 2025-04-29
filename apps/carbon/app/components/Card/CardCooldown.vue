<script setup lang="ts">
import { useCooldown } from '../../composables/useCooldown'
import type { ChainedCooldownEvent } from '../../../utils/generateChainedCooldownEvents'

const props = defineProps<{
  time: number
  timeline: gsap.core.Timeline;
  cooldownEvents: ChainedCooldownEvent[];
}>()

const { cooldown, cooldownDuration, slow, haste, frozen, slowSource, hasteSource, frozenSource } = useCooldown(props.timeline, props.cooldownEvents)
</script>

<template>
  <div class="cooldown" v-if="cooldown > 0" :style="{ height: `${cooldown}%` }" :class="{ slow, haste, frozen }">
    <div class="slowp">
      <p>{{ cooldownDuration.toFixed(1) }}</p>
      <p>{{ time.toFixed(1) }}</p>
      <p>{{ Math.floor(cooldown) }}</p>
    </div>
    <div class="slowp n2">
      <p>{{ slow.toFixed(1) }}</p>
      <p>{{ slowSource }}</p>
    </div>
    <div class="slowp n3">
      <p>{{ haste.toFixed(1) }}</p>
      <p>{{ hasteSource }}</p>
    </div>
    <div class="slowp n4">
      <p>{{ frozen.toFixed(1) }}</p>
      <p>{{ frozenSource }}</p>
    </div>
  </div>
</template>

<style>
.slowp {
  display: flex;
  justify-content: space-between;
  background-color: var(--base-40);
  padding: var(--space-1);
}

.cooldown.slow .n2 {
  background-color: var(--warning-40);
  color: var(--warning-120);
}

.cooldown.haste .n3 {
  background-color: var(--success-40);
  color: var(--success-120);
}

.cooldown.frozen .n4 {
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
</style>
