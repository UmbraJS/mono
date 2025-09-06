<script setup lang="ts">
import SidebarList from './SidebarList.vue'

const props = defineProps<{
  posts?: Array<{ id?: string; title?: string; path?: string }> | null
}>()
</script>

<template>
  <SidebarList :title="'Posts'" :count="props.posts?.length ?? 0">
    <NuxtLink v-for="post in props.posts" :key="post?.id ?? post?.path" class="sidebar-list-item border"
      :to="post?.path ?? ''" tabindex="0" role="link" aria-label="Blog post card">
      <p class="post-title">{{ post?.title }}</p>
    </NuxtLink>
  </SidebarList>
</template>

<style scoped>
.sidebar-list-item {
  background-color: var(--base);
  border-radius: var(--radius);
  border-color: var(--base-20);
  padding: var(--space-1);
}

.post-title {
  font-size: 1rem;
}
</style>
