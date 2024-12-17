<script setup lang="ts"></script>

<template>
  <div class="feed">
    <div>feed</div>
    <div v-for="i in 10" :key="i" class="card">
      <p>some text</p>
    </div>
  </div>
</template>

<style>
.feed {
  display: grid;
  gap: var(--space-2);
  background-color: var(--base-50);
  width: 100%;
}

.card {
  display: grid;
  justify-content: center;
  padding: var(--space-2);
  background: var(--base-10);
  border-radius: var(--radius);
}
</style>
