<script setup lang="ts">
import { ref } from "vue"

// Internal toggle for click interaction (fallback/demo)
const visible = ref(false);

const totalDuration = ref(400); // in ms

const stageOne = computed(() => {
  return totalDuration.value * 0.25;
});

const stageTwo = computed(() => {
  return stageOne.value * 0.25;
});

const stageThree = computed(() => {
  return stageTwo.value * 0.25;
});

function toggleVisibility() {
  visible.value = !visible.value;
}

</script>

<template>
  <div>
    <div class="MockPage border" :class="{
      'MockVisible': visible,
      'MockHidden': !visible
    }" :style="{
      '--mockBG': 'var(--base-10)',
      '--mockBGSubtle': 'var(--base-20)',
      '--mockText': 'var(--base-text)',
      '--mockImg': 'var(--base-50)',
      '--mockAccent': 'var(--accent-100)',
    }" @click="toggleVisibility">
      <header class="MockBGSubtle">
        <div class="MockTitle MockText"></div>
        <nav>
          <div class="MockLink MockText"></div>
          <div class="MockLink MockText"></div>
          <div class="MockLink MockText"></div>
        </nav>
      </header>

      <div class="MockBody MockBG">
        <div class="MockDisplayTitle MockText"></div>
        <button class="MockCTA MockAccent"></button>
        <div class="MockCardGrid">
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

      <div class="MockFooter MockBGSubtle">
        <div class="MockTitle MockText"></div>
        <div class="MockTitle MockText"></div>
      </div>
    </div>
  </div>
</template>

<style>
.MockBG {
  background-color: var(--mockBG);
  transition: .4s;
}

.MockHidden .MockBG {
  opacity: 0;
}

.MockBGSubtle {
  background-color: var(--mockBGSubtle);
  transition: .8s;
}

.MockHidden .MockBGSubtle {
  opacity: 0;
}

.MockText {
  background-color: var(--mockText);
  transition: 1.2s;
}

.MockHidden .MockText {
  opacity: 0;
}

.MockImg {
  background-color: var(--mockImg);
  transition: .8s;
}

.MockHidden .MockImg {
  opacity: 0;
}

.MockAccent {
  background-color: var(--mockAccent);
  transition: .8s;
}

.MockHidden .MockAccent {
  opacity: 0;
}

.MockPage {
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
  padding: var(--space-5) var(--space-3);
  padding-bottom: var(--space-3);
}

.MockDisplayTitle {
  width: 60%;
  height: 60px;
  border-radius: var(--radius);
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
  margin-top: var(--space-3);
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
  padding: var(--space-1);
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
