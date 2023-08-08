<script setup lang="ts">
import type { FormatedRange, UmbraOutputs } from '@umbrajs/core'
import UmbraPallet from './UmbraPallet.vue'

defineProps<{
  range: FormatedRange
  umbra: UmbraOutputs
}>()
</script>

<template>
  <h2>{{ range.name }}</h2>
  <div class="range">
    <UmbraPallet :name="range.name" :color="range.background" :umbra="umbra" />
    <UmbraPallet
      v-for="(color, index) in range.shades"
      :key="index"
      :name="range.name"
      :color="color"
      :index="index"
      :umbra="umbra"
    />
    <UmbraPallet :name="range.name" :color="range.foreground" prefix="foreground" :umbra="umbra" />
  </div>
</template>

<style scoped>
.range {
  display: flex;
}
</style>
