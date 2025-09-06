<script setup lang="ts">
import InteractiveGridPattern from '../../components/InteractiveGridPattern.vue'

const route = useRoute()
const { data: exhaustiveDeps } = await useAsyncData(route.path, () => {
  return queryCollection('blog').path(route.path).first()
})

useSeoMeta({
  title: exhaustiveDeps.value?.title,
  description: exhaustiveDeps.value?.description
})
</script>

<template>
  <article id="MarkdownArticle">
    <ContentRenderer v-if="exhaustiveDeps" :value="exhaustiveDeps" />
    <div v-else>Markdown content not found</div>
  </article>
  <InteractiveGridPattern />
</template>


<style lang="scss">
// Typographic styles specific to markdown pages
#MarkdownArticle {
  position: relative;
  padding: var(--space-4);
  padding-bottom: var(--space-10);
  z-index: 10;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    background: var(--base);
    filter: blur(140px);
  }

  &>div {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-3);

    h3,
    h2 {
      margin-top: var(--space-4);
    }
  }
}
</style>
