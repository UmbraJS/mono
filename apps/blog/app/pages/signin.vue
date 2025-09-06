<script setup lang="ts">
import SignUser from '~/components/SignUser.vue'

definePageMeta({
  auth: {
    only: 'guest',
    redirectUserTo: '/user',
  },
})
</script>

<template>
  <SignUser />
</template>
