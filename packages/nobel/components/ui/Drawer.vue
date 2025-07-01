<script setup lang="ts">
import { DrawerContent, DrawerOverlay, DrawerPortal, DrawerRoot, DrawerTrigger } from 'vaul-vue'
</script>

<template>
  <DrawerRoot id="DrawerRoot">
    <DrawerTrigger id="DrawerTrigger">
      <slot name="trigger" />
    </DrawerTrigger>
    <DrawerPortal>
      <DrawerOverlay id="DrawerOverlay" />
      <DrawerContent id="DrawerContent" class="border" aria-describedby="drawer-content-description">
        <div class="handle"></div>
        <slot name="content" />
      </DrawerContent>
    </DrawerPortal>
  </DrawerRoot>
</template>

<style>
#DrawerContent {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  gap: var(--space-2);
  z-index: 51000;
  width: 100vw;
  height: 30vh;
  background-color: var(--base);
  border-radius: var(--radius);
  padding: var(--space-4);
  padding-top: var(--space-2);
}

#DrawerContent .handle {
  background-color: var(--base-30);
  width: 100px;
  height: 10px;
  border-radius: var(--radius);
}

#DrawerOverlay {
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 50000;
  backdrop-filter: blur(5px);
}
</style>
