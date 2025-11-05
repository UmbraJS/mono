<script setup lang="ts">
import "umbraco/styles/_index.css";
import "umbraco/dist/umbraco.css";
import { Toaster } from "umbraco";
import IslandMenu from "./components/IslandMenu.vue";
import { SpeedInsights } from "@vercel/speed-insights/nuxt";

useSeoMeta({
  title: "Noble Blog",
  description: "Where thoughts meet words.",
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
    <SpeedInsights />
  </ClientOnly>
</template>
