<script setup lang="ts">
import { ButtonGroup, Button, Input, toast, Spinner } from 'umbraco'
import { z } from 'zod'
import { useFormula } from '@umbrajs/formula'

const signMode = ref<'signin' | 'signup'>('signin')
const auth = useAuth()
const router = useRouter()
const loading = ref(false)

// Define validation schemas
const signinSchema = z.object({
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required'),
})

const signupSchema = z.object({
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  password: z
    .string()
    .min(8, 'needs at least 8 characters')
    .regex(/[A-Z]/, 'needs at least one uppercase letter')
    .regex(/[a-z]/, 'needs at least one lowercase letter')
    .regex(/[0-9]/, 'needs at least one number'),
})

// Use basic form without validation (we'll validate manually on submit)
const form = useFormula(
  {
    email: '',
    password: '',
  },
  {
    validationMode: 'onSubmit',
    schema: signupSchema, // Use stricter schema as base
  }
)

// Local errors for input field display
const fieldErrors = ref<{ email?: string; password?: string }>({})

// Clear errors when switching modes
watch(signMode, () => {
  fieldErrors.value = {}
})

// Validate individual fields when they change (only if there's already an error)
watch(() => form.data.value.email, () => {
  if (!fieldErrors.value.email) return

  const schema = signMode.value === 'signin' ? signinSchema : signupSchema
  const result = schema.shape.email.safeParse(form.data.value.email)

  if (result.success) {
    fieldErrors.value = { ...fieldErrors.value, email: undefined }
  }
})

watch(() => form.data.value.password, () => {
  if (!fieldErrors.value.password) return

  const schema = signMode.value === 'signin' ? signinSchema : signupSchema
  const result = schema.shape.password.safeParse(form.data.value.password)

  if (result.success) {
    fieldErrors.value = { ...fieldErrors.value, password: undefined }
  }
})

async function handleSubmit() {
  console.log('handleSubmit called')

  // Clear previous errors
  fieldErrors.value = {}

  // Manually validate with the appropriate schema based on mode
  const schema = signMode.value === 'signin' ? signinSchema : signupSchema
  const result = schema.safeParse({
    email: form.data.value.email,
    password: form.data.value.password,
  })

  console.log('Validation result:', result)

  if (!result.success) {
    const formatted = result.error.flatten()
    const errors = formatted.fieldErrors

    console.log('Field errors:', errors)

    // Store errors for input field display
    fieldErrors.value = {
      email: errors.email?.[0],
      password: errors.password?.[0],
    }

    console.log('Set fieldErrors to:', fieldErrors.value)

    // Show first error in toast
    const firstError = errors.email?.[0] || errors.password?.[0] || formatted.formErrors[0]
    if (firstError) {
      toast.error(firstError)
    }
    return
  }

  if (loading.value) return
  loading.value = true

  if (signMode.value === 'signin') {
    await signIn(result.data)
  } else {
    await signUp(result.data)
  }
}

async function signIn(data: { email: string; password: string }) {
  const result = await auth.client.signIn.email({
    email: data.email,
    password: data.password,
  })

  if (result.error) {
    toast.error(result.error.message || 'Error signing in')
    loading.value = false
    return
  }

  toast.success('You have been signed in!')
  await auth.fetchSession()
  await router.push('/profile')
  loading.value = false
}

async function signUp(data: { email: string; password: string }) {
  const { error } = await auth.client.signUp.email({
    email: data.email,
    password: data.password,
    name: 'Anonymous',
  })

  if (error) {
    toast.error(error.message || 'Error signing up')
    loading.value = false
    return
  }

  toast.success('You have been signed up! Please sign in.')
  signMode.value = 'signin'
  loading.value = false
}

async function handleGithubAuth() {
  if (loading.value) return
  loading.value = true

  const { error } = await auth.client.signIn.social({
    provider: 'github',
    callbackURL: '/profile',
  })

  if (error) {
    const action = signMode.value === 'signin' ? 'signing in' : 'signing up'
    toast.error(`Error ${action} with GitHub`)
    loading.value = false
  }
}
</script>

<template>
  <div class="SigninWrapper">
    <div class="multi-toggle-wrapper sibling-group-blur">
      <ButtonGroup>
        <Button :variant="signMode === 'signin' ? 'primary' : 'base'" size="small" @click="signMode = 'signin'">
          Sign in
        </Button>
        <Button :variant="signMode === 'signup' ? 'primary' : 'base'" size="small" @click="signMode = 'signup'">
          Sign up
        </Button>
      </ButtonGroup>
    </div>

    <div v-if="loading" class="loading-panel">
      <Spinner size="8em" />
    </div>

    <form novalidate @submit.prevent="handleSubmit">
      <Input v-model="form.data.value.email" type="email" label="Email" :error="fieldErrors.email || ''" />
      <Input v-model="form.data.value.password" type="password" label="Password" :error="fieldErrors.password || ''" />
      <Button type="submit" :disabled="loading">
        <span v-if="!loading">{{ signMode === 'signin' ? 'Sign In' : 'Sign Up' }}</span>
        <Spinner v-else variant="secondary" size="1.5em" />
      </Button>
      <Button type="button" :disabled="loading" @click="handleGithubAuth">
        <Icon v-if="!loading" name="i-simple-icons-github" />
        <span v-if="!loading">
          {{ signMode === 'signin' ? 'Sign In with Github' : 'Sign Up with Github' }}
        </span>
        <Spinner v-if="loading" variant="secondary" size="1.5em" />
      </Button>
    </form>
  </div>
</template>

<style>
.SigninWrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--space-2);
  position: relative;
}

.SigninWrapper form {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.SigninWrapper button {
  width: 100%;
}

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
