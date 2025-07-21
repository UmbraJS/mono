<script setup lang="ts">
import { useSimulationInject } from '~/composables/useSimulationProvider'

const store = useStore()

const simulation = useSimulationInject()

const opponentTimeline = simulation.cardTimeline.opponent
const playerTimeline = simulation.cardTimeline.player

const maxUserSlots = computed(() => store.user.maxSlots)
const maxBotSlots = computed(() => store.bot.maxSlots)
</script>

<template>
  <div class="MatchBoard">
    <CardBoard board="deck" :max-slots="maxBotSlots">
      <CardHeader v-for="card in opponentTimeline" :key="card.card.id" :card="card.card">
        <CardCooldown :chunks="card.simulation.chunks" />
      </CardHeader>
    </CardBoard>
    <TimeControls />
    <CardBoard board="deck" :max-slots="maxUserSlots">
      <CardHeader v-for="card in playerTimeline" :key="card.card.id" :card="card.card">
        <CardCooldown :chunks="card.simulation.chunks" />
      </CardHeader>
    </CardBoard>
  </div>
</template>

<style>
.MatchBoard {
  display: grid;
  grid-template-rows: 1fr auto 1fr;
  gap: var(--space-1);
  grid-column: 1 / -1;
}
</style>
