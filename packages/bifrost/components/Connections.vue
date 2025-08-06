<script setup lang="ts">
import type { BifrostFiberConnections } from '../types'
import FiberPath from './BifrostFiber.vue'

type FiberType = InstanceType<typeof FiberPath>

defineProps<{
  bounds?: HTMLDivElement
  connections: BifrostFiberConnections[]
}>()
</script>

<template>
  <div v-for="connection in connections" :key="connection.id">
    <FiberPath v-if="connection.output.component && connection.input.component"
      :ref="(e: FiberType) => (connection.component = e)" :bounds="bounds"
      :output="connection.output.component?.outputs?.hooks[connection.output.hook]"
      :input="connection.input.component?.inputs?.hooks[connection.input.hook]" />
  </div>
</template>
