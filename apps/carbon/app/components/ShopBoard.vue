<script setup lang="ts">
import PlayerCard from '~/components/Card/Card.vue'
import CardBuyBox from './CardBuyBox.vue'
import { useCardPurchase } from '~/composables/useCardPurchase'

/**
 * Maps a rarity number to its corresponding label
 * @param rarity - The rarity number (0-4)
 * @returns The rarity label string
 */

function getRarity(rarity: number): string {
  switch (rarity) {
    case 0: return 'Common'
    case 1: return 'Uncommon'
    case 2: return 'Rare'
    case 3: return 'Epic'
    case 4: return 'Legendary'
    default: return 'Unknown'
  }
}

const quest = useQuest()
const view = useView()
const { purchaseError, isPurchasing, buyCard } = useCardPurchase()
</script>

<template>
  <div v-if="quest.shop.current" class="shop-board">
    <!-- Error Display -->
    <div v-if="purchaseError" class="error-message" role="alert" aria-live="polite">
      <Icon name="carbon:warning" size="1rem" />
      <p>{{ purchaseError }}</p>
    </div>

    <!-- Shop Inventory -->
    <div class="shop-inventory">
      <article v-for="card in quest.shop.shopInventory" :key="card.id" class="shop-card"
        :class="{ 'purchasing': isPurchasing }">
        <!-- Purchase Button -->
        <button class="buy-button" :disabled="isPurchasing"
          :aria-label="`Buy ${card.info.name} for ${view.getCardStats(card).cost} coins`" @click="buyCard(card)">
          <CardBuyBox :card="card" />
        </button>

        <!-- Card Preview -->
        <CardModal :card="card">
          <PlayerCard :card="card" variant="cardSize" />
        </CardModal>

        <!-- Card Information -->
        <div class="card-info">
          <CardMetaChip class="card-name">
            <p class="caption title">{{ card.info.name }}</p>
          </CardMetaChip>

          <CardMetaChip class="card-meta">
            <p class="caption">lvl {{ view.getCardStats(card).level }}</p>
            <span class="separator">-</span>
            <p class="caption">{{ getRarity(card.info.rarity) }}</p>
          </CardMetaChip>

          <p v-if="card.info.quote" class="caption quote">{{ card.info.quote }}</p>
        </div>
      </article>
    </div>
  </div>

  <!-- Empty State -->
  <div v-else class="empty-state">
    <Icon name="carbon:shopping-cart" size="2rem" />
    <p>No shop available</p>
  </div>
</template>

<style scoped>
.shop-board {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  width: 50vw;
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
  overflow-x: auto;
}

.shop-card {
  display: grid;
  grid-template-rows: auto auto 1fr;
  width: var(--cardWindowWidth);
  min-width: var(--cardWindowWidth);
  transition: opacity var(--transition-duration, 0.2s);
}

.shop-card.purchasing {
  opacity: 0.7;
  pointer-events: none;
}

.buy-button {
  all: unset;
  cursor: pointer;
}

.buy-button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.card-info {
  display: flex;
  flex-direction: column;
}

.card-name {
  border-bottom: 0;
  border-top: 0;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: var(--space-quark);
}

.separator {
  opacity: 0.5;
}

.quote {
  font-style: italic;
  padding: var(--space-quark);
  opacity: 0.8;
}

.title {
  font-variation-settings: var(--font-semibold);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-3);
  color: var(--base-contrast);
  background-color: var(--base-40);
  border-radius: var(--radius);
}
</style>
