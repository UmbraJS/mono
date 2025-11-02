<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { Button } from "umbraco";
import { umbra } from "@umbrajs/core";
import { Icon } from "@iconify/vue";
import type { Accent } from "@umbrajs/core";
import "umbraco/styles/_index.css";
import "umbraco/dist/umbraco.css";

const route = useRoute();

const inversed = ref(true);

const warningAccent: Accent = {
  name: "warning",
  color: "red",
};

const successAccent: Accent = {
  name: "success",
  color: "green",
};

const theme = umbra({
  background: "#ffffff",
  foreground: "#000000",
  accents: ["#8888ff", warningAccent, successAccent],
});

async function toggleTheme() {
  try {
    await (inversed.value ? theme.apply() : theme.inverse().apply());
    inversed.value = !inversed.value;
  } catch (error) {
    console.error("Theme toggle error:", error);
  }
}
</script>

<template>
  <header>
    <h1>Umbra Color Testing</h1>
    <nav>
      <div class="nav-links">
        <RouterLink to="/" class="nav-link" activeClass="active">
          <Icon icon="pixelarticons:color-palette" />
          Ranges
        </RouterLink>
        <RouterLink to="/editor" class="nav-link" activeClass="active">
          <Icon icon="pixelarticons:sliders" />
          Editor
        </RouterLink>
        <RouterLink to="/themes" class="nav-link" activeClass="active">
          <Icon icon="pixelarticons:layers" />
          Themes
        </RouterLink>
        <RouterLink to="/element" class="nav-link" activeClass="active">
          <Icon icon="pixelarticons:code" />
          Element
        </RouterLink>
      </div>
      <Button variant="primary" size="small" @click="toggleTheme">
        <Icon icon="pixelarticons:paint-bucket" />
        Toggle Theme
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
  color: var(--base-80);
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
  background: var(--accent-20);
  color: var(--accent-text);
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
