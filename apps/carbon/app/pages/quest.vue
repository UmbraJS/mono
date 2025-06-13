<script setup lang="ts">
import { useStore } from '~/stores/useStore'
console.log("quest page loaded")
const store = useStore()
</script>

<template>
  <main class="quest-wrapper">
    <QuestBoard v-if="false" />
    <InventoryBoard v-else :timeline="store.simulation.timeline" :time="store.simulation.time" :deck="store.user.deck"
      :inventory="store.user.inventory" realm="base" />
    <PlayerHeader :userCharacters="store.user.characters" :health="store.simulation.user.health"
      :shield="store.simulation.user.shield" />
  </main>
</template>

<style>
main.quest-wrapper {
  --side-size: 17vh;

  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: 1fr var(--side-size);
  gap: var(--space-1);

  height: 100vh;

  padding: var(--space-1);
}
</style>
