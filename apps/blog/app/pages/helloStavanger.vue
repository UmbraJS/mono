<script setup lang="ts">
import { ref } from 'vue';
import { onKeyStroke, useRefHistory } from '@vueuse/core';
import RoundedTokens from '../components/halloSlides/RoundedTokens.vue';
import Trinity from '../components/halloSlides/Trinity.vue';
import Eden from '../components/halloSlides/Eden.vue';
import Intro from '../components/halloSlides/Intro.vue';
import LiveEmojiPanel from '../components/Chat/LiveEmojiPanel.vue';
import ThatsTheWebFolks from '../components/halloSlides/ThatsTheWebFolks.vue';
import PersonalSpaceTokens from '../components/halloSlides/PersonalSpaceTokens.vue';
import SpaceTokens from '../components/halloSlides/SpaceTokens.vue';
import NotesBetweenNotes from '../components/halloSlides/NotesBetweenNotes.vue';

const pages = [
  { name: "act1", slides: 20 },
  { name: "act2", slides: 8 },
  { name: "act3", slides: 5 },
]

const act = ref(1)
const slide = ref(1);

const slidesInThisAct = computed(() => {
  return pages[act.value - 1]?.slides || 1;
})

const slideHistory = useRefHistory(slide);

const lastSlide = computed(() => {
  return slideHistory.history.value[slideHistory.history.value.length - 2] || 1;
});

onKeyStroke('ArrowRight', () => {
  slide.value++;
  if (slide.value > slidesInThisAct.value) {
    slide.value = slidesInThisAct.value;
    act.value++;
  }
  if (act.value > pages.length) act.value = pages.length;
});

onKeyStroke('ArrowLeft', () => {
  if (slide.value === 1 && act.value === 1) return;
  slide.value--;
  if (slide.value < 1) {
    act.value--;
    slide.value = pages[act.value - 1]?.slides || 1;
  }
});
</script>

<template>
  <Intro v-if="slide === 1" />
  <RoundedTokens v-if="slide === 2" class="SamSlide" />
  <Trinity v-if="slide === 3" class="SamSlide" />
  <Eden v-if="slide >= 4 && slide <= 11" class="SamSlide" :stage="slide - 3" />
  <ThatsTheWebFolks v-if="slide === 12" class="SamSlide" />
  <PersonalSpaceTokens v-if="slide === 13" class="SamSlide" />
  <SpaceTokens v-if="slide === 14" class="SamSlide" />
  <NotesBetweenNotes v-if="slide === 15" class="SamSlide" />

  <div class="SlidePage">
    <p>{{ act }} / {{ pages.length }}</p>
    <p class="display">
      {{ slide }} / {{ slidesInThisAct }}
    </p>
  </div>

  <!-- <div class="EmojiPanel">
    <LiveEmojiPanel />
  </div> -->
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
  bottom: var(--space-7);
  right: var(--space-3);
}

.EmojiPanel {
  position: fixed;
  bottom: var(--space-3);
  left: var(--space-3);
  width: 300px;
  z-index: 100;
}
</style>
