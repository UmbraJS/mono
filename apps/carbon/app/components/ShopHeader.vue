<script setup lang="ts">
import { Button } from '@nobel/core'
const quest = useQuest()

function exitShop() {
  navigateTo('/quest')
}
</script>

<template>
  <header v-if="quest.shop.current" id="ShopHeader">
    <ShopAvatar />
    <div id="ShopActions">
      <Button variant="base" @click="exitShop">
        <Icon name="carbon:arrow-left" size="1em" />
        <p>Exit</p>
      </Button>
    </div>
  </header>
</template>

<style scoped>
#ShopHeader {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--space-2);

  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding: var(--space-2);
  z-index: 1;
}

#ShopActions {
  display: flex;
  justify-content: flex-end;
}
</style>
