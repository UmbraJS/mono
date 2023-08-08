<script setup lang="ts">
import type { FormatedRange } from '@umbrajs/core'
import UmbraPallet from './UmbraPallet.vue'

defineProps<{
  range: FormatedRange
}>()
</script>

<template>
  <h2>{{ range.name }}</h2>
  <div class="range">
    <UmbraPallet :name="range.name" :color="range.background" :index="0" />
    <UmbraPallet
      v-for="(color, index) in range.shades"
      :key="index"
      :name="range.name"
      :color="color"
      :index="index"
    />
    <UmbraPallet :name="range.name" :color="range.foreground" :index="0" prefix="foreground" />
  </div>
</template>

<style scoped>
.range {
  display: flex;
}
</style>
