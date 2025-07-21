<script setup lang="ts">
import CardHeader from '~/components/Card/CardHeader.vue'

const quest = useQuest()
const store = useStore()
const { isPurchasing } = store.money.cardPurchase
</script>

<template>
  <div v-if="quest.shop.current" id="ShopBoard">
    <div v-if="quest.shop.shopInventory && quest.shop.shopInventory.length > 0" class="shop-inventory">
      <article v-for="card in quest.shop.shopInventory" id="ShopCard" :key="card.id"
        :class="{ 'purchasing': isPurchasing }">
        <GiftButton :card="card" />

        <CardModal :card="card">
          <CardHeader :card="card" variant="cardSize" />
        </CardModal>

        <CardMetaInfo :card="card" />
      </article>
    </div>
  </div>
</template>

<style scoped>
.CardTag {
  display: inline-block;
  padding: var(--space-quark);
  background-color: var(--base-20);
  color: var(--base-120);
  border-radius: var(--radius);
}

.CardEffect {
  display: inline-block;
  padding: var(--space-quark);
  background-color: var(--base-20);
  color: var(--base-120);
  border-radius: var(--radius);
  width: 100%;
}

#ShopBoard {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

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
