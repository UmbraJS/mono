<script setup lang="ts">
const route = useRoute()

if (!route.params.id) {
  console.log('Warning! Make sure user is authenticasted!')
}

const { data } = await useFetch(`/api/users/${route.params.id}`)
</script>

<template>
  <div class="user-panel">
    <div class="identity">
      <NuxtImg
        src="https://images.unsplash.com/photo-1740475339769-664748d1193e?q=80&w=3464&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="User Image"
      />
      <h2>Name: {{ data?.name }}</h2>
    </div>
    <div class="email">
      <p>Email: {{ data?.email }}</p>
      <div v-if="!data?.emailVerified" class="verified border">
        <Icon name="pixelarticons:check" />
      </div>
    </div>
  </div>
</template>

<style lang="scss"></style>
