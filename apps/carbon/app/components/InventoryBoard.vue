<script setup lang="ts">
import PlayerCard from '~/components/Card/Card.vue'
import CardBoard from '~/components/CardBoard.vue'
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
    <CardBoard board="inventory" :max-slots="12">
      <PlayerCard v-for="card in inventory" :key="card.id" :card-info="card.info" :card-stats="getCardStats(card)"
        :index="card.index" :size="card.size" :time="time" :timeline="timeline" board="inventory" />
    </CardBoard>
    <CardBoard board="deck" :max-slots="12">
      <PlayerCard v-for="card in deck" :key="card.id" :card-info="card.info" :card-stats="getCardStats(card)"
        :index="card.index" :size="card.size" :time="time" :timeline="timeline" board="deck" />
    </CardBoard>
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
