<script setup lang="ts">
import { ButtonGroup, Button } from '@nobel/core'
const signMode = ref<'signin' | 'signup'>('signin')
</script>

<template>
  <div class="signin panel-wrapper">
    <div class="multi-toggle-wrapper border sibling-group-blur">
      <ButtonGroup>
        <Button
          :variant="signMode === 'signin' ? 'primary' : 'base'"
          size="small"
          @click="signMode = 'signin'"
        >
          Sign in
        </Button>
        <Button
          :variant="signMode === 'signup' ? 'primary' : 'base'"
          size="small"
          @click="signMode = 'signup'"
        >
          Sign up
        </Button>
      </ButtonGroup>
    </div>
    <SignUp v-if="signMode === 'signup'" />
    <SignIn v-else />
  </div>
</template>

<style lang="scss">
form {
  display: grid;
  gap: var(--space-1);
}

.signin {
  display: grid;
  gap: var(--space-2);
}

.multi-toggle-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: var(--block-big);
  padding: var(--space-quark);
  border-radius: var(--outer-radius);
  background-color: var(--base);

  .button-group {
    width: 100%;
  }

  button {
    width: 100%;
  }
}
</style>
