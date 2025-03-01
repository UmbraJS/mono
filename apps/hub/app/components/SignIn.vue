<script setup lang="ts">
import { Button, toast, Input } from '@nobel/core'

const auth = useAuth()

const email = ref('')
const password = ref('')
const name = ref('')
const loading = ref(false)

async function signIn() {
  if (loading.value) return
  loading.value = true
  const { error } = await auth.signIn.email({
    email: email.value,
    password: password.value,
  })
  if (error) {
    toast.error(error.message || 'Error signing in')
  } else {
    await navigateTo('/user')
    toast.success('You have been signed in!')
  }
  loading.value = false
}

async function signOut() {
  await auth.signOut()
  await navigateTo('/')
}
</script>

<template>
  <form @submit.prevent="signIn">
    <Input type="email" label="Email" @input="(e) => (email = e.target.value)" />
    <Input type="password" label="Password" @input="(e) => (password = e.target.value)" />
    <Button type="submit" :disabled="!email.length || !password.length">Sign In</Button>
    <Button type="button" @click="auth.signIn.social({ provider: 'github', callbackURL: '/user' })">
      <Icon name="i-simple-icons-github" />
      <span>Sign In with Github</span>
    </Button>
  </form>
</template>
