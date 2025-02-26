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

  console.log('rex stuff: ', email.value, password.value, name.value)

  const { error } = await auth.signUp.email({
    email: email.value,
    password: password.value,
    name: name.value,
  })
  console.log('rex: ', error)
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
  <div class="signin">
    <p>email: {{ email }}</p>
    <p>password: {{ password }}</p>
    <p>name: {{ name }}</p>
    <!-- 
    <form @submit.prevent="signIn">
      <Input v-model="email" type="email" label="Email" />
      <Input v-model="password" type="password" label="Password" />
      <Button type="submit" :disabled="!email.length || !password.length">Sign In</Button>
      <Button
        type="button"
        @click="auth.signIn.social({ provider: 'github', callbackURL: '/user' })"
      >
        <Icon name="i-simple-icons-github" />
        <span>Sign In with Github</span>
      </Button>
    </form> -->
    <form @submit.prevent="signUp">
      <Input @input="(e) => (email = e.target.value)" type="email" label="Email" />
      <Input @input="(e) => (password = e.target.value)" type="password" label="Password" />
      <Input @input="(e) => (name = e.target.value)" type="name" label="Name" />
      <Button type="submit">Sign Up</Button>
    </form>
  </div>
</template>

<style lang="scss">
form {
  display: grid;
  gap: var(--space-1);
}

.signin {
  display: grid;
  gap: var(--space-4);
}
</style>
