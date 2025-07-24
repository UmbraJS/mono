<script setup lang="ts">
import CardHeader from '~/components/Card/CardHeader.vue'
const quest = useQuest()
</script>

<template>
  <div v-if="quest.gift.inventory && quest.gift.inventory.length > 0" class="shop-inventory">
    <article v-for="card in quest.gift.inventory" id="ShopCard" :key="card.id">
      <GiftButton :card="card" />

      <CardModal :card="card">
        <CardHeader :card="card" variant="cardSize" />
      </CardModal>

      <CardMetaInfo :card="card" />
    </article>
  </div>
  <ShopFallback v-else />
</template>

<style>
.shop-inventory {
  display: flex;
  gap: var(--space-1);
  grid-column: 1 / -1;
  min-height: 150px;
}

#ShopCard {
  display: grid;
  grid-template-rows: auto auto 1fr;
  gap: var(--space-1);

  width: var(--cardWindowWidth);
  min-width: var(--cardWindowWidth);
  transition: opacity var(--transition-duration, 0.2s);
}
</style>
