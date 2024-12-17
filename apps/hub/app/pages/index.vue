<script setup lang="ts">
import PostFeed from '~/components/PostFeed.vue'
</script>

<template>
  <div class="artickle">
    <RichArtickle />
  </div>
  <PostFeed />
</template>

<style scoped lang="scss">
.artickle {
  margin-top: 200px;

  display: grid;
  gap: var(--space-1);
  padding: var(--space-5);
  padding-bottom: var(--space-7);
  border-radius: var(--radius);
  background-color: var(--base-10);
  width: 100%;
  /* border: solid var(--border-size) var(--base-40); */

  h2 {
    margin: var(--space-6);
  }
}
</style>
