<script setup lang="ts">
import "umbraco/styles/main.scss";
import { Toaster } from "umbraco";

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
  <ClientOnly>
    <Toaster />
  </ClientOnly>
</template>
