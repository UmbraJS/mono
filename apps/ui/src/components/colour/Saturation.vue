<script setup lang="ts">
import type { UmbraSwatch } from '@umbrajs/core'
import { computed } from 'vue';

const props = defineProps<{
  color: UmbraSwatch
}>()

const colourSaturation = computed(() => {
  return Math.round(props.color.toHsl().s);
});
</script>

<template>
  <div class="TokenSaturation" :style="{
    height: `${colourSaturation}%`
  }">
    <p>{{ colourSaturation }}</p>
  </div>
</template>

<style scoped>
.TokenSaturation {
  display: flex;
  justify-content: center;
  align-items: center;
  width: var(--space-3);
  background-color: var(--base-40);
  border: solid 1px var(--base-10);
}
</style>
