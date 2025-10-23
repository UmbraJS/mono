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
  <div class="MySpacingTokens">
    <h1 class="SpacingTitle">
      My first attempt
    </h1>
    <div class="MyTokensTables">
      <TokensTable :tokens="backgroundTokens" />
      <TokensTable :tokens="middleTokens" />
      <TokensTable :tokens="foregroundTokens" />
    </div>
  </div>
</template>

<style scoped>
.MyTokensTables {
  display: grid;
  width: 100%;
  gap: var(--space-4);
}

.SpacingTitle {
  color: var(--base-50);
}

.MySpacingTokens {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  gap: var(--space-4);
}
</style>
