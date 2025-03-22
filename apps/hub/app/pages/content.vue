<script setup lang="ts">
import RichText from '~/components/RichText.vue'
import type { MDCParserResult } from '@nuxtjs/mdc'

const someOther = ref(`# Simple`)
const ast = ref<MDCParserResult>()

// const source = useLocalStorage('nuxt-mdc-playground-code', someOther)

async function pM(value: string) {
  ast.value = await parseMarkdown(value)
}

watch(someOther, () => pM(someOther.value))
onMounted(() => pM(someOther.value))
</script>

<template>
  <div class="artickle">
    <RichText :value="someOther" @update:model-value="someOther = $event" />

    <!-- <Editor v-model:code="samllDemo" /> -->
    <!-- <Editor :code="JSON.stringify(ast?.body, null, 2) || ''" language="json" read-only /> -->

    <div contenteditable="true" class="buttonHover buttonFocus focus rounded border">
      <MDCRenderer
        v-if="ast"
        :body="ast!.body"
        :data="ast!.data"
        tag="article"
        class="content post"
      />
    </div>
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
