<script setup lang="ts">
defineProps<{
  tokens: { name: string; value: string }[]
}>();
</script>

<template>
  <div class="TokensTable">
    <div v-for="token in tokens" :key="token.name" class="SpaceToken">
      <p>{{ token.name }}:</p>
      <div class="Swatch border" :style="{ '--color': token.value }" />
    </div>
  </div>
</template>

<style scoped>
.TokensTable {
  grid-column: span 3;
  display: grid;
  grid-template-columns: 1fr auto !important;
}

.TokensTable p {
  font-size: clamp(14px, 4vw, 31px);
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
  height: 3em;
  width: 3em;
  background-color: var(--color);
}
</style>
