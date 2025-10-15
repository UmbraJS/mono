<script setup lang="ts">
import { defineAsyncComponent, defineComponent } from 'vue'
import Bio from '../components/Bio.vue'

// Lazy-load BlackHole only on client to avoid SSR/prerender errors
const BlackHole = import.meta.client
  ? defineAsyncComponent(() => import('../components/BlackHole.vue'))
  : defineComponent({ name: 'BlackHoleSSRStub', setup: () => () => null })

useSeoMeta({
  title: "Sam is Blogging at 2am",
  description: "A place to share your thoughts and ideas.",
})
</script>

<template>
  <div id="BlogFrontPage">
    <Bio />
    <div id="BackgroundElement">
      <component :is="BlackHole" />
    </div>
  </div>
</template>

<style>
#BackgroundElement {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

#BlogFrontPage {
  display: flex;
  flex-direction: column;
  align-items: center;

  gap: var(--space-4);
  height: 100vh;
  width: 100%;
}
</style>
