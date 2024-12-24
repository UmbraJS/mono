<script setup lang="ts">
import '@nobel/core/styles/main.scss'
import { Button, ButtonGroup, IconHome, IconWidth, IconPaint, IconText } from '@nobel/core'

const theme = useUmbra()
const hover = ref(false)
const hazeStrength = computed(() => {
  return hover.value ? '58px' : '28px'
})
</script>

<template>
  <nav
    id="island-menu"
    class="inverted-theme"
    @mouseover="hover = true"
    @mouseleave="hover = false"
  >
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
  <div class="haze island-position"></div>
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

.island-position {
  position: fixed;
  bottom: var(--space-1);
  margin: auto;
  left: 0;
  right: 0;
}

.haze {
  height: var(--block-big);
  width: 123px;
  background: var(--accent);
  box-shadow: -0px 22px 115px v-bind(hazeStrength) var(--accent);
  border-radius: var(--radius);
  z-index: 99;
  opacity: 1;
  transition: var(--slow);
  pointer-events: none;
}
</style>
