<script setup lang="ts">
import { Slider } from "umbraco"
import { getMoodEmoji } from "../utils";

useSeoMeta({
  title: "Pulse - Workdays",
  description: "Log of workdays in Pulse app.",
})

const todaysMood = ref<number>(0);
</script>

<template>
  <WorkDays />

  <div class="TodaySection">
    <div class="TodayCore ContentWidth">
      <div class="TodayHeader">
        <h2>Today</h2>
        <p>{{ getMoodEmoji(todaysMood) }} {{ todaysMood }} / 10</p>
      </div>
      <textarea class="Textarea" placeholder="What are you working on today?" rows="6"></textarea>
      <Slider v-model="todaysMood" :min="0" :max="10" step="0.1" />
    </div>
  </div>
</template>

<style>
.ContentWidth {
  width: 50em;
}

.TodaySection {
  display: flex;
  justify-content: center;
  align-items: center;

  padding: var(--space-2);
  background: var(--accent-10);
  margin-top: var(--space-2);
  border-radius: var(--radius);
}

.TodayCore {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.TodayHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Enhanced, theme-aware textarea styling */
.Textarea {
  width: 100%;
  min-height: 8rem;
  padding: var(--space-1) var(--space-2);
  border: 1px solid var(--base-30);
  border-radius: var(--radius);
  background: var(--base-20);
  color: var(--base-text);
  outline: none;
  resize: vertical;
  transition: border-color var(--slow) var(--timing),
    background-color var(--slow) var(--timing),
    box-shadow var(--slow) var(--timing);
}

.Textarea::placeholder {
  color: var(--base-80);
}

.Textarea:hover {
  border-color: var(--base-40);
}

.Textarea:focus {
  border-color: var(--accent-80);
  outline: 2px solid var(--accent-80);
  outline-offset: 2px;
  background: var(--base-10);
}

.Textarea:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
