<script setup lang="ts">
import type { Card } from '../../../types/card'
import type { ValueLogCore } from '../../composables/useBash'
import BashLogDropdown from './BashLogDropdown.vue'
import BashLogEntryContent from './BashLogEntryContent.vue'

const props = defineProps<{
  opponetDeck: Card[]
  playerDeck: Card[]
  logEntry: ValueLogCore
}>()
</script>

<template>
  <li
    class="change"
    :class="{
      'base-success': logEntry.type === 'heal',
      'base-warning': logEntry.type === 'attack',
      'base-info': logEntry.type === 'shield',
      'base-yellow': logEntry.type === 'banter',
      dud: logEntry.actualChange === 0,
    }"
  >
    <BashLogEntryContent
      :opponet-deck="props.opponetDeck"
      :player-deck="props.playerDeck"
      :log-entry="logEntry"
      :can-have-strikethrough="true"
    />

    <BashLogDropdown
      v-if="logEntry.banter.debufs.length > 0"
      :player-deck="props.playerDeck"
      :opponet-deck="props.opponetDeck"
      :log-entry="logEntry"
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
</style>
