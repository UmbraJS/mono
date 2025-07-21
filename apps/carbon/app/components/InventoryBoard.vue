<script setup lang="ts">
import PlayerCard from '~/components/Card/CardHeader.vue'
import CardBoard from '~/components/CardBoard.vue'
import { useStore } from '~/stores/useStore'
import { createDeckCostCalculator } from '../../utils/cardCost'
const store = useStore()
const view = useView()

const deckCostCalculator = createDeckCostCalculator(view.realm)

const deckStats = computed(() => {
  const deck = store.user.deck
  const totalGenericCost = deck.reduce((sum, card) => sum + card.stats.base.cost, 0)
  const averageCost = Math.floor(totalGenericCost / deck.length)

  const synergetic = deckCostCalculator(deck)
  const deckCost = synergetic.totalCost === totalGenericCost
    ? synergetic.totalCost.toString()
    : `${synergetic.totalCost} (${totalGenericCost})`

  return {
    average: averageCost,
    cost: deckCost,
    count: deck.length,
    maxSlots: store.user.maxSlots
  }
})
</script>

<template>
  <div class="MatchBoard">
    <CardBoard board="inventory" :max-slots="12">
      <PlayerCard v-for="card in store.user.inventory" :key="card.id" :card="card" board="inventory" />
    </CardBoard>

    <div id="DeckPerformance">
      <ChipCardMeta :text="`Average: ${deckStats.average}`" />
      <ChipCardMeta class="caption" :text="`Cost: ${deckStats.cost}`" />
      <ChipCardMeta class="caption" :text="`Cards: ${deckStats.count}/${deckStats.maxSlots}`" />
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
