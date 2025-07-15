<script setup lang="ts">
import PlayerCard from '~/components/Card/Card.vue'
import CardBuyBox from './CardBuyBox.vue'
import { PixelTransition } from '@nobel/core'
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

    <PixelTransition :grid-size="8" pixel-color="#ff6b6b">
      <template #default>
        <NuxtImg src="/borgBog.png" alt="Default" />
      </template>
      <template #active>
        <NuxtImg src="/burial.jpg" alt="Active" />
      </template>
    </PixelTransition>

    <!-- Shop Inventory -->
    <div class="shop-inventory">
      <article v-for="card in quest.shop.shopInventory" id="ShopCard" :key="card.id"
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
        <div id="CardInfo">
          <div id="CardMainInfo" class="border">
            <CardMetaChip id="CardName">
              <p class="caption title">{{ card.info.name }}</p>
            </CardMetaChip>

            <CardMetaChip id="CardMeta">
              <p class="caption">lvl {{ view.getCardStats(card).level }}</p>
              <span class="separator">-</span>
              <p class="caption">{{ getRarity(card.info.rarity) }}</p>
            </CardMetaChip>

            <CardMetaChip id="CardTypes">
              <div class="CardTag base-accent">
                <p class="caption">{{ view.getCardStats(card).slot }}</p>
              </div>
              <div v-for="type in view.getCardStats(card).tags" :key="type" class="CardTag base-yellow">
                <p class="caption">{{ type }}</p>
              </div>
              <div v-for="type in view.getCardStats(card).aspects" :key="type.name" class="CardTag base-info">
                <p class="caption">{{ type.name }}</p>
              </div>
            </CardMetaChip>

            <CardMetaChip id="CardEffects">
              <div v-for="type in view.getCardStats(card).effects" :key="type.name" class="CardEffect">
                <p class="caption">{{ type.description }}</p>
              </div>
            </CardMetaChip>

          </div>

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

.shop-board {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
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

.buy-button {
  all: unset;
  cursor: pointer;
}

.buy-button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

#CardMainInfo {
  box-shadow: 1px 58px 100px -24px rgba(0, 0, 0, 0.77);
  overflow: hidden;
}

#CardName {
  border-bottom: 0;
  border-top: 0;
  border-bottom: var(--border);
  border-bottom-style: dotted;
}

#CardMeta {
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
