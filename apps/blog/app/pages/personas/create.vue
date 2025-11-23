<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMutation } from '@pinia/colada'
import { useConvexClient } from 'convue'
import { Button } from 'umbraco'
import { api } from '~/convex/_generated/api'
import type { IdentityTag } from '~/types/profile'

definePageMeta({
  middleware: 'auth',
})

const router = useRouter()
const convex = useConvexClient()

const name = ref('')
const handle = ref('')
const bio = ref('')
const avatarUrl = ref('')
const identityTags = ref<IdentityTag[]>([])

const { mutate: createPersona, status, error } = useMutation({
  mutation: async () => {
    const personaId = await convex.mutation(api.personas.create, {
      name: name.value,
      handle: handle.value,
      bio: bio.value || undefined,
      avatarUrl: avatarUrl.value || undefined,
      identityTags: identityTags.value,
    })
    return personaId
  },
  onSuccess: (personaId) => {
    router.push(`/personas/${personaId}`)
  },
})

function handleSubmit() {
  if (!name.value || !handle.value) return
  createPersona()
}
</script>

<template>
  <div class="CreatePersonaPage">
    <div class="PageHeader">
      <h1>Create Persona</h1>
      <p class="subtitle">
        Create a new public identity for posting and engaging
      </p>
    </div>

    <form class="PersonaForm" @submit.prevent="handleSubmit">
      <div class="FormSection">
        <label for="name" class="FormLabel">
          Display Name
          <span class="required">*</span>
        </label>
        <input id="name" v-model="name" type="text" class="FormInput" placeholder="John Doe" required>
      </div>

      <div class="FormSection">
        <label for="handle" class="FormLabel">
          Handle
          <span class="required">*</span>
        </label>
        <div class="HandleInput">
          <span class="HandlePrefix">@</span>
          <input id="handle" v-model="handle" type="text" class="FormInput" placeholder="johndoe"
            pattern="[a-zA-Z0-9_]+" title="Only letters, numbers, and underscores" required>
        </div>
        <p class="FormHint">Only letters, numbers, and underscores</p>
      </div>

      <div class="FormSection">
        <label for="bio" class="FormLabel">Bio</label>
        <textarea id="bio" v-model="bio" class="FormTextarea" placeholder="Tell us about this persona..." rows="4" />
      </div>

      <div class="FormSection">
        <label for="avatarUrl" class="FormLabel">Avatar URL</label>
        <input id="avatarUrl" v-model="avatarUrl" type="url" class="FormInput"
          placeholder="https://example.com/avatar.jpg">
      </div>

      <div class="FormSection">
        <label class="FormLabel">Identity Tags</label>
        <p class="FormHint">Add identity tags to help others understand this persona (coming soon)</p>
        <!-- TODO: Identity tag selector component -->
      </div>

      <div v-if="error" class="ErrorMessage">
        {{ error }}
      </div>

      <div class="FormActions">
        <Button type="button" variant="base" @click="router.back()">
          Cancel
        </Button>
        <Button type="submit" variant="primary" :disabled="status === 'pending' || !name || !handle">
          {{ status === 'pending' ? 'Creating...' : 'Create Persona' }}
        </Button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.CreatePersonaPage {
  max-width: 600px;
  margin: 0 auto;
  padding: var(--space-4);
}

.PageHeader {
  margin-bottom: var(--space-4);
}

.PageHeader h1 {
  margin-bottom: var(--space-1);
}

.subtitle {
  color: var(--base-100);
  margin: 0;
}

.PersonaForm {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.FormSection {
  display: flex;
  flex-direction: column;
  gap: var(--space-quark);
}

.FormLabel {
  font-weight: 600;
  color: var(--base-110);
}

.required {
  color: var(--danger-text);
}

.FormInput,
.FormTextarea {
  height: var(--block);
  padding: 0 var(--space-atom);
  background: var(--base-10);
  border: 1px solid var(--base-60);
  border-radius: var(--radius);
  color: var(--base-text);
  font-family: inherit;
  font-size: var(--paragraph);
  transition: border-color var(--time);
}

.FormTextarea {
  height: auto;
  padding: var(--space-atom);
  resize: vertical;
}

.FormInput:focus,
.FormTextarea:focus {
  outline: none;
  border-color: var(--accent-80);
}

.HandleInput {
  display: flex;
  align-items: center;
  gap: var(--space-quark);
}

.HandlePrefix {
  color: var(--base-90);
  font-weight: 600;
}

.FormHint {
  font-size: 0.875rem;
  color: var(--base-90);
  margin: 0;
}

.ErrorMessage {
  padding: var(--space-atom);
  background: var(--danger-20);
  border: 1px solid var(--danger-60);
  border-radius: var(--radius);
  color: var(--danger-text);
}

.FormActions {
  display: flex;
  gap: var(--space-2);
  justify-content: flex-end;
  margin-top: var(--space-2);
}
</style>
