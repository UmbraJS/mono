<script setup lang="ts">
import { useSimulationProvider } from '~/composables/useSimulationProvider'
import { bot } from '../../data/character'

const store = useStore()
const botStore = usePerson(bot)

const simulation = useSimulationProvider({
  userDeck: store.user.deck,
  botDeck: botStore.deck.value,
  userCharacters: store.user.characters,
  botCharacters: botStore.characters.value
})
</script>

<template>
  <CarbonGrid grid-layout="match">
    <OpponentHeader :health="simulation.bot.health" :shield="simulation.bot.shield"
      :characters="botStore.characters.value" />
    <MatchBoard :max-slots="botStore.maxSlots.value" />
    <PlayerHeader :health="simulation.user.health.value" :shield="simulation.user.shield.value" />
  </CarbonGrid>
</template>
