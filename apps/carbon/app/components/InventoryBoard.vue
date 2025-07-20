<script setup lang="ts">
import PlayerCard from '~/components/Card/CardHeader.vue'
import CardBoard from '~/components/CardBoard.vue'
import { useStore } from '~/stores/useStore'
const store = useStore()
</script>

<template>
  <div class="MatchBoard">
    <CardBoard board="inventory" :max-slots="12">
      <PlayerCard v-for="card in store.user.inventory" :key="card.id" :card="card" board="inventory" />
    </CardBoard>

    <div id="DeckPerformance">
      <ChipCardMeta
        :text="'Average: ' + Math.floor((store.user.deck.reduce((sum, card) => sum + card.stats.base.cost, 0) / store.user.deck.length))" />
      <ChipCardMeta class="caption"
        :text="'Deck Value: ' + store.user.deck.reduce((sum, card) => sum + card.stats.base.cost, 0)" />
      <ChipCardMeta class="caption" :text="'Deck: ' + store.user.deck.length" />
      <ChipCardMeta class="caption" :text="'Deck Slots: ' + store.user.maxSlots" />
    </div>

    <CardBoard board="deck" :max-slots="store.user.maxSlots">
      <PlayerCard v-for="card in store.user.deck" :key="card.id" :card="card" board="deck" />
    </CardBoard>
  </div>
</template>

<style>
.MatchBoard {
  display: grid;
  grid-template-columns: subgrid;
  grid-template-rows: 1fr auto 1fr;
  gap: 0px;
  grid-column: span 12;
  height: 100%;
  background-color: var(--base);
}

#DeckPerformance {
  display: flex;
  gap: var(--space-2);

  padding: var(--space-1) 0px;
  background-color: var(--base);
  border-radius: var(--radius);
}
</style>
