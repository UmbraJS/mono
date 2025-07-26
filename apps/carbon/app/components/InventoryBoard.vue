<script setup lang="ts">
import CardBoard from '~/components/CardBoard.vue'
import { useStore } from '~/stores/useStore'
import { getDeckCost } from '../../utils/cardCost'
const store = useStore()

const deckStats = computed(() => {
  const deck = store.user?.deck ?? []
  if (deck.length === 0) {
    return {
      average: 0,
      cost: '0',
      count: 0,
      maxSlots: store.user?.maxSlots ?? 0
    }
  }

  const totalGenericCost = deck.reduce((sum, card) => sum + card.stats.cost, 0)
  const averageCost = Math.floor(totalGenericCost / deck.length)

  const synergetic = getDeckCost(deck)
  const deckCost = synergetic.totalCost === totalGenericCost
    ? synergetic.totalCost.toString()
    : `${synergetic.totalCost} (${totalGenericCost})`

  return {
    average: averageCost,
    cost: deckCost,
    count: deck.length,
    maxSlots: store.user?.maxSlots ?? 0
  }
})
</script>

<template>
  <div class="MatchBoard">
    <CardBoard board="inventory" :max-slots="12">
      <CardModal v-for="card in store.user?.inventory ?? []" :key="card.id" :card="card">
        <CardHeader :card="card" board="inventory" />
      </CardModal>
    </CardBoard>

    <div id="DeckPerformance">
      <ChipCardMeta :text="`Average: ${deckStats.average}`" />
      <ChipCardMeta class="caption" :text="`Cost: ${deckStats.cost}`" />
      <ChipCardMeta class="caption" :text="`Cards: ${deckStats.count}/${deckStats.maxSlots}`" />
    </div>

    <CardBoard board="deck" :max-slots="store.user?.maxSlots ?? 0">
      <CardModal v-for="card in store.user?.deck ?? []" :key="card.id" :card="card">
        <CardHeader :card="card" board="deck" />
      </CardModal>
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
