<template>
  <CarbonGrid grid-layout="event">
    <ViewBoard>
      <QuestBoard />
      <template #overlay>
        <InventoryBoard />
      </template>
    </ViewBoard>

    <PlayerHeader />
  </CarbonGrid>
</template>
