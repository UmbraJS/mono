<script setup lang="ts">
import { ref, toRef } from 'vue'
import { useButtonSize } from "../../../composables/useButtonSize";
import type { ButtonSize } from '../../../types/button'
import InputLabel from './InputLabel.vue'
import InputErrorIcon from './InputErrorIcon.vue'
import InputWrapper from './InputWrapper.vue';

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
  <InputWrapper :error="error">
    <InputLabel :for="label" :label="label" :error="error" class="button" :class="!focused ? 'bodycopy' : 'move'" />
    <input v-bind="$attrs" v-model="model" :id="label"
      :class="`InputElement button buttonHover buttonActive buttonFocus focus ${sizeClass}`" :placeholder="label"
      @focus="() => (focused = true)" @blur="() => (focused = false)" />
    <!-- <InputErrorIcon :error="error" /> -->
  </InputWrapper>
</template>
