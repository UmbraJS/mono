<script setup lang="ts">
import TokensTable from './TokensTable.vue';

const backgroundTokens = [
  { name: '--background-1', value: '#0c0915' },
  { name: '--background-2', value: '#201c26' },
  { name: '--background-3', value: '#484349' },
];

const middleTokens = [
  { name: '--middleground-1', value: '#615e64' },
  { name: '--middleground-2', value: '#6e6c70' },
  { name: '--middleground-3', value: '#8d8d8d' },
];

const foregroundTokens = [
  { name: '--foreground-1', value: '#d4d6cd' },
  { name: '--foreground-2', value: '#e1e3da' },
  { name: '--foreground-3', value: '#eef0e7' },
];
</script>

<template>
  <div class="SpacingTokens">
    <div class="TokensTables">
      <TokensTable :tokens="backgroundTokens" />
      <TokensTable :tokens="middleTokens" />
      <TokensTable :tokens="foregroundTokens" />
    </div>
  </div>
</template>

<style>
.TokensTables {
  display: grid;
  grid-template-columns: auto auto 1fr;
  gap: var(--space-4);
}

.SpacingTitle {
  color: var(--base-50);
}

.SpacingTokens {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}
</style>
