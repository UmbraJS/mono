<script setup lang="ts">
import type { Card } from '../../types'

defineProps<{
  card: Card;
}>()

const view = useView()
</script>

<template>
  <div id="BuyBox">
    <CardMetaChip :style="{ 'border-bottom': '0px', 'border-right': '0px' }">
      <p class="caption">buy</p>
    </CardMetaChip>
    <CardMetaChip :style="{ 'border-bottom': '0px' }">
      <Icon name="carbon:purchase" size="1rem" />
      <p class="caption">{{ view.getCardStats(card).cost }}</p>
    </CardMetaChip>
    <CardMetaChip :style="{ 'border-bottom': '0px' }">
      <Icon name="carbon:pan-horizontal" size="1rem" />
      <p class="caption">{{ card.size }}</p>
    </CardMetaChip>
  </div>
</template>

<style>
#BuyBox {
  display: grid;
  grid-template-columns: auto 1fr 1fr;
}
</style>
