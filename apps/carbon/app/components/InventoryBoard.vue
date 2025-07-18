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
    <CardBoard board="deck" :max-slots="12">
      <PlayerCard v-for="card in store.user.deck" :key="card.id" :card="card" board="deck" />
    </CardBoard>
  </div>
</template>

<style>
.MatchBoard {
  display: grid;
  grid-template-columns: subgrid;
  grid-template-rows: 1fr 1fr;
  gap: var(--space-1);
  grid-column: span 12;
  height: 100%;
}
</style>
