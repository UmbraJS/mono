<script setup lang="ts">
import type { Card } from '../../../types/card'
import type { ValueLog } from '../../composables/useBash'

const props = defineProps<{
  opponetDeck: Card[]
  playerDeck: Card[]
  healthLog: ValueLog
}>()

const open = ref(false)

function getCardByIndex(index: number) {
  return props.playerDeck[index]
}
const opponentCardByIndex = props.playerDeck[props.healthLog.index]
</script>

<template>
  <li
    class="change"
    :class="{
      'base-success': healthLog.type === 'heal',
      'base-warning': healthLog.type === 'attack',
      'base-info': healthLog.type === 'shield',
      'base-yellow': healthLog.type === 'banter',
      dud: healthLog.actualChange === 0,
    }"
  >
    <div class="avatar border">
      <img :src="opponentCardByIndex?.image?.default" alt="Card avatar" />
    </div>
    <p>{{ opponentCardByIndex?.name }}</p>

    <div class="value border">
      <p v-if="healthLog.actualChange !== healthLog.attemptedChange">
        {{ healthLog.actualChange }} / {{ healthLog.attemptedChange }}
      </p>
      <p v-else>{{ healthLog.actualChange }}</p>
    </div>

    <div class="dropdown-wrapper" :class="{ open }" v-if="healthLog.debufs.length > 0">
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
      </div>
    </div>
  </li>
</template>

<style>
li.change {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: var(--space-1);
  align-items: center;
  background: var(--base-10);
  color: var(--base-120);
  padding: var(--space-1);
  border-radius: var(--radius);
}

li.change.dud {
  opacity: 0.2;
}

li .dropdown-wrapper {
  grid-column: 1 / -1;
}

li .dropdown-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--base-20);
  border-radius: var(--radius);
  cursor: pointer;
}

li .dropdown-toggle:hover {
  background-color: var(--base-30);
}

li .dropdown-toggle span {
  transform: rotate(180deg);
  transition: 0.2s;
}

li .open .dropdown-toggle span {
  transform: rotate(0deg);
}

li .dropdown {
  padding: 0px;
  height: 0px;
  overflow: hidden;
}

li .open .dropdown {
  height: auto;
}

li.change .value {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--base-20);
  border-radius: var(--radius);
  padding: var(--space-quark) var(--space-1);
  color: var(--base-120);
}

.change .avatar {
  position: relative;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: var(--radius);
  overflow: hidden;
}

.change .avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
