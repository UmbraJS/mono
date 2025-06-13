<script setup lang="ts">
defineProps<{
  board?: "deck" | "inventory";
}>();
</script>

<template>
  <div class="board-wrapper">
    <div class="board">
      <slot />
    </div>
    <div class="subSpace">
      <CardSpace v-for="index in 12" :key="index" :index="`${board}-${index - 1}`" />
    </div>
  </div>
</template>

<style>
.board-wrapper {
  position: relative;
  display: grid;
  grid-column: span 12;
  grid-template-columns: subgrid;
  grid-template-areas: 'stack stack stack stack stack stack stack stack stack stack stack stack';
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
