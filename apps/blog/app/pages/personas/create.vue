<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMutation } from '@pinia/colada'
import { useConvexMutation } from 'convue'
import { Button, Input, TextArea } from 'umbraco'
import { api } from '../../../convex/_generated/api'

definePageMeta({
  middleware: 'auth',
})

const router = useRouter()

const name = ref('')
const bio = ref('')
const identityTagIds = ref<string[]>([])

const { mutate: createPersonaMutation } = useConvexMutation(api.personas.create)

const { mutate: createPersona, status, error } = useMutation({
  mutation: async () => {
    // Generate a short handle (6 character alphanumeric)
    const handle = Math.random().toString(36).substring(2, 8)

    const personaId = await createPersonaMutation({
      name: name.value,
      handle,
      bio: bio.value || undefined,
      identityTagIds: identityTagIds.value,
    })
    return personaId
  },
  onSuccess: (personaId) => {
    router.push(`/personas/${personaId}`)
  },
})

function handleSubmit() {
  if (!name.value) return
  createPersona()
}
</script><template>
  <div class="CreatePersonaPage">
    <div class="PageHeader">
      <h1>Create Persona</h1>
      <p class="subtitle">
        Create a new public identity for posting and engaging
      </p>
    </div>

    <form class="PersonaForm" @submit.prevent="handleSubmit">
      <Input v-model="name" label="Display Name" placeholder="John Doe" required />

      <TextArea v-model="bio" placeholder="Tell us about this persona..." />

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
        <Button type="submit" variant="primary" :disabled="status === 'pending' || !name">
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
