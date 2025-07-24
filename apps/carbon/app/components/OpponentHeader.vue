<script setup lang="ts">
import type { Character } from '~~/types'
import PartyBoard from './PartyBoard.vue'

defineProps<{
  health: globalThis.Ref<number>;
  shield: globalThis.Ref<number>;
  characters: Character[];
}>()
</script>

<template>
  <PartyBoard>
    <div class="location border">
      <!-- <img :src="skeletonKing.field?.image?.default" alt="Location" /> -->
    </div>
    <PlayerCharacter :characters="characters" :health="health.value" :shield="shield.value" :reverse="false" />
    <div class="location border">
      <div class="money" />
    </div>
    <!-- <BashLogs :logs="logs" :player-info-deck="getInfoDeck(user.deck)" :opponent-info-deck="getInfoDeck(bot.deck)"
      :modal-button="true" /> -->
  </PartyBoard>
</template>

<style></style>
