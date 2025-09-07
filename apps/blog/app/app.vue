<script setup lang="ts">
import "umbraco/styles/main.scss";
import { Toaster } from "umbraco";
import IslandMenu from "./components/IslandMenu.vue";
// Use direct component import to avoid Nuxt module resolution issues
import { SpeedInsights } from "@vercel/speed-insights/nuxt";

useSeoMeta({
  title: "NuxtHub Starter",
  description:
    "A Nuxt template to build your full-stack application on the edge.",
});
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <IslandMenu />
  <Toaster />
  <SpeedInsights />
</template>
