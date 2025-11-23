<script setup lang="ts">
import { useConvexQuery } from 'convue'
import { Button } from 'umbraco'
import { api } from '~/convex/_generated/api'

const { data: personas, isPending } = useConvexQuery(api.personas.listMine, {})
</script>

<template>
  <div class="PersonasPage">
    <div class="PageHeader">
      <h1>My Personas</h1>
      <NuxtLink to="/personas/create">
        <Button variant="primary">
          Create Persona
        </Button>
      </NuxtLink>
    </div>

    <div v-if="isPending" class="LoadingState">
      Loading personas...
    </div>

    <div v-else-if="personas && personas.length === 0" class="EmptyState">
      <p>You haven't created any personas yet.</p>
      <NuxtLink to="/personas/create">
        <Button variant="primary">
          Create Your First Persona
        </Button>
      </NuxtLink>
    </div>

    <div v-else class="PersonasList">
      <div v-for="persona in personas" :key="persona._id" class="PersonaCard">
        <div class="PersonaAvatar">
          <img v-if="persona.avatarUrl" :src="persona.avatarUrl" :alt="persona.name">
          <div v-else class="AvatarPlaceholder">
            {{ persona.name[0].toUpperCase() }}
          </div>
        </div>
        <div class="PersonaInfo">
          <h3>{{ persona.name }}</h3>
          <p class="handle">@{{ persona.handle }}</p>
          <p v-if="persona.bio" class="bio">
            {{ persona.bio }}
          </p>
          <div class="PersonaMeta">
            <span class="role">{{ persona.role }}</span>
            <span class="tagCount">{{ persona.identityTags.length }} tags</span>
          </div>
        </div>
        <div class="PersonaActions">
          <NuxtLink :to="`/personas/${persona._id}`">
            <Button variant="base" size="small">
              View
            </Button>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.PersonasPage {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--space-4);
}

.PageHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-4);
}

.LoadingState,
.EmptyState {
  padding: var(--space-6) var(--space-4);
  text-align: center;
  color: var(--base-100);
}

.EmptyState {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  align-items: center;
}

.PersonasList {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.PersonaCard {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: var(--space-2);
  padding: var(--space-2);
  background: var(--base-10);
  border: 1px solid var(--base-60);
  border-radius: var(--radius);
  transition: border-color var(--time);
}

.PersonaCard:hover {
  border-color: var(--base-80);
}

.PersonaAvatar {
  width: 64px;
  height: 64px;
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
  font-size: 1.5rem;
  font-weight: 700;
}

.PersonaInfo {
  display: flex;
  flex-direction: column;
  gap: var(--space-quark);
}

.PersonaInfo h3 {
  margin: 0;
  color: var(--base-text);
}

.handle {
  color: var(--base-90);
  font-size: 0.875rem;
  margin: 0;
}

.bio {
  color: var(--base-100);
  margin: 0;
  font-size: 0.9rem;
}

.PersonaMeta {
  display: flex;
  gap: var(--space-2);
  font-size: 0.8rem;
  color: var(--base-80);
}

.role {
  text-transform: capitalize;
  padding: 2px 6px;
  background: var(--accent-30);
  color: var(--accent-text);
  border-radius: 4px;
}

.PersonaActions {
  display: flex;
  align-items: center;
}
</style>
