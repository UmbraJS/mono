<script setup lang="ts">
import { watch, useTemplateRef } from 'vue'
import { useSliderKeys } from './useSliderKeys'
import { useSliderValue } from './useSliderValue'
import SnapPoints from './SnapPoints.vue'
import SliderHandle from './SliderHandle.vue'
import SliderRuler from './SliderRuler.vue'

const slider = useTemplateRef<HTMLDivElement>('slider')
const track = useTemplateRef<HTMLDivElement>('track')

const { size, left, zoom, pressed, updateSlider, leftHandleClicked, snapPoints } = useSliderValue({
  slider,
  track,
})

useSliderKeys(slider, { size, snapPoints })

watch(pressed, (isPressed) => {
  if (isPressed) return
  leftHandleClicked.value = false
})
</script>

<template>
  <div class="slider-container">
    <SliderRuler
      :value="leftHandleClicked ? left : size + left"
      :min="0"
      :max="100"
      :snapPoints="snapPoints"
      :pressed="pressed"
      :zoom="zoom"
    />
    <div
      ref="slider"
      tabindex="1"
      class="slider-wrapper border focus"
      @mousedown="() => updateSlider()"
    >
      <div ref="track" class="track">
        <div class="range">
          <SliderHandle variant="secondary" side="left" @mousedown="leftHandleClicked = true" />
          <SliderHandle variant="primary" side="right" />
        </div>

        <SnapPoints :value="size + left" :snapPoints="snapPoints" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.slider-container {
  position: relative;
  --handle-size: var(--block-small);
  --track-height: calc(var(--block-small) / 2);
  --padding-sides: calc(var(--space-2) + var(--track-height) / 2.5);
  --padding: var(--space-2) var(--padding-sides);
}

.slider-container .slider-ruler {
  position: absolute;
  top: 0px;
  width: 100%;
  pointer-events: none;
  z-index: 5;
}

.slider-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;

  padding: var(--padding);
  height: var(--block-big);
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
