<script setup lang="ts">
interface Props {
  body: string;
}

defineProps<Props>();
</script>

<template>
  <li class="my-message">
    <div class="my-message__bubble">{{ body }}</div>
  </li>
</template>

<style scoped>
.my-message {
  display: grid;
  gap: var(--space-1);
  justify-items: end;
}

.my-message__bubble {
  max-width: 80%;
  padding: var(--space-1);
  border-radius: var(--radius);
  background: color-mix(in oklab, var(--base-20) 92%, transparent);
  background-color: var(--base);
  color: var(--base-text);
  word-wrap: break-word;
  overflow-wrap: anywhere;
  animation: fadeUpMessage var(--time-3, 0.4s) var(--timing, ease) both;
}
</style>
