<template>
  <CarbonGrid grid-layout="event">
    <ShopHeader />

    <ViewBoard>
      <GiftBoard />
      <template #overlay>
        <InventoryBoard />
      </template>
    </ViewBoard>

    <PlayerHeader />
  </CarbonGrid>
</template>
