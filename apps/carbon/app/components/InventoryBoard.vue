<script setup lang="ts">
import PlayerCard from '~/components/Card/Card.vue'
import Board from '~/components/Board.vue'
import type { Card, CardStatRealms } from '../../types'

const props = defineProps<{
  timeline: gsap.core.Timeline
  time: number
  deck: Card[]
  inventory: Card[]
  realm: keyof CardStatRealms
}>()
function getCardStats(card: Card) {
  return card.stats[props.realm]
}
</script>

<template>
  <div class="MatchBoard">
    <Board board="inventory" :maxSlots="12">
      <PlayerCard v-for="card in inventory" :key="card.id" :cardInfo="card.info" :cardStats="getCardStats(card)"
        :index="card.index" :size="card.size" :time="time" :timeline="timeline" board="inventory" />
    </Board>
    <Board board="deck" :maxSlots="12">
      <PlayerCard v-for="card in deck" :key="card.id" :cardInfo="card.info" :cardStats="getCardStats(card)"
        :index="card.index" :size="card.size" :time="time" :timeline="timeline" board="deck" />
    </Board>
  </div>
</template>

<style>
.MatchBoard {
  display: grid;
  grid-template-columns: subgrid;
  grid-template-rows: 1fr 1fr;
  gap: var(--space-1);
  grid-column: span 12;
  height: 100%;
}
</style>
