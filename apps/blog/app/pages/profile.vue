<script setup lang="ts">
import { Button, toast } from 'umbraco'
import { useAuth } from 'convue'

const { session, isAuthenticated, isLoading, client: authClient } = useAuth()
const router = useRouter()

// Redirect to signin if not authenticated
watch([isAuthenticated, isLoading], ([auth, loading]) => {
  if (loading || auth) return
  router.push('/signin')
}, { immediate: true })

async function signOut() {
  const { error } = await authClient.signOut()

  if (error) {
    toast.error('Error signing out')
  } else {
    toast.success('You have been signed out!')
    router.push('/signin')
  }
}
</script>

<template>
  <div class="profile-container">
    <div v-if="isLoading" class="loading">
      <Icon name="svg-spinners:pulse-multiple" size="4em" />
      <p>Loading...</p>
    </div>

    <div v-else-if="isAuthenticated && session" class="profile-content">
      <div class="profile-header">
        <h1>Profile</h1>
        <Button variant="secondary" @click="signOut">
          Sign Out
        </Button>
      </div>

      <div class="user-info">
        <div v-if="session.user" class="info-card">
          <h2>User Information</h2>
          <div class="info-grid">
            <div class="info-item">
              <label>Name</label>
              <p>{{ session.user.name || 'N/A' }}</p>
            </div>
            <div class="info-item">
              <label>Email</label>
              <p>{{ session.user.email || 'N/A' }}</p>
            </div>
            <div class="info-item">
              <label>User ID</label>
              <p class="mono">{{ session.user.id || 'N/A' }}</p>
            </div>
            <div v-if="session.user.emailVerified !== undefined" class="info-item">
              <label>Email Verified</label>
              <p>
                <Icon :name="session.user.emailVerified ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle'"
                  :class="session.user.emailVerified ? 'verified' : 'unverified'" />
                {{ session.user.emailVerified ? 'Yes' : 'No' }}
              </p>
            </div>
          </div>
        </div>

        <div v-if="session.session" class="info-card">
          <h2>Session Information</h2>
          <div class="info-grid">
            <div class="info-item">
              <label>Session ID</label>
              <p class="mono">{{ session.session.id || 'N/A' }}</p>
            </div>
            <div class="info-item">
              <label>Expires At</label>
              <p>{{ session.session.expiresAt ? new Date(session.session.expiresAt).toLocaleString() : 'N/A' }}</p>
            </div>
          </div>
        </div>

        <div class="info-card debug">
          <h2>Full Session Data</h2>
          <pre>{{ JSON.stringify(session, null, 2) }}</pre>
        </div>
      </div>

      <div class="navigation">
        <Button variant="base" @click="router.push('/')">
          <Icon name="i-heroicons-home" />
          Go to Home
        </Button>
      </div>
    </div>

    <div v-else class="not-authenticated">
      <p>Not authenticated</p>
      <Button @click="router.push('/signin')">
        Sign In
      </Button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.profile-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-4);
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-8);

  p {
    color: var(--text-secondary);
  }
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: var(--space-3);
  border-bottom: 1px solid var(--border-color);

  h1 {
    margin: 0;
  }
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.info-card {
  background: var(--surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-2);
  padding: var(--space-3);

  h2 {
    margin: 0 0 var(--space-3) 0;
    font-size: 1.25rem;
  }

  &.debug {
    pre {
      margin: 0;
      padding: var(--space-2);
      background: var(--surface-secondary);
      border-radius: var(--radius-1);
      overflow-x: auto;
      font-size: 0.875rem;
      line-height: 1.5;
    }
  }
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-3);
}

.info-item {
  label {
    display: block;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-secondary);
    margin-bottom: var(--space-1);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  p {
    margin: 0;
    font-size: 1rem;
    color: var(--text-primary);

    &.mono {
      font-family: var(--font-mono, monospace);
      font-size: 0.875rem;
      word-break: break-all;
    }

    .verified {
      color: var(--success, green);
    }

    .unverified {
      color: var(--error, red);
    }
  }
}

.navigation {
  display: flex;
  gap: var(--space-2);
  padding-top: var(--space-3);
  border-top: 1px solid var(--border-color);
}

.not-authenticated {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  padding: var(--space-8);

  p {
    font-size: 1.25rem;
    color: var(--text-secondary);
  }
}

@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-2);
  }

  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
