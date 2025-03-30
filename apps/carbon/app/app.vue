<script setup lang="ts">
import '@nobel/core/styles/main.scss'
import { Toaster } from '@nobel/core'

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
  <Toaster />
</template>
