<script setup lang="ts">
import { ScrollArea } from '@nobel/core'
import type { CardInfo } from '../../../types/card'
import BashLogEntry from './BashLogEntry.vue'
import type { SpaceOutput } from '../../../utils/spaceTimeSimulation'

const props = defineProps<{
  logs: Pick<SpaceOutput, "healthLog" | "shieldLog">
  opponentInfoDeck: CardInfo[]
  playerInfoDeck: CardInfo[]
}>()

const allLogs = [...props.logs.healthLog, ...props.logs.shieldLog]
const allLogsOrderedByTime = allLogs
  .sort((a, b) => a.timestamp - b.timestamp)
  .slice()
  .reverse()
</script>

<template>
  <ScrollArea class="ScrollArea">
    <ul>
      <BashLogEntry v-for="log in allLogsOrderedByTime" :key="log.timestamp" :log-entry="log"
        :opponentInfoDeck="props.opponentInfoDeck" :playerInfoDeck="props.playerInfoDeck" />
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
