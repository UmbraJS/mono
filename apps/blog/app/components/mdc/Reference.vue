<script setup lang="ts">
</script>

<template>
  <span class="NobleReference">
    <slot mdc-unwrap="p" />
  </span>
</template>

<style>
.NobleReference {
  display: inline-block;
  border-radius: var(--radius);
  background-color: var(--base-10);
}
</style>
