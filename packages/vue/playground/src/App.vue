<script setup lang="ts">
import { umbra } from '@umbrajs/core'
import UmbraRange from './components/UmbraRange.vue'

const u = umbra({
  background: 'white',
  foreground: 'black',
  accents: ['#d9accf', '#97e8b5', '#e91e63']
}).apply()

console.log(u)
</script>

<template>
  <div class="wrapper">
    <UmbraRange v-for="range in u.formated" :key="range.name" :range="range" />
  </div>
</template>
