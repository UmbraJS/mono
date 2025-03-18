<script setup lang="ts">
import RichText from '~/components/RichText.vue'
import type { MDCParserResult } from '@nuxtjs/mdc'
const { data: home } = await useAsyncData(() => queryCollection('content').path('/').first())

const counter = ref(0)

const ast = ref<MDCParserResult>()

const md = ref(`
# Just a Vue app

This is markdown content rendered via the \`<MDCRenderer>\` component,

including MDC below. ${counter.value}

\`\`\`ts
const a = 1;
\`\`\`
`)

const samllDemo = ref(`
# Simple

Simple paragraph
`)

const mounted = ref(false)

async function pM(value: string) {
  ast.value = await parseMarkdown(value)
}

watch([mounted, samllDemo], () => {
  if (!mounted.value) return
  pM(samllDemo.value)
})

onMounted(() => {
  mounted.value = true
})
</script>

<template>
  <div class="artickle" @click="counter++">
    <RichText
      @input="
        (e) => {
          samllDemo = (e?.target as HTMLDivElement)?.innerText || ''
        }
      "
    />

    <MDCRenderer
      v-if="ast"
      :body="ast!.body"
      :data="ast!.data"
      tag="article"
      class="content post"
    />

    <ContentRenderer v-if="home" :value="home" class="content post" />
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
