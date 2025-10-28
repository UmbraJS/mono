<script setup lang="ts">
import type { UmbraSwatch } from '@umbrajs/core'
import { computed } from 'vue';

const props = defineProps<{
  color: UmbraSwatch
  previousColor?: UmbraSwatch
}>()

const colourLightness = computed(() => {
  return Math.round(props.color.toHsl().l);
});

const previousColourLightness = computed(() => {
  if (!props.previousColor) return null;
  return Math.round(props.previousColor.toHsl().l);
});
</script>

<template>
  <div class="TokenLightness" :style="{
    height: `${colourLightness}%`
  }">
    <p v-if="!previousColourLightness || previousColourLightness === colourLightness" class="caption">
      {{ colourLightness }}
    </p>
    <p v-else class="caption">
      {{ colourLightness }} / {{ previousColourLightness }}
    </p>
    <div v-if="previousColourLightness !== null" class="PreviousTokenLightness" :style="{
      height: `${Math.abs(colourLightness - previousColourLightness)}%`
    }">
    </div>
  </div>
</template>

<style scoped>
.TokenLightness {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: var(--space-3);
  background-color: var(--base-40);
  border: solid 1px var(--base-10);
}

.PreviousTokenLightness {
  position: absolute;
  bottom: 0;
  width: 100%;
  background-color: var(--warning-100);
  opacity: 0.5;
}
</style>
