<script setup lang="ts">
import { DialogDescription, ScrollArea } from '@nobel/core'
import type { Card, CardInfo, CardStats } from '../../../types'
import AttackIcon from '../icons/Attack.vue'
import BanterIcon from '../icons/Banter.vue'
import CardModalBash from './CardModalBash.vue'

const props = defineProps<{
  info: CardInfo
  stats: CardStats
}>()

const bash = props.stats.bash
</script>

<template>
  <ScrollArea class="CardModalDetailsScrollArea">
    <div class="CardModalDetails">
      <DialogDescription>
        {{ info.description }}
      </DialogDescription>

      <div class="bash">
        <div v-if="bash?.cooldown" class="chip">
          <BanterIcon />
          Cooldown: {{ bash.cooldown }}s
        </div>
        <div class="chip">
          <AttackIcon />Cost: {{ stats.cost }}
        </div>
      </div>

      <CardModalBash :cardStats="stats" />

      <div>
        <div class="tags">
          <p>Aspects:</p>
          <div v-for="aspect in stats.aspects" class="chip">
            {{ aspect.name }}
          </div>
        </div>

        <div class="tags">
          <p>Tags:</p>
          <div v-for="tag in stats.tags" class="chip">
            {{ tag }}
          </div>
        </div>
      </div>
    </div>
  </ScrollArea>
</template>

<style>
.CardModalDetailsScrollArea {
  height: 50vh;
  padding-right: var(--space-2);
}

.CardModalDetails {
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: var(--space-4);
}

.cardMeta span {
  color: var(--base-60);
}

.cardMeta .bash {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.cardMeta .tags {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--space-1);
}
</style>
