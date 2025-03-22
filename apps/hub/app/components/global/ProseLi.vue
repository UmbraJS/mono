<template>
  <li><slot /></li>
</template>

<style>
ul:has(> li input) {
  list-style-type: none;
  padding-left: 0;
}
</style>
