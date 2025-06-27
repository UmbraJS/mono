<script setup lang="ts">
const { data: posts } = await useAsyncData('blog', () => queryCollection('blog').all())

useSeoMeta({
  title: "Sam is Blogging at 2am",
  description: "A place to share your thoughts and ideas.",
})
</script>

<template>
  <div id="BlogFrontPage">
    <div id="BlogHero">
      <NuxtImg src="/sword.jpg" alt="Samuel Bednarz" width="200" height="200" class="rounded-full" />

      <div class="BlogHeaderCluster">
        <p class="subtitle display-bold"><span class="base-success">
            Hey!
            <Icon name="pixelarticons:human-handsup" />
          </span> I'm a <span class="base-success">
            designer
            <Icon name="pixelarticons:downasaur" />
          </span> and senior <span class="base-warning">
            engineer
            <Icon name="pixelarticons:lightbulb-on" />
          </span> working at a fortune 500 company you may know 😎
        </p>

        <p class="subtitle display">
          I also maintain several open-source libraries and occasionally tinker with some <span class="base-info">
            top-secret
            <Icon name="pixelarticons:visible" />
          </span>
          side projects 👀
        </p>
      </div>

      <div class="BlogHeaderCluster">
        <p class="subtitle display-bold">
          When I’m not getting paid to architect systems that scale, I’m exploring the <span class="base-accent">
            boundaries
            <Icon name="carbon:area-custom" />
          </span> of frontend 🤓
        </p>

        <p class="subtitle display">
          Also, I'm single...
        </p>
      </div>

    </div>

    <div id="BlogPostList">
      <div id="BlogPostListHeader">
        <p class="caption">Posts ({{ posts?.length }})</p>
      </div>
      <NuxtLink v-for="post in posts" id="BlogPostCard" :key="post.id" :to="post.path"
        class="base button buttonText buttonHover buttonActive buttonFocus focus medium base-accent" tabindex="0"
        role="link" aria-label="Blog post card">
        <h4>{{ post.title }}</h4>
      </NuxtLink>
    </div>
  </div>
</template>

<style lang="scss">
#BlogFrontPage {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

#BlogHero {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);

  background: var(--base);
  padding: var(--space-4);
  border-radius: var(--radius);
}

#BlogPostList {
  display: grid;
  gap: var(--space-1);
}

#BlogPostListHeader {
  display: flex;
  justify-content: flex-end;
  padding: var(--space-1);
  background: var(--base);
  border-radius: var(--radius);
  color: var(--base-80);
}

#BlogPostCard {
  background: var(--base-10);
  border-radius: var(--radius);
  border: solid var(--border-size) var(--base-30);
  text-align: left;
  justify-content: start;
}

#BlogPostCard:hover {
  background: var(--accent-40);
  border: solid var(--border-size) var(--accent-80);
}

.BlogHeaderCluster {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}
</style>
