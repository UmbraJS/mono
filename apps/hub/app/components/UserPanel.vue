<script setup lang="ts">
import { Button, toast } from '@nobel/core'
const { user, session, client } = useAuth()

const signOut = async () => {
  await client.signOut()
  toast.success('Signed out')
}

const sessionAge = computed(() => {
  if (!session.value?.createdAt) return
  const startedAt = new Date(session.value.createdAt)
  const now = new Date()
  const diff = now.getTime() - startedAt.getTime()
  return Math.floor(diff / 1000)
})
</script>

<template>
  <div class="user-panel">
    <div class="identity">
      <NuxtImg
        src="https://images.unsplash.com/photo-1740475339769-664748d1193e?q=80&w=3464&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="User Image"
      />
      <h2>{{ user?.name }}</h2>
    </div>
    <div class="email">
      <p>{{ user?.email }}</p>
      <div v-if="!user?.emailVerified" class="verified border">
        <Icon name="pixelarticons:check" />
      </div>
    </div>
    <p>IP Adress: {{ session?.ipAddress }}</p>
    <p>Session age: {{ sessionAge }}</p>
    <p>{{ user?.id }}</p>

    <Button size="medium" @click="signOut">Sign out</Button>
  </div>
</template>

<style lang="scss">
.user-panel button {
  width: 100%;
}

.user-panel img {
  height: var(--block-big);
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 100%;
}

.user-panel .verified {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  background-color: var(--success-40);
  width: var(--block);
  aspect-ratio: 1 / 1;
  .iconify {
    background-color: var(--success-120);
  }
}

.email {
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

.identity {
  display: flex;
  align-items: center;
  gap: var(--space-1);
}
</style>
