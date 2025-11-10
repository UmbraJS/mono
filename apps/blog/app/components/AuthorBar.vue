<script setup lang="ts">
import type { author as authorType } from '../../types/profile'
import IdentityTag from './IdentityTag.vue'

defineProps<{
  author: typeof authorType
}>()
</script>

<template>
  <div class="AuthorBar">
    <NuxtImg class="AuthorAvatar" :src="author.avatarUrl" width="75" height="75" alt="Author avatar" />
    <div class="AuthorInfo">
      <p>
        <span>
          {{ author.name }}
        </span>
      </p>
      <div class="MandatoryIdentityFields">
        <IdentityTag v-for="tag in author.indentityTags" :key="tag.id" :identity-tag="tag" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.MandatoryIdentityFields {
  display: grid;
  grid-auto-flow: column;
  gap: var(--space-quark);
}

.AuthorInfo {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.AuthorBar {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: var(--space-2);
  background-color: var(--base-20);
  padding: var(--space-1);
  border-radius: var(--radius);
  width: 100%;
  max-width: clamp(300px, 100vw, 700px);
}

.AuthorBar .AuthorAvatar {
  border-radius: var(--radius);
  object-fit: cover;
}
</style>
