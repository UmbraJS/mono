<script setup lang="ts">
import { toRef, ref } from 'vue'
import { useButtonSize } from "../../composables/useButtonSize";
import type { ButtonSize } from '../../types/button'

defineOptions({
  inheritAttrs: false,
})

const { size } = defineProps<{
  size?: ButtonSize
  label: string
}>()

const sizeClass = useButtonSize(toRef(() => size));

const scrollHeight = ref(0);

function adjustHeight(area: EventTarget | null) {
  if (!area) return;
  scrollHeight.value = (area as HTMLTextAreaElement).scrollHeight;
}
</script>

<template>
  <div class="TextArea">
    <label :for="label" class="caption">
      {{ label }}
    </label>
    <textarea v-bind="$attrs" :id="label" class="button buttonHover buttonActive buttonFocus focus" :class="sizeClass"
      :placeholder="label" @input="(e) => adjustHeight(e.target)" :style="{ height: scrollHeight + 'px' }" />
  </div>
</template>

<style>
textarea {
  all: unset;

  display: block;
  box-sizing: border-box;
  width: 100%;

  resize: none;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  word-break: break-word;
  overflow-x: hidden;
  overflow-y: hidden;

  field-sizing: content;
}
</style>
