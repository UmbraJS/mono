<script setup lang="ts">
import type { UmbraSwatch } from '@umbrajs/core'
import { computed } from 'vue';

const props = defineProps<{
  color: UmbraSwatch
}>()

const colourHue = computed(() => {
  return Math.round(props.color.toHsl().h);
});

const colorHuePercent = computed(() => {
  return Math.round((props.color.toHsl().h / 360) * 100);
});
</script>

<template>
  <div class="TokenHue" :style="{
    height: `${colorHuePercent}%`
  }">
    <p>{{ colourHue }}</p>
  </div>
</template>

<style scoped>
.TokenHue {
  display: flex;
  justify-content: center;
  align-items: center;
  width: var(--space-3);
  background-color: var(--base-40);
  border: solid 1px var(--base-10);
}
</style>
