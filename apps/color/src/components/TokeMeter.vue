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
</script>

<template>
  <div class="token-meter" :style="{
    width: `${colourLightness}%`
  }"></div>
</template>

<style scoped lang="scss">
.tokens:hover .token-meter {
  opacity: 0.8;
}

.token-meter {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 20%;
  height: 100%;
  background: var(--base-10);
  opacity: 0;
  transition: .2s ease-in-out;
}
</style>
