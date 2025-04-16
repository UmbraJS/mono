<script setup lang="ts">
import { umbra } from '@umbrajs/core'
import type { Accent } from '@umbrajs/core'

const warningAccent: Accent = {
  name: 'warning',
  color: '#ff0000',
}

const successAccent: Accent = {
  name: 'success',
  color: '#00ff00',
}

const theme = umbra({
  foreground: '#16121f',
  background: '#f3f6ea',
  accents: ['#9999ff', warningAccent, successAccent],
  inversed: {
    foreground: '#f3f6ea',
    background: '#16121f',
    accents: ['#9999ff', warningAccent, successAccent],
  },
})

theme.apply()
</script>

<template>
  <div class="umbra-wrapper">
    <div class="range-list">
      <div v-for="range in theme.output" :key="range.name" class="color-list">
        <div class="color-name">{{ range.name }}</div>
        <div v-for="color in range.range" class="color" :style="`--color: ${color.toHex()}`"></div>
      </div>
    </div>
  </div>
</template>

<style>
.range-list {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: var(--space-2);
}

.color-list {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--space-2);
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
