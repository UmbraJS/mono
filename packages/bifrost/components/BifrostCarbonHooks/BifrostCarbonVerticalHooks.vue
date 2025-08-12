<script setup lang="ts">
import type { CarbonObject, NewNode } from '../../types'
import BifrostCarbonHooks from './BifrostCarbonHooks.vue'
import { shallowRef } from 'vue'

defineProps<{
  carbon: CarbonObject
}>()

const emit = defineEmits<{
  (e: 'clickCarbonHandle', carbon: NewNode): void
}>()

const sources = shallowRef<InstanceType<typeof BifrostCarbonHooks>>()
const sinks = shallowRef<InstanceType<typeof BifrostCarbonHooks>>()

defineExpose({ sources, sinks })
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
