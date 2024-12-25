<script setup lang="ts"></script>

<template>
  <div class="premises">
    <slot />
  </div>
</template>

<style>
.argument .premises {
  display: grid;
  gap: var(--space-1);
  grid-template-columns: auto 1fr;
}
</style>
