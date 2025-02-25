<script setup lang="ts">
import { ref } from 'vue'

const { size = 'medium' } = defineProps<{
  size?: 'medium' | 'small' | 'mini'
  label: string
}>()

const focused = ref(false)
</script>

<template>
  <div class="input">
    <label
      for="html"
      class="button buttonText buttonHover buttonActive buttonFocus focus"
      :class="!focused ? 'bodycopy' : 'move'"
    >
      {{ label }}
    </label>
    <input
      :id="label"
      ref="inputRef"
      class="button buttonText buttonHover buttonActive buttonFocus focus"
      :class="size"
      :placeholder="label"
      @focus="() => (focused = true)"
      @blur="() => (focused = false)"
    />
  </div>
</template>

<style lang="scss">
input {
  all: unset;
  width: 100%;
  box-sizing: border-box;
}

/* input:-internal-autofill-selected {
  background-color: var(--base-20) !important;
  color: var(--base-contrast) !important;
} */

.input {
  position: relative;
}

div.input:has(+ div:focus-within) {
  filter: blur(4px);
}

.input label {
  position: absolute;
  z-index: 10;
  height: 100%;
  width: 100%;
  background: var(--base);
  color: var(--base-contrast);
  justify-content: left;
  padding: 0 var(--space-quark);
  pointer-events: none;
  transition: all 0.3s;
}

.input label.move {
  transform: translateY(-100%);
  height: var(--block);
}
</style>
