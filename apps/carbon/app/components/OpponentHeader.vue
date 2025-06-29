<script setup lang="ts">
import PartyBoard from './PartyBoard.vue'
import { useStore } from '~/stores/useStore'
const store = useStore()

// function getInfoDeck(deck: Card[]) {
//   return deck.map(d => d.info)
// }
</script>

<template>
  <PartyBoard>
    <div class="location border">
      <!-- <img :src="skeletonKing.field?.image?.default" alt="Location" /> -->
    </div>
    <PlayerCharacter :characters="store.bot.characters" :health="store.simulation.bot.health"
      :shield="store.simulation.bot.shield" :reverse="false" />
    <div class="location border">
      <div class="money" />
    </div>
    <!-- <BashLogs :logs="logs" :player-info-deck="getInfoDeck(user.deck)" :opponent-info-deck="getInfoDeck(bot.deck)"
      :modal-button="true" /> -->
  </PartyBoard>
</template>

<style></style>
