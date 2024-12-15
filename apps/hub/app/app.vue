<script setup lang="ts">
import '@nobel/core/styles/main.scss'
import { ref } from 'vue'
import { umbra } from '@umbrajs/core'
import type { Accent } from '@umbrajs/core'

const inversed = ref(true)

const warningAccent: Accent = {
  name: 'warning',
  color: '#ff0000',
}

const successAccent: Accent = {
  name: 'success',
  color: '#00ff00',
}

const theme = umbra({
  background: '#ffffff',
  foreground: '#000000',
  accents: ['#8888ff', warningAccent, successAccent]
})

inversed.value ? theme.inverse().apply() : theme.apply()

function toggleTheme() {
  inversed.value ? theme.apply() : theme.inverse().apply()
  inversed.value = !inversed.value
}

useSeoMeta({
  title: 'NuxtHub Starter',
  description: 'A Nuxt template to build your full-stack application on the edge.',
})
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtLoadingIndicator />
  <NuxtPage />
</template>
