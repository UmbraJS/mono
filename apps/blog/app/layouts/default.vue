<script setup lang="ts">
import { onKeyStroke } from '@vueuse/core'
import FrostLayer from '../components/FrostLayer.vue'
import AuthorCard from '../components/AuthorCard.vue'

const { data: posts } = await useAsyncData('blog', () => queryCollection('blog').all())

const theme = useUmbra()

onMounted(() => {
  theme.inverse()
})

const reveal = ref(false)

function toggleReveal() {
  reveal.value = !reveal.value
}

onKeyStroke('Escape', () => toggleReveal())


const projects = [
  { name: "Moonbow", href: undefined, description: "A WebGPU framework for creative coding.", status: "v0.1.0" },
  { name: "Umbra", href: undefined, description: "A design system for building beautiful web apps.", status: "v0.3.0" },
  { name: "Carbon Bizarre", href: undefined, description: "A design system for building beautiful web apps.", status: "private" },
  { name: "Bifrost", href: undefined, description: "A design system for building beautiful web apps.", status: "private" },
  { name: "Formula", href: undefined, description: "A design system for building beautiful web apps.", status: "planning" },
]
</script>

<template>
  <div class="layout" :class="{
    reveal: reveal,
    dark: theme.isDark,
  }">
    <div class="burger" @click="toggleReveal" />
    <FrostLayer />
    <div class="content-layer">
      <div class="vignet" @click="toggleReveal" />
      <main class="page">
        <slot />
      </main>
    </div>
    <div class="underbar">
      <header>
        <NuxtLink to="/" class="logo">
          <h1>CarelessCourage</h1>
        </NuxtLink>
      </header>
      <div class="content" />
      <div class="sidebar">
        <AuthorCard />
        <div id="BlogPostList" class="border">
          <div id="BlogPostListHeader">
            <h3 class="caption">Posts ({{ posts?.length }})</h3>
          </div>
          <NuxtLink v-for="post in posts" id="BlogPostCard" :key="post.id" class="border" filter: blur(3px);
            :to="post.path" tabindex="0" role="link" aria-label="Blog post card">
            <p>{{ post.title }}</p>
          </NuxtLink>
        </div>

        <div id="BlogPostList" class="border">
          <div id="BlogPostListHeader">
            <h3 class="caption">Projects ({{ projects.length }})</h3>
          </div>
          <NuxtLink v-for="project in projects" id="BlogPostCard" :key="project.name" class="border" filter: blur(3px);
            :to="project.href ?? ''" tabindex="0" role="link" aria-label="Blog post card">
            <p>{{ project.name }}</p>
            <p class="description">{{ project.description }}</p>
            <p class="status">{{ project.status }}</p>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
/* author card styles moved to AuthorCard.vue */

#BlogPostList {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  padding: var(--space-1);
  padding-bottom: var(--space-2);
  border-color: var(--base-30);
  height: min-content;
  background-color: var(--base);
}

#BlogPostListHeader {
  display: flex;
  padding: var(--space-1);
  border-radius: var(--radius);
}

#BlogPostCard {
  font-size: 50px;
  background-color: var(--base);
  border-radius: var(--radius);
  border-color: var(--base-20);
  padding: var(--space-1);
}

.inverted-theme {
  color: var(--base-120);
}

.layout {
  --header-height: calc(var(--h1-display-size) + var(--space-2));
  --sidebar-width: calc(100dvw / 3);
  position: relative;
  width: 100dvw;
}

@media (max-width: 800px) {
  .layout {
    --sidebar-width: 100dvw;
  }
}

.layout .content-layer {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  position: relative;
  z-index: 1;

  background-color: var(--base);
  border-top-right-radius: var(--radius);
  overflow: hidden;

  transform: translateY(0px) translateX(0px);
  transition: var(--slow);
}

.layout .content-layer main.page {
  display: flex;
  justify-content: center;

  width: 80dvw;
  max-width: 1900px;
  min-height: 100vh;

  @media (max-width: 800px) {
    width: 100dvw;
  }
}

.layout .content-layer .vignet {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--accent);
  opacity: 0;
  z-index: 1;
  pointer-events: none;
  transition: opacity var(--slow);
  border-radius: var(--radius);
}

.layout.reveal .content-layer .vignet {
  opacity: 0.7;
  cursor: pointer;
  pointer-events: all;
}

.layout.reveal .content-layer .vignet:hover {
  opacity: 0.3;
}

.layout.reveal .content-layer {
  pointer-events: none;
  transform: translateY(var(--header-height)) translateX(calc(0px - var(--sidebar-width) + 1px));

  @media (max-width: 800px) {
    transform: translateY(0) translateX(calc(0px - var(--sidebar-width) + 1px));
    transition: var(--slower);
  }
}

.underbar {
  position: fixed;
  z-index: 0;
  top: 0;
  left: 0;
  height: 100dvh;
  width: 100dvw;
  background: var(--base-10);

  display: grid;
  grid-template-columns: 1fr var(--sidebar-width);
  grid-template-rows: var(--header-height) 1fr;
  grid-template-areas:
    'header header'
    'content sidebar';
  transition: background-color var(--slower);
}

.underbar header {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;

  grid-column: span 2;
  grid-area: header;
  padding: var(--space-1) var(--space-2);
}

.layout .burger {
  position: fixed;
  right: 0px;
  z-index: 2;
  width: 60px;
  height: 60px;
  background-color: var(--base-80);
  cursor: pointer;
}

.underbar .sidebar {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);

  padding: var(--space-2);
  padding-top: 0px;
}

.underbar .content {
  grid-area: content;
  background-color: var(--base-20);
}
</style>
