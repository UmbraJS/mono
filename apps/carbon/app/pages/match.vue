<script setup lang="ts">
import { useSimulationProvider } from '~/composables/useSimulationProvider'

const store = useStore()

const simulation = useSimulationProvider({
  userDeck: store.user.deck,
  botDeck: store.bot.deck,
  userCharacters: store.user.characters,
  botCharacters: store.bot.characters
})
</script>

<template>
  <CarbonGrid grid-layout="match">
    <OpponentHeader :health="simulation.bot.health" :shield="simulation.bot.shield" />
    <MatchBoard />
    <PlayerHeader :health="simulation.user.health" :shield="simulation.user.shield" />
  </CarbonGrid>
</template>
