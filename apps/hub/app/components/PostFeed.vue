<script setup lang="ts"></script>

<template>
  <div class="feed">
    <div v-for="i in 10" :key="i" class="card">
      <p>some text</p>
    </div>
  </div>
</template>

<style lang="scss">
.feed {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-4);
  width: 100%;
  @media screen and (max-width: 1300px) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.card {
  display: grid;
  justify-content: center;
  grid-column: span 2;
  padding: var(--space-4);
  background: var(--base-10);
  border-radius: var(--radius);
}
</style>
