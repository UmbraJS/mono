<script setup lang="ts">
import { onMounted } from 'vue'
import type { FormatedRange, UmbraOutputs } from '@umbrajs/core'
import UmbraPallet from './UmbraPallet.vue'

const props = defineProps<{
  range: FormatedRange
  umbra: UmbraOutputs
}>()

onMounted(() => {
  console.log(props.range)
})
</script>

<template>
  <h2 v-if="false">{{ range.name }}</h2>
  <div class="range">
    <!-- <UmbraPallet variable="accent" text="base-foreground" /> -->
    <UmbraPallet variable="base" text="base-foreground" />
    <UmbraPallet
      v-for="(color, index) in range.shades"
      :key="index"
      :name="range.name"
      :color="color"
      :index="index"
      :umbra="umbra"
    />
    <UmbraPallet variable="base-foreground" text="base" />
  </div>
</template>

<style scoped>
.range {
  display: flex;
}
</style>
