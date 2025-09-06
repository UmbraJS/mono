<script setup lang="ts">
import { Graph, ScrollArea } from 'umbraco'
import type { Card } from '../../../types'
// import type { BashRecords } from '~/composables/LEGACYuseBashRecords'

const props = defineProps<{
  card: Card;
}>()

const simulation = useSimulationInject()

// opponent Health Logs With Player Owner
const playerAttacks = simulation.simulatedMatch.space.opponent.healthLog.filter(
  (record) => record.board === props.card.owner.board
)

const cardAttacks = playerAttacks.filter(
  (record) => record.index === props.card.index
)

const mappedCardAttacks = cardAttacks.map((record) => {
  return {
    x: record.timestamp,
    y: record.attemptedChange,
    y1: 10,
    y2: 10,
  }
})
</script>

<template>
  <ScrollArea class="CardModalRecords">
    <div class="datavis">
      <Graph v-if="mappedCardAttacks" :data="mappedCardAttacks" />
    </div>
  </ScrollArea>
</template>

<style>
.CardModalRecords {
  display: grid;
  flex-direction: column;
  grid-template-rows: auto 1fr;
  gap: var(--space-2);
  height: 100%;
}

.datavis {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
