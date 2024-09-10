<script setup lang="ts">
import { ref } from 'vue'

import IconHome from './components/Icons/IconHome.vue'
import IconWidth from './components/Icons/IconWidth.vue'
import IconPaint from './components/Icons/IconPaint.vue'
import IconText from './components/Icons/IconText.vue'
import IconUI from './components/Icons/IconUI.vue'
import Button from './components/ui/Button/Button.vue'
import ButtonGroup from './components/ui/Button/ButtonGroup.vue'
import TextScreen from './components/TextScreen.vue'

import { umbra } from '@umbrajs/core'

const inversed = ref(true)

const warningAccent = {
  name: 'warning',
  color: '#ff0000'
}

const successAccent = {
  name: 'success',
  color: '#00ff00'
}

const theme = umbra({
  background: '#ffffff',
  foreground: '#000000',
  accents: ['#8888ff', warningAccent, successAccent]
})

inversed.value ? theme.inverse().apply() : theme.apply()

function toggleTheme() {
  inversed.value ? theme.apply() : theme.inverse().apply()
  inversed.value = !inversed.value
}
</script>

<template>
  <header>
    <TextScreen>{{ $route.fullPath }}</TextScreen>
    <nav>
      <ButtonGroup>
        <RouterLink to="/" class="button focus small" activeClass="primary">
          <IconHome />
        </RouterLink>

        <RouterLink to="/type" class="button focus small" activeClass="primary">
          <IconText />
        </RouterLink>

        <RouterLink to="/sizes" class="button focus small" activeClass="primary">
          <IconWidth />
        </RouterLink>

        <RouterLink to="/ui" class="button focus small" activeClass="primary">
          <IconUI />
        </RouterLink>

        <Button variant="primary" size="small" @click="toggleTheme">
          <IconPaint />
        </Button>
      </ButtonGroup>
    </nav>
  </header>
  <main>
    <router-view :key="$route.path"></router-view>
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
