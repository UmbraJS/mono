<script setup lang="ts"></script>

<template>
  <div class="frost-layers">
    <div class="layer" style="--index: 1"></div>
    <div class="layer" style="--index: 2"></div>
    <div class="layer" style="--index: 3"></div>
    <div class="layer" style="--index: 4"></div>
    <div class="layer" style="--index: 5"></div>
    <div class="layer" style="--index: 6"></div>
  </div>
</template>

<style lang="scss">
.layout:not(.dark) {
  --blur-contrast: 1.9;
  --blur-brightness: 0.81;
}

.layout.dark .frost-layers {
  --blur-contrast: 1.12;
  --blur-brightness: 1.2;
}

.frost-layers {
  --layers: 5;

  --blur-size: 150;

  --blur-max: 20;
  --blur-start: calc(var(--blur-size) * (1 / 6));
  --blur-add: calc(var(--blur-size) * (5 / 6));

  --blur-transition: 5%;

  position: fixed;
  z-index: 10;
  bottom: 0;
  left: 0;

  height: calc(var(--blur-size) * 1px);
  width: 100dvw;

  pointer-events: none;

  & > div {
    position: absolute;
    inset: 0;
    transition: var(--slower);
  }

  & > div:nth-of-type(1) {
    z-index: 2;
    backdrop-filter: blur(1px) brightness(var(--blur-brightness)) contrast(var(--blur-contrast));
    mask: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 1) 25%,
      rgba(0, 0, 0, 1) 37.5%,
      rgba(0, 0, 0, 0) 50%
    );
  }
  & > div:nth-of-type(2) {
    z-index: 3;
    backdrop-filter: blur(2px) brightness(var(--blur-brightness)) contrast(var(--blur-contrast));
    mask: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) 25%,
      rgba(0, 0, 0, 1) 37.5%,
      rgba(0, 0, 0, 1) 50%,
      rgba(0, 0, 0, 0) 62.5%
    );
  }
  & > div:nth-of-type(3) {
    z-index: 4;
    backdrop-filter: blur(4px) brightness(var(--blur-brightness)) contrast(var(--blur-contrast));
    mask: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) 37.5%,
      rgba(0, 0, 0, 1) 50%,
      rgba(0, 0, 0, 1) 62.5%,
      rgba(0, 0, 0, 0) 75%
    );
  }
  & > div:nth-of-type(4) {
    z-index: 5;
    backdrop-filter: blur(8px) brightness(var(--blur-brightness)) contrast(var(--blur-contrast));
    mask: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) 50%,
      rgba(0, 0, 0, 1) 62.5%,
      rgba(0, 0, 0, 1) 75%,
      rgba(0, 0, 0, 0) 87.5%
    );
  }
  & > div:nth-of-type(5) {
    z-index: 6;
    backdrop-filter: blur(16px) brightness(var(--blur-brightness)) contrast(var(--blur-contrast));
    mask: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) 62.5%,
      rgba(0, 0, 0, 1) 75%,
      rgba(0, 0, 0, 1) 87.5%,
      rgba(0, 0, 0, 0) 100%
    );
  }
  & > div:nth-of-type(6) {
    z-index: 7;
    backdrop-filter: blur(32px) brightness(var(--blur-brightness)) contrast(var(--blur-contrast));
    mask: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) 75%,
      rgba(0, 0, 0, 1) 87.5%,
      rgba(0, 0, 0, 1) 100%
    );
  }
}
</style>
