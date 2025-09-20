<template>
  <li class="other-message">
    <div class="other-message__meta">
      <p class="caption">{{ message.user }}</p>
    </div>
    <div class="other-message__bubble">{{ message.body }}</div>
  </li>
</template>

<script setup lang="ts">
interface Props {
  message: {
    _id: string;
    user: string;
    body: string;
  };
}

defineProps<Props>();
</script>

<style scoped>
.other-message {
  display: grid;
  gap: var(--space-1);
  justify-items: start;
}

.other-message__bubble {
  max-width: 80%;
  padding: var(--space-1);
  border-radius: var(--radius);
  background: var(--base);
  color: var(--base-text);
  word-wrap: break-word;
  overflow-wrap: anywhere;
}
</style>
