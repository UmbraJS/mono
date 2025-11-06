<script>
import { NodeViewContent, nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'

export default {
  props: nodeViewProps,
  components: {
    NodeViewWrapper,
    NodeViewContent,
  },
}
</script>

<template>
  <NodeViewWrapper class="draggable-item">
    <span class="reference">
      <NodeViewContent class="content" />
      <span>[{{ id }}]</span>
    </span>
  </NodeViewWrapper>
</template>

<style>
span.reference {
  display: inline-block;
  background-color: var(--base-20);
  border-radius: var(--radius);
  padding: 0px var(--space-quark);
  outline: solid var(--border-size) var(--base-40);
  font-variation-settings: var(--font-regular);
}

span.reference span {
  font-size: var(--font-size-1);
  color: var(--base-60);
  font-variation-settings: var(--font-regular);
  border-left: solid var(--border-size) var(--base-60);
  padding-left: var(--space-quark);
  margin-left: var(--space-quark);
}
</style>
