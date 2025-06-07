<script setup lang="ts">
import PartyBoard from './PartyBoard.vue'
import type { Character } from '~~/types'
import type { User } from '../../types'
import type { Card } from '../../types/card'
import type { SpaceOutput } from '../../utils/spaceTimeSimulation'
import BashLogs from '~/components/BashLog/BashLogs.vue'

defineProps<{
  bot: User;
  user: User;
  health: number
  shield: number
  logs: Pick<SpaceOutput, "healthLog" | "shieldLog">
}>()

function getInfoDeck(deck: Card[]) {
  return deck.map(d => d.info)
}
</script>

<template>
  <PartyBoard>
    <div class="location border">
      <!-- <img :src="skeletonKing.field?.image?.default" alt="Location" /> -->
    </div>
    <PlayerCharacter :characters="bot.characters" :health="health" :shield="shield" :reverse="false" />
    <BashLogs :logs="logs" :playerInfoDeck="getInfoDeck(user.deck)" :opponentInfoDeck="getInfoDeck(bot.deck)"
      :modal-button="true" />
  </PartyBoard>
</template>

<style></style>
