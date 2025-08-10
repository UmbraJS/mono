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
    <BifrostFiber v-if="connection.start.component && connection.end.component"
      :ref="(e) => connection.component = e as FiberType" :fiber-start="connection.type === 'source-sink'
        ? connection.start.component?.sources?.hooks[connection.start.hook]
        : connection.start.component?.inputs?.hooks[connection.start.hook]" :fiber-end="connection.type === 'source-sink'
          ? connection.end.component?.sinks?.hooks[connection.end.hook]
          : connection.end.component?.outputs?.hooks[connection.end.hook]"
      :orientation="connection.type === 'source-sink' ? 'vertical' : 'horizontal'" />
  </div>
</template>
