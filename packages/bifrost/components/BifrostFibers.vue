<script setup lang="ts">
import type { BifrostFiberConnections, CarbonObject } from '../types'
import BifrostFiber from './BifrostFiber.vue'
import { computed } from 'vue'

type FiberType = InstanceType<typeof BifrostFiber>

const { connections, carbons } = defineProps<{
  connections: BifrostFiberConnections[]
  carbons: CarbonObject[]
}>()

function getRelatedCarbons(connection: BifrostFiberConnections) {
  return {
    start: carbons.find(c => c.id === connection.start.carbon),
    end: carbons.find(c => c.id === connection.end.carbon)
  }

}
</script>

<template>
  <div v-for="connection in connections" :key="connection.id">
    <BifrostFiber v-if="connection.start.component && connection.end.component"
      :ref="(e) => connection.component = e as FiberType" :fiber-start="connection.type === 'source-sink'
        ? connection.start.component?.verticalHooks?.sources?.hooks[connection.start.hook]
        : connection.start.component?.horizontalHooks?.inputs?.hooks[connection.start.hook]" :fiber-end="connection.type === 'source-sink'
          ? connection.end.component?.verticalHooks?.sinks?.hooks[connection.end.hook]
          : connection.end.component?.horizontalHooks?.outputs?.hooks[connection.end.hook]"
      :orientation="connection.type === 'source-sink' ? 'vertical' : 'horizontal'"
      :start-state="getRelatedCarbons(connection).start?.state" :end-state="getRelatedCarbons(connection).end?.state" />
  </div>
</template>
