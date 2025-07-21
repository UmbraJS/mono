<script setup lang="ts">
import type { Card } from '../../types'

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
  <PickButton :disabled="store.money.cardPurchase.isPurchasing" :aria-label="ariaLabel"
    :color="purchaseValidity.canPurchase ? 'default' : 'warning'" @click="handleBuyCard">
    <ButtonSection>
      <Icon name="carbon:purchase" size="1rem" />
      <p class="caption">{{ view.getCardStats(card).cost }}</p>
    </ButtonSection>
    <ButtonSection>
      <Icon name="carbon:pan-horizontal" size="1rem" />
      <p class="caption">{{ card.size }}</p>
    </ButtonSection>
  </PickButton>
</template>
