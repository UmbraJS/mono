<script setup lang="ts">
import { ref } from 'vue'

defineOptions({
  inheritAttrs: false,
})

const { size = 'medium' } = defineProps<{
  size?: 'medium' | 'small' | 'mini'
  label: string
}>()

const focused = ref(false)
</script>

<template>
  <div class="input sibling-blur">
    <label
      for="html"
      class="button buttonText buttonHover buttonActive buttonFocus focus"
      :class="!focused ? 'bodycopy' : 'move'"
    >
      {{ label }}
    </label>
    <input
      v-bind="$attrs"
      :id="label"
      ref="inputRef"
      class="button buttonText buttonHover buttonActive buttonFocus focus"
      :class="`${size}`"
      :placeholder="label"
      @focus="() => (focused = true)"
      @blur="() => (focused = false)"
    />
  </div>
</template>

<style lang="scss">
input.button {
  all: unset;
  width: 100%;
  box-sizing: border-box;
}

/* input:-internal-autofill-selected {
  background-color: var(--base-20) !important;
  color: var(--base-contrast) !important;
}

input:-webkit-autofill {
  background-color: var(--base-20) !important;
  color: var(--base-contrast) !important;
}

input:-webkit-autofill::placeholder {
  background-color: var(--base-20) !important;
  color: var(--base-contrast) !important;
} */

.input {
  position: relative;
}

div.input:has(input:not(:placeholder-shown)):not(:focus-within) label {
  transform: translateY(0%);
  opacity: 0;
}

div.sibling-blur:has(+ * input:focus) {
  filter: blur(4px);
}

div.sibling-group-blur:has(+ * > :first-child input:focus) {
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

.input input.focus:focus {
  color: var(--accent-120);
  background: var(--accent-10);
}

.input input::placeholder {
  color: var(--accent-120);
}

.input label.move {
  transform: translateY(-100%);
  height: var(--block);
}
</style>
