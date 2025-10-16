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

onMounted(() => {
  console.log('Rex: debug space opponent health log: ')
  simulation.simulatedMatch.space.opponent.healthLog.forEach((entry, i) => {
    console.log(`${i}: ${entry.actualChange} damage at ${entry.timestamp}s from card ${entry.index} (${entry.board} side)`)
  })
  console.log('Rex: debug player time calculations: ')
  simulation.simulatedMatch.time.player.forEach((card, i) => {
    console.log(`Card ${i} "${card.info.name}": lifetime segments [${card.simulation.lifetime.join(', ')}]`)
  })
})

</script>

<template>
  <CarbonGrid grid-layout="match">
    <OpponentHeader :health="simulation.bot.health" :shield="simulation.bot.shield"
      :health-log="simulation.simulatedMatch.space.opponent.healthLog"
      :shield-log="simulation.simulatedMatch.space.opponent.shieldLog" :time="simulation.time.value"
      :characters="botStore.characters.value" />
    <MatchBoard :max-slots="botStore.maxSlots.value" />
    <PlayerHeader :health="simulation.user.health" :shield="simulation.user.shield" />
  </CarbonGrid>
</template>
