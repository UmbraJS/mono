<script setup lang="ts">
import PlayerCard from '~/components/Card/CardHeader.vue'
import Board from '~/components/CardBoard.vue'

const store = useStore()
const opponentTimeline = store.simulation.cardTimeline.opponent
const playerTimeline = store.simulation.cardTimeline.player
</script>

<template>
  <div class="MatchBoard">
    <Board board="deck" :max-slots="12">
      <PlayerCard v-for="card in opponentTimeline" :key="card.card.id" :card="card.card"
        :chunks="card.simulation.chunks" />
    </Board>
    <TimeControls />
    <Board board="deck" :max-slots="12">
      <PlayerCard v-for="card in playerTimeline" :key="card.card.id" :card="card.card"
        :chunks="card.simulation.chunks" />
    </Board>
  </div>
</template>

<style>
.MatchBoard {
  display: grid;
  grid-template-columns: subgrid;
  grid-template-rows: 1fr auto 1fr;
  gap: var(--space-1);
  grid-column: span 12;
}
</style>
