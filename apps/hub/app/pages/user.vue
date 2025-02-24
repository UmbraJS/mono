<script setup lang="ts">
// https://better-auth.vercel.app/docs/integrations/nuxt#ssr-usage
const { user, session, client } = useAuth()
const { data: accounts } = await useAsyncData('accounts', () => client.listAccounts())

function hasProvider(provider: string) {
  return accounts.value?.data?.some((account) => account.provider === provider)
}
const error = useRoute().query?.error
onMounted(() => {
  if (error) {
    // toast.add({
    //   color: 'red',
    //   title: error,
    // })
  }
})
</script>

<template>
  <div>
    <h3 class="text-xl font-bold">User</h3>
    <pre>{{ user }}</pre>
    <h3 class="text-xl font-bold mt-2">Session</h3>
    <pre>{{ session }}</pre>
    <h3 class="text-xl font-bold mt-2">Accounts</h3>
    <p class="mt-2">
      <Button
        v-if="hasProvider('github')"
        color="gray"
        icon="i-simple-icons-github"
        trailing-icon="i-heroicons-check"
      >
        Linked with GitHub
      </Button>
      <Button
        v-else
        color="black"
        icon="i-simple-icons-github"
        @click="client.linkSocial({ provider: 'github' })"
      >
        Link account with GitHub
      </Button>
    </p>
  </div>
</template>
