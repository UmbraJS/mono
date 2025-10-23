<script setup lang="ts">
import TokenRow from './TokenRow.vue'

interface Props {
  title: string
  tokens: string[]
  prefix: string
  mainColorVar: string
  textColorVar: string
  helpers?: boolean
}

const { helpers = false } = defineProps<Props>()

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
        <div v-for="(token) in tokens" :key="token" class="Swatch border" :style="{ '--color': token }" />
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

.SelectBox {
  height: 100px;
  width: 100px;
  position: absolute;
  z-index: 999;
  top: 0px;
  left: -50px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.SelectBox p {
  transform: translateX(-70%);
  background-color: var(--base);
  padding: var(--space-1);
  position: relative;
  color: var(--base-80);
  z-index: 99;
}

.ActualBox {
  height: 100%;
  width: 100%;
  border: solid 2px var(--base-50);
  background-color: var(--base);
  position: absolute;
  top: 0;
  left: 0;
  clip-path: polygon(0 0, 50% 0, 50% 100%, 0% 100%);
}

.Swatch {
  height: 2.2em;
  width: 2.2em;
  background-color: var(--color);
}
</style>
