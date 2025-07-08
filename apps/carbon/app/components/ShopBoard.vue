<script setup lang="ts">
import PlayerCard from '~/components/Card/Card.vue'
const quest = useQuest()
const view = useView()

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
</script>

<template>
  <div v-if="quest.shop.current" id="ShopBoard">
    <div class="shopInventory">
      <div v-for="card in quest.shop.inventory" id="ShopCard" :key="card.id">
        <div id="BuyBox">
          <div class="cost border" :style="{ 'border-bottom': '0px', 'border-right': '0px' }">
            <p class="caption">buy</p>
          </div>
          <div class="cost border" :style="{ 'border-bottom': '0px' }">
            <Icon name="carbon:purchase" size="1rem" />
            <p class="caption">{{ view.getCardStats(card).cost }}</p>
          </div>
          <div class="cost border" :style="{ 'border-bottom': '0px' }">
            <Icon name="carbon:pan-horizontal" size="1rem" />
            <p class="caption">{{ card.size }}</p>
          </div>
        </div>
        <CardModal :card="card">
          <PlayerCard :card="card" variant="cardSize" />
        </CardModal>
        <div class="cost border" :style="{ 'border-bottom': '0px', 'border-top': '0px' }">
          <p class="caption title">{{ card.info.name }}</p>
        </div>
        <div class="cost border">
          <p class="caption">lvl {{ view.getCardStats(card).level }} -</p>
          <p class="caption">{{ getRarity(card.info.rarity) }}</p>
        </div>
        <p class="caption quote">{{ card.info.quote }}</p>
      </div>
    </div>
  </div>

  <div v-else>
    <p>No shop available</p>
  </div>
</template>

<style>
#BuyBox {
  display: grid;
  grid-template-columns: auto 1fr 1fr;
}

#ShopBoard {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  width: 50vw;
}

.shopInventory {
  display: flex;
  gap: var(--space-1);
  grid-column: 1 / -1;
  height: 150px;
}

#ShopCard {
  display: grid;
  grid-template-columns: 1fr;
  /* gap: var(--space-quark); */
}

#ShopCard .quote {
  font-style: italic;
  padding: var(--space-quark);
}

#ShopCard .title {
  font-variation-settings: var(--font-semibold);
}

#ShopCard .cost {
  display: flex;
  align-items: center;
  gap: var(--space-quark);
  width: 100%;
  background-color: var(--base);
  padding: var(--space-quark);
  border-radius: 0px;
}

#ShopCard #CardWrapper {
  border-radius: 0px;
}
</style>
