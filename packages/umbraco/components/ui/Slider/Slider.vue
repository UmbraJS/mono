<script setup lang="ts">
import { watch, useTemplateRef } from 'vue'
import { useSliderKeys } from './useSliderKeys'
import { useSliderValue } from './useSliderValue'
import SnapPoints from './SnapPoints.vue'
import SliderHandle from './SliderHandle.vue'
import SliderRuler from './SliderRuler.vue'

const slider = useTemplateRef<HTMLDivElement>('slider')
const track = useTemplateRef<HTMLDivElement>('track')

const {
  zoom,
  pressed,
  endHandle,
  snapPoints,
  startHandle,
  updateSlider,
  activeTrackSize,
  startHandleClicked,
} = useSliderValue({
  slider,
  track,
})

useSliderKeys(slider, {
  activeTrackSize,
  snapPoints
})

watch(pressed, (isPressed) => {
  if (isPressed) return
  startHandleClicked.value = false
})
</script>

<template>
  <div class="SliderContainer">
    <SliderRuler v-if="zoom > 1" :value="startHandleClicked ? startHandle : activeTrackSize + startHandle" :min="0"
      :max="100" :snapPoints="snapPoints" :pressed="pressed" :zoom="zoom" />
    <div ref="slider" tabindex="1" class="SliderWrapper border focus" @mousedown="() => updateSlider()">
      <div ref="track" class="SliderTrack">
        <div class="SliderRange">
          <SliderHandle variant="secondary" side="left" @mousedown="startHandleClicked = true" />
          <SliderHandle variant="primary" side="right" />
        </div>
        <SnapPoints :value="activeTrackSize + startHandle" :snapPoints="snapPoints" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.SliderContainer {
  position: relative;
  --handle-size: var(--block-small);
  --track-height: calc(var(--block-small) / 2);
  --padding-sides: calc(var(--space-2) + var(--track-height) / 2.5);
  --padding: var(--space-2) var(--padding-sides);
}

.SliderContainer .SliderRuler {
  position: absolute;
  top: 0px;
  width: 100%;
  pointer-events: none;
  z-index: 5;
}

.SliderWrapper {
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

.SliderWrapper .SliderTrack {
  display: flex;
  align-items: center;
  z-index: 1;
  position: relative;
  height: var(--track-height);
  width: 100%;
  background: var(--accent-60);
  border-radius: var(--radius);
}

.SliderWrapper .SliderTrack .SliderRange {
  display: flex;
  align-items: center;
  justify-self: flex-end;
  position: relative;
  z-index: 2;
  height: 100%;
  width: calc(v-bind(activeTrackSize) * 1%);
  margin-left: calc(v-bind(startHandle) * 1%);
  background: var(--accent-100);
  border-radius: var(--radius);
}
</style>
