<script setup lang="ts">
import PurchaseButton from './PurchaseButton.vue'
import CardHeader from '~/components/Card/CardHeader.vue'

const quest = useQuest()
</script>

<template>
  <div v-if="quest.shop.current">
    <div v-if="quest.shop.inventory && quest.shop.inventory.length > 0" class="shop-inventory">
      <article v-for="card in quest.shop.inventory" id="ShopCard" :key="card.id">
        <PurchaseButton :card="card" />

        <CardModal :card="card">
          <CardHeader :card="card" variant="cardSize" />
        </CardModal>

        <CardMetaInfo :card="card" />
      </article>
    </div>
    <div v-else class="error-message base-warning">
      <Icon name="carbon:error" size="1.5em" />
      <p>No cards available in the shop.</p>
    </div>
  </div>
  <ShopFallback v-else />
</template>

<style scoped>
.error-message {
  display: flex;
  align-items: center;
  gap: var(--space-quark);
  padding: var(--space-1);
  background-color: var(--base);
  color: var(--base-contrast);
  border-radius: var(--radius);
}

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

#ShopCard.purchasing {
  opacity: 0.7;
  pointer-events: none;
}
</style>
