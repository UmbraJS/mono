<script setup lang="ts">
import PlayerCard from '~/components/Card/Card.vue'
import Board from '~/components/CardBoard.vue'
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
        :opponent-logs="cardTimeline.space.player" :player-logs="cardTimeline.space.opponent" :time="time"
        :timeline="timeline" />

      <PlayerCard v-for="card in cardTimeline.time.opponent" :key="card.id" :card-info="card.info"
        :card-stats="getCardStats(card)" :index="card.index" :time="time" :timeline="timeline" />
    </Board>
    <TimeControls :timeline="timeline" :time="time" @on-restart="handleReset" />
    <Board>
      <PlayerCard v-for="card in cardTimeline.time.player" :key="card.card.id" :card="card"
        :opponent-logs="cardTimeline.space.opponent" :player-logs="cardTimeline.space.player" :time="time"
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
