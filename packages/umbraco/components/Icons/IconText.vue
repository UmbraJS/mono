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
      d="M11 5H3v2h8zm10 0h-8v2h8zM3 9h8v2H3zm18 0h-8v2h8zM3 13h8v2H3zm18 0h-8v2h8zM3 17h8v2H3zm18 0h-8v2h8z"
    />
  </SVG>
</template>
