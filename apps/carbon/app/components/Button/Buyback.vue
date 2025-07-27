<script setup lang="ts">
import { DrawerButton } from '@nobel/core'
const store = useStore()
</script>

<template>
  <DrawerButton class-name="viewButton" title="Buyback Store" description="Buy back your previously sold cards">
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
            <CardHeader :card="card" variant="cardSize" @click="() => {
              store.money.buyBackCard(card)
            }" />
          </div>
        </div>
      </div>
    </template>
  </DrawerButton>
</template>
