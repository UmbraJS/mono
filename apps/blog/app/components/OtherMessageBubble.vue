<template>
  <li class="OtherMessage" :style="{ '--color': color }">
    <div class="OtherMessageBubble">
      <div class="MessageHead">
        <Icon name="mdi:account" />
      </div>
      <div class="MessageContent">
        <p class="MessageName caption">{{ message.user }}</p>
        <p>{{ message.body }}</p>
      </div>
    </div>
  </li>
</template>

<script setup lang="ts">
interface Props {
  color: string;
  message: {
    _id: string;
    user: string;
    body: string;
  };
}

defineProps<Props>();
</script>

<style>
.MessageName {
  color: var(--color);
}

.OtherMessage {
  display: grid;
  gap: var(--space-1);
  justify-items: start;
}

.OtherMessageBubble {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--space-1);
  justify-items: start;
  align-items: center;

  max-width: 80%;
  padding: var(--space-1);
  border-radius: var(--radius);
  background: var(--base);
  color: var(--base-text);
  word-wrap: break-word;
  overflow-wrap: anywhere;
}

.MessageHead span {
  width: 20px;
  color: var(--color);
}

.MessageHead {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  background: var(--base-10);
  border-radius: var(--radius);

}
</style>
