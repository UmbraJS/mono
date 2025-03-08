<script setup lang="ts">
import { Button, ButtonGroup, Toggle, toast, Dialog, DialogClose } from '@nobel/core'

const { user, session, client } = useAuth()

const signOut = async () => {
  await client.signOut()
  toast.success('Signed out')
}

const deleteUser = async () => {
  await client.deleteUser()
  toast.success('User deleted')
}

// const expiresIn = computed(() => {
//   if (!session) return ''
//   const currentTime = new Date()

//   const expiresAt = session.value?.expiresAt ? new Date(session.value.expiresAt).getTime() : 0
//   const difference = expiresAt - currentTime.getTime()

//   const minutes = Math.floor((difference / (1000 * 60)) % 60)
//   const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
//   const days = Math.floor(difference / (1000 * 60 * 60 * 24))

//   return `${days}D ${hours}H ${minutes}M`
// })

// const creationDate = computed(() => {
//   if (!user.value) return ''
//   return new Date(user.value?.createdAt).toLocaleDateString()
// })
</script>

<template>
  <div class="user-panel">
    <div class="identity">
      <NuxtImg
        src="https://images.unsplash.com/photo-1740475339769-664748d1193e?q=80&w=3464&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="User Image"
      />
      <h2>{{ user?.name }}</h2>
      <div v-if="!user?.emailVerified" class="verified border">
        <Icon name="pixelarticons:check" />
      </div>
    </div>
    <div class="email">
      <p>{{ user?.email }}</p>
    </div>

    <div class="user-actions">
      <Button size="medium" @click="signOut">Sign out</Button>
      <Dialog variant="warning">
        <template #trigger>
          <Button size="medium" variant="primary" color="warning"> Delete user </Button>
        </template>

        <template #content>
          <h2>Are you sure?</h2>
          <p>Deleting this user is irriversible</p>
          <DialogClose>
            <Button size="medium" color="warning" @click="deleteUser"> Delete user </Button>
          </DialogClose>
        </template>
      </Dialog>
    </div>
  </div>
</template>

<style lang="scss">
.user-panel {
  display: grid;
  gap: var(--space-1);
}

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
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: var(--space-1);
}

.user-actions {
  display: grid;
  gap: var(--space-1);
}
</style>
