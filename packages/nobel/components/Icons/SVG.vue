<script setup lang="ts">
const { size = 'small' } = defineProps<{
  size?: 'medium' | 'small' | 'mini'
}>()
</script>

<template>
  <svg id="icon" :class="size" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <slot />
  </svg>
</template>

<style>
svg#icon {
  aspect-ratio: 1 / 1;
  fill: currentColor;
}

svg#icon.medium {
  width: var(--space-3);
}

svg#icon.small {
  width: var(--paragraph);
}

svg#icon.mini {
  width: var(--space-atom);
}
</style>
