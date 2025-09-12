<script setup lang="ts">
import { computed } from 'vue'
import type { ButtonSize } from "../../../types/button"
import { TabsTrigger } from 'reka-ui'

const props = defineProps<{
  value: string
  size: ButtonSize
  active: boolean
  disabled: boolean
}>()

const sizeClass = computed(() => ({
  mini: 'buttonMini',
  small: 'buttonSmall',
  medium: 'buttonMedium',
}[props.size] ?? 'buttonMedium'))
</script>

<template>
  <TabsTrigger class="button buttonText buttonHover buttonActive buttonFocus"
    :class="`${sizeClass} ${active ? 'base-accent' : 'base'}`" :value="value" :disabled="disabled" :active="active">
    <slot />
  </TabsTrigger>
</template>
