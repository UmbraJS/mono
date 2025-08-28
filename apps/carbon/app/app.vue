<script setup lang="ts">
import '@nobel/core/styles/main.scss'
import { Toaster } from '@nobel/core'
import { useSplinesStore } from '@/stores/useSplinesStore'

useSeoMeta({
  title: 'NuxtHub Starter',
  description: 'A Nuxt template to build your full-stack application on the edge.',
})

const splinesStore = useSplinesStore()
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

  <div v-if="splinesStore.tankCharacter" id="BifrostSplineBoard">
    <MatchSpline v-for="splinePath in splinesStore.attackSource" :key="splinePath.id" :start="splinePath"
      :end="splinesStore.tankCharacter" />
  </div>
  <Toaster />
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
