<script setup lang="ts">
import { useConvexQuery } from 'convue'
import { Button } from 'umbraco'
import { api } from '../../../convex/_generated/api'
import type { Id } from '../../../convex/_generated/dataModel'

const route = useRoute()
const personaId = computed(() => route.params.id as Id<'personas'>)

const { data: persona, isPending } = useConvexQuery(api.personas.getById, {
  personaId: personaId.value,
})

const { data: members } = useConvexQuery(api.personas.listMembers, {
  personaId: personaId.value,
})
</script>

<template>
  <div class="PersonaDetailPage">
    <div v-if="isPending" class="LoadingState">
      Loading persona...
    </div>

    <div v-else-if="!persona" class="ErrorState">
      Persona not found
    </div>

    <div v-else class="PersonaDetail">
      <div class="PersonaHeader">
        <div class="PersonaAvatar">
          <img v-if="persona.avatarUrl" :src="persona.avatarUrl" :alt="persona.name">
          <div v-else class="AvatarPlaceholder">
            {{ persona.name[0].toUpperCase() }}
          </div>
        </div>
        <div class="PersonaInfo">
          <h1>{{ persona.name }}</h1>
          <p class="handle">@{{ persona.handle }}</p>
          <p v-if="persona.bio" class="bio">
            {{ persona.bio }}
          </p>
        </div>
        <div class="PersonaActions">
          <NuxtLink :to="`/personas/${personaId}/edit`">
            <Button variant="base">
              Edit
            </Button>
          </NuxtLink>
        </div>
      </div>

      <div class="PersonaSections">
        <section class="Section">
          <h2>Identity Tags</h2>
          <div v-if="persona.identityTags.length === 0" class="EmptyMessage">
            No identity tags yet
          </div>
          <div v-else class="TagsList">
            <div v-for="tag in persona.identityTags" :key="tag.id" class="Tag">
              <span class="TagSubject">{{ tag.subject }}</span>
              <span class="TagName">{{ tag.name }}</span>
              <span class="TagFervor">{{ tag.fervor }}</span>
            </div>
          </div>
        </section>

        <section class="Section">
          <h2>Members</h2>
          <div v-if="!members || members.length === 0" class="EmptyMessage">
            No members
          </div>
          <div v-else class="MembersList">
            <div v-for="member in members" :key="member.userId" class="Member">
              <div class="MemberInfo">
                <span class="MemberName">{{ member.user?.name || 'Unknown' }}</span>
                <span class="MemberRole">{{ member.role }}</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.PersonaDetailPage {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--space-4);
}

.LoadingState,
.ErrorState {
  padding: var(--space-6) var(--space-4);
  text-align: center;
  color: var(--base-100);
}

.PersonaDetail {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.PersonaHeader {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: var(--space-3);
  padding: var(--space-3);
  background: var(--base-10);
  border: 1px solid var(--base-60);
  border-radius: var(--radius);
}

.PersonaAvatar {
  width: 96px;
  height: 96px;
  border-radius: var(--radius);
  overflow: hidden;
}

.PersonaAvatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.AvatarPlaceholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--accent-60);
  color: var(--accent-text);
  font-size: 2rem;
  font-weight: 700;
}

.PersonaInfo {
  display: flex;
  flex-direction: column;
  gap: var(--space-quark);
}

.PersonaInfo h1 {
  margin: 0;
}

.handle {
  color: var(--base-90);
  font-size: 1rem;
  margin: 0;
}

.bio {
  color: var(--base-100);
  margin: 0;
}

.PersonaActions {
  display: flex;
  align-items: flex-start;
}

.PersonaSections {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.Section {
  padding: var(--space-3);
  background: var(--base-10);
  border: 1px solid var(--base-60);
  border-radius: var(--radius);
}

.Section h2 {
  margin: 0 0 var(--space-2) 0;
  font-size: 1.25rem;
}

.EmptyMessage {
  color: var(--base-90);
  font-style: italic;
}

.TagsList {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
}

.Tag {
  display: flex;
  align-items: center;
  gap: var(--space-quark);
  padding: var(--space-quark) var(--space-atom);
  background: var(--base-20);
  border: 1px solid var(--base-60);
  border-radius: var(--radius);
  font-size: 0.875rem;
}

.TagSubject {
  color: var(--base-90);
  text-transform: capitalize;
}

.TagName {
  color: var(--base-text);
  font-weight: 600;
}

.TagFervor {
  color: var(--base-80);
  font-size: 0.75rem;
}

.MembersList {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.Member {
  padding: var(--space-atom);
  background: var(--base-20);
  border-radius: var(--radius);
}

.MemberInfo {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.MemberName {
  color: var(--base-text);
}

.MemberRole {
  color: var(--base-90);
  font-size: 0.875rem;
  text-transform: capitalize;
  padding: 2px 6px;
  background: var(--accent-30);
  color: var(--accent-text);
  border-radius: 4px;
}
</style>
