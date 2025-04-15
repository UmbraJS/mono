<script setup lang="ts">
import type { Card } from '../../../types/card'
import type { ValueLog } from '../../composables/useBash'

const props = defineProps<{
  opponetDeck: Card[]
  playerDeck: Card[]
  healthLog: ValueLog
}>()

function getCardByIndex(index: number) {
  return props.playerDeck[index]
}
const opponentCardByIndex = props.playerDeck[props.healthLog.index]
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
    <div class="avatar border">
      <img :src="opponentCardByIndex?.image?.default" alt="Card avatar" />
    </div>
    <p>{{ opponentCardByIndex?.name }}</p>

    <div class="value border">
      <p v-if="healthLog.actualChange !== healthLog.attemptedChange">
        {{ healthLog.actualChange }} / {{ healthLog.attemptedChange }}
      </p>
      <p v-else>{{ healthLog.actualChange }}</p>
    </div>
    <!-- <p v-if="healthLog.reductionSources.length > 0">
            reduced by
            {{
              healthLog.reductionSources
                .map((source) => {
                  const card = getCardByIndex(source)
                  return card ? card.name : 'Unknown'
                })
                .join(', ')
            }}
          </p> -->
  </li>
</template>

<style>
li.change {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: var(--space-1);
  align-items: center;
  background: var(--base-10);
  color: var(--base-120);
  padding: var(--space-1);
  border-radius: var(--radius);
}

li.change.dud {
  opacity: 0.2;
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
