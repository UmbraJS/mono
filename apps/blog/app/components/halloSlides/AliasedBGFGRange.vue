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

const aliasTokens = [
  { name: '--primary-button-text', value: 'var(--foreground-3)' },
  { name: '--primary-button-background', value: 'var(--background-1)' },
  { name: '--primary-button-hover', value: 'var(--background-2)' },
];


</script>

<template>
  <div class="AliasedSpacingTokens" :style="{
    '--background-1': '#0c0915',
    '--background-2': '#201c26',
    '--background-3': '#484349',
    '--middleground-1': '#615e64',
    '--middleground-2': '#6e6c70',
    '--middleground-3': '#8d8d8d',
    '--foreground-1': '#d4d6cd',
    '--foreground-2': '#e1e3da',
    '--foreground-3': '#eef0e7',
  }">
    <div class="AliasedWrapper">
      <div class="ColorLayer border">
        <h3>Color Primitives</h3>
        <div class="TokensTables">
          <TokensTable :tokens="backgroundTokens" />
          <TokensTable :tokens="middleTokens" />
          <TokensTable :tokens="foregroundTokens" />
        </div>
      </div>

      <div class="ColorLayer border">
        <h3>Alias Layer</h3>
        <div class="TokensTables">
          <TokensTable :tokens="aliasTokens" />
        </div>
      </div>
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

.AliasedWrapper {
  display: flex;
  gap: var(--space-5);
}

.AliasedSpacingTokens {
  display: flex;
  align-items: center;
  gap: var(--space-5);
}

.ColorLayer {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.ColorLayer.border {
  padding: var(--space-3);
}
</style>
