<script setup lang="ts">
import { RichText } from '@nobel/richtext'
import PostFeed from '~/components/PostFeed.vue'
import ReasonList from '~/components/Reason/List.vue'
</script>

<template>
  <div class="article voice">
    <h1 class="title">Voice of Reason</h1>
    <p class="subtitle">A place to share your thoughts and ideas.</p>
  </div>
  <div class="article">
    <ReasonList />
  </div>
  <div class="article">
    <RichText />
  </div>
  <PostFeed />
</template>

<style scoped lang="scss">
.article {
  margin-top: 200px;

  display: grid;
  gap: var(--space-1);
  padding: var(--space-5);
  padding-bottom: var(--space-7);
  border-radius: var(--radius);
  background-color: var(--base-10);
  width: 100%;
  border: solid var(--border-size) var(--base-30);
  box-shadow: 0px 0px 20px 10px var(--base-20);
  transition: 0.4s;
}
</style>
