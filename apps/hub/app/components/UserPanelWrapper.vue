<script setup lang="ts">
const { user } = useAuth()
</script>

<template>
  <SignUser v-if="!user" />
  <UserPanel v-else />
</template>
