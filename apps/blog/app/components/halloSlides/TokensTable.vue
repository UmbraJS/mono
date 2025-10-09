<script setup lang="ts">
defineProps<{
  tokens: { name: string; value: string }[]
}>();
</script>

<template>
  <div class="TokensTable">
    <div v-for="token in tokens" :key="token.name" class="SpaceToken">
      <span class="TokenName">{{ token.name }}:</span>
      <span class="TokenValue">{{ token.value }};</span>
      <div class="Swatch border" :style="{ '--color': token.value }" />
    </div>
  </div>
</template>

<style>
.TokensTable {
  grid-column: span 3;
}

.TokenName {
  color: var(--base-text);
  font-weight: 500;
}

.TokenValue {
  color: var(--base-50);
  font-family: monospace;
}

.Swatch {
  height: 1.8em;
  width: 1.8em;
  background-color: var(--color);
}
</style>
