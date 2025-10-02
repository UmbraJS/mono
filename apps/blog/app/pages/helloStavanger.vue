<script setup lang="ts">
import { ref } from 'vue';
import { onKeyStroke, useRefHistory } from '@vueuse/core';
import RoundedTokens from '../components/halloSlides/RoundedTokens.vue';
import Trinity from '../components/halloSlides/Trinity.vue';
import Eden from '../components/halloSlides/Eden.vue';
import Intro from '../components/halloSlides/Intro.vue';

const slide = ref(1);
const totalSlides = 10;

const slideHistory = useRefHistory(slide);

const lastSlide = computed(() => {
  return slideHistory.history.value[slideHistory.history.value.length - 2] || 1;
});

onKeyStroke('ArrowRight', () => {
  slide.value++;
});

onKeyStroke('ArrowLeft', () => {
  slide.value--;
});
</script>

<template>
  <Intro v-if="slide === 1" />
  <RoundedTokens v-if="slide === 2" class="SamSlide" />
  <Trinity v-if="slide === 3" class="SamSlide" />
  <Eden v-if="slide >= 4" class="SamSlide" :stage="slide - 3" />

  <div class="SlidePage">
    <h1 class="display">
      {{ slide }} / {{ totalSlides }}
    </h1>
  </div>
</template>

<style>
.SamSlide {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.SlidePage {
  position: absolute;
  bottom: var(--space-3);
  right: var(--space-3);
}
</style>
