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
  <div class="UInput sibling-blur">
    <label for="html" class="button buttonText buttonHover buttonActive buttonFocus focus"
      :class="!focused ? 'bodycopy' : 'move'">
      {{ label }}
    </label>
    <input v-bind="$attrs" :id="label" ref="inputRef"
      class="button buttonText buttonHover buttonActive buttonFocus focus" :class="`${size}`" :placeholder="label"
      @focus="() => (focused = true)" @blur="() => (focused = false)" />
  </div>
</template>

<style lang="scss">
input.UInput.button {
  all: unset;
  width: 100%;
  box-sizing: border-box;
  border-radius: var(--radius);
}

/* input:-internal-autofill-selected {
  background-color: var(--base-20) !important;
  color: var(--base-text) !important;
}

input:-webkit-autofill {
  background-color: var(--base-20) !important;
  color: var(--base-text) !important;
}

input:-webkit-autofill::placeholder {
  background-color: var(--base-20) !important;
  color: var(--base-text) !important;
} */

.UInput {
  position: relative;
}

div.UInput:has(input:not(:placeholder-shown)):not(:focus-within) label {
  transform: translateY(0%);
  opacity: 0;
}

div.sibling-blur:has(+ * input:focus) {
  filter: blur(4px);
}

div.sibling-group-blur:has(+ * > :first-child input:focus) {
  filter: blur(4px);
}

.UInput label {
  position: absolute;
  z-index: 10;
  height: 100%;
  width: 100%;
  background: var(--base);
  color: var(--base-text);
  justify-content: left;
  padding: 0 var(--space-quark);
  pointer-events: none;
  transition: all 0.3s;
}

.UInput input.focus:focus {
  color: var(--accent-120);
  background: var(--accent-10);
}

.UInput input::placeholder {
  color: var(--accent-120);
}

.UInput label.move {
  transform: translateY(-100%);
  height: var(--block);
}
</style>
