<script setup lang="ts">
import type { Card } from '../../../types/card'
import type { ValueLogCore } from '../../composables/useBash'

const {
  logEntry,
  opponentDeck,
  playerDeck,
  canHaveStrikethrough = false,
} = defineProps<{
  opponentDeck: Card[]
  playerDeck: Card[]
  logEntry: ValueLogCore
  canHaveStrikethrough?: boolean
}>()

const card = computed(() => {
  if (logEntry.type === 'heal') return playerDeck[logEntry.index]
  if (logEntry.type === 'attack') return opponentDeck[logEntry.index]
  if (logEntry.type === 'shield') return playerDeck[logEntry.index]
  if (logEntry.type === 'banter') return playerDeck[logEntry.index]
})

const valueText = computed(() => {
  const isFullChange = logEntry.actualChange === logEntry.attemptedChange
  const changeText = isFullChange
    ? logEntry.actualChange
    : `(${logEntry.actualChange} / ${logEntry.attemptedChange})`

  const isNegative = logEntry.type === 'attack'

  if (isNegative) {
    return `-${changeText}`
  }
  return `+${changeText}`
})
</script>

<template>
  <div class="EntryContent" :class="{
    'base-success': logEntry.type === 'heal',
    'base-warning': logEntry.type === 'attack',
    'base-info': logEntry.type === 'shield',
    'base-yellow': logEntry.type === 'banter',
    strike: canHaveStrikethrough,
  }">
    <div class="avatar border">
      <img :src="card?.image?.default" alt="Card avatar" />
    </div>
    <p>{{ card?.name }} {{ logEntry.index }}</p>
    <div class="value border">
      <p>{{ valueText }}</p>
    </div>
  </div>
</template>

<style>
.EntryContent {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: var(--space-1);
  align-items: center;
}

li.change.dud .EntryContent.strike {
  text-decoration: line-through;
}

li.change .value {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--base-20);
  border-radius: var(--radius);
  padding: var(--space-quark) var(--space-1);
  color: var(--base-120);
}

.change .avatar {
  position: relative;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: var(--radius);
  overflow: hidden;
}

.change .avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
