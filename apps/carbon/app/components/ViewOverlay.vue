<script setup lang="ts">
defineProps<{
  hidden: boolean;
  stackLayer: 'top' | 'bottom';
}>();
</script>

<template>
  <div id="ViewOverlay" class="clipPath" :class="{ hidden }" :style="{
    'z-index': stackLayer === 'top' ? 99 : 98,
  }">
    <slot />
  </div>
</template>

<style>
#ViewOverlay {
  position: absolute;
  top: 0;
  height: 100%;
  width: 100%;
}

#ViewOverlay {
  clip-path: circle(100% at 50% 100%);
  transition: var(--time-4);
}

#ViewOverlay.hidden {
  overflow: hidden;
  clip-path: circle(0% at 50% 100%);
}
</style>
