<script setup lang="ts">
import type { UsePlayerReturn } from '../../composables/usePlayer'
import { ScrollArea } from '@nobel/core'
import type { Card } from '../../../types/card'
import BashLogEntry from './BashLogEntry.vue'

const props = defineProps<{
  player: UsePlayerReturn
  opponent: UsePlayerReturn
  playerDeck: Card[]
  opponentDeck: Card[]
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
  <ScrollArea class="ScrollArea">
    <ul>
      <BashLogEntry v-for="log in allLogsOrderedByTime" :key="log.timestamp" :log-entry="log"
        :opponent-deck="props.opponentDeck" :player-deck="props.playerDeck" />
    </ul>
  </ScrollArea>
</template>

<style>
.ScrollArea {
  padding-right: var(--space-quark);
  height: 100%;
  padding-right: var(--space-2);
}

ul {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}
</style>
