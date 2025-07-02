<script setup lang="ts">
import { DrawerContent, DrawerOverlay, DrawerPortal, DrawerRoot, DrawerTrigger, DrawerDescription, DrawerTitle } from 'vaul-vue'

defineProps<{
  title?: string
  description?: string
}>()
</script>

<template>
  <DrawerRoot :preventScrollRestoration="true" :shouldScaleBackground="true">
    <DrawerTrigger id="DrawerTrigger">
      <slot name="trigger" />
    </DrawerTrigger>
    <DrawerPortal>
      <DrawerOverlay id="DrawerOverlay" />
      <DrawerContent id="DrawerContent" class="border" aria-describedby="drawer-content-description"
        aria-labelledby="drawer-title" role="dialog" tabindex="-1">
        <DrawerTitle id="drawer-title">
          Drawer Title
        </DrawerTitle>
        <DrawerDescription id="drawer-content-description">
          description
        </DrawerDescription>
        <div class="handle"></div>
        <slot name="content" />
      </DrawerContent>
    </DrawerPortal>
  </DrawerRoot>
</template>

<style>
#DrawerContent {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  z-index: 51000;
  width: 100vw;
  height: 30vh;
  background-color: var(--base);
  border-radius: var(--radius) var(--radius) 0 0;
  padding: var(--space-4);
  padding-top: var(--space-2);
}

#DrawerContent:focus {
  outline: 2px solid var(--accent-100);
  outline-offset: -2px;
}

#DrawerContent .handle {
  background-color: var(--base-30);
  width: 100px;
  height: 10px;
  border-radius: var(--radius);
  cursor: grab;
  margin-bottom: var(--space-2);
}

#DrawerContent .handle:active {
  cursor: grabbing;
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
  opacity: 0;
  transition: opacity 0.5s cubic-bezier(0.32, 0.72, 0, 1);
}

#DrawerOverlay[data-state="open"] {
  opacity: 1;
}

#DrawerOverlay[data-state="closed"] {
  opacity: 0;
}
</style>
