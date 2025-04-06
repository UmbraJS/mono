<script setup>
import {
  ScrollAreaRoot,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
  ScrollAreaCorner,
} from 'reka-ui'
</script>

<template>
  <ScrollAreaRoot class="ScrollAreaRoot" type="auto">
    <ScrollAreaViewport class="ScrollAreaViewport">
      <slot />
    </ScrollAreaViewport>
    <!-- <ScrollAreaScrollbar class="ScrollAreaScrollbar" orientation="horizontal">
      <ScrollAreaThumb class="ScrollAreaThumb" />
    </ScrollAreaScrollbar> -->
    <ScrollAreaScrollbar class="ScrollAreaScrollbar" orientation="vertical">
      <ScrollAreaThumb class="ScrollAreaThumb" />
    </ScrollAreaScrollbar>
    <!-- <ScrollAreaCorner /> -->
  </ScrollAreaRoot>
</template>

<style>
.ScrollAreaRoot {
  height: 225px;
  overflow: hidden;
  --scrollbar-size: 10px;
}

.ScrollAreaViewport {
  width: 100%;
  height: 100%;
  border-radius: inherit;
}

.ScrollAreaScrollbar {
  display: flex;
  /* ensures no selection */
  user-select: none;
  /* disable browser handling of all panning and zooming gestures on touch devices */
  touch-action: none;
  padding: 2px;
  background-color: var(--base-20);
}
.ScrollAreaScrollbar:hover {
  background-color: var(--base-40);
}

.ScrollAreaScrollbar[data-orientation='vertical'] {
  width: var(--scrollbar-size);
}

.ScrollAreaScrollbar[data-orientation='horizontal'] {
  flex-direction: column;
  height: var(--scrollbar-size);
}

.ScrollAreaThumb {
  flex: 1;
  background: var(--base-120);
  border-radius: var(--radius);
  position: relative;
}

/* increase target size for touch devices https://www.w3.org/WAI/WCAG21/Understanding/target-size.html */
.ScrollAreaThumb::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  min-width: 44px;
  min-height: 44px;
}

.ScrollAreaCorner {
  background: var(--base-20);
}
</style>
