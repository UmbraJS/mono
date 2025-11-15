<script setup lang="ts">
import { Button, Input, toast, Spinner } from 'umbraco'
import { z } from 'zod'
import { useFormula } from '@umbrajs/formula'

const { client: authClient } = useAuth()

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
      password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    }),
  }
)

async function signUp() {
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

  const { error } = await authClient.signUp.email({
    email: validation.data.email,
    password: validation.data.password,
    name: 'Anonymous',
  })

  if (error) {
    toast.error(error.message || 'Error signing up')
    loading.value = false
  } else {
    toast.success('You have been signed up! Please sign in.')
    form.reset()
    loading.value = false
  }
}
</script>

<template>
  <form @submit.prevent="signUp">
    <Input v-model="form.data.value.email" type="email" label="Email"
      :error="form.errors.value.email ? form.errors.value.email[0] : ''" />
    <Input v-model="form.data.value.password" type="password" label="Password"
      :error="form.errors.value.password ? form.errors.value.password[0] : ''" />
    <Button type="submit" :disabled="loading">
      <span v-if="!loading">Sign Up</span>
      <Spinner v-else variant="secondary" size="1.5em" />
    </Button>
  </form>
</template>
