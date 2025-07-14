<script setup lang="ts">
import { useView } from '~/stores/useStore'
import PartyBoard from './PartyBoard.vue'
import { Button, Drawer, DrawerTitle, DrawerDescription, Slider } from '@nobel/core'

const store = useStore()
const view = useView()

function toggleInventory() {
  view.setView(view.view === 'inventory' ? null : 'inventory')
}
</script>

<template>
  <PartyBoard>
    <div class="location border">
      <Button class="viewButton" :color="view.view === 'inventory' ? 'default' : 'default'"
        :variant="view.view === 'inventory' ? 'primary' : 'base'" @click="toggleInventory">
        <Icon name="carbon:wallet" size="1.5em" />
        <p>inventory</p>
      </Button>
      <Drawer class="viewButton" title="Player Settings"
        description="Configure your character settings and preferences">
        <template #content>
          <div class="content">
            <DrawerTitle id="drawer-title" class="">
              Player Settings
            </DrawerTitle>
            <DrawerDescription id="drawer-content-description">
              Configure your character settings here.
            </DrawerDescription>
            <Slider />
          </div>
        </template>
      </Drawer>
    </div>

    <PlayerCharacter :characters="store.user.characters" :health="store.simulation.user.health"
      :shield="store.simulation.user.shield" :reverse="false" />

    <div class="location border">
      <div class="money">
        <Icon name="carbon:money" size="1.5em" />
        <p>{{ store.money.value }}</p>
        <p>(+{{ store.money.income }})</p>
      </div>
    </div>

    <ViewOverlay :hidden="store.user.draggedCard === null" stack-layer="bottom">
      <SellZone />
    </ViewOverlay>
  </PartyBoard>
</template>

<style>
section#PartyBoard .location {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);

  position: relative;
  height: 100%;
  padding: var(--space-1);
}

section#PartyBoard .location #DrawerTrigger {
  width: 100%;
}

section#PartyBoard img {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: var(--radius);
}

section#PartyBoard .location .money {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  background-color: var(--base-20);
  color: var(--base-120);
  border-radius: var(--radius);
  padding: var(--space-1);
  cursor: pointer;
}

section#PartyBoard .location .viewButton {
  display: flex;
  justify-content: flex-start;
  gap: var(--space-1);
  width: 100%;
}
</style>
