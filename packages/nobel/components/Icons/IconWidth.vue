<script setup lang="ts">
import SVG from './SVG.vue'
const { size } = defineProps<{
  size?: 'medium' | 'small' | 'mini'
}>()
</script>

<template>
  <SVG :size="size">
    <path
      fill="currentColor"
      d="M22 2v2H2V2zm0 18v2H2v-2zm-6-5v-2H8v2H6v-2H4v-2h2V9h2v2h8V9h2v2h2v2h-2v2zm0 0v2h-2v-2zm0-6h-2V7h2zM8 9V7h2v2zm0 6h2v2H8z"
    />
  </SVG>
</template>
