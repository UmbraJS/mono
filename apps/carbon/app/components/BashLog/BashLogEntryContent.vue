<script setup lang="ts">
import type { Card } from '../../../types/card'
import type { ValueLog } from '../../composables/useBash'

const props = defineProps<{
  opponetDeck: Card[]
  playerDeck: Card[]
  healthLog: ValueLog
}>()

const card = computed(() => {
  if (props.healthLog.type === 'heal') return props.playerDeck[props.healthLog.index]
  if (props.healthLog.type === 'attack') return props.opponetDeck[props.healthLog.index]
  if (props.healthLog.type === 'shield') return props.playerDeck[props.healthLog.index]
  if (props.healthLog.type === 'banter') return props.playerDeck[props.healthLog.index]
})
</script>

<template>
  <div
    class="EntryContent"
    :class="{
      'base-success': healthLog.type === 'heal',
      'base-warning': healthLog.type === 'attack',
      'base-info': healthLog.type === 'shield',
      'base-yellow': healthLog.type === 'banter',
    }"
  >
    <div class="avatar border">
      <img :src="card?.image?.default" alt="Card avatar" />
    </div>
    <p>{{ card?.name }} {{ healthLog.index }}</p>
    <div class="value border">
      <p v-if="healthLog.actualChange !== healthLog.attemptedChange">
        {{ healthLog.actualChange }} / {{ healthLog.attemptedChange }}
      </p>
      <p v-else>{{ healthLog.actualChange }}</p>
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
