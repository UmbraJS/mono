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
  console.log("rex with realm:", props.realm)
  return card.stats[props.realm]
}
</script>

<template>
  <div class="MatchBoard">
    <Board>
      <PlayerCard v-for="card in inventory" :key="card.id" :cardInfo="card.info" :cardStats="getCardStats(card)"
        :index="card.index" :time="time" :timeline="timeline" />
    </Board>
    <Board>
      <PlayerCard v-for="card in deck" :key="card.id" :cardInfo="card.info" :cardStats="getCardStats(card)"
        :index="card.index" :time="time" :timeline="timeline" />
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
}
</style>
