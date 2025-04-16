<script setup lang="ts">
import type { Card } from '../../../types/card'
import type { ValueLogCore } from '../../composables/useBash'

const props = defineProps<{
  opponetDeck: Card[]
  playerDeck: Card[]
  logEntry: ValueLogCore
}>()

const card = computed(() => {
  if (props.logEntry.type === 'heal') return props.playerDeck[props.logEntry.index]
  if (props.logEntry.type === 'attack') return props.opponetDeck[props.logEntry.index]
  if (props.logEntry.type === 'shield') return props.playerDeck[props.logEntry.index]
  if (props.logEntry.type === 'banter') return props.playerDeck[props.logEntry.index]
})
</script>

<template>
  <div
    class="EntryContent"
    :class="{
      'base-success': logEntry.type === 'heal',
      'base-warning': logEntry.type === 'attack',
      'base-info': logEntry.type === 'shield',
      'base-yellow': logEntry.type === 'banter',
    }"
  >
    <div class="avatar border">
      <img :src="card?.image?.default" alt="Card avatar" />
    </div>
    <p>{{ card?.name }} {{ logEntry.index }}</p>
    <div class="value border">
      <p v-if="logEntry.actualChange !== logEntry.attemptedChange">
        {{ logEntry.actualChange }} / {{ logEntry.attemptedChange }}
      </p>
      <p v-else>{{ logEntry.actualChange }}</p>
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
