<script setup lang="ts">
import type { FormatedRange, UmbraOutputs } from '@umbrajs/core'
import UmbraPallet from './UmbraPallet.vue'

interface Props {
  range: FormatedRange
  umbra: UmbraOutputs
  width?: string
  height?: string
}

withDefaults(defineProps<Props>(), {
  width: '6rem',
  height: undefined
})
</script>

<template>
  <div class="range">
    <h2 v-if="true">{{ range.name }}</h2>
    <UmbraPallet variable="base" text="base-foreground" :width="width" :height="height" />
    <UmbraPallet
      v-for="(color, index) in range.shades"
      :key="index"
      :name="range.name"
      :color="color"
      :index="index"
      :umbra="umbra"
      :width="width"
      :height="height"
    />
    <UmbraPallet variable="base-foreground" text="base" :width="width" :height="height" />
  </div>
</template>

<style scoped>
h2 {
  position: absolute;
  transform: translate(12px, 12px);
  font-size: 16px;
}

.range {
  display: flex;
  grid-template-columns: repeat(11, 1fr);
}
</style>
