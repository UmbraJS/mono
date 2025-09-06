<script setup lang="ts">
import { Button, toast, Input } from 'umbraco'

const auth = useAuth()

const email = ref('')
const password = ref('')
const name = ref('')
const loading = ref(false)

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
  }
  loading.value = false
}
</script>

<template>
  <form @submit.prevent="signUp">
    <Input type="email" label="Email" @input="(e: InputEvent) => (email = (e.target as HTMLInputElement).value)" />
    <Input label="Password" type="password"
      @input="(e: InputEvent) => (password = (e.target as HTMLInputElement).value)" />
    <Input label="Name" type="name" @input="(e: InputEvent) => (name = (e.target as HTMLInputElement).value)" />
    <Button type="submit">Sign Up</Button>
  </form>
</template>
