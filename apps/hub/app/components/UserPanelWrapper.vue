<script setup lang="ts">
import SignUser from '~/components/SignUser.vue'
import UserPanel from '~/components/UserPanel.vue'
const { user } = useAuth()
</script>

<template>
  <SignUser v-if="!user" />
  <UserPanel v-else />
</template>
