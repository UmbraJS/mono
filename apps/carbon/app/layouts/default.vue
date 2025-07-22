<script setup lang="ts">
const theme = useUmbra()

onMounted(() => {
  theme.inverse()
  theme.inverse()
  theme.inverse()
})
</script>

<template>
  <div data-vaul-drawer-wrapper class="layout" :class="{
    dark: theme.isDark,
  }">
    <slot />
  </div>
</template>
