<script setup lang="ts">
import type { Connection } from '../types'
import FiberPath from './Fiber.vue'

type FiberType = InstanceType<typeof FiberPath>

defineProps<{
  bounds?: HTMLDivElement
  connections: Connection[]
}>()
</script>

<template>
  <div v-for="connection in connections" :key="connection.id">
    <FiberPath
      v-if="connection.output.component && connection.input.component"
      :ref="(e) => (connection.component = e as FiberType)"
      :bounds="bounds"
      :output="connection.output.component?.outputs?.hooks[connection.output.hook]"
      :input="connection.input.component?.inputs?.hooks[connection.input.hook]"
    />
  </div>
</template>
