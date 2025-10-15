<script setup lang="ts">
import { gsap } from 'gsap';
import { onMounted } from 'vue';

defineProps<{
  title: string;
  conclusion: {
    text: string;
    author: string;
  }[];
}>();

function revealQuote(revealBox: HTMLElement, introText: HTMLElement) {
  const tl = gsap.timeline();

  tl.fromTo(
    revealBox,
    {
      scaleX: 0,
      transformOrigin: "left",
    },
    {
      scaleX: 1,
      duration: 0.3,
    }
  );

  tl.fromTo(
    introText,
    {
      opacity: 0,
    },
    {
      opacity: 1,
      duration: 0.1,
    },
    "-=0.1"
  );

  tl.fromTo(
    revealBox,
    {
      scaleX: 1,
      transformOrigin: "right",
    },
    {
      scaleX: 0,
      duration: 0.3,
    },
  );

  return tl;
}


onMounted(() => {
  const tl = gsap.timeline();

  const revealBoxes = document.querySelectorAll('.RevealBox');
  const introTexts = document.querySelectorAll('.IntroText');

  revealBoxes.forEach((box, index) => {
    const text = introTexts[index] as HTMLElement;
    if (box instanceof HTMLElement && text) {
      tl.add(revealQuote(box, text), index > 0 ? "-=0.3" : 0);
    }
  });
});
</script>

<template>
  <div class="SamSlide">
    <div class="ActConclusions">

      <div class="MetaBox">
        <p class="display"><span>{{ title }}</span></p>
      </div>

      <div v-for="(item, index) in conclusion" :key="index" class="IntroText">
        <div ref="revealBox" class="RevealBox"></div>
        <p ref="introText" class="display">
          {{ item.text }}
          <span>- {{ item.author }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<style>
.IntroText {
  position: relative;
}

.MetaBox {
  color: var(--base-120);
}

.ActConclusions {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.IntroText .RevealBox {
  position: absolute;
  z-index: 1;
  background: var(--base-120);
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
}
</style>
