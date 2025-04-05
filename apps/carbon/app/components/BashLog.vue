<script setup lang="ts">
import type { UsePlayerReturn } from '../composables/usePlayer'
import { ScrollArea } from '@nobel/core'

const props = defineProps<{
  player: UsePlayerReturn
}>()

const reversedHealthLog = computed(() => {
  return props.player.healthLog.value.slice().reverse()
})
</script>

<template>
  <ScrollArea class="ScrollArea border">
    <ul>
      <li v-for="(log, index) in reversedHealthLog" :key="index">
        <p>
          {{ Math.floor(log.timestamp) }}s {{ log.actualChange }} /
          {{ log.attemptedChange }}
          {{ log.newValue }}
          {{ log.reductionSources }}
        </p>
      </li>
    </ul>
  </ScrollArea>
</template>

<style>
.ScrollArea {
  height: 130px;
  overflow: hidden;
  padding: var(--space-2);
}

ul {
  list-style: none;
  padding: 0;
}
</style>
