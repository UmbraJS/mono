<script setup lang="ts">
import '@nobel/core/styles/main.scss'
import { umbra } from '@umbrajs/core'
import type { Accent } from '@umbrajs/core'

const warningAccent: Accent = {
  name: 'warning',
  color: '#ff0000'
}

const successAccent: Accent = {
  name: 'success',
  color: '#00ff00'
}

const theme = umbra({
  background: '#ffffff',
  foreground: '#000000',
  accents: ['#8888ff', warningAccent, successAccent]
})
</script>

<template>
  <div>
    <NuxtPage />
  </div>
</template>

<style>
header {
  display: flex;
  flex-direction: column;
  align-items: center;
}

nav {
  display: flex;
  gap: var(--space-3);
  justify-content: center;
  margin-bottom: var(--space-3);
}

nav a {
  text-decoration: none;
  color: var(--base-120);
}

nav a:hover {
  color: var(--accent-50);
}

nav a.router-link-active {
  color: var(--accent-60);
}

body {
  background: var(--base);
  padding: var(--space-1);
  height: 100%;
}

#app {
  height: 100%;
}

main {
  height: 100%;
  display: flex;
  justify-content: center;
}
</style>
