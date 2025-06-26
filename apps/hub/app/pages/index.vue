<script setup lang="ts">
const { data: posts } = await useAsyncData('blog', () => queryCollection('blog').all())

useSeoMeta({
  title: "Sam is Blogging at 2am",
  description: "A place to share your thoughts and ideas.",
})
</script>

<template>
  <div class="article voice">
    <h1 class="title">Blog</h1>
    <p class="subtitle">A place to share your thoughts and ideas.</p>

    <div id="BlogPostList">
      <NuxtLink v-for="post in posts" id="BlogPostCard" :key="post.id" :to="post.path"
        class="base button buttonText buttonHover buttonActive buttonFocus focus medium base-accent" tabindex="0"
        role="link" aria-label="Blog post card">
        <h4>{{ post.title }}</h4>
      </NuxtLink>
    </div>
  </div>
</template>

<style lang="scss">
#BlogPostList {
  padding: var(--space-2);
  padding-bottom: var(--space-7);
  border-radius: var(--radius);
  background-color: var(--base-10);
}

#BlogPostCard {
  background: var(--base-10);
  border-radius: var(--radius);
  border: solid var(--border-size) var(--base-30);
}

#BlogPostCard:hover {
  background: var(--accent-40);
  border: solid var(--border-size) var(--accent-80);
}
</style>
