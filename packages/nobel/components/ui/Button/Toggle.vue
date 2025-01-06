<script setup lang="ts">
import { ref } from 'vue'
import Button from './Button.vue'

const emit = defineEmits(['click'])
const active = ref(false)

function handleClick() {
  active.value = !active.value
  emit('click', active)
}
</script>

<template>
  <Button @click="handleClick" size="small" :type="active ? 'warning' : 'success'">
    <slot v-if="active" name="active" />
    <slot v-else name="inactive" />
  </Button>
</template>

<style lang="scss"></style>
