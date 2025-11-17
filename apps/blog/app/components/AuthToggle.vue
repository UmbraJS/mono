<script setup lang="ts">
import { ButtonGroup, Button } from 'umbraco'

const props = defineProps<{
  signMode: 'signin' | 'signup' | null
}>()

const emit = defineEmits<{
  (e: 'update:signMode', value: 'signin' | 'signup' | null): void
}>()

function handleModeClick(mode: 'signin' | 'signup') {
  // If clicking the current mode, toggle back to null (show chat)
  if (props.signMode === mode) {
    emit('update:signMode', null)
  } else {
    emit('update:signMode', mode)
  }
}
</script>

<template>
  <div class="multi-toggle-wrapper sibling-group-blur">
    <ButtonGroup class="ButtonGroup">
      <Button :variant="signMode === 'signin' ? 'primary' : 'base'" size="medium" @click="handleModeClick('signin')">
        <Icon name="carbon:user-online" />
        <p>Sign in</p>
      </Button>
      <Button :variant="signMode === 'signup' ? 'primary' : 'base'" size="medium"
        :color="signMode == 'signup' ? 'default' : 'base'" @click="handleModeClick('signup')">
        <Icon name="carbon:user-follow" />
        <p>Sign up</p>
      </Button>
    </ButtonGroup>
  </div>
</template>

<style scoped>
.buttonGroup {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.multi-toggle-wrapper {
  width: 100%;
}
</style>
