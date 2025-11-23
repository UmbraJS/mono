<script setup lang="ts">
import { toRef, ref } from 'vue'
import { useButtonSize } from "../../../composables/useButtonSize";
import type { ButtonSize } from '../../../types/button'
import InputLabel from './InputLabel.vue'
import InputErrorIcon from './InputErrorIcon.vue'
import InputWrapper from './InputWrapper.vue';

defineOptions({
  inheritAttrs: false,
})

const { size, error } = defineProps<{
  size?: ButtonSize
  error?: string
  placeholder: string
}>()

const model = defineModel<string>()

const sizeClass = useButtonSize(toRef(() => size));

const scrollHeight = ref(0);
const focused = ref(false)

function adjustHeight(area: EventTarget | null) {
  if (!area) return;
  scrollHeight.value = (area as HTMLTextAreaElement).scrollHeight;
}
</script>

<template>
  <InputWrapper :error="error">
    <InputLabel :for="placeholder" :label="placeholder" :error="error" class="button"
      :class="!focused ? 'bodycopy' : 'move'" />
    <textarea v-bind="$attrs" v-model="model" :id="placeholder"
      :class="`InputElement button buttonHover buttonActive buttonFocus focus ${sizeClass}`" :placeholder="placeholder"
      @input="(e) => adjustHeight(e.target)" @focus="() => (focused = true)" @blur="() => (focused = false)"
      :style="{ height: scrollHeight + 'px' }" />
    <!-- <InputErrorIcon :error="error" /> -->
  </InputWrapper>
</template>

<style>
.InputWrapper textarea.InputElement {
  padding-top: var(--space-quark);

  resize: none;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  word-break: break-word;
  overflow-x: hidden;
  overflow-y: hidden;

  field-sizing: content;
  width: 100%;
  max-width: var(--paragraph-width);
  min-height: calc(var(--block) * 3);
}

/* TextArea-specific label styles */
.InputWrapper:has(textarea) label.InputLabel {
  opacity: 0;
  height: var(--block-big);
}

.InputWrapper:has(textarea):focus-within label.InputLabel {
  opacity: 1;
}
</style>
