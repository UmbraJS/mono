<script setup lang="ts">
defineProps<{
  hidden: boolean;
}>();
</script>

<template>
  <div id="ViewOverlay" class="clipPath" :class="{ hidden }">
    <slot />
  </div>
</template>

<style>
#ViewOverlay {
  position: absolute;
  z-index: 99;
  top: 0;
  height: 100%;
  width: 100%;
}

#ViewOverlay {
  clip-path: circle(100% at 50% 100%);
  transition: var(--slower);
}

#ViewOverlay.hidden {
  overflow: hidden;
  clip-path: circle(0% at 10% 100%);
}
</style>
