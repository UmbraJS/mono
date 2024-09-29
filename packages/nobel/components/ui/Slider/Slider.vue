<script setup lang="ts">
import { watch, useTemplateRef } from 'vue'
import { useSliderKeys } from './useSliderKeys'
import { useSliderValue } from './useSliderValue'
import SnapPoints from './SnapPoints.vue'
import SliderHandle from './SliderHandle.vue'
import SliderRuler from './SliderRuler.vue'

const slider = useTemplateRef<HTMLDivElement>('slider')
const track = useTemplateRef<HTMLDivElement>('track')

const { size, left, pressed, updateSlider, leftHandleClicked, snapPoints } = useSliderValue({
  slider,
  track
})

useSliderKeys(slider, { size, snapPoints })

watch(pressed, (isPressed) => {
  if (isPressed) return
  leftHandleClicked.value = false
})
</script>

<template>
  <p>{{ left }}</p>
  <p>{{ size }}</p>
  <SliderRuler :value="size" :max="100" :snapPoints="snapPoints" />
  <div
    ref="slider"
    tabindex="1"
    class="slider-wrapper border focus"
    @mousedown="() => updateSlider()"
  >
    <div ref="track" class="track">
      <div class="range">
        <SliderHandle @mousedown="leftHandleClicked = true" variant="secondary" side="left" />
        <SliderHandle variant="primary" side="right" />
      </div>

      <SnapPoints :value="size + left" :snapPoints="snapPoints" />
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
  padding: var(--space-2) calc(var(--space-2) + var(--track-height) / 2.5);
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
  width: calc(v-bind(size) * 1%);
  margin-left: calc(v-bind(left) * 1%);
  background: var(--accent-100);
  border-radius: var(--radius);
}
</style>
