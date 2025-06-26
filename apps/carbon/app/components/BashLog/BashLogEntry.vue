<script setup lang="ts">
import type { CardInfo } from '../../../types/card'
import type { ValueLogCore } from '../../composables/useBash'
import BashLogDropdown from './BashLogDropdown.vue'
import BashLogEntryContent from './BashLogEntryContent.vue'

const props = defineProps<{
  opponentInfoDeck: CardInfo[]
  playerInfoDeck: CardInfo[]
  logEntry: ValueLogCore
}>()
</script>

<template>
  <li
class="change border" :class="{
    'base-success': logEntry.type === 'heal',
    'base-warning': logEntry.type === 'attack',
    'base-info': logEntry.type === 'shield',
    'base-yellow': logEntry.type === 'banter',
    dud: logEntry.actualChange === 0,
  }">
    <BashLogEntryContent
:opponent-info-deck="props.opponentInfoDeck" :player-info-deck="props.playerInfoDeck"
      :log-entry="logEntry" :can-have-strikethrough="true" />

    <BashLogDropdown
v-if="logEntry.banter.debuffs.length > 0" :player-info-deck="props.playerInfoDeck"
      :opponent-info-deck="props.opponentInfoDeck" :log-entry="logEntry" />
  </li>
</template>

<style>
li.change {
  display: flex;
  flex-direction: column;
  gap: var(--space-quark);
  background: var(--base-10);
  color: var(--base-120);
  padding: var(--space-1);
  border-radius: var(--radius);
  animation: fade-in var(--slow) ease-in-out;
}

@keyframes fade-in {
  0% {
    opacity: 0;
    transform: translateX(-40%);
  }

  100% {
    opacity: 1;
    transform: translateX(0px);
  }
}
</style>
