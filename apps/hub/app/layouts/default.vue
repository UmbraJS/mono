<script setup lang="ts">
import { onKeyStroke } from '@vueuse/core'

const classObject = reactive({
  reveal: true,
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
    <div class="content">
      <div class="vignet" @click="toggleReveal" />
      <slot />
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

<style>
.layout {
  --header-height: 60px;
  --sidebar-width: 300px;
}

.underbar {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
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

  grid-column: span 2;
  grid-area: header;
  padding: var(--space-1);
}

.layout .burger {
  position: fixed;
  right: 0;
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
  background-color: var(--base-30);
}

.layout > .content {
  position: relative;
  z-index: 1;
  transform: translateY(0px) translateX(0px);
  transition: var(--slow);
}

.layout .content .vignet {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: black;
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--slow);
}

.layout.reveal .content .vignet {
  opacity: 0.7;
  cursor: pointer;
  pointer-events: all;
}

.layout.reveal .content .vignet:hover {
  opacity: 0.3;
}

.layout.reveal > .content {
  transform: translateY(var(--header-height))
    translateX(calc(0px - var(--sidebar-width) + var(--space-2) + 1px));
}
</style>
