<script setup lang="ts">
import { onKeyStroke } from '@vueuse/core'

const classObject = reactive({
  reveal: false,
})

function toggleReveal() {
  classObject.reveal = !classObject.reveal
}

onKeyStroke('Escape', () => {
  toggleReveal()
})
</script>

<template>
  <div class="layout" :class="classObject">
    <div class="burger" @click="toggleReveal" />
    <div class="frost">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
    <div class="content-layer">
      <div class="vignet" @click="toggleReveal" />
      <main class="page">
        <slot />
      </main>
    </div>
    <div class="underbar inverted-theme">
      <header>
        <h1>title</h1>
      </header>
      <div class="content" />
      <div class="sidebar">
        <p>Some default layout content shared across all pages</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.inverted-theme {
  color: var(--base-120);
}

.layout {
  --header-height: calc(var(--h1-display-size) + var(--space-2));
  --sidebar-width: calc(100dvw / 3);
  position: relative;
  width: 100dvw;
  background: red;
}

@media (max-width: 800px) {
  .layout {
    --sidebar-width: 100dvw;
  }
}

.layout .content-layer {
  position: relative;
  z-index: 1;

  display: flex;
  flex-direction: column;
  justify-content: center;
  place-items: center;

  padding-bottom: var(--space-5);
  background-color: var(--base-20);
  border-radius: var(--radius);

  transform: translateY(0px) translateX(0px);
  transition: var(--slow);
}

.layout .content-layer main.page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  place-items: center;
  gap: var(--space-4);

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
  display: grid;
  padding: var(--space-2);
  grid-area: sidebar;
}

.underbar .content {
  grid-area: content;
  background-color: var(--base-20);
}

.layout .frost {
  --blur-contrast: 1.3;
  --blur-brightness: 0.9;

  position: fixed;
  z-index: 10;
  bottom: 0;
  left: 0;

  height: 15dvh;
  width: 100dvw;
  pointer-events: none;

  & > div,
  &::before,
  &::after {
    position: absolute;
    inset: 0;
  }
  &::before {
    content: '';
    z-index: 1;
    backdrop-filter: blur(0.5px) brightness(var(--blur-brightness)) contrast(var(--blur-contrast));
    mask: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 1) 12.5%,
      rgba(0, 0, 0, 1) 25%,
      rgba(0, 0, 0, 0) 37.5%
    );
  }
  & > div:nth-of-type(1) {
    z-index: 2;
    backdrop-filter: blur(1px) brightness(var(--blur-brightness)) contrast(var(--blur-contrast));
    mask: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) 12.5%,
      rgba(0, 0, 0, 1) 25%,
      rgba(0, 0, 0, 1) 37.5%,
      rgba(0, 0, 0, 0) 50%
    );
  }
  & > div:nth-of-type(2) {
    z-index: 3;
    backdrop-filter: blur(2px) brightness(var(--blur-brightness)) contrast(var(--blur-contrast));
    mask: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) 25%,
      rgba(0, 0, 0, 1) 37.5%,
      rgba(0, 0, 0, 1) 50%,
      rgba(0, 0, 0, 0) 62.5%
    );
  }
  & > div:nth-of-type(3) {
    z-index: 4;
    backdrop-filter: blur(4px) brightness(var(--blur-brightness)) contrast(var(--blur-contrast));
    mask: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) 37.5%,
      rgba(0, 0, 0, 1) 50%,
      rgba(0, 0, 0, 1) 62.5%,
      rgba(0, 0, 0, 0) 75%
    );
  }
  & > div:nth-of-type(4) {
    z-index: 5;
    backdrop-filter: blur(8px) brightness(var(--blur-brightness)) contrast(var(--blur-contrast));
    mask: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) 50%,
      rgba(0, 0, 0, 1) 62.5%,
      rgba(0, 0, 0, 1) 75%,
      rgba(0, 0, 0, 0) 87.5%
    );
  }
  & > div:nth-of-type(5) {
    z-index: 6;
    backdrop-filter: blur(16px) brightness(var(--blur-brightness)) contrast(var(--blur-contrast));
    mask: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) 62.5%,
      rgba(0, 0, 0, 1) 75%,
      rgba(0, 0, 0, 1) 87.5%,
      rgba(0, 0, 0, 0) 100%
    );
  }
  & > div:nth-of-type(6) {
    z-index: 7;
    backdrop-filter: blur(32px) brightness(var(--blur-brightness)) contrast(var(--blur-contrast));
    mask: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) 75%,
      rgba(0, 0, 0, 1) 87.5%,
      rgba(0, 0, 0, 1) 100%
    );
  }
  &::after {
    content: '';
    z-index: 8;
    backdrop-filter: blur(64px) brightness(var(--blur-brightness)) contrast(var(--blur-contrast));
    mask: linear-gradient(to bottom, rgba(0, 0, 0, 0) 87.5%, rgba(0, 0, 0, 1) 100%);
  }
}
</style>
