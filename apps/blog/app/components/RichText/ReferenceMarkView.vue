<script setup lang="ts">
import type { MarkViewProps } from '@tiptap/core'
import { MarkViewContent } from '@tiptap/vue-3'

// Define props using the MarkViewProps interface from Tiptap
defineProps<MarkViewProps>()
</script>

<template>
  <a className="ProseContent" data-test-id="mark-view" contenteditable="false"
    href="https://community.vercel.com/t/build-completes-successfully-but-deployment-never-starts/27085">
    <MarkViewContent />
    <Icon class="ReferenceLinkIcon" name="carbon:link" />
  </a>
</template>

<style>
/* Unscoped so SSR fallback has correct styling */
.ProseContent {
  color: var(--base-text);
  position: relative;
  z-index: 1;
}

.ProseContent::after {
  content: '';
  background-color: var(--base-20);
  border-radius: var(--radius);
  --padding: var(--space-quark);
  width: calc(100% + var(--padding) * 2);
  height: calc(100% + var(--padding));
  position: absolute;
  top: calc(0px - var(--padding) / 2);
  left: calc(0px - var(--padding));
  z-index: -1;
  outline: 1px solid var(--base-80);
}

.ReferenceLinkIcon {
  margin-left: var(--space-1);
  vertical-align: middle;
}

/* Add emoji icon via CSS for SSR (before Vue component loads) */
.ProseContent[data-icon]::after {
  content: attr(data-icon);
  margin-left: var(--space-1);
  vertical-align: middle;
}

/* Hide CSS icon when Vue component renders the Icon */
.ProseContent:has(.ReferenceLinkIcon)::after {
  display: none;
}
</style>
