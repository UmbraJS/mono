<script setup lang="ts">
import PlayerCard from '~/components/Card/Card.vue'
import Board from '~/components/Board.vue'
import type { SpaceTimeSimulationOutput } from '../../utils/spaceTimeSimulation'

const props = defineProps<{
  cardTimeline: SpaceTimeSimulationOutput
  timeline: gsap.core.Timeline
  time: number
}>()

function handleReset() {
  props.timeline.restart()
  // Reset the health and morale of both players
}
</script>

<template>
  <div class="MatchBoard">
    <Board>
      <PlayerCard v-for="card in cardTimeline.time.opponent" :key="card.card.id" :card="card"
        :opponentLogs="cardTimeline.space.player" :playerLogs="cardTimeline.space.opponent" :time="time"
        :timeline="timeline" />

      <PlayerCard v-for="card in cardTimeline.time.opponent" :key="card.id" :cardInfo="card.info"
        :cardStats="getCardStats(card)" :index="card.index" :time="time" :timeline="timeline" />
    </Board>
    <TimeControls :timeline="timeline" :time="time" @on-restart="handleReset" />
    <Board>
      <PlayerCard v-for="card in cardTimeline.time.player" :key="card.card.id" :card="card"
        :opponentLogs="cardTimeline.space.opponent" :playerLogs="cardTimeline.space.player" :time="time"
        :timeline="timeline" />
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
