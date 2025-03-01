<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { Button, ButtonGroup, IconHome, IconWidth, IconPaint, IconText, IconUI } from '@nobel/core'
import TextScreen from './components/TextScreen.vue'
import { umbra } from '@umbrajs/core'
import type { Accent } from '@umbrajs/core'
import '@nobel/core/styles/main.scss'

const route = useRoute()

const inversed = ref(true)

const warningAccent: Accent = {
  name: 'warning',
  color: '#ff0000',
}

const successAccent: Accent = {
  name: 'success',
  color: '#00ff00',
}

const theme = umbra({
  background: '#ffffff',
  foreground: '#000000',
  accents: ['#8888ff', warningAccent, successAccent],
})

inversed.value ? theme.inverse().apply() : theme.apply()

function toggleTheme() {
  inversed.value ? theme.apply() : theme.inverse().apply()
  inversed.value = !inversed.value
}
</script>

<template>
  <header>
    <TextScreen>{{ route.fullPath }}</TextScreen>
    <nav>
      <ButtonGroup>
        <RouterLink to="/" class="button buttonFocus small" activeClass="primary">
          <IconHome />
        </RouterLink>

        <RouterLink to="/type" class="button buttonFocus small" activeClass="primary">
          <IconText />
        </RouterLink>

        <RouterLink to="/sizes" class="button buttonFocus small" activeClass="primary">
          <IconWidth />
        </RouterLink>

        <RouterLink to="/ui" class="button buttonFocus small" activeClass="primary">
          <IconUI />
        </RouterLink>

        <RouterLink to="/color" class="button buttonFocus small" activeClass="primary">
          <IconPaint />
        </RouterLink>

        <Button variant="primary" size="small" @click="toggleTheme">
          <IconPaint />
        </Button>
      </ButtonGroup>
    </nav>
  </header>
  <main>
    <router-view :key="route.path"></router-view>
  </main>
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
