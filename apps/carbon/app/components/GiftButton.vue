<script setup lang="ts">
import type { Card } from '../../types'

const props = defineProps<{
  card: Card
}>()

const store = useStore()
const quest = useQuest()

function giftCard() {
  quest.passDay()
  store.money.cardPurchase.getCard(props.card)
}

const ariaLabel = computed(() => {
  return `Receive ${props.card.info.name} worth ${props.card.stats.cost} coins`
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
