<script setup lang="ts">
const quest = useQuest()
</script>

<template>
  <div v-if="quest.shop.current" id="ShopAvatar">
    <NuxtImg v-if="quest.shop.current.images.inside" class="avatar" :src="quest.shop.current.images.inside"
      :alt="quest.shop.current.description" width="200" height="200" placeholder format="webp" fit="cover" />
  </div>
</template>

<style>
#ShopAvatar {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--base-40);
  padding: var(--space-1);
  border-radius: var(--radius);
}

#ShopAvatar .avatar {
  width: 100%;
  height: 100%;
  border-radius: var(--radius);
}
</style>
