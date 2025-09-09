<script setup lang="ts">
import 'umbraco/styles/main.scss'
import { Toaster } from 'umbraco'
import { useSplinesStore } from '@/stores/useSplinesStore'

useSeoMeta({
  title: 'Carbon',
  description: 'A Nuxt app deployed on Vercel.',
})

const splinesStore = useSplinesStore()
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

  <div v-if="splinesStore.tankCharacter.opponent" id="BifrostSplineBoard">
    <MatchSpline v-for="splinePath in splinesStore.attackSources.player" :key="splinePath.id" :start="splinePath"
      :end="splinesStore.tankCharacter.opponent" :angle="90" owner="player" />
  </div>

  <div v-if="splinesStore.tankCharacter.player" id="BifrostSplineBoard">
    <MatchSpline v-for="splinePath in splinesStore.attackSources.opponent" :key="splinePath.id" :start="splinePath"
      :end="splinesStore.tankCharacter.player" :angle="-90" owner="opponent" />
  </div>
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
