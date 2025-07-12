<script setup lang="ts">
import type { Card } from '../../types'

defineProps<{
  card: Card;
}>()

const view = useView()
</script>

<template>
  <div id="BuyBox" class="border">
    <CardMetaChip>
      <Icon name="carbon:purchase" size="1rem" />
      <p class="caption">{{ view.getCardStats(card).cost }}</p>
    </CardMetaChip>
    <CardMetaChip>
      <Icon name="carbon:pan-horizontal" size="1rem" />
      <p class="caption">{{ card.size }}</p>
    </CardMetaChip>
  </div>
</template>

<style>
#BuyBox {
  display: grid;
  grid-template-columns: 1fr auto;
  overflow: hidden;
}
</style>
