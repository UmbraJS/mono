<script setup lang="ts">
import ActIntro from './ActIntro.vue';
// import { NuxtImage } from 'nuxt';
import Bio from '../Bio.vue'

</script>

<template>
  <div class="SamSlide">
    <!-- <NuxtImage src="~/public/query.png"
      alt="A screenshot of a Google search for 'What is a design system?' showing various definitions from different sources." />
    -->
    <div class="Bio">
      <!-- <img class="headshot"
        src="https://images.unsplash.com/photo-1600486913747-55e5470d6f40?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2670"
        alt="A screenshot of a Google search for 'What is a design system?' showing various definitions from different sources." /> -->
      <Bio />
    </div>
  </div>
</template>

<style>
.headshot {
  width: 150px;
  height: 150px;
  border-radius: var(--radius);
  object-fit: cover;
  margin-bottom: var(--space-4);
}
</style>
