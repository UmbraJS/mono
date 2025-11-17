<script setup lang="ts">
import { Button, Toggle, toast, Spinner } from 'umbraco'
import { useMutation } from '@pinia/colada'

const theme = useUmbra()
const auth = useAuth()
const router = useRouter()

const { mutate: logout, asyncStatus } = useMutation({
  mutation: async () => {
    await auth.client.signOut()
    await auth.fetchSession()
    toast.success('You have been signed out')
  },
})

const isLoggingOut = computed(() => asyncStatus.value === 'loading')
</script>

<template>
  <div class="SettingsPanel">

    <div class="settings-section">
      <div class="setting-row">
        <label class="caption">Dark Mode</label>
        <Toggle :value="theme.isDark" @click="theme.inverse()" />
      </div>
    </div>

    <div class="settings-section">
      <Button :disabled="isLoggingOut" @click="logout">
        <Spinner v-if="isLoggingOut" size="1.5em" />
        <Icon v-else name="carbon:logout" />
        <p>Sign Out</p>
      </Button>
    </div>
  </div>
</template>

<style scoped>
.SettingsPanel {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  height: 100%;
  padding: var(--space-2) 0;
}

.SettingsPanel h2 {
  margin: 0;
  font-size: var(--h2-size);
}

.settings-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.settings-section h3 {
  margin: 0;
  font-size: var(--h3-size);
  color: var(--base-100);
}

.setting-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-quark) 0;
}

.settings-section button {
  width: 100%;
  justify-content: flex-start;
  gap: var(--space-quark);
}
</style>
