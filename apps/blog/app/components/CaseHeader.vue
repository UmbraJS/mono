<script setup lang="ts">
import { EditorContent } from '@tiptap/vue-3'
import type { Editor } from '@tiptap/vue-3'

defineProps<{
  titleEditor: Editor | undefined
  imageUrl: string
}>()
</script>

<template>
  <div class="CaseHeader">
    <NuxtImg :src="imageUrl" width="1200" height="1000" alt="Case header image" />
    <EditorContent :editor="titleEditor" class="CaseTitle" />
  </div>
</template>

<style scoped lang="scss">
.CaseTitle {
  position: relative;
  padding: var(--space-2);
  /* background-color: rgba($color: black, $alpha: 0.2); */
  /* box-shadow: 0px -70px 54px 0px rgba(0, 0, 0, 1); */
  backdrop-filter: blur(5px);
}

.CaseHeader {
  position: relative;
  height: 70vh;
  display: flex;
  align-items: flex-end;
}

.CaseHeader img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  overflow: hidden;
  border-radius: var(--radius);
}
</style>
