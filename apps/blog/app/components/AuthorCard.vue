<script setup lang="ts">
const socials = [
  { label: 'Twitter', href: 'https://x.com/MorkSamuel', icon: 'carbon:logo-twitter' },
  { label: 'GitHub', href: 'https://github.com/CarelessCourage', icon: 'carbon:logo-github' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/samuelmbednarz/', icon: 'carbon:logo-linkedin' },
]

// Live time in Stavanger, Norway (Europe/Oslo timezone)
const stavangerTime = ref<string>('')
const isClient = ref(false)

onMounted(() => {
  isClient.value = true

  const fmt = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Europe/Oslo',
  })

  const update = () => {
    stavangerTime.value = fmt.format(new Date())
  }

  update()
  const id = setInterval(update, 1000)
  onBeforeUnmount(() => clearInterval(id))
})
</script>

<template>
  <aside id="AuthorCard" class="author-card border">
    <div class="author">
      <NuxtImg src="/sam.jpg" width="96" height="96" alt="Author avatar" class="avatar" />
      <div class="meta">
        <!-- <div class="meta-header">
          <h3 class="caption">Hey 😊</h3>
          <nav id="SocialLinks">
            <NuxtLink v-for="link in socials" :key="link.href" :to="link.href" class="social-link" target="_blank"
              rel="noopener noreferrer">
              <Icon :name="link.icon" size="1em" />
            </NuxtLink>
          </nav>
        </div> -->

        <!-- <p>You're my favorite visitor. Have my number:</p> -->

        <!-- <p>You're my favorite visitor. Let's keep in touch</p> -->

        <nav id="SocialLinks" class="links">
          <div v-if="isClient" class="time-chip">
            <!-- 🇳🇴 +47 929 85 290 -->
            <p>LinkedIn: <NuxtLink to="https://www.linkedin.com/in/samuelmbednarz/" target="_blank"
                rel="noopener noreferrer" class="call-me">samuelmbednarz</NuxtLink>
            </p>
            <p>Instagram: <NuxtLink to="https://www.instagram.com/carelesscourage/" target="_blank"
                rel="noopener noreferrer" class="call-me">raw_samuel_</NuxtLink>
            </p>
          </div>
          <!-- <div v-if="isClient" class="time-chip">
            <Icon name="carbon:time" size="1em" /> Stavanger: {{ stavangerTime }}
          </div> -->
        </nav>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.meta-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.author-card {
  display: grid;
  gap: var(--space-2);
  padding: var(--space-2);
  border-color: var(--base-30);
  background: var(--base);
  border-radius: var(--radius);
}

.author {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--space-2);
  align-items: center;
}

.avatar {
  border-radius: var(--radius);
}

.meta {
  display: grid;
  gap: var(--space-1);
}

.time-chip {
  display: inline-flex;
  display: flex;
  flex-direction: column;
  /* align-items: center; */
  gap: var(--space-quark);
  width: fit-content;
  width: 100%;
  padding: var(--space-quark) var(--space-1);
  padding: var(--space-2);
  border-radius: var(--radius);
  border: 1px solid var(--base-30);
  background: var(--base-10);
  color: var(--base-120);
}

.call-me {
  width: fit-content;
  padding: var(--space-quark) var(--space-1);
  border-radius: var(--radius);
  border: 1px dashed var(--accent-80);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  background: var(--accent-10);
  color: var(--accent-120);
}

.links {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
}

#SocialLinks {
  display: flex;
  gap: var(--space-1);
}

.social-link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-quark);
  padding: var(--space-quark) var(--space-1);
  border-radius: var(--radius);
  border: 1px solid var(--base-30);
  color: var(--base-120);
  background: var(--base);
  transition: background-color var(--fast), color var(--fast), border-color var(--fast);
}

.social-link:hover {
  border-color: var(--accent-80);
  color: var(--accent-120);
  background: var(--accent-10);
}
</style>
