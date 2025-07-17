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

<style>
:root {
  --cardWindowWidth: calc(3 * 70px);
  --cardWindowHeight: 150px;
}

#MouseBall {
  position: absolute;
  z-index: 99999999;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: var(--accent-100);
  pointer-events: none;
  transform: translate(-50%, -50%);
}
</style>
