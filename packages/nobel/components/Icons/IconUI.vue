<script setup lang="ts">
import SVG from './SVG.vue'
const { size } = defineProps<{
  size?: 'medium' | 'small' | 'mini'
}>()
</script>

<template>
  <SVG :size="size">
    <path fill="currentColor" d="M2 4h20v16H2zm2 2v12h16V6zm6 4h8v6h-8zm2 2v2h4v-2z" />
  </SVG>
</template>
