<script setup lang="ts">
import { umbra } from '@umbrajs/core'
import UmbraRange from './components/UmbraRange.vue'

const u = umbra({
  background: 'white',
  foreground: 'black',
  accents: ['#a94d94', '#1c7d40', '#e91e63', '#4f0820']
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
  gap: 0rem;
}
</style>
