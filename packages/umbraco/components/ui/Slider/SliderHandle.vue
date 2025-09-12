<script setup lang="ts">
import { Icon } from '@iconify/vue'
import Button from '../Button/Button.vue'

defineProps<{
  variant: 'primary' | 'secondary' | 'base'
  side: 'left' | 'right'
}>()
</script>

<template>
  <Button size="mini" :variant="variant" class="SliderHandle" :class="side">
    <Icon icon="pixelarticons:home" width="0.6em" height="0.6em" />
  </Button>
</template>

<style scoped lang="scss">
.SliderWrapper .SliderTrack .SliderRange .SliderHandle.right {
  position: absolute;
  right: calc(0px - var(--handle-size) / 2);
}

.SliderWrapper .SliderTrack .SliderRange .SliderHandle.left {
  position: absolute;
  left: calc(0px - var(--handle-size) / 2);
}
</style>
