<script setup lang="ts">
import { Button } from '@nobel/core'
const quest = useQuest()
</script>

<template>
  <header v-if="quest.shop.current" id="ShopHeader">
    <ShopAvatar />
    <div id="ShopMetaInfo">
      <h2>{{ quest.shop.current.name }}</h2>
      <p>{{ quest.shop.current.description }}</p>

      <div id="ShopActions">
        <Button variant="base">
          <Icon name="carbon:arrow-left" size="1em" />
          <p>Exit</p>
        </Button>
      </div>
    </div>
  </header>
</template>

<style scoped>
#ShopHeader {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--space-2);

  background-color: var(--base);
  padding: var(--space-2);
  border-radius: var(--radius);
}

#ShopMetaInfo {
  display: grid;
  gap: var(--space-1);
  grid-template-rows: auto 1fr auto;
}

#ShopActions {
  display: flex;
  justify-content: flex-end;
}
</style>
