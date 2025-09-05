<script setup lang="ts">
useSeoMeta({
  title: "Sam is Blogging at 2am",
  description: "A place to share your thoughts and ideas.",
})
</script>

<template>
  <div id="BlogFrontPage">
    <div id="BlogHero">
      <!-- <NuxtImg class="avatar" src="/sam.jpg" alt="Samuel Bednarz" width="400" height="400" fit="contain" /> -->
      <div class="BlogHeaderCluster">
        <p class="subtitle display-bold"><span class="base-success">
            Hey!
            <Icon name="pixelarticons:human-handsup" />
          </span> I'm a <span class="base-success">
            designer
            <Icon name="pixelarticons:downasaur" />
          </span> and senior
          <span class="base-warning">
            engineer
            <Icon name="pixelarticons:lightbulb-on" />
          </span> working at a fortune 500 company you may know 😎
        </p>

        <p class="subtitle display">
          I also maintain several open-source libraries and occasionally tinker with some
          <span class="base-info">
            top-secret
            <Icon name="pixelarticons:visible" />
          </span>
          side projects 👀
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
#BlogFrontPage {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  gap: var(--space-4);
  height: 80vh;
  width: 100%;
}

#BlogHero .avatar {
  border-radius: var(--radius);
  overflow: hidden;
}

.BlogHeaderCluster {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.BlogHeaderCluster span {
  color: var(--base-110);
}
</style>
