<script setup lang="ts">
import type { Card } from '../../../types/card'
import type { ValueLog } from '../../composables/useBash'
import BashLogDropdown from './BashLogDropdown.vue'
import BashLogEntryContent from './BashLogEntryContent.vue'

const props = defineProps<{
  opponetDeck: Card[]
  playerDeck: Card[]
  healthLog: ValueLog
}>()
</script>

<template>
  <li
    class="change"
    :class="{
      'base-success': healthLog.type === 'heal',
      'base-warning': healthLog.type === 'attack',
      'base-info': healthLog.type === 'shield',
      'base-yellow': healthLog.type === 'banter',
      dud: healthLog.actualChange === 0,
    }"
  >
    <BashLogEntryContent
      :opponet-deck="props.opponetDeck"
      :player-deck="props.playerDeck"
      :health-log="healthLog"
    />

    <BashLogDropdown
      v-if="healthLog.debufs.length > 0"
      :player-deck="props.playerDeck"
      :opponet-deck="props.opponetDeck"
      :health-log="healthLog"
    />
  </li>
</template>

<style>
li.change {
  background: var(--base-10);
  color: var(--base-120);
  padding: var(--space-1);
  border-radius: var(--radius);
}

li.change.dud {
  opacity: 0.2;
}
</style>
