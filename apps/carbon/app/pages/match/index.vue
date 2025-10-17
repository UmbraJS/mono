<script setup lang="ts">
import { useSimulationProvider } from '~/composables/useSimulationProvider'

const userStore = useUser()
const botStore = useBot()

const simulation = useSimulationProvider({
  userDeck: userStore.user.deck,
  botDeck: botStore.deck,
  userCharacters: userStore.user.characters,
  botCharacters: botStore.characters
})
</script>

<template>
  <CarbonGrid grid-layout="match">
    <OpponentHeader 
      v-if="simulation.bot" 
      :health="simulation.bot.health" 
      :shield="simulation.bot.shield"
      :health-log="simulation.simulatedMatch.space.opponent.healthLog"
      :shield-log="simulation.simulatedMatch.space.opponent.shieldLog" 
      :time="simulation.time.value"
      :characters="botStore.characters" />
    <MatchBoard :max-slots="botStore.maxSlots" />
    <PlayerHeader 
      v-if="simulation.user"
      :health="simulation.user.health" 
      :shield="simulation.user.shield" />
  </CarbonGrid>
</template>
