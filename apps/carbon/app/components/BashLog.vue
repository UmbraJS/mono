<script setup lang="ts">
import type { UsePlayerReturn } from '../composables/usePlayer'
import { ScrollArea } from '@nobel/core'
import type { Card } from '../../types/card'

const props = defineProps<{
  player: UsePlayerReturn
  opponentDeck: Card[]
}>()

const reversedHealthLog = computed(() => {
  return props.player.healthLog.value.slice().reverse()
})

function getCardByIndex(index: number) {
  return props.opponentDeck[index]
}
</script>

<template>
  <ScrollArea class="ScrollArea border">
    <ul>
      <li v-for="(log, index) in reversedHealthLog" :key="index">
        <p class="timestamp">{{ Math.floor(log.timestamp) }}s -</p>
        <div class="change">
          <p v-if="log.actualChange !== log.attemptedChange">
            {{ log.actualChange }} / {{ log.attemptedChange }}
          </p>
          <p v-else>{{ log.actualChange }}</p>
          <p v-if="log.reductionSources.length > 0">
            reduced by
            {{
              log.reductionSources
                .map((source) => {
                  const card = getCardByIndex(source)
                  return card ? card.name : 'Unknown'
                })
                .join(', ')
            }}
          </p>
        </div>
        <p class="newValue">
          {{ log.newValue }}
        </p>
      </li>
    </ul>
  </ScrollArea>
</template>

<style>
.ScrollArea {
  height: 130px;
  overflow: hidden;
  padding: var(--space-2);
}

ul {
  list-style: none;
  padding: 0;
}

li {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: var(--space-2);
  padding: var(--space-2);
  border-bottom: 1px solid var(--base-20);
}

.timestamp {
  color: var(--base-50);
}

.change {
  display: flex;
  gap: var(--space-1);
}
</style>
