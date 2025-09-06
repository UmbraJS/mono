<script setup lang="ts">
import { Button, toast } from '@nobel/core'

// https://better-auth.vercel.app/docs/integrations/nuxt#ssr-usage
const { user, session, client } = useAuth()
const { data: accounts } = await useAsyncData('accounts', () => client.listAccounts())

function hasProvider(provider: string) {
  return accounts.value?.data?.some((account) => account.provider === provider)
}
const error = useRoute().query?.error
onMounted(() => {
  if (!error) return
  toast.error('Noble Error in User.vue')
})
</script>

<template>
  <div>
    <h1 v-if="user">User</h1>
    <pre>{{ user }}</pre>
    <h3 v-if="session">Session</h3>
    <pre>{{ session }}</pre>
    <h3>Accounts</h3>
    <p class="mt-2">
      <Button
        v-if="hasProvider('github')"
        icon="i-simple-icons-github"
        trailing-icon="i-heroicons-check"
      >
        Linked with GitHub
      </Button>
      <Button
        v-else
        icon="i-simple-icons-github"
        @click="client.linkSocial({ provider: 'github' })"
      >
        Link account with GitHub
      </Button>
    </p>
  </div>
</template>
