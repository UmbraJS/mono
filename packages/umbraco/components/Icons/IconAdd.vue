<script setup lang="ts">
import SVG from './SVG.vue'
const { size } = defineProps<{
  size?: 'medium' | 'small' | 'mini'
}>()
</script>

<template>
  <SVG :size="size">
    <path fill="currentColor" d="M11 4h2v7h7v2h-7v7h-2v-7H4v-2h7z" />
  </SVG>
</template>
