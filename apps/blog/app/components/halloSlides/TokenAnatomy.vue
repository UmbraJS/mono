<script setup lang="ts">
import { gsap } from 'gsap';
import { onMounted, ref } from 'vue';
import { ScrollArea } from "umbraco";

const exampleRefs = ref<HTMLElement[]>([]);

onMounted(() => {
  gsap.fromTo(
    exampleRefs.value,
    {
      scale: 1,
      x: 0,
      y: 0,
      opacity: 0
    },
    {
      scale: 1,
      x: (index) => index * 50,
      y: (index) => index * 50,
      opacity: 1,
      duration: 0.6,
      ease: "back.out(1.7)",
      stagger: 0.1
    }
  );
});

const spaceTokens = [
  { name: "--primary-button-hover", value: "rgba(61, 61, 61, 1)" }
];

const spaceTokenStyleObject = computed(() => {
  const styleObject: Record<string, string> = {};
  spaceTokens.forEach(token => {
    styleObject[token.name] = token.value;
  });
  return styleObject;
});
</script>

<template>
  <div class="SpacingTokens" :style="spaceTokenStyleObject">
    <h1 class="SpacingTitle">
      This is very specific! 👀
    </h1>
    <div class="MyElementTokensTable">
      <div class="SpaceToken">
        <div class="TokenName">
          <p class="display">--</p>
          <div class="TokenSection base-accent">
            <p class="display">primary</p>
            <div class="TokenSectionBracket">
              <p>type</p>
            </div>
          </div>
          <p class="display">-</p>
          <div class="TokenSection base-warning">
            <p class="display">button</p>
            <div class="TokenSectionBracket">
              <p>element</p>
            </div>
          </div>
          <p class="display">-</p>
          <div class="TokenSection base-success">
            <p class="display">hover</p>
            <div class="TokenSectionBracket">
              <p>state</p>
            </div>
          </div>
          <p class="display">:</p>

        </div>

        <div class="TokenColor">
          <div class="Swatch border" :style="{ '--color': 'rgba(61, 61, 61, 1)' }" />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.TokenColor {
  padding-top: var(--space-quark);
}

.TokenName {
  display: flex;
  align-items: center;
}

.TokenSection {
  position: relative;
}

.TokenSection p.display {
  letter-spacing: 3px;
}

.TokenSection p {
  color: var(--base-100);
}

.TokenSectionBracket {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  border: 2px solid var(--base-50);
  border-top: none;
  padding: var(--space-2);
  width: 100%;
  height: 100%;
}

.TokenSectionBracket p {
  transform: translateY(40%);
  background-color: var(--base);
  padding: var(--space-2);
}

.SpacingTitle {
  color: var(--base-text);
}

.DummyParent {
  --height: 40vh;
  position: relative;
  padding: var(--space-4);
  border-radius: var(--radius);
  max-height: var(--height);
}

.ScrollArea {
  padding-right: var(--space-3);
}

.ScrollAreaScrollbar {
  --reduction: var(--space-4);
  transform: translateX(-4px);
  border-radius: var(--radius);
}

.SpaceToken {
  display: grid;
  grid-template-columns: subgrid;
  grid-column: 1 / -1;
  gap: var(--space-2);
  align-items: center;
  justify-content: center;
}

.SpacingTokens {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
}

.MyElementTokensTable {
  display: grid;
  grid-template-columns: auto auto;
  align-items: space-between;
  justify-content: space-between;
}

.TokenText {
  display: grid;
  justify-content: space-between;
  gap: 0px var(--space-2);
  color: var(--base-50);
}

.TokenValue {
  color: var(--base-50);
  font-family: monospace;
}

.Swatch {
  height: 1.8em;
  width: 1.8em;
  background-color: var(--color);
}
</style>
