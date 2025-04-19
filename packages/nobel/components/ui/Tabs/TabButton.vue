<script setup lang="ts">
import type { ButtonSize } from "../../../types/button"
import { TabsTrigger } from 'reka-ui'

defineProps<{
  value: string
  size: ButtonSize
  active: boolean
  disabled: boolean
}>()
</script>

<template>
  <TabsTrigger class="button buttonText buttonHover buttonActive buttonFocus focus"
    :class="`${size} ${active ? 'base-accent' : 'base'}`" :value="value" :disabled="disabled" :active="active">
    <slot />
  </TabsTrigger>
</template>
