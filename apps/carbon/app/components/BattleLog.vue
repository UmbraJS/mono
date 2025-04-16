<script setup lang="ts">
import BashLog from '~/components/BashLog/BashLog.vue'
import type { UsePlayerReturn } from '../composables/usePlayer'
import type { Card } from '../../types/card'

defineProps<{
  player: UsePlayerReturn
  opponent: UsePlayerReturn
  playerDeck: Card[]
  opponetDeck: Card[]
}>()
</script>

<template>
  <BashLog
    :player="opponent"
    :opponent="player"
    :playerDeck="opponent.deck.value"
    :opponetDeck="player.deck.value"
  />
</template>

<style></style>
