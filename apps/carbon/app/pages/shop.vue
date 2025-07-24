<script setup lang="ts">
const store = useStore()
const health = store.user.maxHealth
const shield = 0
</script>

<template>
  <CarbonGrid grid-layout="event">
    <ShopHeader />

    <ViewBoard>
      <ShopBoard />
      <template #overlay>
        <InventoryBoard />
      </template>
    </ViewBoard>

    <PlayerHeader :health="health" :shield="shield" />
  </CarbonGrid>
</template>
