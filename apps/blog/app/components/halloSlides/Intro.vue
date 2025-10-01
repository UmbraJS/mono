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
      <p ref="introText" class="display">
        A design <span>system</span> isn't UI components. It isn't dark mode <br /> or rounded corners. It's the
        underlying <span>rules</span> that make <br /> those decisions possible.
      </p>
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
