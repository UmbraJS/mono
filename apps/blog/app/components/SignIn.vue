<script setup lang="ts">
import { Button, toast, Input } from 'umbraco'
import { useBetterAuthClient } from 'convue'

const authClient = useBetterAuthClient()
const router = useRouter()

const email = ref('')
const password = ref('')
const loading = ref(false)

async function signIn() {
  if (loading.value) return
  loading.value = true

  const { error } = await authClient.signIn.email({
    email: email.value,
    password: password.value,
  })

  if (error) {
    toast.error(error.message || 'Error signing in')
    loading.value = false
  } else {
    toast.success('You have been signed in!')
    await router.push('/profile')
  }
}

const signinWithGithub = async () => {
  if (loading.value) return
  loading.value = true

  const { error } = await authClient.signIn.social({
    provider: 'github',
    callbackURL: '/profile',
  })

  if (error) {
    toast.error('Error signing in')
    loading.value = false
  }
}
</script>

<template>
  <div v-if="loading" class="loading-panel">
    <Icon name="svg-spinners:pulse-multiple" size="8em" />
  </div>
  <form @submit.prevent="signIn">
    <Input type="email" label="Email" @input="(e: InputEvent) => (email = (e.target as HTMLInputElement).value)" />
    <Input type="password" label="Password"
      @input="(e: InputEvent) => (password = (e.target as HTMLInputElement).value)" />
    <Button type="submit" :disabled="!email.length || !password.length">
      <span v-if="!loading"> Sign In </span>
      <Icon v-else name="svg-spinners:3-dots-move" />
    </Button>
    <Button type="button" :disabled="loading" @click="signinWithGithub">
      <Icon v-if="!loading" name="i-simple-icons-github" />
      <span v-if="!loading"> Sign In with Github </span>
      <Icon v-if="loading" name="svg-spinners:3-dots-move" />
    </Button>
  </form>
</template>

<style>
.loading-panel {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0%;
  left: 0%;
  z-index: 20;
  backdrop-filter: blur(4px);
  animation: reveal var(--slower) forwards;
}

@keyframes reveal {
  0% {
    clip-path: circle(0% at 50% 50%);
  }

  100% {
    clip-path: circle(100% at 50% 50%);
  }
}
</style>
