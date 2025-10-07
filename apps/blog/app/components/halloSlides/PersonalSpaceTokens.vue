<script setup lang="ts">
import { gsap } from 'gsap';
import { onMounted, ref } from 'vue';

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
  { name: '--space-personal', value: '10px' },
  { name: '--space-friendly', value: 'calc(10px * 2)' },
  { name: '--space-familiar', value: 'calc(10px * 4)' },
  { name: '--space-strange', value: 'calc(10px * 8)' },
  { name: '--space-divorced', value: 'calc(10px * 16)' },
  { name: '--space-hostile', value: 'calc(10px * 32)' }
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
      Personal Space
    </h1>

    <div class="TokensTable">
      <div v-for="token in spaceTokens" :key="token.name" class="SpaceToken">
        <span class="TokenName">{{ token.name }}:</span>
        <span class="TokenValue">{{ token.value }};</span>
        <div class="SpaceBox border" :style="{ '--size': token.value }" />
      </div>
    </div>
  </div>
</template>

<style>
.SpacingTitle {
  color: var(--base-50);
}

.SpaceToken {
  display: grid;
  grid-template-columns: subgrid;
  grid-column: 1 / -1;
  gap: var(--space-2);
  align-items: center;
}

.SpacingTokens {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
}

.TokensTable {
  display: grid;
  grid-template-columns: auto auto 1fr;
  gap: var(--space-1);
}

.TokenText {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0px var(--space-2);
  color: var(--base-50);
}

.TokenText span {
  color: var(--base-text);
}

.TokenName {
  color: var(--base-text);
  font-weight: 500;
}

.TokenValue {
  color: var(--base-50);
  font-family: monospace;
}

.SpaceBox {
  height: 1.8em;
  width: var(--size);
  background-color: var(--base-30);
}
</style>
