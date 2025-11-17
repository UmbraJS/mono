<script setup lang="ts">
import { computed, ref } from "vue";
import { useConvexQuery, useConvexMutation } from "convue";
import { api } from "../../convex/_generated/api";
import { Button, Input, toast } from "umbraco";

useSeoMeta({ title: "Chatrooms" });

const { session, isAuthenticated } = useAuth()
const router = useRouter()

// Redirect to signin if not authenticated
watchEffect(() => {
  if (!isAuthenticated.value) {
    router.push('/signin')
  }
})

const currentUser = computed(() => ({
  userId: session.value?.user?.id || '',
  displayName: session.value?.user?.name || 'Anonymous',
}))

const chatroomsQuery = useConvexQuery(api.chat.getChatrooms)
const chatrooms = computed(() => chatroomsQuery.data.value || [])

const { mutate: createChatroom, isPending: isCreating } = useConvexMutation(api.chat.createChatroom)

const newRoomName = ref('')
const newRoomDescription = ref('')
const isPrivate = ref(false)
const showCreateForm = ref(false)

async function handleCreateRoom() {
  if (!newRoomName.value.trim()) {
    toast.error('Room name is required')
    return
  }

  try {
    const roomId = await createChatroom({
      name: newRoomName.value.trim(),
      description: newRoomDescription.value.trim() || undefined,
      createdBy: currentUser.value.userId,
      isPrivate: isPrivate.value,
    })

    toast.success('Chatroom created!')
    newRoomName.value = ''
    newRoomDescription.value = ''
    isPrivate.value = false
    showCreateForm.value = false

    // Navigate to the new room
    router.push(`/chat/${roomId}`)
  } catch (error) {
    console.error('Failed to create chatroom:', error)
    toast.error('Failed to create chatroom')
  }
}

function goToRoom(roomId: string) {
  console.log('Navigating to room:', roomId)
  router.push(`/chat/${roomId}`)
}
</script>

<template>
  <main v-if="isAuthenticated && session" class="ChatroomsPage">
    <header class="PageHeader">
      <h1>Chatrooms</h1>
      <Button @click="showCreateForm = !showCreateForm">
        {{ showCreateForm ? 'Cancel' : 'Create Room' }}
      </Button>
    </header>

    <section v-if="showCreateForm" class="CreateRoomForm border">
      <h2>Create New Chatroom</h2>
      <Input v-model="newRoomName" label="Room name" placeholder="Enter room name" :disabled="isCreating" />
      <Input v-model="newRoomDescription" label="Description" placeholder="Optional description"
        :disabled="isCreating" />
      <label class="PrivateCheckbox">
        <input v-model="isPrivate" type="checkbox" :disabled="isCreating" />
        Private room
      </label>
      <Button :disabled="isCreating || !newRoomName.trim()" @click="handleCreateRoom">
        {{ isCreating ? 'Creating...' : 'Create' }}
      </Button>
    </section>

    <section class="ChatroomsList">
      <div v-for="room in chatrooms" :key="room._id" class="ChatroomCard border" @click="goToRoom(room._id)">
        <h3>{{ room.name }}</h3>
        <p v-if="room.description" class="caption">{{ room.description }}</p>
        <span v-if="room.isPrivate" class="PrivateBadge">Private</span>
      </div>

      <div v-if="chatrooms.length === 0" class="EmptyState">
        <p>No chatrooms yet. Create one to get started!</p>
      </div>
    </section>
  </main>
</template>

<style scoped>
.ChatroomsPage {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-4);
}

.PageHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-4);
}

.CreateRoomForm {
  background: var(--base-10);
  padding: var(--space-3);
  border-radius: var(--radius);
  margin-bottom: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.PrivateCheckbox {
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

.ChatroomsList {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--space-2);
}

.ChatroomCard {
  background: var(--base-10);
  padding: var(--space-3);
  border-radius: var(--radius);
  cursor: pointer;
  transition: background-color var(--time-2);
  position: relative;
}

.ChatroomCard:hover {
  background: var(--base-20);
}

.ChatroomCard h3 {
  margin: 0 0 var(--space-1) 0;
}

.PrivateBadge {
  position: absolute;
  top: var(--space-2);
  right: var(--space-2);
  background: var(--accent-50);
  color: var(--accent-text);
  padding: var(--space-quark) var(--space-atom);
  border-radius: var(--inner-radius);
  font-size: 0.875rem;
}

.EmptyState {
  grid-column: 1 / -1;
  text-align: center;
  padding: var(--space-6) 0;
  color: var(--base-80);
}
</style>
