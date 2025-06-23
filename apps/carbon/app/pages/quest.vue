<script setup lang="ts">
import { useStore, useView } from '~/stores/useStore'
const store = useStore()
const view = useView()
</script>

<template>
  <main class="quest-wrapper">
    <div class="Viewboard">
      <div class="ActiveBoard" :class="{ blured: view.view !== null }">
        <QuestBoard />
      </div>
      <div class="ViewOverlay clipPath" :class="{ hidden: view.view !== 'inventory' }">
        <InventoryBoard :timeline="store.simulation.timeline" :time="store.simulation.time" :deck="store.user.deck"
          :inventory="store.user.inventory" realm="base" />
      </div>
    </div>
    <div class="HeadBoard">
      <PlayerHeader :userCharacters="store.user.characters" :health="store.simulation.user.health"
        :shield="store.simulation.user.shield" />
      <div class="ViewOverlay clipPath2" :class="{ hidden: store.user.draggedCard === null }">
        <div class="Seller border base-warning">
          <h1>Drop To Sell {{ store.user.draggedCard?.cardStats.cost }}</h1>
        </div>
      </div>
    </div>
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

main.quest-wrapper .Viewboard {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  grid-column: 1 / -1;
}

main.quest-wrapper .Viewboard .ActiveBoard {
  filter: blur(0px);
  transition: var(--time);
}


main.quest-wrapper .Viewboard .ActiveBoard.blured {
  filter: blur(20px);
}

main.quest-wrapper .ViewOverlay {
  position: absolute;
  z-index: 99;

  top: 0;
  height: 100%;
  width: 100%;
}

main.quest-wrapper .clipPath {
  clip-path: circle(100% at 50% 100%);
  transition: var(--slower);
}

main.quest-wrapper .clipPath.hidden {
  overflow: hidden;
  clip-path: circle(0% at 10% 100%);
}


main.quest-wrapper .clipPath2 {
  clip-path: circle(100% at 50% 100%);
  transition: var(--slow);
}

main.quest-wrapper .clipPath2.hidden {
  overflow: hidden;
  clip-path: circle(0% at 50% 100%);
}

main.quest-wrapper .HeadBoard {
  position: relative;
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: subgrid;
}

main.quest-wrapper .ViewOverlay .Seller {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--base-20);
  height: 100%;
  width: 100%;
  border-radius: var(--radius);
}
</style>
