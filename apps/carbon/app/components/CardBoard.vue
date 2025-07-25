<script setup lang="ts">
import { useStore } from '~/stores/useStore'

const prop = defineProps<{
  board?: 'deck' | 'inventory';
  maxSlots: number;
}>();

const templateAreas = computed(() => {
  const maxSlots = prop.maxSlots;
  let areas = '';
  for (let i = 0; i < maxSlots; i++) {
    areas += '"stack"';
  }
  return areas;
})

const store = useStore()

function range(start: number, end: number) {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

const dragHit = computed(() => {
  const hoveredBoard = store.user.hoveredSpace?.immigrant.board
  if (!hoveredBoard) return []
  if (prop.board !== hoveredBoard) return []
  const hoveredStart = store.user.hoveredSpace?.immigrant.start
  const hoveredEnd = store.user.hoveredSpace?.immigrant.end
  if (hoveredStart === undefined || hoveredEnd === undefined) return []
  return range(hoveredStart, hoveredEnd)
})
</script>

<template>
  <div class="board-wrapper">
    <div class="board">
      <slot />
    </div>
    <div class="subSpace">
      <CardSpace v-for="index in prop.maxSlots" :key="index" :index="`${board}-${index - 1}`"
        :hovered="dragHit.includes(index - 1)" />
    </div>
  </div>
</template>

<style>
.board-wrapper {
  position: relative;
  display: grid;
  grid-column: 1 / -1;
  grid-template-columns: repeat(v-bind(maxSlots), minmax(0, 150px));
  grid-template-areas: v-bind(templateAreas);
  justify-content: center;
  height: 100%;

  padding: var(--space-1);
  background: var(--base-10);
  border-radius: var(--radius);
  height: 100%;
}

.board-wrapper .board-title {
  grid-column: 1 / -1;
}

.board {
  --rotateAmount: 15;

  position: relative;
  display: grid;
  grid-template-columns: subgrid;
  grid-area: stack;
  grid-column: 1 / -1;
  z-index: 2;
}

.subSpace {
  display: grid;
  grid-template-columns: subgrid;
  grid-area: stack;
  grid-column: 1 / -1;
  z-index: 1;

  height: 100%;
  width: 100%;
}
</style>
