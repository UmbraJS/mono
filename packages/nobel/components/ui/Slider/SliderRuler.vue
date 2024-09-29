<script lang="ts" setup>
defineProps<{
  value: number
  max: number
  snapPoints: number[]
}>()
</script>

<template>
  <div class="slider-ruler border">
    <div
      v-for="tick in max"
      :key="tick"
      class="tick"
      :class="{ mark: snapPoints.includes(tick) }"
    ></div>
  </div>
</template>

<style lang="scss" scoped>
.slider-ruler {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: var(--block);
  padding: 0 var(--space-2);
}

.slider-ruler .tick {
  height: 50%;
  width: 0.2px;
  background: var(--base-80);
}

.slider-ruler .tick.mark {
  background: var(--base-120);
  height: 100%;
}
</style>
