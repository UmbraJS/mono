<script setup lang="ts">
import { Button } from "umbraco"
</script>

<template>
  <div class="ColourReassignment">
    <div class="ButtonsWrapper">
      <div class="ButtonWrapper">
        <p class="display">Base Button</p>
        <Button>
          Click Me
        </Button>
      </div>

      <div class="ButtonWrapper">
        <p class="display">Accent Button</p>
        <Button class="base-accent">
          Click Me
        </Button>
      </div>

      <div class="ButtonWrapper">
        <p class="display">Warning Button</p>
        <Button class="base-warning">
          Click Me
        </Button>
      </div>

      <div class="ButtonWrapper">
        <p class="display">Success Button</p>
        <Button class="base-success">
          Click Me
        </Button>
      </div>

    </div>
  </div>
</template>

<style scoped>
.ButtonsWrapper {
  display: flex;
  gap: var(--space-6);
}

.ButtonWrapper {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.ColourReassignment {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}
</style>
