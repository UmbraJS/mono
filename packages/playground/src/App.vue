<script setup lang="ts">
import { umbra } from '@umbrajs/core'
import UmbraRange from './components/UmbraRange.vue'

const u = umbra({
  background: 'white',
  foreground: 'black',
  accents: ['#d9accf', '#97e8b5', '#e91e63']
}).apply()
</script>

<template>
  <div class="ranges">
    <UmbraRange v-for="range in u.formated" :key="range.name" :range="range" :umbra="u" />
  </div>
</template>

<style scoped>
.ranges {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
