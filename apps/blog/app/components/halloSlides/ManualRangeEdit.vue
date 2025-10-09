<script setup lang="ts">
import { umbra } from '@umbrajs/core';
import type { FormatedRange } from '@umbrajs/core';
import DyePicker from '../DyePicker.vue';

const lol = umbra({
  background: 'black',
  foreground: 'white',
  accents: [
    "#ff0000",
  ]
});

const formated = lol.format();
const base = formated.formated[0] as FormatedRange;
const accent = formated.formated[1] as FormatedRange;

console.log("rex: ", lol.format());

const baseTokens = base.shades
const accentTokens = accent.shades

function getVariableName(prefix: string, entryNumber: number): string {
  return `--${prefix}-${entryNumber * 10}`;
}
</script>

<template>
  <div class="SpacingTokens">
    <div class="AliasedWrapper">
      <div class="ColorLayer border">
        <div class="TokensTables">
          <!-- <div class="TokensTable">
            <div class="SpaceToken">
              <span class="TokenName">--base:</span>
              <span class="TokenValue"></span>
              <div class="Swatch border" :style="{ '--color': 'var(--base)' }" />
            </div>
          </div> -->

          <div class="TokensTable">
            <div v-for="(token, index) in baseTokens" :key="token" class="SpaceToken">
              <span class="TokenName">{{ getVariableName("base", index + 1) }}:</span>
              <span class="TokenValue">{{ token }};</span>
              <!-- <div class="Swatch border" :style="{ '--color': token }" /> -->
              <DyePicker :default-color="token" />
            </div>
          </div>

          <!-- <div class="TokensTable">
            <div class="SpaceToken">
              <span class="TokenName">--base-text:</span>
              <span class="TokenValue"></span>
              <div class="Swatch border" :style="{ '--color': 'var(--base-text)' }" />
            </div>
          </div> -->
        </div>
      </div>

      <div class="ColorLayer border">
        <div class="TokensTables">
          <!-- <div class="TokensTable">
            <div class="SpaceToken">
              <span class="TokenName">--accent:</span>
              <span class="TokenValue"></span>
              <div class="Swatch border" :style="{ '--color': 'var(--base)' }" />
            </div>
          </div> -->

          <div class="TokensTable">
            <div v-for="(token, index) in accentTokens" :key="token" class="SpaceToken">
              <span class="TokenName">{{ getVariableName("accent", index + 1) }}:</span>
              <!-- <div class="Swatch border" :style="{ '--color': token }" /> -->
              <DyePicker :default-color="token" />
            </div>
          </div>

          <!--
          <div class="TokensTable">
            <div class="SpaceToken">
              <span class="TokenName">--accent-text:</span>
              <span class="TokenValue"></span>
              <div class="Swatch border" :style="{ '--color': 'var(--accent-text)' }" />
            </div>
          </div> -->
        </div>
      </div>
    </div>



  </div>
</template>

<style>
.SpacingTitle {
  color: var(--base-50);
}

.SpaceToken {
  display: grid;
  grid-template-columns: subgrid;
  grid-column: 1 / -1;
  gap: var(--space-2);
  align-items: center;
}

.SpacingTokens {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
}

.TokensTable {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: var(--space-1);
}

.TokenText {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0px var(--space-2);
  color: var(--base-50);
}

.TokenText span {
  color: var(--base-text);
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
