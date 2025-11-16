<script setup lang="ts">
defineProps<{ color: string; }>();
</script>

<template>
  <div class="UserChip border" :style="{ '--color': color }">
    <slot />
  </div>
</template>

<style>
.UserChip {
  display: grid;
  grid-template-columns: auto 1fr auto;

  gap: var(--space-1);
  justify-items: start;
  align-items: center;
  padding: var(--space-1);
  border-radius: var(--radius);
  background: var(--base);
  width: 100%;
  max-width: var(--paragraph-width);

  color: var(--base-text);
  word-wrap: break-word;
  overflow-wrap: anywhere;
}

.UserChip p {
  color: var(--base-120);
}
</style>
