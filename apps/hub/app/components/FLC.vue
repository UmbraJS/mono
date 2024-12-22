<script setup lang="ts"></script>

<template>
  <div class="frost-layers">
    <div class="layer" style="--index: 1"></div>
    <div class="layer" style="--index: 2"></div>
    <div class="layer" style="--index: 3"></div>
    <div class="layer" style="--index: 4"></div>
    <div class="layer" style="--index: 5"></div>
  </div>
</template>

<style lang="scss">
.frost-layers {
  --layers: 5;
  --blur-contrast: 1.3;
  --blur-size: 100;
  --blur-brightness: 0.9;

  --blur-max: 20;
  --blur-start: calc(var(--blur-size) * (1 / 6));
  --blur-add: calc(var(--blur-size) * (5 / 6));

  position: fixed;
  z-index: 10;
  bottom: 0;
  left: 0;

  height: 15dvh;
  height: calc(var(--blur-size) * 1px);
  width: 100dvw;
  //   pointer-events: none;

  & > div {
    position: absolute;
    inset: 0;

    --blur: calc(sin(((var(--layers) - var(--index)) / var(--layers)) * 90deg) * var(--blur-max));
    --stop: calc(sin(((var(--index)) / var(--layers)) * 90deg) * var(--blur-add));

    backdrop-filter: blur(calc(var(--blur) * 1px)) brightness(var(--blur-brightness))
      contrast(var(--blur-contrast));
    mask: linear-gradient(#0000, #000 0.5rem),
      linear-gradient(
        #fff calc(var(--blur-start) * 1%),
        #0000 calc((var(--blur-start) + var(--stop)) * 1%)
      );
    transform: rotate(0.5turn);
    mask-composite: intersect;
  }
}
</style>
