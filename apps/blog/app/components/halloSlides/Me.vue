<script setup lang="ts">
// import { NuxtImage } from 'nuxt';
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
      <div id="BlogHero">
        <!-- <NuxtImg class="avatar" src="/sam.jpg" alt="Samuel Bednarz" width="400" height="400" fit="contain" /> -->
        <div class="BlogHeaderCluster">
          <h1 class="subtitle display">
            <span class="base-success">Colour Theory
              <Icon name="pixelarticons:paint-bucket" />
            </span>
            &amp;
            <span class="base-warning">
              Design Systems
              <Icon name="pixelarticons:lightbulb-on" />
            </span>
          </h1>
          <!-- <h2>Building Flexible Style Strategies</h2> -->

          <p class="subtitle display">
            by <span class="">Samuel M. Bednarz</span><br />from <span class="">Olavstoppen</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.SamSlide {
  --h1-display-size: clamp(2.4rem, 5vw, 5rem);
  --h1-size: clamp(2rem, 2.9vw, 5rem);
  --h2-size: clamp(1.8rem, 2.5vw, 4rem);
  --h3-size: clamp(1rem, 1.6vw, 2rem);
  --h4-size: clamp(1rem, 1.3vw, 1.5rem);
  --h5-size: clamp(1rem, 1.2vw, 1.2rem);
  --h6-size: clamp(1rem, 1vw, 1rem);
}

.BlogHeaderCluster .base-success {
  margin-right: 10px;
}

.BlogHeaderCluster h1 {
  width: max-content;
  margin-bottom: 10px;
  text-wrap: wrap;
}

.BlogHeaderCluster h2 {
  color: var(--base-50);
}

.BlogHeaderCluster p,
.BlogHeaderCluster p span {
  color: var(--base-text);
}

.headshot {
  width: 150px;
  height: 150px;
  border-radius: var(--radius);
  object-fit: cover;
  margin-bottom: var(--space-4);
}


#BlogHero {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
}

#BlogHero .avatar {
  border-radius: var(--radius);
  overflow: hidden;
}

.BlogHeaderCluster {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.BlogHeaderCluster span {
  color: var(--base-110);
}
</style>
