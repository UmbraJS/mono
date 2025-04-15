<script setup lang="ts">
import { DialogTitle, DialogDescription } from '@nobel/core'
import type { Card } from '../../../types'
import AttackIcon from '../icons/Attack.vue'
import BanterIcon from '../icons/Banter.vue'
import CardModalBash from './CardModalBash.vue'

const props = defineProps<{
  card: Card
}>()

const bash = props.card.bash
</script>

<template>
  <div class="cardMeta">
    <DialogTitle>
      <span>lvl {{ card.level }} - </span>{{ card.name }}
    </DialogTitle>
    <DialogDescription>
      {{ card.description }}
    </DialogDescription>
    <div class="bash">
      <h4>Meta --------------------------</h4>
      <div v-if="bash.cooldown" class="chip">
        <BanterIcon />
        Cooldown: {{ bash.cooldown }}s
      </div>
      <div class="chip"><AttackIcon />Cost: {{ card.cost }}</div>
    </div>

    <div class="tags">
      <p>Aspects:</p>
      <div v-for="aspect in card.aspects" class="chip">
        {{ aspect.name }}
      </div>
    </div>

    <CardModalBash :card="card" />

    <div class="tags">
      <p>Tags:</p>
      <div v-for="tag in card.tags" class="chip">
        {{ tag }}
      </div>
    </div>
  </div>
</template>

<style>
.cardMeta .chip {
  display: flex;
  gap: var(--space-1);
  align-items: center;
  border: solid 2px var(--base-60);
  padding: var(--space-quark);
  width: 100%;
  color: var(--base-120);
  background-color: var(--base-20);
  border-radius: var(--radius);
}

.cardMeta {
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: var(--space-2);
  width: 100%;
  padding-top: var(--space-3);
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
