<script setup lang="ts">
import { useView } from '~/stores/useStore'
import PartyBoard from './PartyBoard.vue'
import { DrawerButton, DrawerTitle, DrawerDescription, Slider } from '@nobel/core'

const store = useStore()
const view = useView()

defineProps<{
  health: number;
  shield: number;
}>()

function toggleInventory() {
  view.setView(view.view === 'inventory' ? null : 'inventory')
}

const theme = useUmbra()

function inverseTheme() {
  theme.inverse()
}
</script>

<template>
  <PartyBoard>
    <div class="location border">
      <CarbonButton :color="view.view === 'inventory' ? 'default' : 'default'"
        :variant="view.view === 'inventory' ? 'primary' : 'base'" @click="toggleInventory">
        <Icon name="carbon:wallet" size="1.5em" />
        <p>inventory</p>
      </CarbonButton>
      <DrawerButton class-name="CarbonButton" title="Player Settings"
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

            <CarbonButton @click="inverseTheme">
              <Icon name="carbon:3d-curve-auto-vessels" size="1.5em" />
              <p>Toggle Theme</p>
            </CarbonButton>

            <Slider />
          </div>
        </template>
      </DrawerButton>
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

section#PartyBoard .location .finances {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: var(--space-1);
}
</style>
