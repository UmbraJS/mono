<template>
  <li class="my-message">
    <div class="my-message__bubble">{{ body }}</div>
  </li>
</template>

<script setup lang="ts">
interface Props {
  body: string;
}

defineProps<Props>();
</script>

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
  background: color-mix(in oklab, var(--base-30) 92%, transparent);
  color: var(--base-text);
  word-wrap: break-word;
  overflow-wrap: anywhere;
}
</style>
