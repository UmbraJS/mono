<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMutation } from '@pinia/colada'
import { useConvexMutation, useConvexQuery } from 'convue'
import { Button, Input, TextArea } from 'umbraco'
import { api } from '../../../convex/_generated/api'

definePageMeta({
  middleware: 'auth',
})

const router = useRouter()

const name = ref('')
const bio = ref('')
const identityTagIds = ref<string[]>([])

// Fetch tags grouped by subject
const { data: tagsBySubject } = useConvexQuery(api.identityTags.listTagsBySubject, {})

// For now, all tags are unlocked (we'll add prerequisite checking later)
const isTagUnlocked = (_tagId: string) => true

const toggleTag = (tagId: string) => {
  const index = identityTagIds.value.indexOf(tagId)
  if (index === -1) {
    identityTagIds.value.push(tagId)
  } else {
    identityTagIds.value.splice(index, 1)
  }
}

const isTagSelected = (tagId: string) => identityTagIds.value.includes(tagId)

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
        <p class="FormHint">Select tags that represent this persona's identity</p>

        <div v-if="tagsBySubject" class="IdentityTagsGrid">
          <div v-for="(tags, subject) in tagsBySubject" :key="subject" class="TagSubjectSection">
            <h3 class="SubjectHeading">{{ subject }}</h3>
            <div class="TagChips">
              <button v-for="tag in tags" :key="tag.id" type="button" class="TagChip" :class="{
                selected: isTagSelected(tag.id),
                locked: !isTagUnlocked(tag.id)
              }" :disabled="!isTagUnlocked(tag.id)" @click="toggleTag(tag.id)">
                <span class="TagName">{{ tag.displayName }}</span>
                <span v-if="!isTagUnlocked(tag.id)" class="LockIcon">🔒</span>
              </button>
            </div>
          </div>
        </div>
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

.IdentityTagsGrid {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-top: var(--space-2);
}

.TagSubjectSection {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.SubjectHeading {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--base-110);
  text-transform: capitalize;
  margin: 0;
}

.TagChips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-quark);
}

.TagChip {
  display: inline-flex;
  align-items: center;
  gap: var(--space-quark);
  padding: var(--space-quark) var(--space-atom);
  background: var(--base-20);
  border: 1px solid var(--base-50);
  border-radius: var(--radius);
  color: var(--base-110);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all calc(var(--time) * 2) var(--timing);
}

.TagChip:hover:not(:disabled) {
  background: var(--base-30);
  border-color: var(--base-60);
}

.TagChip.selected {
  background: var(--accent-30);
  border-color: var(--accent-70);
  color: var(--accent-text);
}

.TagChip.selected:hover {
  background: var(--accent-40);
  border-color: var(--accent-80);
}

.TagChip.locked {
  background: var(--base-10);
  border-color: var(--base-40);
  color: var(--base-80);
  cursor: not-allowed;
  opacity: 0.5;
}

.TagName {
  user-select: none;
}

.LockIcon {
  font-size: 0.75rem;
}
</style>
