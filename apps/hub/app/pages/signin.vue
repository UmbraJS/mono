<script setup lang="ts">
import { Button, toast, Input } from '@nobel/core'

definePageMeta({
  auth: {
    only: 'guest',
    redirectUserTo: '/user',
  },
})

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

async function signUp() {
  if (loading.value) return
  loading.value = true
  const { error } = await auth.signUp.email({
    email: email.value,
    password: password.value,
    name: name.value,
  })
  if (error) {
    toast.error(error.message || 'Error signing up')
  } else {
    toast.success('You have been signed up!')
    await navigateTo('/user')
  }
  loading.value = false
}
</script>

<template>
  <div>
    <form @submit.prevent="signIn">
      <Input v-model="email" type="email" placeholder="Email" />
      <Input v-model="password" type="password" placeholder="Password" />
      <Button type="submit" :loading="loading" :disabled="!email || !password"> Sign In </Button>
      <Button
        icon="i-simple-icons-github"
        type="button"
        @click="auth.signIn.social({ provider: 'github', callbackURL: '/user' })"
      >
        <Icon name="i-simple-icons-github" />
        <span>Sign In with Github</span>
      </Button>
    </form>
    <form @submit.prevent="signUp">
      <Input v-model="email" type="email" placeholder="Email" />
      <Input v-model="password" type="password" placeholder="Password" />
      <Input v-model="name" type="name" placeholder="Name" />
      <Button type="submit" :loading="loading"> Sign Up </Button>
    </form>
  </div>
</template>
