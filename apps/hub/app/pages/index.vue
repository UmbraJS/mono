<script setup lang="ts">
import PostFeed from '~/components/PostFeed.vue'
</script>

<template>
  <main class="page">
    <div class="artickle">
      <RichArtickle />
    </div>
    <PostFeed />
  </main>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  place-items: center;

  width: 100dvw;
  max-width: 1300px;
  gap: var(--space-4);
}

.artickle {
  margin-top: 200px;

  display: grid;
  gap: var(--space-1);
  padding: var(--space-3);
  padding-bottom: var(--space-6);
  border-radius: var(--radius);
  background-color: var(--base-10);
  width: 100%;
  /* border: solid var(--border-size) var(--base-40); */
}
</style>
