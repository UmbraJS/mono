<script setup lang="ts">
import type { ButtonSize } from '../../../types/button'
defineProps<{
  size?: ButtonSize;
}>()
</script>

<template>
  <div class="UChipContent button" :class="size ? size : 'small'">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.UChipContent {
  box-sizing: content-box;
  padding: 0px var(--space-quark);
}
</style>
