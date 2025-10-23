<script setup lang="ts">
import Tailwind from "../../../public/tailwind.png";
</script>

<template>
  <div class="RadixColors">
    <iframe src="https://tailwindcss.com/docs/colors" frameborder="0"></iframe>
    <Img :src="Tailwind" width="200" height="200" />
    <!-- loading icon -->
    <!-- <Icon name="loading" /> -->
  </div>
</template>

<style>
iframe {
  position: absolute;
  z-index: 1;
  width: 70vw;
  height: 70vh;
  border: none;
}

.RadixColors img {
  position: absolute;
  width: 70vw;
  height: 70vh;
  background-color: var(--base-20);
}
</style>
