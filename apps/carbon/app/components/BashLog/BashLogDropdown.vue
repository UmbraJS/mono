<script setup lang="ts">
import type { CardInfo } from '../../../types/card'
import type { ValueLogCore } from '../../composables/LEGACYuseBash'
import BashLogEntryContent from './BashLogEntryContent.vue'

defineProps<{
  opponentInfoDeck: CardInfo[]
  playerInfoDeck: CardInfo[]
  logEntry: ValueLogCore
}>()

const open = ref(false)
</script>

<template>
  <div class="dropdown-wrapper" :class="{ open }">
    <div class="dropdown-toggle" @click="open = !open">
      <Icon name="carbon:chevron-down" size="1.5rem" />
    </div>
    <div class="dropdown">
      <BashLogEntryContent v-for="log in logEntry.banter.debuffs" :key="log.index"
        :opponent-info-deck="opponentInfoDeck" :player-info-deck="playerInfoDeck" :log-entry="log" />
    </div>
  </div>
</template>

<style>
.dropdown-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--base-20);
  border-radius: var(--radius);
  cursor: pointer;
}

.dropdown-toggle:hover {
  background-color: var(--base-30);
}

.dropdown-toggle span {
  transform: rotate(0deg);
  transition: 0.2s;
}

.open .dropdown-toggle span {
  transform: rotate(180deg);
}

.dropdown {
  display: flex;
  flex-direction: column;
  gap: var(--space-quark);
  padding: 0;
  height: 0px;
  overflow: hidden;
  transition: 0.2s ease-in-out;
}

.open .dropdown {
  padding: var(--space-1);
  padding-left: var(--space-3);
  height: auto;
}
</style>
