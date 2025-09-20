<script setup lang="ts">
import { ref, toRef } from 'vue'
import { useButtonSize } from "../../composables/useButtonSize";
import type { ButtonSize } from '../../types/button'

defineOptions({
  inheritAttrs: false,
})

const model = defineModel<string>()

const { size } = defineProps<{
  size?: ButtonSize
  label: string
}>()

const sizeClass = useButtonSize(toRef(() => size));

const focused = ref(false)
</script>

<template>
  <div class="UInput sibling-blur">
    <label :for="label" class="button" :class="!focused ? 'bodycopy' : 'move'">
      {{ label }}
    </label>
    <input v-bind="$attrs" v-model="model" :id="label" class="button buttonHover buttonActive buttonFocus focus"
      :class="sizeClass" :placeholder="label" @focus="() => (focused = true)" @blur="() => (focused = false)" />
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
  transition: color 0.3s, background-color 0.3s, transform 0.3s, opacity 0.3s;
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
