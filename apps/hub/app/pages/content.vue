<script setup lang="ts">
const { data: home } = await useAsyncData(() => queryCollection('content').path('/').first())

useSeoMeta({
  title: home.value?.title,
  description: home.value?.description,
})

const md = `
# Foo lol
This is Foo blog post of some kind

## Bar
This is Bar blog post of some kind :)

`
</script>

<template>
  <div class="artickle">
    <MDC :value="md" tag="article" class="content post" />
    <!-- <ContentRenderer v-if="home" :value="home" class="content post" />
    <div v-else>Home not found</div> -->
  </div>
</template>

<style lang="scss">
.artickle {
  margin-top: 200px;

  display: grid;
  gap: var(--space-1);
  padding: var(--space-5);
  padding-bottom: var(--space-7);
  border-radius: var(--radius);
  background-color: var(--base-10);
  width: 100%;
  border: solid var(--border-size) var(--base-30);
  box-shadow: 0px 0px 20px 10px var(--base-20);
  transition: 0.4s;
}

.content.post {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
}
</style>
