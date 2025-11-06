<script setup lang="ts">
import { Drawer, Button } from 'umbraco'

defineProps<{
  title: string
  description: string
  icon: string
}>()
</script>

<template>
  <Drawer :title="title" :description="description">
    <template #trigger>
      <Button class="CitationIcon" size="small" variant="base" :aria-label="title" :title="title">
        <Icon :name="icon" />
      </Button>
    </template>
    <template #content>
      <slot></slot>
    </template>
  </Drawer>
</template>

<style>
.CitationIcon {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--base);
  border-color: transparent;
  color: var(--base-120);
  padding: var(--space-1);
  border-radius: var(--radius);
}

.CitationIcon:hover {
  background-color: var(--base-50);
  color: var(--base-120);
}
</style>
