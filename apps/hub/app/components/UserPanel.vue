<script setup lang="ts">
import { Button, toast } from '@nobel/core'
import DeleteUser from './Dialogs/DeleteUser.vue'

const { user, session, client } = useAuth()

const signOut = async () => {
  await client.signOut()
  toast.success('Signed out')
}

const expiresIn = computed(() => {
  if (!session) return ''
  const currentTime = new Date()

  const expiresAt = session.value?.expiresAt ? new Date(session.value.expiresAt).getTime() : 0
  const difference = expiresAt - currentTime.getTime()

  const minutes = Math.floor((difference / (1000 * 60)) % 60)
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
  const days = Math.floor(difference / (1000 * 60 * 60 * 24))

  return `${days}D ${hours}H ${minutes}M`
})
</script>

<template>
  <div class="user-panel">
    <div class="identity">
      <NuxtImg
        class="banner"
        :src="
          user?.image || 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png'
        "
        alt="User Banner"
      />
      <div class="identity-content panel-wrapper">
        <NuxtImg
          class="avatar"
          :src="
            user?.image ||
            'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png'
          "
          alt="User avatar"
        />
        <h3>{{ user?.name }}</h3>
        <div v-if="!user?.emailVerified" class="verified border base-accent">
          <Icon name="pixelarticons:check" />
        </div>
      </div>
    </div>

    <div class="email panel-wrapper">
      <p>{{ user?.email }}</p>
      <p>
        Created at:
        <NuxtTime
          v-if="user?.createdAt"
          :datetime="new Date(user?.createdAt)"
          second="numeric"
          month="long"
          day="numeric"
          year="numeric"
        />
      </p>
      <p>Session Expires: {{ expiresIn }}</p>
    </div>

    <div class="user-actions panel-wrapper">
      <Button size="medium" @click="signOut">Sign out</Button>
      <DeleteUser />
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

.user-panel img.avatar {
  height: var(--block-big);
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 100%;
}

.user-panel img.banner {
  position: absolute;
  height: 100%;
  width: 100%;
  overflow: hidden;
  object-fit: cover;
  filter: blur(7px);
  opacity: 0.7;
}

.user-panel .verified {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  background-color: var(--base-110);
  width: var(--block);
  aspect-ratio: 1 / 1;
  .iconify {
    background-color: var(--base-10);
  }
}

.email {
  display: flex;
  flex-direction: column;
  gap: var(--space-quark);
}

.identity {
  position: relative;
  border-top-left-radius: var(--radius);
  border-top-right-radius: var(--radius);
  overflow: hidden;
}

.identity-content {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: var(--space-1);
  position: relative;
}

.user-actions {
  display: grid;
  gap: var(--space-1);
}

.dialog-warning-title {
  display: flex;
  align-items: center;
  gap: var(--space-1);
}
</style>
