<script setup lang="ts">
import "umbraco/styles/main.scss";
import { Toaster } from "umbraco";
import IslandMenu from "./components/IslandMenu.vue";

useSeoMeta({
  title: "Umbra Blog",
  description: "A Nuxt app deployed on Vercel.",
});
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <IslandMenu />
  <ClientOnly>
    <Toaster />
  </ClientOnly>
</template>
