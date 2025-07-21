<script setup lang="ts">
const store = useStore()

const simulation = useSimulation({
  userDeck: store.user.deck,
  botDeck: store.bot.deck,
  userCharacters: store.user.characters,
  botCharacters: store.bot.characters
})

const opponentTimeline = simulation.cardTimeline.opponent
const playerTimeline = simulation.cardTimeline.player

const maxUserSlots = computed(() => store.user.maxSlots)
const maxBotSlots = computed(() => store.bot.maxSlots)
</script>

<template>
  <div class="MatchBoard">
    <CardBoard board="deck" :max-slots="maxBotSlots">
      <CardHeader v-for="card in opponentTimeline" :key="card.card.id" :card="card.card"
        :chunks="card.simulation.chunks" />
    </CardBoard>
    <TimeControls />
    <CardBoard board="deck" :max-slots="maxUserSlots">
      <CardHeader v-for="card in playerTimeline" :key="card.card.id" :card="card.card"
        :chunks="card.simulation.chunks" />
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
