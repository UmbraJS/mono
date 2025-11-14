<script setup lang="ts">
import SignUser from '../components/SignUser.vue'
import UserPanel from '../components/UserPanel.vue'

const { isLoading: isPending, user } = useAuth()
</script>

<template>
  <ClientOnly>
    <div v-if="isPending">Loading...</div>
    <SignUser v-else-if="!user" />
    <UserPanel v-else />
  </ClientOnly>
</template>
