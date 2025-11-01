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

const baseTokens = base.shades
const accentTokens = accent.shades

console.log('Base Tokens:', accentTokens);

function getVariableName(prefix: string, entryNumber: number): string {
  return `--${prefix}-${entryNumber * 10}`;
}
</script>

<template>
  <div class="MySpacingTokens">
    <p class="display"> <span>Manual work is slow</span></p>
    <div class="MyAliasedWrapper">

      <div class="ColorLayer">
        <div class="MyTokensTables">
          <!-- <div class="TokensTable">
            <div class="SpaceToken">
              <span class="TokenName">--base:</span>
              <span class="TokenValue"></span>
              <div class="Swatch border" :style="{ '--color': 'var(--base)' }" />
            </div>
          </div> -->

          <div class="MyTokensTable">
            <div v-for="(token, index) in baseTokens" :key="token" class="SpaceToken">
              <p class="MyTokenName"><span>{{ getVariableName("base", index + 1) }}:</span></p>
              <!-- <div class="Swatch border" :style="{ '--color': token }" /> -->
              <!-- <DyePicker :default-color="token" /> -->
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

      <div class="ColorLayer">
        <div class="MyTokensTables">
          <!-- <div class="TokensTable">
            <div class="SpaceToken">
              <span class="TokenName">--accent:</span>
              <span class="TokenValue"></span>
              <div class="Swatch border" :style="{ '--color': 'var(--base)' }" />
            </div>
          </div> -->

          <div class="MyTokensTable">
            <div v-for="(token, index) in accentTokens" :key="token" class="SpaceToken">
              <p class="MyTokenName"><span>{{ getVariableName("base", index + 1) }}:</span></p>
              <!-- <div class="Swatch border" :style="{ '--color': token }" /> -->
              <!-- <DyePicker :default-color="token" /> -->
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
.MyAliasedWrapper {
  display: flex;
  gap: var(--space-5);
}

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

.SpaceToken:has(.DyepickerWrapper:not(.compact)),
.SpaceToken:has(.DyepickerWrapper.renderPriority) {
  position: relative;
  z-index: 999999;
}

.MySpacingTokens {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
}

.MyTokensTable {
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

.MyTokenName {
  color: var(--base-text);
  font-weight: 500;
  font-size: 2em;
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
