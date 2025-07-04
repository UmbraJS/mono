<script setup lang="ts">
import { useStore, useView } from '~/stores/useStore'
const store = useStore()
const view = useView()
</script>

<template>
  <main class="shop-wrapper">
    <div class="Viewboard">
      <div class="ActiveBoard" :class="{ blured: view.view !== null }">
        <QuestBoard />
      </div>
      <div class="ViewOverlay clipPath" :class="{ hidden: view.view !== 'inventory' }">
        <InventoryBoard />
      </div>
    </div>
    <div class="HeadBoard">
      <PlayerHeader />
      <div class="ViewOverlay clipPath2" :class="{ hidden: store.user.draggedCard === null }">
        <div data-sellzone class="Seller border base-warning">
          <h1>Drop To Sell {{ store.user.draggedCard?.cardStats.cost }}</h1>
        </div>
      </div>
    </div>
  </main>
</template>

<style></style>
