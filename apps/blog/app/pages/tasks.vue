<script setup lang="ts">
import { api } from "../../convex/_generated/api";
import { useConvexQuery } from "convue";
import { computed } from "vue";

useSeoMeta({ title: "Tasks" });

// useConvexQuery returns an object with a `data` Ref (undefined while loading)
const result = useConvexQuery(api.tasks.get);
const tasks = computed(() => result.data.value ?? []);
</script>

<template>
  <div>
    <h1>Tasks</h1>
    <div v-if="result.isPending">Loading…</div>
    <div v-else-if="result.error">{{ String(result.error) }}</div>
    <ul>
      <li v-for="task in tasks" :key="task._id">
        <span>{{ task.text }}</span>
        <span v-if="task.isCompleted" style="margin-left: 0.5rem">✅</span>
      </li>
    </ul>
  </div>
  <p style="margin-top: 1rem">
    Try visiting this page after running Convex locally and importing sample
    data.
  </p>
  <NuxtLink to="/">Back</NuxtLink>
</template>
