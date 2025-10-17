<script setup lang="ts">
const store = useUser()
</script>

<template>
  <div id="SellZone" data-sellzone class="border base-warning">
    <h1>Drop To Sell For {{ store.user.draggedCard?.cardStats.cost }}</h1>
  </div>
</template>

<style>
#SellZone {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--base-20);
  color: var(--base-120);
  height: 100%;
  width: 100%;
  border-radius: var(--radius);
  transition: var(--slow);
}

#SellZone.active-zone {
  border-width: var(--space-1);
}
</style>
