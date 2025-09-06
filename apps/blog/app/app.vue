<script setup lang="ts">
import 'umbraco/styles/main.scss'
import { Toaster } from 'umbraco'
import IslandMenu from './components/IslandMenu.vue'

useSeoMeta({
  title: 'NuxtHub Starter',
  description: 'A Nuxt template to build your full-stack application on the edge.',
})
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <IslandMenu />
  <Toaster />
</template>
