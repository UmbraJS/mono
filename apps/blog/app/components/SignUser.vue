<script setup lang="ts">
import SignIn from "./SignIn.vue";
import SignUp from "./SignUp.vue";
import { ButtonGroup, Button } from "umbraco";

const signMode = ref<"signin" | "signup">("signin");
</script>

<template>
  <div class="signin panel-wrapper">
    <div class="multi-toggle-wrapper sibling-group-blur">
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
  position: relative;
  display: grid;
  gap: var(--space-2);
}

.multi-toggle-wrapper {
  .buttonGroup {
    width: 100%;
  }

  button {
    width: 100%;
  }
}
</style>
