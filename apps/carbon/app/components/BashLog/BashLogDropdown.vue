<script setup lang="ts">
import type { Card } from '../../../types/card'
import type { ValueLogCore } from '../../composables/useBash'
import BashLogEntryContent from './BashLogEntryContent.vue'

defineProps<{
  opponetDeck: Card[]
  playerDeck: Card[]
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
      <BashLogEntryContent
        v-for="(log, index) in logEntry.banter.debufs"
        :opponet-deck="opponetDeck"
        :player-deck="playerDeck"
        :logEntry="log"
      />
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
  padding: 0px;
  padding-left: var(--space-2);
  height: 0px;
  overflow: hidden;
}

.open .dropdown {
  height: auto;
}
</style>
