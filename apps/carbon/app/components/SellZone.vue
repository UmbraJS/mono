<script setup lang="ts">
import { useStore } from '~/stores/useStore'
const store = useStore()
</script>

<template>
  <div id="SellZone" data-sellzone class="border base-warning">
    <h1>Drop To Sell {{ store.user.draggedCard?.cardStats.cost }}</h1>
  </div>
</template>

<style>
#SellZone {
  position: relative;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--base-20);
  color: var(--base-50);
  height: 100%;
  width: 100%;
  border-radius: var(--radius);
  transition: var(--slow);
}

#SellZone.active-zone {
  border-width: var(--space-1);
}
</style>
