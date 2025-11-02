<script setup lang="ts">
import { useRoute } from "vue-router";
import { Button } from "umbraco";
import { Icon } from "@iconify/vue";
import "umbraco/styles/_index.css";
import "umbraco/dist/umbraco.css";
import { useUmbra } from "./stores/useUmbra";

const route = useRoute();
const umbraStore = useUmbra();

// Initialize the theme
umbraStore.apply();

async function toggleTheme() {
  await umbraStore.inverse();
}
</script>

<template>
  <header>
    <h1>Umbra Color Testing</h1>
    <nav>
      <div class="nav-links">
        <RouterLink to="/" class="nav-link" activeClass="active">
          <Icon icon="pixelarticons:art-text" />
          Ranges
        </RouterLink>
        <RouterLink to="/editor" class="nav-link" activeClass="active">
          <Icon icon="pixelarticons:sliders" />
          Editor
        </RouterLink>
        <RouterLink to="/themes" class="nav-link" activeClass="active">
          <Icon icon="pixelarticons:paint-bucket" />
          Themes
        </RouterLink>
        <RouterLink to="/element" class="nav-link" activeClass="active">
          <Icon icon="pixelarticons:code" />
          Element
        </RouterLink>
      </div>
      <Button variant="primary" size="small" @click="toggleTheme"
        :class="umbraStore.isDark ? 'base-accent' : 'base-accent'">
        <Icon v-if="umbraStore.isDark" icon="pixelarticons:moon" />
        <Icon v-else icon="pixelarticons:sun" />
      </Button>
    </nav>
  </header>
  <main data-vaul-drawer-wrapper>
    <router-view :key="route.path"></router-view>
  </main>
</template>

<style scoped lang="scss">
header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-4);
}

h1 {
  margin: 0 0 var(--space-3) 0;
  color: var(--base-text);
}

nav {
  display: flex;
  gap: var(--space-3);
  justify-content: center;
  align-items: center;
  margin-bottom: var(--space-3);
}

.nav-links {
  display: flex;
  gap: var(--space-2);
  padding: var(--space-1);
  background: var(--base-10);
  border-radius: var(--radius-2);
  border: 1px solid var(--base-20);
}

.nav-link {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-2) var(--space-3);
  text-decoration: none;
  color: var(--base-text);
  border-radius: var(--radius-2);
  font-size: var(--font-size-2);
  font-weight: 500;
  transition: all 0.2s ease;
}

.nav-link:hover {
  background: var(--base-20);
  color: var(--base-text);
}

.nav-link.active {
  background: var(--accent-90);
  color: var(--accent-10);
}

body {
  background: var(--base);
  padding: 0;
  margin: 0;
  height: 100vh;
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
