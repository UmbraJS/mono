<script setup lang="ts">
import type { UsePlayerReturn } from '../../composables/usePlayer'
import { ScrollArea } from '@nobel/core'
import type { Card } from '../../../types/card'
import BashLogEntry from './BashLogEntry.vue'

const props = defineProps<{
  player: UsePlayerReturn
  opponent: UsePlayerReturn
  playerDeck: Card[]
  opponetDeck: Card[]
}>()

const allLogsOrderedByTime = computed(() => {
  const allLogs = [...props.player.healthLog.value, ...props.player.shieldLog.value]
  return allLogs
    .sort((a, b) => a.timestamp - b.timestamp)
    .slice()
    .reverse()
})
</script>

<template>
  <ScrollArea class="ScrollArea border">
    <ul>
      <li v-for="(log, index) in allLogsOrderedByTime" :key="index">
        <BashLogEntry
          :log-entry="log"
          :opponet-deck="props.opponetDeck"
          :player-deck="props.playerDeck"
        />
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
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}
</style>
