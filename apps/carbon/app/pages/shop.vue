<template>
  <CarbonGrid grid-layout="event">
    <ShopHeader />

    <ViewBoard>
      <ShopBoard />
      <template #overlay>
        <InventoryBoard />
      </template>
    </ViewBoard>

    <PlayerHeader />
  </CarbonGrid>
</template>
