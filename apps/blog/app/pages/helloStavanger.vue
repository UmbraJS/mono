<script setup lang="ts">
import { ref } from 'vue';
import { onKeyStroke } from '@vueuse/core';
import RoundedTokens from '../components/halloSlides/RoundedTokens.vue';

const slide = ref(1);

onKeyStroke('ArrowRight', () => {
  console.log('right');
  slide.value++;
});

onKeyStroke('ArrowLeft', () => {
  console.log('left');
  slide.value--;
});


</script>

<template>
  <div v-if="slide === 1" class="SamSlide">
    <p class="display">
      A design <span>system</span> isn’t UI components.
      It isn’t dark mode <br /> or rounded corners.
      It’s the <span>rules</span> that make <br /> those decisions possible.
    </p>
  </div>

  <RoundedTokens v-if="slide === 2" class="SamSlide" />
</template>

<style scoped>
.SamSlide {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
