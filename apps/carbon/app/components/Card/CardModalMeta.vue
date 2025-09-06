<script setup lang="ts">
import { DialogTitle, Tabs } from 'umbraco'
import type { Card } from '../../../types'

defineProps<{
  card: Card;
  // bashRecords?: BashRecords
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
</script>

<template>
  <div class="cardMeta">
    <DialogTitle>
      <span>lvl {{ card.stats.level }} - </span>{{ card.info.name }}
    </DialogTitle>

    <Tabs id="ModalBashLogTabs" :tabs="[
      { label: 'Details', icon: 'mdi:account-card-outline' },
      { label: 'Stats', icon: 'mdi:star-four-points-circle' },
    ]">
      <template #tab1>
        <div id="CardInfo">

          <div id="CardMeta">
            <p class="caption">{{ getRarity(card.info.rarity) }}</p>
          </div>

          <div id="CardTypes">
            <ChipCardMeta class="base-accent" :text="card.stats.slot" />
            <ChipCardMeta v-for="type in card.stats.tags" :key="type" class="base-yellow" :text="type" />
            <ChipCardMeta v-for="type in card.stats.aspects" :key="type.name" class="base-info" :text="type.name" />
          </div>

          <div id="CardEffects">
            <ChipCardEffect v-for="type in card.stats.effects" :key="type.name" :text="type.description" />
          </div>

          <p v-if="card.info.quote" class="caption quote">{{ card.info.quote }}</p>
        </div>

      </template>
      <template #tab2>
        <CardRecord :card="card" />
      </template>
    </Tabs>
  </div>
</template>

<style>
#ModalBashLogTabs {
  height: 100%;
}

#CardInfo {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  background-color: var(--base-10);
}
</style>
