<script setup lang="ts">
import { ref } from 'vue'
const value = ref(50)
</script>

<template>
  <div class="slider-wrapper">
    <input type="range" min="0" max="100" v-model="value" tabindex="1" />
    <div class="slider">
      <div class="fill">
        <div class="handle"></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.slider-wrapper {
  --handle-size: var(--block-small);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  height: var(--block-big);
  background: var(--base-10);
  border-radius: var(--radius);
  padding: 0px calc(var(--handle-size) / 2);
}

.slider-wrapper input {
  opacity: 0;
  cursor: pointer;
  position: absolute;
  z-index: 3;
  width: calc(100% - var(--handle-size));
  height: var(--block-big);
}

input[type='range'] {
  -webkit-appearance: none; /* Chrome and Safari */
  -moz-appearance: none; /* Firefox */
  appearance: none; /* Standard */
}

input[type='range']::-webkit-slider-thumb {
  height: 5px;
  width: 0px;
  border: none;
  background: blue;
}

input[type='range']::-moz-range-thumb {
  height: 5px;
  width: 0px;
  border: none;
  background: blue;
}

.slider-wrapper .slider {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  height: calc(var(--block-small) / 2);
  width: 100%;
  background: var(--accent-60);
  border-radius: var(--radius);
}

.slider-wrapper .slider .fill {
  position: relative;
  display: flex;
  align-items: center;
  justify-self: flex-end;
  height: 100%;
  width: calc(v-bind(value) * 1%);
  background: var(--accent-100);
  border-radius: var(--radius);
}

.slider-wrapper .slider .fill .handle {
  position: absolute;
  right: calc(0px - var(--handle-size) / 2);
  height: var(--handle-size);
  aspect-ratio: 1 / 1;
  background: var(--base-100);
  border-radius: var(--radius);
}
</style>
