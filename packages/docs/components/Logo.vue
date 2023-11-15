<script lang="ts" setup></script>

<template>
  <svg id="logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250.04 244.17">
    <circle class="main-circle" cx="122.08" cy="122.08" r="109.08" />
    <circle class="moon-circle" cx="203.31" cy="52.19" r="46.72" />
  </svg>
</template>

<style scoped>
#logo .main-circle {
  fill: none;
  stroke: var(--foreground);
  stroke-miterlimit: 2;
  stroke-width: 26px;
}

#logo .moon-circle {
  fill: var(--foreground);
  stroke-width: 0px;
}
</style>
