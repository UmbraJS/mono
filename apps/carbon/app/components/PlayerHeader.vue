<script setup lang="ts">
import PlayerCard from '~/components/Card/CardHeader.vue'
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

    <PlayerCharacter :characters="store.user.characters" :health="store.simulation.user.health"
      :shield="store.simulation.user.shield" :reverse="false" />

    <div class="location border">
      <div class="finances">
        <ChipChipPassiveFinance />

        <Drawer v-if="store.money.soldCards.length > 0" class-name="viewButton" title="Buyback Store"
          description="Buy back your previously sold cards">
          <template #trigger>
            <Icon name="carbon:money" size="1.5em" />
            <p>buyback</p>
          </template>
          <template #content>
            <div class="content">
              <!-- <DrawerTitle id="drawer-buyback-title">
                Buyback
              </DrawerTitle> -->
              <!-- <DrawerDescription id="drawer-buyback-description">
                Buy back your sold cards.
              </DrawerDescription> -->
              <div id="BuyBackCards">
                <div v-if="store.money.cardPurchase.purchaseError">
                  <Icon name="carbon:warning" size="1rem" />
                  <p>{{ store.money.cardPurchase.purchaseError }}</p>
                </div>
                <div v-for="(card, index) in store.money.soldCards" :key="index" class="card">
                  <PlayerCard :card="card" variant="cardSize" @click="() => {
                    store.money.buyBackCard(card)
                  }" />
                </div>
              </div>
            </div>
          </template>
        </Drawer>
      </div>
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
