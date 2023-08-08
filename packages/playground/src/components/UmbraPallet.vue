<script setup lang="ts">
import tinycolor from 'tinycolor2'
import { computed } from 'vue'
import { findContrast } from '@umbrajs/core'
import type { UmbraOutputs } from '@umbrajs/core'

const props = defineProps<{
  color: string
  name: string
  index?: number
  prefix?: string
  umbra: UmbraOutputs
}>()

function getIndex() {
  if (props.index === undefined) return 0
  return props.index * 10 + 10
}

const colorId = computed(() => {
  return props.index !== undefined ? '-' + getIndex() : ''
})

const cssVariable = computed(() => {
  return props.prefix
    ? `var(--${props.name}-${props.prefix})`
    : `var(--${props.name}${colorId.value})`
})

const textColor = computed(() => {
  return findContrast(tinycolor(props.color), props.umbra.output.adjusted).toHexString()
})
</script>

<template>
  <div class="range">
    <div class="pallet" :style="{ color: textColor }">
      <p>{{ getIndex() }}</p>
      <p>{{ color }}</p>
    </div>
  </div>
</template>

<style scoped>
.pallet {
  padding: 0.2rem 0.5rem;
  aspect-ratio: 1/1;
  height: 6rem;
  width: 6rem;
  background-color: v-bind(cssVariable);
}

.pallet p {
}
</style>
