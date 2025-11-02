<script setup lang="ts">
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
  <div class="MyColorLayer">
    <p>{{ title }}</p>
    <div class="TokensTables">
      <!-- Range tokens -->
      <div class="TokensTable">
        <div class="Swatch border" :style="{ '--color': mainColorVar }" />
        <div v-for="(token, index) in tokens" :key="index" class="Swatch border" :style="{ '--color': token }" />
        <div class="Swatch border" :style="{ '--color': textColorVar }" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.MyColorLayer {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.TokensTable {
  position: relative;
  display: flex;
  gap: var(--space-1);
}

.Swatch {
  height: 2.2em;
  width: 2.2em;
  background-color: var(--color);
}
</style>
