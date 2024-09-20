<script setup lang="ts">
import { ref } from 'vue'
const value = ref(50)
</script>

<template>
  <div class="slider-wrapper">
    <input type="range" min="0" max="100" v-model="value" />
    <div class="slider">
      <div class="fill">
        <div class="handle"></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.slider-wrapper {
  --handle-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  height: var(--block-big);
  background: var(--base-40);
  border-radius: var(--radius);
  padding: 0px calc(var(--handle-size) / 2);
}

.slider-wrapper input {
  position: absolute;
  width: calc(100% - var(--handle-size));
}

/* Special styling for WebKit/Blink */
.slider-wrapper input::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 6px;
  width: 6px;
  border-radius: 0px;
  background: #ffffff;
  cursor: pointer;
  margin-top: -14px; /* You need to specify a margin in Chrome, but in Firefox and IE it is automatic */
}

.slider-wrapper .slider {
  display: flex;
  align-items: center;
  height: var(--block);
  width: 100%;
  background: var(--accent-100);
  border-radius: var(--radius);
}

.slider-wrapper .slider .fill {
  display: flex;
  align-items: center;
  justify-self: flex-end;
  height: var(--block);
  width: calc(v-bind(value) * 1%);
  background: var(--accent-20);
  border-radius: var(--radius);
}

.slider-wrapper .slider .fill .handle {
  height: var(--handle-size);
  aspect-ratio: 1 / 1;
  background: var(--base-100);
}
</style>
