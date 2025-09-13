<script setup lang="ts">
import 'umbraco/styles/_index.css';
import 'umbraco/dist/umbraco.css';
import { Toaster } from 'umbraco'

useSeoMeta({
  title: 'Carbon',
  description: 'A Nuxt app deployed on Vercel.',
})

</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

  <ClientOnly>
    <Toaster />
  </ClientOnly>
</template>

<style>
#BifrostSplineBoard {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  width: 100%;
  height: 100%;
  z-index: 9999999;
}

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
