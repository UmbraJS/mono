<script setup lang="ts">
import { onMounted } from 'vue'
import { umbra } from '@umbrajs/core'
import UmbraRange from './components/UmbraRange.vue'

const success = {
  name: 'success',
  value: [25, 35, 25, '#a94d94', 25, 35]
}

const royal = {
  name: 'royal',
  value: [25, 35, 25, '#87533e', 25, 25]
}

const theme = umbra({
  background: 'white',
  foreground: 'black',
  accents: ['#4f0820', '#e91e63', success, royal]
}).apply()

onMounted(() => {
  //console.log('rex: ', u)
})
</script>

<template>
  <div class="ranges">
    <UmbraRange v-for="range in theme.formated" :key="range.name" :range="range" :umbra="theme" />
  </div>
</template>

<style scoped>
.ranges {
  display: flex;
  flex-direction: column;
  gap: 0rem;
}
</style>
