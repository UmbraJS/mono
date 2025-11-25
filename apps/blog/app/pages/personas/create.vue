<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMutation } from '@pinia/colada'
import { useConvexQuery, useConvexClient } from 'convue'
import { Button, Input, TextArea } from 'umbraco'
import { api } from '../../../convex/_generated/api'
import type { Id } from '../../../convex/_generated/dataModel'

definePageMeta({
  middleware: 'auth',
})

const router = useRouter()
const { isAuthenticated, user } = useAuth()

const name = ref('')
const bio = ref('')
const identityTagIds = ref<string[]>([])

// Maximum identity tags allowed per persona
const MAX_IDENTITY_TAGS = 3

// Fetch tags grouped by subject
const { data: tagsBySubject } = useConvexQuery(api.identityTags.listTagsBySubject, {})

// Track which subject card is actively being selected
const activeSubject = ref<string | null>(null)

// For now, all tags are unlocked (we'll add prerequisite checking later)
const isTagUnlocked = (_tagId: string) => true

const isTagLimitReached = computed(() => identityTagIds.value.length >= MAX_IDENTITY_TAGS)

// Get the subject for a given tag ID
const getTagSubject = (tagId: string): string | null => {
  if (!tagsBySubject.value) return null

  for (const [subject, tags] of Object.entries(tagsBySubject.value)) {
    if (tags.some((tag: any) => tag.id === tagId)) {
      return subject
    }
  }
  return null
}

// Check if a subject has a selected tag
const subjectHasSelection = (subject: string): boolean => {
  if (!tagsBySubject.value) return false
  const tags = tagsBySubject.value[subject]
  return tags.some((tag: any) => identityTagIds.value.includes(tag.id))
}

// Get the selected tag for a subject
const getSelectedTagForSubject = (subject: string) => {
  if (!tagsBySubject.value) return null
  const tags = tagsBySubject.value[subject]
  return tags.find((tag: any) => identityTagIds.value.includes(tag.id))
}

// Select a subject card to expand and choose from
const selectSubject = (subject: string) => {
  // If subject already has a selection, deselect it and open for re-selection
  if (subjectHasSelection(subject)) {
    const selectedTag = getSelectedTagForSubject(subject)
    if (selectedTag) {
      const index = identityTagIds.value.indexOf(selectedTag.id)
      if (index !== -1) {
        identityTagIds.value.splice(index, 1)
      }
    }
  }

  // Toggle active subject
  activeSubject.value = activeSubject.value === subject ? null : subject
}

// Select a tag from the active subject
const selectTag = (tagId: string) => {
  const subject = getTagSubject(tagId)
  if (!subject) return

  // Remove any other tag from this subject
  if (tagsBySubject.value) {
    const subjectTags = tagsBySubject.value[subject]
    subjectTags.forEach((tag: any) => {
      const idx = identityTagIds.value.indexOf(tag.id)
      if (idx !== -1) {
        identityTagIds.value.splice(idx, 1)
      }
    })
  }

  // Add the new tag
  identityTagIds.value.push(tagId)

  // Close the subject card
  activeSubject.value = null
}

// Get client at top level (only on client-side)
const client = typeof window !== 'undefined' ? useConvexClient() : null

const { mutate: createPersona, asyncStatus, error } = useMutation({
  mutation: async (data: { name: string; handle: string; bio?: string; identityTagIds: string[] }): Promise<Id<'personas'>> => {
    if (!client) throw new Error('Client not available')
    if (!isAuthenticated.value) throw new Error('You must be signed in to create a persona')
    if (!user.value?.id) throw new Error('User ID not available')

    const result = await client.mutation(api.personas.create, {
      userId: user.value.id,
      name: data.name,
      handle: data.handle,
      bio: data.bio,
      identityTagIds: data.identityTagIds,
    })

    return result
  },
  onSuccess: (personaId) => {
    router.push(`/personas/${personaId}`)
  },
})

