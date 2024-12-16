<script setup lang="ts">
import PostFeed from '~/components/PostFeed.vue'
</script>

<template>
  <main class="page">
    <div class="artickle">
      <h1>Welcome to the NuxtHub Starter</h1>
      <p>A Nuxt template to build your full-stack application on the edge.</p>
    </div>
    <PostFeed />
  </main>
</template>

<style scoped>
.page {
  display: grid;
  place-items: center;
  min-height: 100vh;
  gap: var(--space-2);
  padding: var(--space-2);
  background-color: var(--base-20);
}

.artickle {
  display: grid;
  gap: var(--space-1);
  padding: var(--space-2);
  padding-bottom: var(--space-3);
  border-radius: var(--radius);
  background-color: var(--base-10);
  width: max-content;
}
</style>
