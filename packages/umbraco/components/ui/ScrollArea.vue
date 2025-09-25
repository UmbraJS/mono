<script setup>
import {
  ScrollAreaRoot,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
  // ScrollAreaCorner,
} from 'reka-ui'

defineOptions({
  inheritAttrs: false,
})

const scrollArea = useTemplateRef('scrollArea')
const scrollAreaContainer = useTemplateRef('scrollAreaContainer')
const dummyParent = useTemplateRef('dummyParent')

const scrollAreaHeight = ref('400px') // Default fallback

function scrollToBottom() {
  const viewport = scrollArea.value?.viewport
  const containerHeight = scrollAreaContainer.value?.clientHeight || 0
  if (viewport) {
    viewport.scrollTo({
      top: containerHeight,
      behavior: 'smooth'
    })
  }
}

function updateScrollAreaHeight() {
  if (dummyParent.value) {
    const parentHeight = dummyParent.value.clientHeight
    if (parentHeight > 0) {
      scrollAreaHeight.value = `${parentHeight}px`
    }
  }
}

// Update height on mount and window resize
onMounted(() => {
  updateScrollAreaHeight()

  // Use ResizeObserver for more accurate parent size changes
  if (dummyParent.value) {
    const resizeObserver = new ResizeObserver(() => {
      updateScrollAreaHeight()
    })
    resizeObserver.observe(dummyParent.value)

    // Cleanup on unmount
    onUnmounted(() => {
      resizeObserver.disconnect()
    })
  }

  // Fallback to window resize listener
  window.addEventListener('resize', updateScrollAreaHeight)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateScrollAreaHeight)
})

defineExpose({
  scrollToBottom
})
</script>

<template>
  <div class="DummyParent" ref="dummyParent">
    <ScrollAreaRoot class="ScrollAreaRoot" type="auto" ref="scrollArea" :style="{ height: scrollAreaHeight }">
      <ScrollAreaViewport ref="scrollAreaViewport" class="ScrollAreaViewport" v-bind="$attrs">
        <div class="ScrollAreaContainer" ref="scrollAreaContainer">
          <slot />
        </div>
      </ScrollAreaViewport>
      <!-- <ScrollAreaScrollbar class="ScrollAreaScrollbar" orientation="horizontal">
      <ScrollAreaThumb class="ScrollAreaThumb" />
    </ScrollAreaScrollbar> -->
      <ScrollAreaScrollbar class="ScrollAreaScrollbar" orientation="vertical">
        <ScrollAreaThumb class="ScrollAreaThumb" />
      </ScrollAreaScrollbar>
      <!-- <ScrollAreaCorner /> -->
    </ScrollAreaRoot>
  </div>
</template>

<style>
.DummyParent {
  width: 100%;
  height: 100%;
}

.ScrollAreaRoot {
  overflow: hidden;
  width: 100%;
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
