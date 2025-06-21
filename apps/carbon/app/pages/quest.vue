<script setup lang="ts">
import { useStore, useView } from '~/stores/useStore'
const store = useStore()
const view = useView()
</script>

<template>
  <main class="quest-wrapper">
    <div class="ber">
      <QuestBoard />
      <div class="overlay" :class="{ hidden: view.view !== 'inventory' }">
        <InventoryBoard :timeline="store.simulation.timeline" :time="store.simulation.time" :deck="store.user.deck"
          :inventory="store.user.inventory" realm="base" />
      </div>
    </div>
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

main.quest-wrapper .ber {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  grid-column: 1 / -1;
}

main.quest-wrapper .ber .overlay {
  top: 0;
  position: absolute;
  height: 100%;
  width: 100%;
  background-color: var(--base);
  clip-path: circle(100% at 50% 100%);

  transition: var(--slower);
}

main.quest-wrapper .ber .overlay.hidden {
  overflow: hidden;
  clip-path: circle(0% at 50% 100%);
}
</style>
