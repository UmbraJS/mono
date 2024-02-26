<script setup lang="ts">
defineProps<{
  color: {
    hex: string
    name: string
  }
  position: {
    x: number
    y: number
  }
}>()
</script>

<template>
  <div class="handle-wrapper">
    <slot>
      <div class="handle"></div>
    </slot>
  </div>
</template>

<style lang="scss" scoped>
.handle-wrapper {
  position: absolute;
  --size: 20px;
  width: var(--size);
  aspect-ratio: 1/1;
  pointer-events: none;
  top: calc(v-bind('position.y') * 1px - var(--size) / 2);
  left: calc(v-bind('position.x') * 1px - var(--size) / 2);
}

.handle {
  background-color: v-bind('color.hex');
  border-radius: 50%;
  border: solid 3px var(--base-120, #fff);
  aspect-ratio: 1/1;
}
</style>
