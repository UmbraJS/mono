<script setup lang="ts">
import type { UsePlayerReturn } from '../../composables/usePlayer'
import { ScrollArea } from '@nobel/core'
import type { Card } from '../../../types/card'
import BashLogEntry from './BashLogEntry.vue'

const props = defineProps<{
  player: UsePlayerReturn
  playerDeck: Card[]
  opponetDeck: Card[]
}>()

const reversedHealthLog = computed(() => {
  return props.player.healthLog.value.slice().reverse()
})
</script>

<template>
  <ScrollArea class="ScrollArea border">
    <ul>
      <li v-for="(log, index) in reversedHealthLog" :key="index">
        <BashLogEntry
          :health-log="log"
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
