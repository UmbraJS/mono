<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue"
import { gsap } from 'gsap'

const mockPageRef = ref<HTMLElement>()
const timeline = gsap.timeline({ paused: false });

function playTimeline() {
  if (!timeline) return
  timeline.restart();
}

onMounted(() => {
  if (!mockPageRef.value) return;

  const mockCTA = mockPageRef.value.querySelector('.MockCTA');
  const mockCards = mockPageRef.value.querySelectorAll('.MockCard');
  const mockLinks = mockPageRef.value.querySelectorAll('.MockLink');
  const mockTitles = mockPageRef.value.querySelectorAll('.MockTitle');
  const mockCardsSectionTitle = mockPageRef.value.querySelector('.MockCardsSectionTitle');
  const mockDisplayTitle = mockPageRef.value.querySelector('.MockDisplayTitle');

  const animatableElements = [
    mockTitles,
    mockLinks,
    mockDisplayTitle,
    mockCardsSectionTitle,
    mockCTA,
    mockCards,
  ];

  gsap.set(animatableElements, {
    y: 20,
    opacity: 0,
    scale: 0.95
  });

  // Header animation
  timeline
    .to(mockTitles, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.6,
      stagger: 0.15,
      ease: 'back.out(1.7)'
    })
    .to(mockLinks, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.4,
      ease: 'back.out(1.7)',
      stagger: 0.1
    }, '-=0.4')

    // Body elements
    .to(mockDisplayTitle, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      ease: 'back.out(1.7)'
    }, '-=0.2')
    .to(mockCTA, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.6,
      ease: 'back.out(1.7)'
    }, '-=0.4')

    .to(mockCardsSectionTitle, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.6,
      ease: 'back.out(1.7)'
    }, '-=0.3')
    // Cards with stagger
    .to(mockCards, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.7,
      ease: 'back.out(1.7)',
      stagger: 0.15
    }, '-=0.3')
});

onUnmounted(() => timeline.kill());
</script>

<template>
  <div>
    <div ref="mockPageRef" class="MockPage border" :style="{
      '--mockBG': 'var(--base-10)',
      '--mockBGSubtle': 'var(--base-20)',
      '--mockText': 'var(--base-120)',
      '--mockImg': 'var(--base-50)',
      '--mockAccent': 'var(--base-100)',
    }" @click="playTimeline">
      <header ref="headerRef" class="MockBGSubtle">
        <div class="MockTitle MockText"></div>
        <nav>
          <div class="MockLink MockText"></div>
          <div class="MockLink MockText"></div>
          <div class="MockLink MockText"></div>
        </nav>
      </header>

      <div ref="bodyRef" class="MockBody MockBG">
        <div class="MockDisplayTitle">
          <p>Typography</p>
        </div>
        <button class="MockCTA MockAccent"></button>
        <div class="MockCardGrid">
          <div class="MockCardsSectionTitle"></div>
          <div class="MockCard MockBGSubtle">
            <div class="MockCardImage MockImg"></div>
            <div class="MockCardContent">
              <div class="MockCardTitle MockText"></div>
              <div class="MockCardDescription MockText"></div>
            </div>
          </div>

          <div class="MockCard MockBGSubtle">
            <div class="MockCardImage MockImg"></div>
            <div class="MockCardContent">
              <div class="MockCardTitle MockText"></div>
              <div class="MockCardDescription MockText"></div>
            </div>
          </div>

          <div class="MockCard MockBGSubtle">
            <div class="MockCardImage MockImg"></div>
            <div class="MockCardContent">
              <div class="MockCardTitle MockText"></div>
              <div class="MockCardDescription MockText"></div>
            </div>
          </div>
        </div>
      </div>

      <div ref="footerRef" class="MockFooter MockBGSubtle">
        <div class="MockTitle MockText"></div>
        <div class="MockTitle MockText"></div>
      </div>
    </div>
  </div>
</template>

<style>
.MockBG {
  background-color: var(--mockBG);
}

.MockBGSubtle {
  background-color: var(--mockBGSubtle);
}

.MockText {
  background-color: var(--mockText);
}

.MockTextReveal {
  position: relative;
}

.MockPage:hover .MockTextReveal::after {
  width: 0%;
}

.MockTextReveal::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: var(--mockText);
  border-radius: var(--radius);
  z-index: 1;
  transition: .2s ease;
}

.MockImg {
  background-color: var(--mockImg);
}

.MockAccent {
  background-color: var(--mockAccent);
}

.MockCardsSectionTitle {
  width: 20%;
  height: 20px;
  border-radius: var(--radius);
  background-color: var(--base-50);
  grid-column: 1 / -1;
}

.MockPage {
  --space-1: 10px;
  --space-2: calc(10px * 2);
  --space-3: calc(10px * 4);
  --space-4: calc(10px * 8);
  --space-5: calc(10px * 16);
  --space-6: calc(10px * 32);

  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 40em;
  cursor: pointer;
  user-select: none;
  height: max-content;
  overflow: hidden;

}

.MockPage header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: var(--space-1);
}

.MockPage nav {
  display: flex;
  gap: var(--space-1);
}

.MockTitle {
  width: 50px;
  height: 15px;
  border-radius: var(--radius);
}

.MockLink {
  width: 20px;
  height: 15px;
  border-radius: var(--radius);
}

.MockBody {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);

  width: 100%;
  padding: var(--space-4) var(--space-3);
  padding-bottom: var(--space-3);
}

.MockDisplayTitle {
  width: 60%;
  border-radius: var(--radius);
}

.MockDisplayTitle p {
  font-size: 2em;
}

.MockCTA {
  width: 60px;
  height: 20px;
  border-radius: var(--radius);
  border: none;
}

.MockCardGrid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-1);
  margin-top: var(--space-4);
}

.MockCard {
  display: flex;
  gap: var(--space-1);
  border-radius: var(--radius);
}

.MockCardImage {
  width: 70px;
  border-radius: var(--radius);
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
}

.MockCardContent {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  padding: var(--space-2);
  padding-left: 0px;
  width: 100%;
}

.MockCardTitle {
  width: 70%;
  height: 15px;
  border-radius: var(--radius);
}

.MockCardDescription {
  width: 90%;
  height: 10px;
  border-radius: var(--radius);
}

.MockFooter {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: var(--space-1);
  width: 100%;
  padding: var(--space-1);
}
</style>
