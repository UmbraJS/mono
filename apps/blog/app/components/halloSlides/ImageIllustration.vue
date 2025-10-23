<script setup lang="ts">
defineProps<{
  url: string
  title?: string
}>();
</script>

<template>
  <div class="Gallery">
    <h2 v-if="title" class="Author">{{ title }}</h2>
    <div class="GalleryGrid">
      <div class="GalleryItem">
        <img :src="url" :alt="`Image by him`" />
      </div>
    </div>
  </div>
</template>

<style>
.Gallery {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--space-5);
}

.GalleryGrid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-5);
  width: 100%;
  max-width: 1200px;
}

.GalleryItem {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.GalleryItem img {
  max-height: 80vh;
  object-fit: cover;
}

.GalleryItem:hover {
  transform: scale(1.05);
}

.Author {
  background-color: var(--base);
  color: var(--base-text);
}
</style>
