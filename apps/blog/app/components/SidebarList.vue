<script setup lang="ts">
const props = defineProps<{
  title: string
  count?: number | null
}>()
</script>

<template>
  <section class="sidebar-list border">
    <div class="sidebar-list-header">
      <h3 class="caption">{{ props.title }}<span v-if="props.count !== undefined && props.count !== null"> ({{
        props.count }})</span></h3>
    </div>
    <div class="sidebar-list-items">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.sidebar-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  padding: var(--space-1);
  padding-bottom: var(--space-2);
  border-color: var(--base-30);
  height: min-content;
  background-color: var(--base);
  border-radius: var(--radius);
}

.sidebar-list-header {
  display: flex;
  padding: var(--space-1);
  border-radius: var(--radius);
}

.sidebar-list-items {
  display: grid;
  gap: var(--space-1);
}
</style>
