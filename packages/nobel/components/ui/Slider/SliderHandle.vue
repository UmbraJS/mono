<script setup lang="ts">
import { Icon } from '@iconify/vue'
import Button from '../Button/Button.vue'

defineProps<{
  variant: 'primary' | 'secondary' | 'base'
  side: 'left' | 'right'
}>()
</script>

<template>
  <Button size="mini" :variant="variant" class="handle" :class="side">
    <Icon icon="pixelarticons:home" />
  </Button>
</template>

<style scoped lang="scss">
.slider-wrapper .track .range .handle.right {
  position: absolute;
  right: calc(0px - var(--handle-size) / 2);
}

.slider-wrapper .track .range .handle.left {
  position: absolute;
  left: calc(0px - var(--handle-size) / 2);
}
</style>