function handleSubmit() {
  if (!name.value || !isAuthenticated.value) return

  // Generate a short handle (6 character alphanumeric)
  const handle = Math.random().toString(36).substring(2, 8)

  createPersona({
    name: name.value,
    handle,
    bio: bio.value || undefined,
    identityTagIds: identityTagIds.value,
  })
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
        <p class="FormHint">
          Select up to {{ MAX_IDENTITY_TAGS }} identity aspects
          <span class="TagCount" :class="{ atLimit: isTagLimitReached }">
            ({{ identityTagIds.length }}/{{ MAX_IDENTITY_TAGS }})
          </span>
        </p>

        <div v-if="tagsBySubject" class="SubjectCardsGrid">
          <button v-for="(tags, subject) in tagsBySubject" :key="subject" type="button" class="SubjectCard" :class="{
            active: activeSubject === subject,
            selected: subjectHasSelection(subject),
            disabled: isTagLimitReached && !subjectHasSelection(subject)
          }" :disabled="isTagLimitReached && !subjectHasSelection(subject)" @click="selectSubject(subject)">
            <div class="SubjectCardHeader">
              <h3 class="SubjectCardTitle">{{ subject }}</h3>
              <span v-if="subjectHasSelection(subject)" class="SelectedBadge">
                {{ getSelectedTagForSubject(subject)?.displayName }}
              </span>
            </div>

            <div v-if="activeSubject === subject" class="SubjectCardContent">
              <div class="TagOptionsGrid">
                <button v-for="tag in tags" :key="tag.id" type="button" class="TagOption"
                  @click.stop="selectTag(tag.id)">
                  {{ tag.displayName }}
                </button>
              </div>
            </div>
          </button>
        </div>
      </div>

      <div v-if="error" class="ErrorMessage">
        {{ error }}
      </div>

      <div class="FormActions">
        <Button type="button" variant="base" @click="router.back()">
          Cancel
        </Button>
        <Button type="submit" variant="primary" :disabled="asyncStatus === 'loading' || !name || !isAuthenticated">
          {{ asyncStatus === 'loading' ? 'Creating...' : 'Create Persona' }}
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
  padding-bottom: var(--space-7);
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

.TagCount {
  font-weight: 600;
  color: var(--base-100);
}

.TagCount.atLimit {
  color: var(--accent-text);
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

.SubjectCardsGrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--space-2);
  margin-top: var(--space-2);
}

.SubjectCard {
  display: flex;
  flex-direction: column;
  padding: var(--space-2);
  background: var(--base-10);
  border: 2px solid var(--base-40);
  border-radius: var(--radius);
  cursor: pointer;
  transition: all calc(var(--time) * 2) var(--timing);
  text-align: left;
  min-height: var(--block-big);
}

.SubjectCard:hover:not(:disabled) {
  background: var(--base-20);
  border-color: var(--base-60);
}

.SubjectCard.selected {
  background: var(--accent-10);
  border-color: var(--accent-60);
}

.SubjectCard.selected:hover {
  background: var(--accent-20);
  border-color: var(--accent-70);
}

.SubjectCard.active {
  background: var(--base-20);
  border-color: var(--accent-70);
}

.SubjectCard.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.SubjectCardHeader {
  display: flex;
  flex-direction: column;
  gap: var(--space-quark);
}

.SubjectCardTitle {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--base-110);
  text-transform: capitalize;
  margin: 0;
}

.SelectedBadge {
  display: inline-block;
  padding: calc(var(--space-quark) / 2) var(--space-quark);
  background: var(--accent-30);
  color: var(--accent-text);
  border-radius: calc(var(--radius) / 2);
  font-size: 0.75rem;
  font-weight: 500;
  align-self: flex-start;
}

.SubjectCardContent {
  margin-top: var(--space-2);
  padding-top: var(--space-2);
  border-top: 1px solid var(--base-40);
}

.TagOptionsGrid {
  display: flex;
  flex-direction: column;
  gap: var(--space-quark);
}

.TagOption {
  padding: var(--space-quark) var(--space-atom);
  background: var(--base-20);
  border: 1px solid var(--base-50);
  border-radius: calc(var(--radius) / 2);
  color: var(--base-110);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all calc(var(--time) * 2) var(--timing);
  text-align: left;
}

.TagOption:hover {
  background: var(--accent-30);
  border-color: var(--accent-60);
  color: var(--accent-text);
}
</style>
