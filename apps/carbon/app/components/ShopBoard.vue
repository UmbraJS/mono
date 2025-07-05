<script setup lang="ts">
import PlayerCard from '~/components/Card/Card.vue'
const quest = useQuest()
</script>

<template>
  <div id="ShopBoard">
    <PlayerCard v-for="event in quest.currentShop" :key="event.id" :card="event" :placement="false" />
  </div>
</template>

<style>
#ShopBoard {
  display: grid;
  grid-template-columns: subgrid;
  gap: var(--space-1);
  grid-column: 1 / -1;
  height: 150px;
}
</style>
