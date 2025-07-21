<script setup lang="ts">
import { useSimulationProvider } from '~/composables/useSimulationProvider'

const simulation = useSimulationProvider()
</script>

<template>
  <CarbonGrid grid-layout="match">
    <OpponentHeader :health="simulation.bot.health.value" :shield="simulation.bot.shield.value" />
    <MatchBoard />
    <PlayerHeader :health="simulation.user.health.value" :shield="simulation.user.shield.value" />
  </CarbonGrid>
</template>
