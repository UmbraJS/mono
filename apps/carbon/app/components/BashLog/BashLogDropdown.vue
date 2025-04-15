<script setup lang="ts">
import type { Card } from '../../../types/card'
import type { ValueLog } from '../../composables/useBash'
import BashLogEntryContent from './BashLogEntryContent.vue'

const props = defineProps<{
  opponetDeck: Card[]
  playerDeck: Card[]
  healthLog: ValueLog
}>()

const open = ref(false)
function getCardByIndex(index: number) {
  return props.opponetDeck[index]
}
</script>

<template>
  <div class="dropdown-wrapper" :class="{ open }">
    <div class="dropdown-toggle" @click="open = !open">
      <Icon name="carbon:chevron-down" size="1.5rem" />
    </div>
    <div class="dropdown">
      <p>
        reduced by
        {{
          healthLog.debufs
            .map((source) => {
              const card = getCardByIndex(source.sourceIndex)
              return card ? card.name : 'Unknown'
            })
            .join(', ')
        }}
      </p>
      <!-- <BashLogEntryContent
        v-for="(source, index) in healthLog.debufs"
        :opponet-deck="opponetDeck"
        :player-deck="playerDeck"
        :health-log="healthLog"
      /> -->
    </div>
  </div>
</template>

<style>
.dropdown-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--base-20);
  border-radius: var(--radius);
  cursor: pointer;
}

.dropdown-toggle:hover {
  background-color: var(--base-30);
}

.dropdown-toggle span {
  transform: rotate(180deg);
  transition: 0.5s;
}

.open .dropdown-toggle span {
  transform: rotate(0deg);
}

.dropdown {
  padding: 0px;
  height: 0px;
  overflow: hidden;
}

.open .dropdown {
  height: auto;
}
</style>
