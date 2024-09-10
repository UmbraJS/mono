<template>
  <svg id="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <slot />
  </svg>
</template>

<style>
svg#icon {
  width: var(--paragraph);
  aspect-ratio: 1 / 1;
  fill: currentColor;
}
</style>
