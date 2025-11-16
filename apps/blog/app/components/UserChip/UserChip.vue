<script setup lang="ts">
defineProps<{ color: string; }>();
</script>

<template>
  <div class="UserChip" :style="{ '--color': color }">
    <slot />
  </div>
</template>

<style>
.UserChip {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--space-1);
  justify-items: start;
  align-items: center;
  padding: var(--space-1);
  border-radius: var(--radius);
  background: var(--base);
  color: var(--base-text);
  word-wrap: break-word;
  overflow-wrap: anywhere;
}
</style>
