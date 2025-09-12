<script setup lang="ts">
import { computed } from 'vue'
import type { ButtonSize } from '../../../types/button'
const {
  size = 'small',
} = defineProps<{
  size?: ButtonSize;
}>()


const sizeClass = computed(() => ({
  mini: 'buttonMini',
  small: 'buttonSmall',
  medium: 'buttonMedium',
}[size] ?? 'buttonMedium'))
</script>

<template>
  <div class="UChipContent button" :class="sizeClass">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.UChipContent {
  padding: 0px var(--space-quark);
}
</style>
