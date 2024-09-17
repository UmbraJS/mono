<script setup lang="ts"></script>

<template>
  <div class="button-group">
    <slot></slot>
  </div>
</template>

<style>
.button-group {
  display: flex;
  justify-content: center;
}

.button-group > *:not(:last-child, :first-child, :focus),
.button-group > a:not(:last-child, :first-child, :focus) > *:not(:focus) {
  border-right-color: transparent;
  border-radius: 0px;
}

.button-group > *:not(:focus):first-child,
.button-group > a:first-child > *:not(:focus) {
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-right-color: transparent;
}

.button-group > *:not(:focus):last-child,
.button-group > a:last-child > *:not(:focus) {
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
}
</style>
