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
    <div class="content-layer">
      <div class="vignet" @click="toggleReveal" />
      <main class="page">
        <slot />
      </main>
    </div>
    <div class="underbar">
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

  transform: translateY(0px) translateX(0px);
  transition: var(--slow);
}

.layout .content-layer main.page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  place-items: center;

  width: 80dvw;
  max-width: 1900px;
  gap: var(--space-4);

  min-height: 100vh;
  padding-bottom: var(--space-5);
  background-color: var(--base-20);

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
</style>
