<script setup lang="ts">
import { gsap } from 'gsap';
import { onMounted, useTemplateRef } from 'vue';

const revealBox = useTemplateRef<HTMLElement[]>("revealBox");
const introText = useTemplateRef<HTMLElement[]>("introText");

onMounted(() => {
  const tl = gsap.timeline();

  tl.fromTo(
    revealBox.value,
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
    introText.value,
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
    revealBox.value,
    {
      scaleX: 1,
      transformOrigin: "right",
    },
    {
      scaleX: 0,
      duration: 0.3,
    }
  );
});
</script>

<template>
  <div class="SamSlide">
    <div class="IntroText">
      <div ref="revealBox" class="RevealBox"></div>
      <blockquote ref="introText" class="display">
        "The music is not in the notes,
        but in the silence between."
        <br />
        <span>- Wolfgang Amadeus Mozart</span>
      </blockquote>
    </div>
  </div>
</template>

<style>
.IntroText {
  position: relative;
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
