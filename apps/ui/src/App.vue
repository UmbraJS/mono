<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Button, ButtonGroup } from 'umbraco'
import TextScreen from './components/TextScreen.vue'
import { umbra } from '@umbrajs/core'
import { Icon } from '@iconify/vue'
import type { Accent } from '@umbrajs/core'
import 'umbraco/styles/main.scss'

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

// Apply theme after component is mounted
onMounted(() => {
  try {
    inversed.value ? theme.inverse().apply() : theme.apply()
  } catch (error) {
    console.error('Theme application error:', error)
  }
})

function toggleTheme() {
  try {
    inversed.value ? theme.apply() : theme.inverse().apply()
    inversed.value = !inversed.value
  } catch (error) {
    console.error('Theme toggle error:', error)
  }
}
</script>

<template>
  <header>
    <TextScreen>{{ route.fullPath }}</TextScreen>
    <nav>
      <ButtonGroup>
        <RouterLink to="/" class="button buttonFocus small" activeClass="primary">
          <Icon icon="pixelarticons:home" />
        </RouterLink>

        <RouterLink to="/type" class="button buttonFocus small" activeClass="primary">
          <Icon icon="pixelarticons:card-text" />
        </RouterLink>

        <RouterLink to="/sizes" class="button buttonFocus small" activeClass="primary">
          <Icon icon="pixelarticons:viewport-wide" />
        </RouterLink>

        <RouterLink to="/ui" class="button buttonFocus small" activeClass="primary">
          <Icon icon="pixelarticons:building" />
        </RouterLink>

        <RouterLink to="/color" class="button buttonFocus small" activeClass="primary">
          <Icon icon="pixelarticons:paint-bucket" />
        </RouterLink>

        <Button variant="primary" size="small" @click="toggleTheme">
          <Icon icon="pixelarticons:paint-bucket" />
        </Button>
      </ButtonGroup>
    </nav>
  </header>
  <main data-vaul-drawer-wrapper>
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
