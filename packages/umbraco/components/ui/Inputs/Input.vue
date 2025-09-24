<script setup lang="ts">
import { ref, toRef } from 'vue'
import { useButtonSize } from "../../../composables/useButtonSize";
import type { ButtonSize } from '../../../types/button'
import InputLabel from './InputLabel.vue'
import InputErrorIcon from './InputErrorIcon.vue'

defineOptions({
  inheritAttrs: false,
})

const model = defineModel<string>()

const { size, error } = defineProps<{
  size?: ButtonSize
  label: string
  error?: string
}>()

const sizeClass = useButtonSize(toRef(() => size));

const focused = ref(false)
</script>

<template>
  <div class="UInput sibling-blur" :class="error ? 'base-warning' : ''">
    <InputLabel :for="label" :label="label" :error="error" class="button" :class="!focused ? 'bodycopy' : 'move'" />
    <input v-bind="$attrs" v-model="model" :id="label"
      :class="`button buttonHover buttonActive buttonFocus focus ${sizeClass}`" :placeholder="label"
      @focus="() => (focused = true)" @blur="() => (focused = false)" />
    <InputErrorIcon :error="error" />
  </div>
</template>

<style>
.UInput {
  position: relative;
}

.ErrorNote {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--base-20);
  height: var(--block);
  padding: 0 var(--space-1);
  border-radius: var(--radius);
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  z-index: 10;
  height: 100%;
  width: 100%;
  background: var(--base);
  color: var(--base-120);
  padding: 0 var(--space-quark);
  pointer-events: none;
  transition: color 0.3s, background-color 0.3s, transform 0.3s, opacity 0.3s;
}

.UInput input.focus:focus {
  color: var(--base-120);
  background: var(--base-10);
}

.UInput input::placeholder {
  color: var(--base-120);
}

.UInput label.move {
  transform: translateY(-100%);
  height: 100%;
}
</style>
