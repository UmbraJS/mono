<script setup lang="ts">
const view = useView()
const overlay = computed(() => view.view !== null)

</script>

<template>
  <div id="Viewboard">
    <div id="ActiveBoard" :class="{ blured: overlay }">
      <slot />
    </div>
    <ViewOverlay :hidden="!overlay">
      <slot name="overlay" />
    </ViewOverlay>
  </div>

</template>

<style>
#Viewboard {
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
}

#Viewboard #ActiveBoard.blured {
  filter: blur(20px);
}
</style>
