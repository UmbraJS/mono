<script setup lang="ts">
import type { BifrostFiberConnections } from '../types'
import BifrostFiber from './BifrostFiber.vue'

type FiberType = InstanceType<typeof BifrostFiber>

defineProps<{
  connections: BifrostFiberConnections[]
}>()
</script>

<template>
  <div v-for="connection in connections" :key="connection.id">
    <BifrostFiber v-if="connection.output.component && connection.input.component"
      :ref="(e) => connection.component = e as FiberType"
      :fiber-start="connection.output.component?.outputs?.hooks[connection.output.hook]"
      :fiber-end="connection.input.component?.inputs?.hooks[connection.input.hook]" />
  </div>
</template>
