<script setup lang="ts">
import { umbra } from '@umbrajs/core'
import type { Accent } from '@umbrajs/core'

import {
  gray,
  blue,
  red,
  green,
  grayDark,
  blueDark,
  redDark,
  greenDark,
} from "@radix-ui/colors";

const warningAccent: Accent = {
  name: 'warning',
  color: '#ff0000',
}

const successAccent: Accent = {
  name: 'success',
  color: '#00ff00',
}

console.log('successAccent', successAccent)

const theme = umbra({
  foreground: '#16121f',
  background: '#f3f6ea',
  accents: [
    '#9999ff',
    warningAccent,
    successAccent,
    "#ff00ff",
  ],
  // Or use an easing options object:
  // accents: [
  //   {
  //     color: '#9999ff',
  //     tints: { easing: 'easeInCubic', min: 5, max: 80, count: 12 }
  //   }
  // ],
  // Or still use the traditional array:
  // accents: [
  //   {
  //     color: '#9999ff',
  //     tints: [5, 10, 15, 20, 30, 40, 50, 60, 70, 80, 90, 95]
  //   }
  // ],
})

theme.apply()
</script>

<template>
  <div class="umbra-wrapper">
    <div class="range-list">
      <div v-for="range in theme.output" :key="range.name" class="color-list">
        <div class="color-name">{{ range.name }}</div>
        <div class="tokens border">
          <div id="StartCap" class="caps color" :style="`--color: ${range.background.toHex()}`"></div>
          <div v-for="(color, index) in range.range" class="color" :style="`--color: ${color.toHex()}`">
            <!-- <p v-if="false" class="caption">{{ getTokenName(index) }}</p> -->
          </div>
          <div id="EndCap" class="caps color" :style="`--color: ${range.foreground.toHex()}`"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.color-list:first-of-type .tokens {
  border-bottom: none;
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
}

.color-list:last-of-type .tokens {
  border-top: none;
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
}

.color-list:not(:last-of-type, :first-of-type) .tokens {
  border-top: none;
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;

  border-bottom: none;
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
}


.tokens {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.tokens:first-of-type {
  border-bottom: none;
}

.range-list {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.color-list {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0px;
}

.color-name {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--space-5);
}

.color {
  width: var(--space-3);
  aspect-ratio: 1 / 1;
  background: var(--color);
}
</style>
