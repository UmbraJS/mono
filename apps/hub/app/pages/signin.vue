<script setup lang="ts">
definePageMeta({
  auth: {
    only: 'guest',
    redirectUserTo: '/user',
  },
})
const auth = useAuth()
const tabs = [
  {
    slot: 'signin',
    label: 'Sign In',
    icon: 'i-heroicons-user',
  },
  {
    slot: 'signup',
    label: 'Sign Up',
    icon: 'i-heroicons-user-plus',
  },
]

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
    // toast.add({
    //   title: error.message,
    //   color: 'red',
    // })
  } else {
    await navigateTo('/user')
    // toast.add({
    //   title: `You have been signed in!`,
    // })
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
    // toast.add({
    //   title: error.message,
    //   color: 'red',
    // })
  } else {
    // toast.add({
    //   title: `You have been signed up!`,
    // })
    await navigateTo('/user')
  }
  loading.value = false
}
</script>

<template>
  <UPageBody>
    <UTabs :items="tabs" class="max-w-md mx-auto">
      <template #signin>
        <form class="flex flex-col gap-4" @submit.prevent="signIn">
          <UFormGroup label="Email" required>
            <UInput v-model="email" type="email" placeholder="Email" />
          </UFormGroup>
          <UFormGroup label="Password" requiredrequired>
            <UInput v-model="password" type="password" placeholder="Password" />
          </UFormGroup>
          <UButton type="submit" color="black" :loading="loading" :disabled="!email || !password">
            Sign In
          </UButton>
          <UDivider label="or" />
          <UButton
            icon="i-simple-icons-github"
            type="button"
            color="black"
            @click="auth.signIn.social({ provider: 'github', callbackURL: '/user' })"
          >
            Sign In with Github
          </UButton>
        </form>
      </template>
      <template #signup>
        <form class="flex flex-col gap-4" @submit.prevent="signUp">
          <UFormGroup label="Email" required>
            <UInput v-model="email" type="email" placeholder="Email" />
          </UFormGroup>
          <UFormGroup label="Password" requiredrequired>
            <UInput v-model="password" type="password" placeholder="Password" />
          </UFormGroup>
          <UFormGroup label="Name">
            <UInput v-model="name" type="name" placeholder="Name" />
          </UFormGroup>
          <UButton type="submit" color="black" :loading="loading"> Sign Up </UButton>
        </form>
      </template>
    </UTabs>
  </UPageBody>
</template>
