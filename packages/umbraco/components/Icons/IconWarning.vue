<script setup lang="ts">
import SVG from './SVG.vue'
const { size } = defineProps<{
  size?: 'medium' | 'small' | 'mini'
}>()
</script>

<template>
  <SVG :size="size">
    <path fill="currentColor" d="M12 2L2 22h20L12 2zm0 3.83L19.17 20H4.83L12 5.83zM11 16v2h2v-2h-2zm0-6v4h2v-4h-2z" />
  </SVG>
</template>
