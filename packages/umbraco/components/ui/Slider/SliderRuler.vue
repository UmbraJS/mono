<script lang="ts" setup>
import { computed } from 'vue'
import { nearestSnapPoint } from './utils'

const props = defineProps<{
  value: number
  max: number
  min: number
  snapPoints: number[]
  pressed: boolean
  zoom: number
}>()

const inverseZoom = computed(() => inverseScale(props.zoom))

const clampedValue = computed(() => {
  return Math.min(props.max, Math.max(props.min, props.value))
})

function inverseScale(scale: number) {
  if (scale === 0) throw new Error('Scale cannot be zero')
  return 1 / scale
}
</script>

<template>
  <div class="slider-ruler border">
    <div class="zoomable">
      <div class="handle-range">
        <div class="handle"></div>
      </div>
      <div
        v-for="tick in max + 1"
        :key="tick"
        class="tick"
        :class="{
          mark: snapPoints.includes(tick - 1),
          active: nearestSnapPoint(value, snapPoints) === tick - 1
        }"
      ></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.slider-ruler {
  overflow: hidden;
  height: var(--block-big);
  padding: 0 var(--padding-sides);
  backdrop-filter: blur(7px);
  opacity: 0.9;
  --pos: calc(v-bind(clampedValue) * 1%);
  --offset: calc(var(--space-quark) / 2);
  --handle-pos: calc(var(--pos) - var(--offset));
}

.slider-ruler .zoomable {
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  transform: scaleX(v-bind(zoom));
  transform-origin: var(--handle-pos) 50%;
}

.slider-ruler .tick {
  height: 25%;
  width: 0.2px;
  background: var(--base-80);
  transition: var(--slow);
}

.slider-ruler .tick.mark {
  background: var(--base-120);
  height: 50%;
}

.slider-ruler .tick.mark.active {
  background: var(--accent-100);
  height: 75%;
}

.slider-ruler .handle-range {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 10;
}

.slider-ruler .handle {
  position: absolute;
  left: var(--handle-pos);
  width: var(--space-quark);
  aspect-ratio: 1 / 1;
  border-radius: var(--radius);
  background: var(--accent-100);
  transform: scaleX(v-bind(inverseZoom));
}
</style>
