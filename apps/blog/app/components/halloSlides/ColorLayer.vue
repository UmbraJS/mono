<script setup lang="ts">
import TokenRow from './TokenRow.vue'

interface Props {
  title: string
  tokens: string[]
  prefix: string
  mainColorVar: string
  textColorVar: string
}

defineProps<Props>()

function getVariableName(prefix: string, entryNumber: number): string {
  return `--${prefix}-${entryNumber * 10}`;
}
</script>

<template>
  <div class="ColorLayer border">
    <h3>{{ title }}</h3>
    <div class="TokensTables">
      <!-- Main color token -->
      <div class="TokensTable">
        <TokenRow :token-name="`--${prefix}`" :color-value="mainColorVar" />
      </div>

      <!-- Range tokens -->
      <div class="TokensTable">
        <TokenRow v-for="(token, index) in tokens" :key="token" :token-name="getVariableName(prefix, index + 1)"
          :token-value="token" :color-value="token" />
      </div>

      <!-- Text color token -->
      <div class="TokensTable">
        <TokenRow :token-name="`--${prefix}-text`" :color-value="textColorVar" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.TokensTable {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: var(--space-1);
}
</style>
