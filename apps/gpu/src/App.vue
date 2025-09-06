<script setup lang="ts">
import { RouterView, RouterLink } from 'vue-router'
</script>

<template>
  <header>
    <nav>
      <RouterLink to="/conway" activeClass="active">Conway</RouterLink>
      <RouterLink to="/" activeClass="active">Moonbow</RouterLink>
      <RouterLink to="/planks" activeClass="active">Planks</RouterLink>
      <RouterLink to="/gradient" activeClass="active">Gradient</RouterLink>
      <RouterLink to="/marbles" activeClass="active">Marbles</RouterLink>
      <RouterLink to="/bomber" activeClass="active">Bomber</RouterLink>
      <RouterLink to="/impact" activeClass="active">Impact</RouterLink>
      <RouterLink to="/earth" activeClass="active">Earth</RouterLink>
      <RouterLink to="/postprocess" activeClass="active">PostProcess</RouterLink>
    </nav>
  </header>
  <RouterView />
</template>

<style scoped>
a {
  font-weight: 500;
  color: #646cff;
  text-decoration: inherit;
}

a:hover {
  color: #535bf2;
}

header {
  position: absolute;
  background-color: #242424;
  z-index: 10;
  top: 0px;
  left: 0px;
  width: 100vw;
}

nav {
  display: flex;
  gap: 1em;
  padding: 1em 2em;
  margin: 0;
}

a {
  color: #ffffff;
  text-decoration: none;
  opacity: 0.5;
}

a:hover {
  opacity: 1;
  color: #ffae00;
}

a:active {
  color: #00b3ff;
}

a.active {
  opacity: 1;
}
</style>
