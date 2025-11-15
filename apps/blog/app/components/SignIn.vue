<script setup lang="ts">
import { Button, toast, Input, Spinner } from 'umbraco'
import { z } from 'zod'
import { useFormula } from '@umbrajs/formula'

const auth = useAuth()
const router = useRouter()

const loading = ref(false)

const form = useFormula(
  {
    email: '',
    password: '',
  },
  {
    validationMode: 'onSubmit',
    schema: z.object({
      email: z.string().email('Invalid email address').min(1, 'Email is required'),
      password: z.string().min(1, 'Password is required'),
    }),
  }
)

async function signIn() {
  const validation = form.validate()

  if (!validation.success) {
    const errors = Object.entries(validation.fieldErrors)
    if (errors.length > 0) {
      const firstError = errors[0]
      if (firstError) {
        const [field, messages] = firstError
        toast.error(`${messages[0]}`)
      }
    } else if (validation.formErrors.length > 0 && validation.formErrors[0]) {
      toast.error(validation.formErrors[0])
    }
    return
  }

  if (!validation.data || loading.value) return
  loading.value = true

  const result = await auth.client.signIn.email({
    email: validation.data.email,
    password: validation.data.password,
  })

  if (result.error) {
    toast.error(result.error.message || 'Error signing in')
    loading.value = false
  } else {
    toast.success('You have been signed in!')

    // Manually fetch the session after sign in
    await auth.fetchSession()

    // Navigate to profile
    await router.push('/profile')
    loading.value = false
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
    <Input v-model="form.data.value.email" type="email" label="Email"
      :error="form.errors.value.email ? form.errors.value.email[0] : ''" />
    <Input v-model="form.data.value.password" type="password" label="Password"
      :error="form.errors.value.password ? form.errors.value.password[0] : ''" />
    <Button type="submit" :disabled="loading">
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
