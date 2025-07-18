<script setup lang="ts">
import type { Card } from '../../types'
import { Button } from '@nobel/core'

const props = defineProps<{
  card: Card
}>()

const view = useView()
const store = useStore()

function handleBuyCard() {
  store.money.cardPurchase.buyCard(props.card)
}

const ariaLabel = computed(() => {
  return `Buy ${props.card.info.name} for ${view.getCardStats(props.card).cost} coins`
})

const purchaseValidity = computed(() => {
  const checkValidity = store.money.cardPurchase.validatePurchase(props.card)
  return checkValidity
})
</script>

<template>
  <Button id="BuyButton" :disabled="store.money.cardPurchase.isPurchasing" :aria-label="ariaLabel"
    :color="purchaseValidity.canPurchase ? 'default' : 'warning'" @click="handleBuyCard">
    <div class="ButtonSection">
      <Icon name="carbon:purchase" size="1rem" />
      <p class="caption">{{ view.getCardStats(card).cost }}</p>
    </div>
    <div class="ButtonSection">
      <Icon name="carbon:pan-horizontal" size="1rem" />
      <p class="caption">{{ card.size }}</p>
    </div>
  </Button>

</template>

<style scoped>
#BuyBox {
  display: grid;
  grid-template-columns: 1fr auto;
  overflow: hidden;
}

.ButtonSection {
  display: flex;
  gap: var(--space-quark);
}

#BuyButton {
  display: grid;
  grid-template-columns: 1fr auto;
  overflow: hidden;
}
</style>
