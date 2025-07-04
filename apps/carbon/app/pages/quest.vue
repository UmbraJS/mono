<script setup lang="ts">
import { useStore, useView } from '~/stores/useStore'
const store = useStore()
const view = useView()
</script>

<template>
  <main class="quest-wrapper">
    <ViewBoard :overlay="view.view !== null">
      <QuestBoard />
      <template #overlay>
        <InventoryBoard />
      </template>
    </ViewBoard>

    <div class="HeadBoard">
      <PlayerHeader />
      <ViewOverlay :hidden="store.user.draggedCard === null">
        <SellZone />
      </ViewOverlay>
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

main.quest-wrapper .HeadBoard {
  position: relative;
  z-index: 1;
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: subgrid;
}
</style>
