<script setup lang="ts">
import { TabsTrigger } from 'reka-ui'

defineProps<{
  value: string
}>()
</script>

<template>
  <TabsTrigger
    class="button buttonText buttonHover buttonActive buttonFocus focus"
    :value="value"
  >
    <slot />
  </TabsTrigger>
</template>
