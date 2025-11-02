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
  <div class="ColorLayer border">
    <h3>{{ title }}</h3>
    <div class="MyTokensTables">
      <!-- Main color token -->
      <div class="TokensTable">
        <TokenRow :token-name="`--${prefix}`" :color-value="mainColorVar" />
      </div>

      <!-- Range tokens -->
      <div class="TokensTable">
        <div v-if="helpers" class="SelectBox" :style="{ top: '0%', height: '33%' }">
          <p>background</p>
          <div class="ActualBox"></div>
        </div>

        <div v-if="helpers" class="SelectBox" :style="{ top: '34%', height: '33%' }">
          <p>middleground</p>
          <div class="ActualBox"></div>
        </div>

        <div v-if="helpers" class="SelectBox" :style="{ top: '68%', height: '33%' }">
          <p>foreground</p>
          <div class="ActualBox"></div>
        </div>

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
.ColorLayer {
  padding: var(--space-3);
}

.ColorLayer h3 {
  margin: 0 0 var(--space-3) 0;
  color: var(--base-text);
}

.MyTokensTables {
  position: relative;
  display: grid;
  gap: var(--space-2);
}

.TokensTable {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: var(--space-1);
  position: relative;
}

.SelectBox {
  opacity: 0;
  height: 100px;
  width: 100px;
  position: absolute;
  z-index: 999;
  top: 0px;
  left: -70px;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: translateX(10%);
  transition: .4s;
}

.TokensTable:hover .SelectBox {
  transform: translateX(0%);
  opacity: 1;
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
</style>
