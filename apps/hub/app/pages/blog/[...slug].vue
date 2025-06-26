<script setup lang="ts">
// const { data: exhaustiveDeps } = await useAsyncData(() => queryCollection('blog').path('blog/exhaustivedeps').first())

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
  <ContentRenderer v-if="exhaustiveDeps" :value="exhaustiveDeps" />
  <div v-else>Markdown content not found</div>
</template>

<style scoped lang="scss"></style>
