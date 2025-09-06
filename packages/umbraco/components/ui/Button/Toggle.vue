<script setup lang="ts">
import { ref } from 'vue'
import Button from './Button.vue'

const emit = defineEmits(['click'])
const active = ref(false)

function handleClick() {
  active.value = !active.value
  emit('click', active.value)
}
</script>

<template>
  <Button size="small" :color="active ? 'warning' : 'success'" @click="handleClick">
    <slot v-if="active" name="active" />
    <slot v-else name="inactive" />
  </Button>
</template>

<style lang="scss"></style>
