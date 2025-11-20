<script setup lang="ts">
import Bio from '../components/Bio.vue'
import BlackHole from '../components/BlackHole.vue'

useSeoMeta({
  title: "Sam is Blogging at 2am",
  description: "A place to share your thoughts and ideas.",
})
</script>

<template>
  <div id="BlogFrontPage">
    <Bio />
    <div id="BackgroundElement">
      <ClientOnly fallback-tag="div" fallback="">
        <component :is="BlackHole" />
      </ClientOnly>
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
