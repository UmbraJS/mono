<script setup lang="ts">
import { Button, toast, Input, Spinner } from 'umbraco'

const auth = useAuth()
const router = useRouter()

const email = ref('')
const password = ref('')
const loading = ref(false)

async function signIn() {
  if (loading.value) return
  loading.value = true

  const result = await auth.client.signIn.email({
    email: email.value,
    password: password.value,
  })

  if (result.error) {
    toast.error(result.error.message || 'Error signing in')
    loading.value = false
  } else {
    toast.success('You have been signed in!')

    // Manually refetch the session after sign in
    await auth.refetch()

    // Wait for the refetch to actually complete
    // Watch for data to be populated
    await new Promise<void>((resolve) => {
      let stopWatch: (() => void) | undefined

      stopWatch = watch(
        () => auth.session.value,
        (newSession) => {
          if (newSession) {
            if (stopWatch) stopWatch()
            resolve()
          }
        },
        { immediate: true, deep: true }
      )

      // Fallback timeout
      setTimeout(() => {
        if (stopWatch) stopWatch()
        resolve()
      }, 5000)
    })

    // Navigate to profile
    await router.push('/profile')
  }
}

const signinWithGithub = async () => {
  if (loading.value) return
  loading.value = true

  const { error } = await auth.client.signIn.social({
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
    <Spinner size="8em" />
  </div>
  <form @submit.prevent="signIn">
    <Input type="email" label="Email" @input="(e: InputEvent) => (email = (e.target as HTMLInputElement).value)" />
    <Input type="password" label="Password"
      @input="(e: InputEvent) => (password = (e.target as HTMLInputElement).value)" />
    <Button type="submit" :disabled="!email.length || !password.length">
      <span v-if="!loading"> Sign In </span>
      <Spinner v-else variant="secondary" size="1.5em" />
    </Button>
    <Button type="button" :disabled="loading" @click="signinWithGithub">
      <Icon v-if="!loading" name="i-simple-icons-github" />
      <span v-if="!loading"> Sign In with Github </span>
      <Spinner v-if="loading" variant="secondary" size="1.5em" />
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
  animation: reveal var(--time-4) forwards;
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
