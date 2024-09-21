<script setup lang="ts">
import { ref, computed, watch, useTemplateRef } from 'vue'
import { useMouse, useMousePressed, onKeyStroke } from '@vueuse/core'
import { gsap } from 'gsap'
import Button from '../Button/Button.vue'
import IconHome from '../../Icons/IconHome.vue'
import { useMod } from './useMod'

const slider = useTemplateRef<HTMLDivElement>('slider')
const track = useTemplateRef<HTMLDivElement>('track')
const range = useTemplateRef<HTMLDivElement>('range')
const handle = useTemplateRef<HTMLDivElement>('handle')

const { x } = useMouse()
const { pressed } = useMousePressed({ target: slider })

const value = ref(50)
const snapPoints = ref([0, 25, 50, 75, 100])
const modifier = ref(false)

function nearestSnapPoint(value: number) {
  return snapPoints.value.reduce((a, b) => (Math.abs(b - value) < Math.abs(a - value) ? b : a))
}

watch(pressed, (pressed) => {
  // when finished press gsap value to nearest snap point
  if (pressed) return
  gsap.to(value, {
    value: nearestSnapPoint(value.value),
    duration: 0.2,
    ease: 'power2.inOut'
  })
})

const percent = computed(() => {
  const trackBox = track.value?.getBoundingClientRect()
  return trackBox ? Math.round(((x.value - trackBox.left) / trackBox.width) * 100) : 0
})

useMod({ track: slider, value })

watch(percent, (percent) => {
  if (!pressed.value) return
  value.value = percent
})
</script>

<template>
  <p>{{ percent }}</p>
  <p>{{ value }}</p>
  <p>{{ modifier }}</p>
  <div ref="slider" class="slider-wrapper" @mousedown="() => (value = percent)">
    <div ref="track" class="track">
      <div ref="range" class="range">
        <Button ref="handle" size="mini" variant="secondary" class="handle">
          <IconHome size="mini" />
        </Button>
      </div>

      <div class="snap-points">
        <div
          v-for="snapPoint in snapPoints"
          :key="snapPoint"
          class="snapPoint"
          :class="{ active: nearestSnapPoint(value) === snapPoint }"
          :style="{ left: snapPoint + '%' }"
        ></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.slider-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;

  --handle-size: var(--block-small);
  --track-height: calc(var(--block-small) / 2);

  height: var(--block-big);
  padding: 0px calc(var(--handle-size) / 2);
  border-radius: var(--radius);
  background: var(--base-10);
}

.slider-wrapper .track {
  display: flex;
  align-items: center;
  z-index: 1;
  position: relative;
  height: var(--track-height);
  width: 100%;
  background: var(--accent-60);
  border-radius: var(--radius);
}

.slider-wrapper .track .range {
  display: flex;
  align-items: center;
  justify-self: flex-end;
  position: relative;
  z-index: 2;
  height: 100%;
  width: calc(v-bind(value) * 1%);
  background: var(--accent-100);
  border-radius: var(--radius);
}

.slider-wrapper .track .range .handle {
  position: absolute;
  right: calc(0px - var(--handle-size) / 2);
}

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
  background-color: var(--base-100);
  border-radius: var(--radius);
  height: var(--block-small);
  aspect-ratio: 1 / 1;
  transition: var(--time);
}

.slider-wrapper .snapPoint.active {
  height: var(--block);
  background-color: var(--accent-100);
}
</style>
