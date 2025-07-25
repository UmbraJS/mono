<script setup lang="ts">
import type { Card } from '../../types'

const props = defineProps<{
  card: Card
}>()

const store = useStore()

function handleBuyCard() {
  store.money.cardPurchase.buyCard(props.card)
}

const ariaLabel = computed(() => {
  return `Buy ${props.card.info.name} for ${props.card.stats.cost} coins`
})

const purchaseValidity = computed(() => {
  const checkValidity = store.money.cardPurchase.validatePurchase(props.card)
  return checkValidity
})
</script>

<template>
  <PickButton :aria-label="ariaLabel" :color="purchaseValidity.valid ? 'default' : 'warning'" @click="handleBuyCard">
    <ButtonSection>
      <Icon name="carbon:purchase" size="1rem" />
      <p class="caption">{{ card.stats.cost }}</p>
    </ButtonSection>
    <ButtonSection>
      <Icon name="carbon:pan-horizontal" size="1rem" />
      <p class="caption">{{ card.size }}</p>
    </ButtonSection>
  </PickButton>
</template>
