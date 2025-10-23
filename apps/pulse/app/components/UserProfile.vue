<template>
  <div class="UserProfile">
    <NuxtImg
      src="https://images.unsplash.com/photo-1760800185531-2b1da99d7538?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687"
      width="64" height="64" class="UserAvatar" />
    <div class="UserHeaderInfo">
      <p class="UserName display">Some Name</p>
      <p class="UserDescription">Some description about the user.</p>
    </div>
    <div class="UserIdentity">
      <div class="UserIdentityTag">
        ♂️
      </div>
      <div class="UserIdentityTag">
        <p class="caption">🕺 Adult</p>
      </div>
      <div class="UserIdentityTag">
        <p>🧑‍💻 Senior Engineer</p>
      </div>
      <div class="UserIdentityTag">
        🇳🇴
      </div>
      <div class="UserIdentityTag">
        <p>🗽 Liberal</p>
      </div>
      <div class="UserIdentityTag">
        <p>⚛️ Atheist</p>
      </div>
      <div class="UserIdentityTag">
        <p>🌍 Humanist</p>
      </div>
      <div class="UserIdentityTag">
        <p>🎓 BA</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.UserIdentity {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--space-1);
  flex-wrap: wrap;
  margin-top: var(--space-1);
}

.UserIdentityTag {
  background-color: var(--accent-10);
  color: var(--accent-text);
  padding: var(--space-1);
  border-radius: var(--radius);
  border: solid 1px var(--accent-50);
}

.UserIdentityTag:not(:has(> p)) {
  aspect-ratio: 1 / 1;
}

.UserProfile {
  display: flex;
  gap: var(--space-1);
  background-color: var(--base-10);
  padding: var(--space-1);

}

.UserHeaderInfo {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.UserAvatar {
  border-radius: var(--radius);
}

.UserDescription {
  color: var(--base-60);
}
</style>
