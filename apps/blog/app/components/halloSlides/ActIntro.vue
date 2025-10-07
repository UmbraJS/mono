<script setup lang="ts">
import { gsap } from 'gsap';
import { onMounted, useTemplateRef } from 'vue';

defineProps<{
  title: string;
}>();

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
    <div class="IntroTextWrapper">
      <h3>{{ title }}</h3>
      <div class="IntroText">
        <div ref="revealBox" class="RevealBox"></div>
        <div ref="introText">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.IntroTextWrapper {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

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
