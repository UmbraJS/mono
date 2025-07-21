<script setup lang="ts">
import type { Card } from '../../types'

const props = defineProps<{
  card: Card
}>()

const view = useView()
const store = useStore()

function giftCard() {
  const fullDiscount = 100
  store.money.cardPurchase.buyCard(props.card, fullDiscount)
}

const ariaLabel = computed(() => {
  return `Receive ${props.card.info.name} worth ${view.getCardStats(props.card).cost} coins`
})
</script>

<template>
  <PickButton :aria-label="ariaLabel" color="success" @click="giftCard">
    <ButtonSection>
      <Icon name="carbon:purchase" size="1rem" />
      <p class="caption">pick</p>
    </ButtonSection>
    <ButtonSection>
      <Icon name="carbon:pan-horizontal" size="1rem" />
      <p class="caption">{{ card.size }}</p>
    </ButtonSection>
  </PickButton>
</template>
