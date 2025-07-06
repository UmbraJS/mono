<script setup lang="ts">
defineProps<{
  src: string
  visible: boolean
}>()
</script>

<template>
  <div id="Underlay" class="border" :class="{ hovered: visible }">
    <NuxtImg :src="src" alt="Shop Keeper" width="1536" height="1024" fit="contain" />
  </div>
</template>

<style>
#Underlay {
  position: absolute;
  z-index: -1;

  top: 0;
  height: 100%;
  width: 100%;

  background: var(--base-20);
  border-radius: var(--radius);
  overflow: hidden;
  grid-column: 1 / -1;
}

#Underlay img {
  object-fit: cover;
  object-fit: top;
  width: 100%;
}

#Underlay {
  z-index: -2;
  /* clip-path: polygon(100% 0, 100% 0, 100% 0, 0 100%); */
  /* transition: clip-path 0.5s ease-in-out; */
  opacity: 0;
  transition: var(--time);
}

#Underlay.hovered {
  z-index: -1;
  opacity: 1;
  /* animation: slideIn 0.2s ease-in-out forwards; */
  /* clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); */
}

/*
@keyframes slideIn {
  0% {
    clip-path: polygon(100% 0, 100% 0, 100% 0, 0 100%);
  }

  40% {
    clip-path: polygon(80% 0, 100% 0, 100% 23%, 0 100%);
  }

  50% {
    clip-path: polygon(80% 0, 100% 0, 100% 23%, 0 100%);
  }

  100% {
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
  }
} */
</style>
