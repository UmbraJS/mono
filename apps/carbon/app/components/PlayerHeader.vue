<script setup lang="ts">
import { useView } from '~/stores/useStore'
import PartyBoard from './PartyBoard.vue'
import { Button, Drawer, DrawerTitle, DrawerDescription, Slider } from '@nobel/core'

const store = useStore()
const view = useView()

const {
  health = store.bot.maxHealth,
  shield = 0
} = defineProps<{
  health?: number;
  shield?: number;
}>()

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
      <Drawer class-name="viewButton" title="Player Settings"
        description="Configure your character settings and preferences">
        <template #trigger>
          <Icon name="carbon:settings" size="1.5em" />
          <p>settings</p>
        </template>
        <template #content>
          <div class="content">
            <DrawerTitle id="drawer-settings-title">
              Player Settings
            </DrawerTitle>
            <DrawerDescription id="drawer-settings-description">
              Configure your character settings here.
            </DrawerDescription>
            <Slider />
          </div>
        </template>
      </Drawer>
    </div>

    <PlayerCharacter :characters="store.user.characters" :health="health" :shield="shield" :reverse="false" />

    <div class="location border">
      <ChipChipPassiveFinance />
    </div>

    <ViewOverlay :hidden="store.user.draggedCard === null" stack-layer="bottom">
      <SellZone />
    </ViewOverlay>
  </PartyBoard>
</template>

<style>
#BuyBackCards {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
}

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

section#PartyBoard .location .finances {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: var(--space-1);
}

section#PartyBoard .location .viewButton {
  display: flex;
  justify-content: flex-start;
  gap: var(--space-1);
  width: 100%;
}
</style>
