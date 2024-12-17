<script setup lang="ts">
import { Button, ButtonGroup, IconHome, IconWidth, IconPaint, IconText } from '@nobel/core'

import '@nobel/core/styles/main.scss'
import { ref } from 'vue'
import { umbra } from '@umbrajs/core'
import type { Accent } from '@umbrajs/core'

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
  background: '#f3f6ea',
  foreground: '#16121f',
  accents: ['#8888ff', warningAccent, successAccent],
})

function applyTheme() {
  if (inversed.value) {
    theme.inverse().apply()
  } else {
    theme.apply()
  }
}

applyTheme()

function toggleTheme() {
  applyTheme()
  inversed.value = !inversed.value
}
</script>

<template>
  <nav id="island-menu">
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

      <Button variant="primary" size="small" @click="toggleTheme">
        <IconPaint />
      </Button>
    </ButtonGroup>
  </nav>
</template>

<style scoped>
#island-menu {
  z-index: 1000;
  position: fixed;
  height: var(--block-big);
  width: min-content;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--space-quark);
  padding: 0 var(--space-quark);

  border-radius: var(--radius);
  background-color: var(--base-10);
  border: solid var(--border-size) var(--base-50);
  border-radius: var(--radius);

  bottom: var(--space-1);
  margin: auto;
  left: 0;
  right: 0;
}
</style>
