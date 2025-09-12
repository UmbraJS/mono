<script setup lang="ts">
import { ref } from 'vue'
import CheckMark from './CheckMark.vue'
const checked = ref(false)
</script>

<template>
  <div class="RadioCheckbox button buttonMedium" :class="{ checked }">
    <input v-model="checked" type="checkbox" class="buttonFocus" tabindex="0" />
    <CheckMark />
    <p>
      <slot></slot>
    </p>
  </div>
</template>

<style>
.RadioCheckbox input[type='checkbox'] {
  -webkit-appearance: none;
  appearance: none;
  margin: 0;
}

/* Customize the label (the container) */
.RadioCheckbox {
  cursor: pointer;
  position: relative;
  display: grid;
  grid-template-columns: var(--block) 1fr;
  justify-items: center;
  padding-right: var(--space-2);
}

/* Hide the browser's default radio button */
.RadioCheckbox input {
  cursor: pointer;
  height: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  z-index: 10;
  border-radius: var(--radius);
  transition: var(--time);
}
</style>
