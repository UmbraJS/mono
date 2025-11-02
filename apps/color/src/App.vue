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
  margin-bottom: var(--space-3);
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
