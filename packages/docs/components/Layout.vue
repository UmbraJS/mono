<script setup lang="ts">
const { config } = useDocus()

useHead({
  titleTemplate: config.value.titleTemplate,
  meta: [{ name: 'twitter:card', content: 'summary_large_image' }]
})

useContentHead(config.value as any)
</script>

<template>
  <div class="app-layout">
    <AppLoadingBar />
    <main>
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<style scoped>
.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space);
}
</style>
