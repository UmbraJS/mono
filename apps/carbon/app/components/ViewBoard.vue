<script setup lang="ts">
const view = useView()
const overlay = computed(() => view.view !== null)
const quest = useQuest()
</script>

<template>
  <div id="Viewboard">
    <div id="ActiveBoard" :class="{ blured: overlay }">
      <slot />
    </div>

    <ViewOverlay :hidden="!overlay">
      <slot name="overlay" />
    </ViewOverlay>

    <ViewUnderlay v-for="event in quest.currentEvents" :key="event.id"
      :src="event.images.inside || event.images.default" :visible="quest.hoveredEvent?.id === event.id" />

    <ViewUnderlay v-if="quest.shop.current" :src="quest.shop.current.images.inside || quest.shop.current.images.default"
      :visible="true" />
  </div>

</template>

<style>
#Viewboard {
  display: grid;
  grid-template-columns: subgrid;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  grid-column: 1 / -1;
}

#Viewboard #ActiveBoard {
  filter: blur(0px);
  transition: var(--time);
  grid-column: 1 / -1;
}

#Viewboard #ActiveBoard.blured {
  filter: blur(20px);
}

#ShopKeeper {
  position: absolute;
  z-index: -1;

  top: 0;
  height: 100%;
  width: 100%;

  background: var(--base-20);
  border-radius: var(--radius);
  overflow: hidden;
  grid-column: 1 / -1;
}

#ShopKeeper img {
  object-fit: cover;
  object-fit: top;
  width: 100%;
}
</style>
