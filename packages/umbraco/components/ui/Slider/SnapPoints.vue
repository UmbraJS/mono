<script setup lang="ts">
import { nearestSnapPoint } from './utils'
defineProps<{
  value: number
  snapPoints: number[]
}>()
</script>

<template>
  <div class="snap-points">
    <div
      v-for="snapPoint in snapPoints"
      :key="snapPoint"
      class="snapPoint"
      :class="{ active: nearestSnapPoint(value, snapPoints) === snapPoint }"
      :style="{ left: snapPoint + '%' }"
    ></div>
  </div>
</template>

<style scoped lang="scss">
.slider-wrapper .snap-points {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.slider-wrapper .snapPoint {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  transform: translateX(-50%);
  background-color: var(--accent-60);
  border-radius: var(--radius);
  height: var(--block-small);
  aspect-ratio: 1 / 1;
  transition: var(--slow);
}

.slider-wrapper .snapPoint.active {
  height: var(--block);
  background-color: var(--accent-100);
}
</style>
