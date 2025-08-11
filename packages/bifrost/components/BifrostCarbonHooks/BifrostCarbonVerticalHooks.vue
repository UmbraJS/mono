<script setup lang="ts">
import type { CarbonObject, NewNode } from '../../types'
import BifrostCarbonHooks from './BifrostCarbonHooks.vue'

defineProps<{
  carbon: CarbonObject
}>()

const emit = defineEmits<{
  (e: 'clickCarbonHandle', carbon: NewNode): void
}>()
</script>

<template>
  <div id="BifrostCore">
    <!-- Vertical Top (sources) -->
    <BifrostCarbonHooks ref="sources" :carbon="carbon" type="source"
      @hookMouseDown="(index: number) => emit('clickCarbonHandle', { id: carbon.id, type: 'source', index })" />
    <slot />
    <!-- Vertical Bottom (sinks) -->
    <BifrostCarbonHooks ref="sinks" :carbon="carbon" type="sink"
      @hookMouseDown="(index: number) => emit('clickCarbonHandle', { id: carbon.id, type: 'sink', index })" />
  </div>
</template>

<style>
#BifrostCore {
  display: grid;
  grid-template-rows: auto 1fr auto;
}
</style>
