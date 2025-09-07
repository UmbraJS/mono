<script setup lang="ts">
import { Button, toast } from 'umbraco'

type Account = { provider: string }
type AccountsResponse = { data: Account[] }
type AuthClient = {
  listAccounts?: () => Promise<AccountsResponse>
  linkSocial?: (opts: { provider: string }) => Promise<unknown>
}

// Auth is currently stubbed; replace with real implementation when needed
const { user, session, client } = useAuth()
const authClient = client as AuthClient
const { data: accounts } = await useAsyncData(
  'accounts',
  async () => {
    if (typeof authClient?.listAccounts !== 'function') {
      return { data: [] as Account[] }
    }
    return await authClient.listAccounts()
  },
  { server: false }
)

function hasProvider(provider: string) {
  return accounts.value?.data?.some((account: Account) => account.provider === provider)
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
      <Button v-if="hasProvider('github')" icon="i-simple-icons-github" trailing-icon="i-heroicons-check">
        Linked with GitHub
      </Button>
      <Button v-else icon="i-simple-icons-github"
        @click="(authClient.linkSocial && authClient.linkSocial({ provider: 'github' }))">
        Link account with GitHub
      </Button>
    </p>
  </div>
</template>
