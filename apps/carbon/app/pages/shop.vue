<template>
  <CarbonGrid grid-layout="event">

    <ViewBoard>
      <ShopBoard />
      <template #overlay>
        <InventoryBoard />
      </template>
    </ViewBoard>

    <PlayerHeader />
  </CarbonGrid>
</template>
