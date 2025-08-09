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
      :ref="(e) => connection.component = e as FiberType" :fiber-start="connection.type === 'source-sink'
        ? connection.output.component?.sources?.hooks[connection.output.hook]
        : connection.output.component?.inputs?.hooks[connection.output.hook]" :fiber-end="connection.type === 'source-sink'
          ? connection.input.component?.sinks?.hooks[connection.input.hook]
          : connection.input.component?.outputs?.hooks[connection.input.hook]"
      :orientation="connection.type === 'source-sink' ? 'vertical' : 'horizontal'" />
  </div>
</template>
