<script setup lang="ts">
import { onMounted } from 'vue'
import { umbra } from '@umbrajs/core'
import UmbraRange from './components/UmbraRange.vue'

const u = umbra({
  background: 'white',
  foreground: 'black',
  accents: [
    {
      name: 'success',
      value: '#1c7d40'
    },
    '#e91e63',
    '#4f0820',
    {
      name: 'royal',
      value: '#a94d94'
    }
  ]
}).apply()

onMounted(() => {
  console.log('rex: ', u)
})
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
