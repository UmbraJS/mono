<script setup lang="ts">
import type { Card } from '../../../types'

defineProps<{
  card: Card;
}>()

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

const view = useView()
</script>

<template>
  <div id="CardInfo">
    <div id="CardMainInfo" class="border">
      <CardMetaWrapper id="CardName">
        <p class="caption title">{{ card.info.name }}</p>
      </CardMetaWrapper>

      <CardMetaWrapper id="CardMeta">
        <p class="caption">lvl {{ view.getCardStats(card).level }}</p>
        <span class="separator">-</span>
        <p class="caption">{{ getRarity(card.info.rarity) }}</p>
      </CardMetaWrapper>

      <CardMetaWrapper id="CardTypes">
        <ChipCardMeta class="base-accent" :text="view.getCardStats(card).slot" />
        <ChipCardMeta v-for="type in view.getCardStats(card).tags" :key="type" class="base-yellow" :text="type" />
        <ChipCardMeta v-for="type in view.getCardStats(card).aspects" :key="type.name" class="base-info"
          :text="type.name" />
      </CardMetaWrapper>

      <CardMetaWrapper id="CardEffects">
        <ChipCardEffect v-for="type in view.getCardStats(card).effects" :key="type.name" :text="type.description" />
      </CardMetaWrapper>
    </div>

    <p v-if="card.info.quote" class="caption quote">{{ card.info.quote }}</p>
  </div>

</template>

<style scoped>
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
</style>
