<script setup lang="ts">
import '@nobel/core/styles/main.scss'
import { Button, ButtonGroup, IconHome, IconWidth, IconPaint, IconText } from '@nobel/core'

const theme = useUmbra()
</script>

<template>
  <nav id="island-menu" class="inverted-theme">
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

      <Button variant="primary" size="small" @click="theme.inverse()">
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
