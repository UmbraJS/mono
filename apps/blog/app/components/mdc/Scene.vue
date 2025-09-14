<template>
  <div class="NarrativeScene">
    <NuxtImg src="https://res.cloudinary.com/samuelbednarz/image/upload/v1696118403/blog/gandhi-with-gun_ozm4v0.jpg"
      alt="Gandhi holding a gun" width="600" height="400" class="mb-4 rounded-lg" />
    <slot />
  </div>
</template>

<style>
.NarrativeScene {
  padding: var(--space-3);
  border: 1px solid var(--base-40);
  border-radius: var(--radius);
  background: var(--base-10);
}
</style>
