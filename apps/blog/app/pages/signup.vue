<script setup lang="ts">
import SignUser from '../components/SignUser.vue'

const { isAuthenticated } = useAuth()
const router = useRouter()

// Redirect to profile if already authenticated
watch(isAuthenticated, (auth) => {
  if (auth) {
    router.push('/profile')
  }
}, { immediate: true })
</script>

<template>
  <div class="auth-page">
    <div class="auth-container">
      <h1>Create an Account</h1>
      <p class="subtitle">Sign up to get started with Better Auth + Convex</p>
      <SignUser />
      <div class="footer">
        <p>
          Already have an account?
          <NuxtLink to="/signin">Sign in here</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
  background: var(--background);
}

.auth-container {
  width: 100%;
  max-width: 450px;

  h1 {
    margin: 0 0 var(--space-1) 0;
    text-align: center;
  }

  .subtitle {
    text-align: center;
    color: var(--text-secondary);
    margin: 0 0 var(--space-4) 0;
  }
}

.footer {
  margin-top: var(--space-3);
  text-align: center;

  p {
    margin: 0;
    color: var(--text-secondary);
    font-size: 0.875rem;

    a {
      color: var(--primary);
      text-decoration: none;
      font-weight: 500;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
