<script setup lang="ts">
import Radix from "../../../public/radix.png";
</script>

<template>
  <div class="RadixColors">
    <iframe src="https://www.radix-ui.com/colors" frameborder="0"></iframe>
    <Img :src="Radix" width="200" height="200" />

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
