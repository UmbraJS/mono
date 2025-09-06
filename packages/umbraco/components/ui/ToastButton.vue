<script setup lang="ts">
import { Toaster, toast } from 'vue-sonner'
</script>

<template>
  <button @click="toast('Hello World!')">Toast</button>
  <Toaster position="top-center" />
</template>

<style lang="scss"></style>
