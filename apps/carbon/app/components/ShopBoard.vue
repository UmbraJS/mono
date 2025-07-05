<script setup lang="ts">
import PlayerCard from '~/components/Card/Card.vue'
const quest = useQuest()
</script>

<template>
  <div id="ShopBoard">
    <CardModal v-for="card in quest.currentShop" :key="card.id" :card="card">
      <PlayerCard :card="card" :free-size="true" />
    </CardModal>
  </div>
</template>

<style>
#ShopBoard {
  display: flex;
  gap: var(--space-1);
  grid-column: 1 / -1;
  height: 150px;
}
</style>
