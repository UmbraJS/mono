<script setup lang="ts">
import type { UmbraSwatch } from '@umbrajs/core'

const props = defineProps<{
  color: UmbraSwatch
}>()

const colourLightness = computed(() => {
  return Math.round(props.color.toHsl().l);
});
</script>

<template>
  <div class="TokenLightness" :style="{
    height: `${colourLightness}%`
  }">
    <p>{{ colourLightness }}</p>
  </div>
</template>

<style scoped>
.TokenLightness {
  display: flex;
  justify-content: center;
  align-items: center;
  width: var(--space-3);
  background-color: var(--base-40);
  border: solid 1px var(--base-10);
}
</style>
