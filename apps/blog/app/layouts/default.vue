<script setup lang="ts">
import { Button } from 'umbraco'
import { onKeyStroke } from '@vueuse/core'
import FrostLayer from '../components/FrostLayer.vue'
import PostList from '../components/PostList.vue'
import ProjectList from '../components/ProjectList.vue'

import UserChip from "../components/UserChip/variants/UserChip.vue";
import GlobalChatPanel from "../components/GlobalChatPanel.vue";
import { author } from '../../types/profile'

// SSR-safe: guard content query to avoid crashing prerender
const { data: posts } = await useAsyncData('blog', async () => {
  try {
    // queryCollection provided by @nuxt/content
    return await queryCollection('blog').all()
  } catch (e) {
    console.error('[home] Failed to load blog posts during SSR:', e)
    return []
  }
})

const theme = useUmbra()
const reveal = ref(false)

function toggleReveal() {
  reveal.value = !reveal.value
}

onKeyStroke('Escape', () => toggleReveal())
</script>

<template>
  <div class="layout" :class="{
    reveal: reveal,
    dark: theme.isDark,
  }">
    <div class="burger" @click="toggleReveal" />
    <!-- <FrostLayer /> -->
    <div class="content-layer">
      <div class="vignet" @click="toggleReveal" />
      <main class="UmbraPage">
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
        <UserChip :author="author">
          <Button size="medium">
            <Icon name="carbon:settings" />
          </Button>
        </UserChip>
        <!-- <div class="ContentPosts">
          <PostList :posts="posts" />
          <ProjectList />
        </div> -->
        <div class="ChatRoom">
          <GlobalChatPanel slug="global" name="Global Chat" description="General discussion for everyone" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.ChatRoom {
  height: 100%;

}

.MandatoryIdentityFields {
  display: grid;
  grid-auto-flow: column;
  gap: var(--space-quark);
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
  transition: background-color var(--time-2), color var(--time-2), border-color var(--time-2), transform var(--time-2);
}

.UmbraPage {
  width: 80dvw;
  max-width: 1900px;
  min-height: 100vh;

  @media (max-width: 800px) {
    width: 100dvw;
  }
}

.layout .content-layer main.UmbraPage {
  display: flex;
  justify-content: center;
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
  transition: opacity var(--time-2);
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
    transition: background-color var(--time-4), color var(--time-4), border-color var(--time-4), transform var(--time-4);
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
  transition: background-color var(--time-4);
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
  padding-right: var(--space-3);
  padding-top: 0px;
}

.underbar .content {
  grid-area: content;
  background-color: var(--accent-100);
  border-radius: var(--radius);
}
</style>
