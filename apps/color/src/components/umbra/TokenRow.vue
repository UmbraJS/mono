<script setup lang="ts">
interface Props {
  tokenName: string
  tokenValue?: string
  colorValue: string
}

defineProps<Props>()
</script>

<template>
  <div class="SpaceToken">
    <span class="TokenName">{{ tokenName }}:</span>
    <span class="TokenValue">{{ tokenValue || '' }}{{ tokenValue ? ';' : '' }}</span>
    <div class="Swatch border" :style="{ '--color': colorValue }" />
  </div>
</template>

<style scoped>
.SpaceToken {
  display: grid;
  grid-template-columns: subgrid;
  grid-column: 1 / -1;
  gap: var(--space-2);
  align-items: center;
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
