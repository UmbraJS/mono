<script setup lang="ts">
import { shallowRef } from 'vue'
import type { NewNode, CarbonObject } from '../../types'
import BifrostCarbonHooks from './BifrostCarbonHooks.vue'

const inputs = shallowRef<InstanceType<typeof BifrostCarbonHooks>>()
const outputs = shallowRef<InstanceType<typeof BifrostCarbonHooks>>()

defineExpose({ inputs, outputs })
defineProps<{ carbon: CarbonObject }>()
const emit = defineEmits<{ (e: 'clickCarbonHandle', carbon: NewNode): void }>()
</script>

<template>
  <!-- Horizontal Left Side (outputs) -->
  <BifrostCarbonHooks ref="outputs" :carbon="carbon" type="output"
    @hookMouseDown="(index: number) => emit('clickCarbonHandle', { id: carbon.id, type: 'output', index })" />
  <slot />
  <!-- Horizontal Right Side (inputs) -->
  <BifrostCarbonHooks ref="inputs" :carbon="carbon" type="input"
    @hookMouseDown="(index: number) => emit('clickCarbonHandle', { id: carbon.id, type: 'input', index })" />
</template>
