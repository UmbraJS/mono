<script setup lang="ts">
import { useSimulationInject } from '~/composables/useSimulationProvider'

const props = defineProps<{
  maxSlots: number;
}>()

const store = useStore()

const simulation = useSimulationInject()

const opponentTimeline = simulation.cardTimeline.opponent
const playerTimeline = simulation.cardTimeline.player

const maxUserSlots = computed(() => store.user.maxSlots)
const maxBotSlots = computed(() => props.maxSlots)
</script>

<template>
  <div class="MatchBoard">
    <CardBoard board="deck" :max-slots="maxBotSlots">
      <CardModal v-for="card in opponentTimeline" :key="card.id" :card="card">
        <CardHeader :card="card">
          <CardCooldown :chunks="card.simulation.chunks" />
        </CardHeader>
      </CardModal>
    </CardBoard>
    <TimeControls />
    <CardBoard board="deck" :max-slots="maxUserSlots">
      <CardModal v-for="card in playerTimeline" :key="card.id" :card="card" :chunks="card.simulation.chunks">
        <CardHeader :card="card">
          <CardCooldown :chunks="card.simulation.chunks" />
        </CardHeader>
      </CardModal>
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
