<script setup lang="ts">
import { Button, Input, toast, Spinner } from 'umbraco'
import { z } from 'zod'
import { useFormula } from '@umbrajs/formula'
import { useMutation } from '@pinia/colada'

const props = defineProps<{
  signMode: 'signin' | 'signup'
}>()

const auth = useAuth()

// Define validation schemas
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const signinSchema = z.object({
  email: z.string().min(1, 'Email is required').regex(emailRegex, 'Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

const signupSchema = z.object({
  email: z.string().min(1, 'Email is required').regex(emailRegex, 'Invalid email address'),
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
    schema: signupSchema,
  }
)

// Local errors for input field display
const fieldErrors = ref<{ email?: string; password?: string }>({})

// Sign in mutation
const { mutate: executeSignIn, asyncStatus: signInStatus } = useMutation({
  mutation: async (data: { email: string; password: string }) => {
    const result = await auth.client.signIn.email({
      email: data.email,
      password: data.password,
    })

    if (result.error) {
      throw new Error(result.error.message || 'Error signing in')
    }

    toast.success('You have been signed in!')
    await auth.fetchSession()
  },
  onError: (error) => {
    toast.error(error.message)
  },
})

// Sign up mutation
const { mutate: executeSignUp, asyncStatus: signUpStatus } = useMutation({
  mutation: async (data: { email: string; password: string }) => {
    const { error } = await auth.client.signUp.email({
      email: data.email,
      password: data.password,
      name: 'Anonymous',
    })

    if (error) {
      throw new Error(error.message || 'Error signing up')
    }

    toast.success('You have been signed up! Please sign in.')
  },
  onError: (error) => {
    toast.error(error.message)
  },
})

// GitHub auth mutation
const { mutate: executeGithubAuth, asyncStatus: githubStatus } = useMutation({
  mutation: async () => {
    const { error } = await auth.client.signIn.social({
      provider: 'github',
      callbackURL: '/profile',
    })

    if (error) {
      const action = props.signMode === 'signin' ? 'signing in' : 'signing up'
      throw new Error(`Error ${action} with GitHub`)
    }
  },
  onError: (error) => {
    toast.error(error.message)
  },
})

const isLoading = computed(() =>
  signInStatus.value === 'loading' ||
  signUpStatus.value === 'loading' ||
  githubStatus.value === 'loading'
)

// Clear errors when switching modes
watch(() => props.signMode, () => {
  fieldErrors.value = {}
})

// Validate individual fields when they change (only if there's already an error)
watch(() => form.data.value.email, () => {
  if (!fieldErrors.value.email) return

  const schema = props.signMode === 'signin' ? signinSchema : signupSchema
  const result = schema.shape.email.safeParse(form.data.value.email)

  if (result.success) {
    fieldErrors.value = { ...fieldErrors.value, email: undefined }
  }
})

watch(() => form.data.value.password, () => {
  if (!fieldErrors.value.password) return

  const schema = props.signMode === 'signin' ? signinSchema : signupSchema
  const result = schema.shape.password.safeParse(form.data.value.password)

  if (result.success) {
    fieldErrors.value = { ...fieldErrors.value, password: undefined }
  }
})

async function handleSubmit() {
  // Clear previous errors
  fieldErrors.value = {}

  // Manually validate with the appropriate schema based on mode
  const schema = props.signMode === 'signin' ? signinSchema : signupSchema
  const result = schema.safeParse({
    email: form.data.value.email,
    password: form.data.value.password,
  })

  if (!result.success) {
    // Extract field errors from issues
    const errors: { email?: string; password?: string } = {}

    for (const issue of result.error.issues) {
      const field = issue.path[0] as 'email' | 'password'
      if (field && !errors[field]) {
        errors[field] = issue.message
      }
    }

    // Store errors for input field display
    fieldErrors.value = errors

    // Show first error in toast
    const firstError = errors.email || errors.password
    if (firstError) {
      toast.error(firstError)
    }
    return
  }

  if (isLoading.value) return

  if (props.signMode === 'signin') {
    executeSignIn(result.data)
  } else {
    executeSignUp(result.data)
  }
}

function handleGithubAuth() {
  if (isLoading.value) return
  executeGithubAuth()
}
</script>

<template>
  <div class="AuthForm">
    <div v-if="isLoading" class="loading-panel">
      <Spinner size="8em" />
    </div>

    <form novalidate @submit.prevent="handleSubmit">
      <Input v-model="form.data.value.email" type="email" label="Email" :error="fieldErrors.email || ''" />
      <Input v-model="form.data.value.password" type="password" label="Password" :error="fieldErrors.password || ''" />
      <div class="Spacer"></div>
      <Button type="submit" :disabled="isLoading">
        <span v-if="!isLoading">{{ signMode === 'signin' ? 'Sign In' : 'Sign Up' }}</span>
        <Spinner v-else variant="secondary" size="1.5em" />
      </Button>
      <Button type="button" :disabled="isLoading" @click="handleGithubAuth">
        <Icon v-if="!isLoading" name="i-simple-icons-github" />
        <span v-if="!isLoading">
          {{ signMode === 'signin' ? 'Sign In with Github' : 'Sign Up with Github' }}
        </span>
        <Spinner v-if="isLoading" variant="secondary" size="1.5em" />
      </Button>
    </form>
  </div>
</template>

<style scoped>
.AuthForm {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--space-2);
  position: relative;
  width: 100%;
  height: 100%;
}

.AuthForm form {
  display: grid;
  grid-template-rows: auto auto 1fr auto auto;
  gap: var(--space-1);
  height: 100%;
}

.AuthForm button {
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
