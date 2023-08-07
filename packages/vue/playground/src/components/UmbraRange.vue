<script setup lang="ts">
import type { FormatedColor } from '@umbrajs/core'
import UmbraPallet from './UmbraPallet.vue'

defineProps<{
  range: FormatedColor
}>()
</script>

<template>
  <div class="range">
    <UmbraPallet
      v-for="(color, index) in range.shades"
      :key="index"
      :name="range.name"
      :color="color"
      :index="index"
    />
  </div>
</template>

<style scoped></style>
