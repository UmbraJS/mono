<script setup lang="ts">

const images = [
  { author: "Dan Scott", url: "https://drawpaintacademy.com/wp-content/uploads/2022/11/Dan-Scott-New-Zealand-Foggy-Mountains-2020.jpg" },
  { author: "Peder Severin Krøyer", url: "https://drawpaintacademy.com/wp-content/uploads/2022/11/Peder-Severin-Kroyer-Self-Portrait-Sitting-by-His-Easel-at-Skagen-Beach-1902.jpg" },
  { author: "Thomas Cole", url: "https://drawpaintacademy.com/wp-content/uploads/2019/02/Thomas-Cole-The-Oxbow-1836.jpg" }
]
</script>

<template>
  <div class="Gallery">
    <div class="GalleryGrid">
      <div v-for="(image, index) in images" :key="index" class="GalleryItem">
        <img :src="image.url" :alt="`Image by ${image.author}`" />
        <p class="Author">Painting by {{ image.author }}</p>
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

.GalleryItem:hover {
  transform: scale(1.05);
}

.Author {
  background-color: var(--base);
  color: var(--base-text);
}
</style>
